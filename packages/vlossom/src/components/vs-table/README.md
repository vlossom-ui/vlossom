> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsTable

A feature-rich data table component with sorting, searching, pagination, selection, drag-and-drop, and expandable rows.

**Available Version**: 2.0.0+

## Feature

- Column sorting, built-in search, and pagination (client-side and server-side)
- Row selection (single or multi) and expandable row panels
- Drag-and-drop row reordering via SortableJS
- Sticky header support with automatic layout synchronization
- Virtual scroll via `VsVisibleRender` for large datasets
- Responsive layout that stacks columns on smaller screens

## Basic Usage

```html
<template>
    <vs-table :columns="columns" :items="items" />
</template>

<script setup>
const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age' },
];
const items = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
];
</script>
```

### With Search and Pagination

```html
<template>
    <vs-table :columns="columns" :items="items" search pagination />
</template>
```

### Selectable Rows

```html
<template>
    <vs-table
        :columns="columns"
        :items="items"
        selectable
        v-model:selected-items="selected"
    />
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
    <vs-table :columns="columns" :items="items">
        <template #expand="{ item }">
            <div>{{ item.detail }}</div>
        </template>
    </vs-table>
</template>
```

### Server Mode

```html
<template>
    <vs-table
        :columns="columns"
        :items="pagedItems"
        server-mode
        :pagination="{ totalItemCount: totalCount }"
        v-model:page="page"
        v-model:page-size="pageSize"
        @paginate="fetchData"
    />
</template>
```

## Props

| Prop              | Type                                           | Default  | Description                                 |
| ----------------- | ---------------------------------------------- | -------- | ------------------------------------------- |
| `colorScheme`     | `string`                                       |          | Color scheme for the component              |
| `styleSet`        | `string \| VsTableStyleSet`                    |          | Custom style set for the component          |
| `columns`         | `VsTableColumnDef[] \| string[]`               | `[]`     | Column definitions                          |
| `items`           | `VsTableItem[]`                                | `[]`     | Data rows                                   |
| `dense`           | `boolean`                                      | `false`  | Reduces cell padding                        |
| `draggable`       | `boolean`                                      | `false`  | Enables drag-and-drop row reordering        |
| `expandable`      | `boolean \| (item, index?, items?) => boolean` | `true`   | Enables expandable rows. Expand UI is rendered only when an `expand` slot is provided |
| `loading`         | `boolean`                                      | `false`  | Shows loading state and disables search     |
| `noVirtualScroll` | `boolean`                                      | `false`  | Disables virtual scroll optimization        |
| `page`            | `number`                                       |          | Current page index (0-based), v-model       |
| `pageSize`        | `number`                                       | `10`     | Number of rows per page, v-model            |
| `pagedItems`      | `VsTableItem[]`                                | `[]`     | Current page items for server mode, v-model |
| `pagination`      | `boolean \| VsTablePaginationOptions`          | `false`  | Enables pagination                          |
| `primary`         | `boolean`                                      | `false`  | Applies primary color to the header         |
| `responsive`      | `boolean`                                      | `false`  | Enables responsive (stacked) layout         |
| `search`          | `boolean \| SearchProps`                       | `false`  | Enables built-in search                     |
| `selectable`      | `boolean \| (item, index?, items?) => boolean` | `false`  | Enables row selection                       |
| `selectedItems`   | `VsTableItem[]`                                | `[]`     | Selected rows, v-model                      |
| `serverMode`      | `boolean`                                      | `false`  | Switches to server-side pagination mode     |
| `state`           | `UIState \| (item, index?, items?) => UIState` | `'idle'` | Row state for styling                       |
| `stickyHeader`    | `boolean`                                      | `false`  | Makes the table header sticky on scroll     |
| `totalItems`      | `VsTableItem[]`                                | `[]`     | All items for server mode, v-model          |

## Types

```typescript
interface VsTableStyleSet {
    component?: CSSProperties;
    toolbar?: CSSProperties;
    search?: VsSearchInputStyleSet;
    header?: CSSProperties;
    row?: CSSProperties;
    selectedRow?: CSSProperties;
    cell?: CSSProperties;
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
    transform?: (value: unknown, item: I) => unknown;
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
            component: { borderRadius: '0.5rem', overflow: 'hidden' },
            header: { fontSize: '0.875rem', fontWeight: 700 },
            row: { height: '3rem' },
            selectedRow: { backgroundColor: '#e3f2fd' },
            cell: { padding: '0.5rem 1rem' },
        }"
    />
</template>
```

## Events

| Event                  | Payload                                       | Description                           |
| ---------------------- | --------------------------------------------- | ------------------------------------- |
| `click-cell`           | `(cell: VsTableBodyCell, event: MouseEvent)`  | Emitted when a cell is clicked        |
| `select-row`           | `(row: VsTableBodyCell[], event: MouseEvent)` | Emitted when a row is selected        |
| `expand-row`           | `(row: VsTableBodyCell[], event: MouseEvent)` | Emitted when a row is expanded        |
| `drag`                 | `SortableEvent`                               | Emitted after a drag-and-drop reorder |
| `search`               | `(items: VsTableItem[], searchText: string)`  | Emitted on search                     |
| `paginate`             | `(nextPage: number, pageSize: number)`        | Emitted when page changes             |
| `update:selectedItems` | `VsTableItem[]`                               | Emitted when selected rows change     |
| `update:page`          | `number`                                      | Emitted when the current page changes |
| `update:pageSize`      | `number`                                      | Emitted when the page size changes    |
| `update:pagedItems`    | `VsTableItem[]`                               | Emitted when paged items update       |
| `update:totalItems`    | `VsTableItem[]`                               | Emitted when total items update       |

## Slots

| Slot           | Description                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| `toolbar`      | Area to the left of the search input; use for action buttons or custom controls |
| `caption`      | Table caption content                                                           |
| `header-[key]` | Custom header cell for a specific column key                                    |
| `body-[key]`   | Custom body cell for a specific column key                                      |
| `select`       | Custom content for the selection column cell                                    |
| `expand`       | Custom content for the expanded row panel. Required to render the expand UI when `expandable` is enabled |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
