> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsTable

A data table component with sorting, searching, pagination, selection, drag-and-drop, and expandable rows, built around item-level handling.

**Available Version**: 2.0.0+

## Feature

- Column sorting, built-in search, and pagination (client-side and server-side)
- Row selection and expandable row panels, all keyed by item
- Drag-and-drop row reordering that never mutates `items`
- Sticky header support with automatic layout synchronization
- Responsive layout that stacks columns on smaller screens

## Basic Usage

```html
<template>
    <vs-table :columns="columns" :items="items" item-key="id" />
</template>

<script setup>
const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age' },
];
const items = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
];
</script>
```

`columns` also accepts a string array (`['name', 'age']`), and when it is empty the keys of the first item are used as columns.

### Row Identity

`itemKey` decides what a row is. Pass a field name (dot paths allowed) or a function. Without it, rows fall back to the identity of the item object, so replacing items with newly created objects (a refetch, for example) drops selection and expansion state and remounts rows.

```html
<template>
    <vs-table :columns="columns" :items="items" :item-key="(item) => item.user.id" />
</template>
```

### With Search and Pagination

```html
<template>
    <vs-table :columns="columns" :items="items" search pagination />
</template>
```

### Search Scope

Search matches against the values rendered in the table body, so a column's `transform` result is searched exactly as it is displayed. Two options adjust that scope:

- `skipSearch` on a column excludes a rendered column from the search.
- `search.extraKeys` adds item fields that no column renders — useful when a slot pulls the value into another cell, or when you want to filter on hidden metadata.

```html
<template>
    <vs-table :columns="columns" :items="items" :search="{ extraKeys: ['tags'] }">
        <template #item-name="{ item }">{{ item.name }} ({{ item.tags }})</template>
    </vs-table>
</template>

<script setup>
const columns = [
    { key: 'name', label: 'Name' },
    { key: 'note', label: 'Note', skipSearch: true },
];
</script>
```

Both accept dot paths (`'metadata.email'`), same as a column `key`. If a key is a `skipSearch` column — or nested under one — it stays excluded even when listed in `extraKeys`.

When a key points at an object or array, every nested value inside it is searched, including class instances. Only own enumerable properties are searched, so values from a prototype getter need their own key. Functions and binary values (`TypedArray`, `Blob`) are ignored, and a `Date` is searched as its ISO string.

### Selectable Rows

```html
<template>
    <vs-table :columns="columns" :items="items" item-key="id" selectable v-model:selected-items="selected" />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref([]);
</script>
```

### Expandable Rows

`expandable` is `true` by default, but the expand UI (toggle button and expanded panel) is rendered only when the `expand` slot is provided. Pass `:expandable="false"` to disable expansion entirely.

```html
<template>
    <vs-table :columns="columns" :items="items" item-key="id">
        <template #expand="{ item }">
            <div>{{ item.detail }}</div>
        </template>
    </vs-table>
</template>
```

### Reading What the Table Shows

`items` is the input and the table never mutates it. To read what the table currently shows — search, sort and drag order applied — bind the output models:

```html
<template>
    <vs-table
        :columns="columns"
        :items="items"
        item-key="id"
        search
        pagination
        draggable
        v-model:paged-items="pagedItems"
        v-model:total-items="totalItems"
        v-model:selected-items="selectedItems"
    />
</template>
```

- `pagedItems`: rows on the current page.
- `totalItems`: every row that survived search and sorting, in display order, across all pages.
- `selectedItems`: currently selected rows.

### Draggable Rows

Dragging reorders the rows on screen — including while a column is sorted — and leaves `items` untouched. Read the new order from `totalItems` / `pagedItems`, or from the `drag` event. The order is dropped when `items`, the search text, or the sort changes, and a drag within a paginated page only reorders that page's slots.

```html
<template>
    <vs-table :columns="columns" :items="items" item-key="id" draggable v-model:total-items="orderedItems" />
</template>
```

### Empty State

Provide an `empty` slot to replace the default "NO DATA" placeholder when there are no rows. When `loading` is true, the loading indicator takes priority over this slot.

```html
<template>
    <vs-table :columns="columns" :items="[]">
        <template #empty>
            <div>No matching results.</div>
        </template>
    </vs-table>
</template>
```

### Server Mode

```html
<template>
    <vs-table
        :columns="columns"
        :items="items"
        item-key="id"
        server-mode
        :pagination="{ totalItemCount: totalCount }"
        v-model:page="page"
        v-model:page-size="pageSize"
        @paginate="fetchData"
    />
</template>
```

## Props

| Prop            | Type                                           | Default  | Description                                                                                                                               |
| --------------- | ---------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `colorScheme`   | `string`                                       |          | Color scheme for the component                                                                                                            |
| `styleSet`      | `string \| VsTableStyleSet`                    |          | Custom style set for the component                                                                                                        |
| `columns`       | `VsTableColumnDef[] \| string[]`               | `[]`     | Column definitions. Falls back to the first item's keys when empty                                                                        |
| `items`         | `VsTableItem[]`                                | `[]`     | Data rows. Never mutated by the table                                                                                                     |
| `itemKey`       | `string \| ((item) => string \| number)`       |          | Row identity. Falls back to the item object's identity when omitted                                                                       |
| `size`          | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`         | `'md'`   | Table size — controls cell padding/font and propagates to the search input, pagination (incl. page-size select), and selection checkboxes |
| `draggable`     | `boolean`                                      | `false`  | Enables drag-and-drop row reordering                                                                                                      |
| `expandable`    | `boolean \| (item, index?, items?) => boolean` | `true`   | Enables expandable rows. Expand UI is rendered only when an `expand` slot is provided                                                     |
| `loading`       | `boolean`                                      | `false`  | Shows loading state and disables search, pagination, dragging, and selection                                                              |
| `page`          | `number`                                       |          | Current page index (0-based), v-model                                                                                                     |
| `pageSize`      | `number`                                       |          | Number of rows per page, v-model. Defaults to the first page size option                                                                  |
| `pagedItems`    | `VsTableItem[]`                                | `[]`     | Rows on the current page, v-model (output only)                                                                                           |
| `pagination`    | `boolean \| VsTablePaginationOptions`          | `false`  | Enables pagination                                                                                                                        |
| `primary`       | `boolean`                                      | `false`  | Applies primary color to the header                                                                                                       |
| `responsive`    | `boolean`                                      | `false`  | Enables responsive (stacked) layout                                                                                                       |
| `search`        | `boolean \| VsTableSearchOptions`              | `false`  | Enables built-in search                                                                                                                   |
| `selectable`    | `boolean \| (item, index?, items?) => boolean` | `false`  | Enables row selection                                                                                                                     |
| `selectedItems` | `VsTableItem[]`                                | `[]`     | Selected rows, v-model                                                                                                                    |
| `serverMode`    | `boolean`                                      | `false`  | Switches to server-side pagination mode                                                                                                   |
| `state`         | `UIState \| (item, index?, items?) => UIState` | `'idle'` | Row state for styling                                                                                                                     |
| `stickyHeader`  | `boolean`                                      | `false`  | Makes the table header sticky on scroll                                                                                                   |
| `totalItems`    | `VsTableItem[]`                                | `[]`     | All rows in display order after search and sorting, v-model (output only)                                                                 |

## Types

```typescript
interface VsTableStyleSet extends CSSProperties {
    $toolbar?: CSSProperties;
    $search?: VsSearchInputStyleSet;
    $caption?: CSSProperties;
    $header?: CSSProperties;
    $stickyHeaderTop?: string;
    $row?: CSSProperties & {
        $selected?: CSSProperties;
    };
    $cell?: CSSProperties;
    $pagination?: VsPaginationStyleSet;
    $pageSizeSelect?: VsSelectStyleSet;
}

type VsTableItemKey<I = VsTableItem> = VsTableColumnKey<I> | ((item: I) => string | number);

interface VsTableSearchOptions<I = VsTableItem> {
    useRegex?: boolean;
    useCaseSensitive?: boolean;
    placeholder?: string;
    extraKeys?: VsTableColumnKey<I>[];
}

interface VsTableColumnDef<I = VsTableItem> {
    key: VsTableColumnKey<I>;
    label: string;
    headerAlign?: TextAlignment;
    align?: TextAlignment;
    verticalAlign?: VerticalAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    sortable?: boolean;
    sortBy?: VsTableColumnKey<I>;
    skipSearch?: boolean;
    transform?: (value: any, item: I) => unknown;
}

interface VsTableCell<I = VsTableItem> {
    item: I;
    value: unknown;
    colKey: VsTableColumnKey<I>;
    rowIdx: number;
    colIdx: number;
}

interface VsTablePaginationOptions {
    pageSizeOptions?: VsTablePageSizeOptions;
    showPageSizeSelect?: boolean;
    showingLength?: number;
    edgeButtons?: boolean;
    showTotal?: boolean;
    totalItemCount?: number;
}
```

### StyleSet Example

```html
<template>
    <vs-table
        :columns="columns"
        :items="items"
        :style-set="{
            borderRadius: '0.5rem', overflow: 'hidden',
            $header: { fontSize: '0.875rem', fontWeight: 700 },
            $stickyHeaderTop: '60px',
            $row: {
                height: '3rem',
                $selected: { backgroundColor: '#e3f2fd' },
            },
            $cell: { padding: '0.5rem 1rem' },
        }"
    />
</template>
```

`$stickyHeaderTop` sets the `top` offset of the floating header shown while `stickyHeader` is enabled. It sticks to the top of the viewport (`0`) by default; set this to offset it below a fixed app header (e.g. `'60px'`).

## Events

| Event                  | Payload                                                                    | Description                                                                        |
| ---------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `click-cell`           | `(cell: VsTableCell, event: MouseEvent)`                                   | Emitted when a body cell is clicked                                                |
| `click-row`            | `(item: VsTableItem, index: number, event: MouseEvent)`                    | Emitted when a body row is clicked                                                 |
| `select-row`           | `(item: VsTableItem, index: number, selected: boolean, event: MouseEvent)` | Emitted when a row is selected or unselected                                       |
| `expand-row`           | `(item: VsTableItem, index: number, expanded: boolean, event: MouseEvent)` | Emitted when a row is expanded or collapsed                                        |
| `drag`                 | `SortableEvent`                                                            | Emitted after a drag-and-drop reorder                                              |
| `search`               | `(items: VsTableItem[], searchText: string)`                               | Emitted on search, with the rows shown after filtering                             |
| `paginate`             | `(nextPage: number, pageSize: number)`                                     | Emitted when the page or page size changes (page size changes reset the page to 0) |
| `update:selectedItems` | `VsTableItem[]`                                                            | Emitted when selected rows change                                                  |
| `update:page`          | `number`                                                                   | Emitted when the current page changes                                              |
| `update:pageSize`      | `number`                                                                   | Emitted when the page size changes                                                 |
| `update:pagedItems`    | `VsTableItem[]`                                                            | Emitted when the rows on the current page change                                   |
| `update:totalItems`    | `VsTableItem[]`                                                            | Emitted when the rows after search and sorting change                              |

`index` is the row's position among the rows currently displayed.

## Slots

| Slot           | Slot Props                                          | Description                                                                     |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------------------------- |
| `toolbar`      |                                                     | Area to the left of the search input; use for action buttons or custom controls |
| `caption`      |                                                     | Table caption content                                                           |
| `header-[key]` | `{ item: VsTableColumnDef, value, colIdx, rowIdx }` | Custom header cell for a specific column key                                    |
| `item-[key]`   | `{ item: VsTableItem, value, colIdx, rowIdx }`      | Custom item cell for a specific column key                                      |
| `select`       | `{ item, value, rowIdx }`                           | Custom content for the selection column cell, in the header and in body rows    |
| `expand`       | `{ item, value, rowIdx }`                           | Custom content for the expanded row panel. Required to render the expand UI     |
| `empty`        |                                                     | Custom content shown when there are no rows                                     |

Header cell slots are prefixed with `header-` and body cell slots with `item-`. Each resolves in this order: `[key]` → `col{colIdx}-row{rowIdx}` → `row{rowIdx}` → `col{colIdx}` → the bare `header` / `item` slot.

The `select` slot replaces the selection column cell in the header and in every body row at once. Tell them apart by `item`: it is `null` in the header cell, where `value` is the select-all state and `rowIdx` is `0`. Clicking anywhere in the cell toggles selection, so custom content needs no click handler of its own, and rows excluded by `selectable` stay untoggled.

## Methods

| Method     | Parameters      | Description                                                                                                                           |
| ---------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `expand`   | `index: number` | Expands the expandable row at the given index in the currently displayed rows. No-op if the row does not exist or is not expandable   |
| `collapse` | `index: number` | Collapses the expandable row at the given index in the currently displayed rows. No-op if the row does not exist or is not expandable |

## Caution

- Row events carry the item, not cell objects. Read values from `item`, or use `click-cell` when you need the rendered cell value.
- Clicking a header cell does not emit `click-cell`; sorting is triggered by the sort icon of a `sortable` column.
- Dragging changes only what the table shows. Persist the order yourself from `totalItems` or the `drag` event if it has to survive an `items` update.
