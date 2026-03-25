> 한국어: [README.ko.md](./README.ko.md)

# VsTable

A component that renders tabular data based on column definitions and an item array. Supports fine-grained customization via header/body slots, and enables cell-level priority rendering via slot naming conventions.

**Available Version**: 2.0.0+

## Basic Usage

### Object Column Definition

```html
<template>
    <vs-table
        :columns="[
            { key: 'name', label: 'Name' },
            { key: 'age', label: 'Age' },
        ]"
        :items="[
            { id: '1', name: 'Alice', age: 24 },
            { id: '2', name: 'Bob', age: 30 },
        ]"
    />
</template>
```

### String Column Definition

```html
<template>
    <vs-table
        :columns="['name', 'age']"
        :items="[
            { id: '1', name: 'Alice', age: 24 },
            { id: '2', name: 'Bob', age: 30 },
        ]"
    />
</template>
```

### Auto-generate Columns from Item Keys (columns: null)

```html
<template>
    <vs-table
        :columns="null"
        :items="[
            { id: '1', name: 'Alice', age: 24 },
            { id: '2', name: 'Bob', age: 30 },
        ]"
    />
</template>
```

### Slot Customization

```html
<template>
    <vs-table :columns="['name', 'age']" :items="items">
        <template #caption>
            <span class="font-bold text-blue-500">User List</span>
        </template>

        <template #header-name="{ value }">
            <span class="bg-yellow-200 font-semibold">{{ value }}*</span>
        </template>

        <template #body-age="{ item, value }">
            <span class="text-emerald-600">{{ item.age }} yrs ({{ value }})</span>
        </template>
    </vs-table>
</template>
```

### Row Selection

```html
<template>
    <!-- All rows selectable -->
    <vs-table :columns="columns" :items="items" selectable />

    <!-- Conditional selection -->
    <vs-table
        :columns="columns"
        :items="items"
        :selectable="(item) => item.status === 'active'"
    />
</template>
```

### Sorting

```html
<template>
    <vs-table
        :columns="[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'age', label: 'Age', sortable: true },
            { key: 'address', label: 'Address', sortable: true, sortBy: 'address.city' },
        ]"
        :items="items"
    />
</template>
```

> Clicking a header cycles through ascending (ASCEND) → descending (DESCEND) → no sort (NONE).

### Sticky Header

```html
<template>
    <vs-table :columns="['name', 'age', 'email']" :items="items" stickyHeader />
</template>
```

### Search

```html
<template>
    <vs-table
        :columns="[
            { key: 'name', label: 'Name' },
            { key: 'age', label: 'Age' },
            { key: 'email', label: 'Email', skipSearch: true },
        ]"
        :items="items"
        :search="{
            placeholder: 'Search by name',
            useCaseSensitive: false,
            useRegex: true
        }"
        @search="(rows, searchText) => console.log(rows, searchText)"
    />
</template>
```

> Passing `search` as `true` or an options object shows the search input. Columns with `skipSearch` are excluded.

### Responsive

```html
<template>
    <!-- Responsive enabled (switches to card layout below 1024px) -->
    <vs-table :columns="columns" :items="items" responsive />

    <!-- Responsive disabled — always table layout (default) -->
    <vs-table :columns="columns" :items="items" />
</template>
```

> Responsive is disabled by default. When `responsive` is set, the layout switches to card-style below the container width.

### Pagination

```html
<template>
    <vs-table
        :columns="['name', 'age', 'email']"
        :items="items"
        pagination
        @paginate="(page, pageSize) => console.log(page, pageSize)"
    />
</template>
```

> Setting `pagination` to `true` activates `VsPagination` internally. The `paginate` event provides 0-based page index and page size.

#### Tracking Paged Items

```html
<template>
    <vs-table
        :columns="['name', 'age', 'email']"
        :items="allItems"
        pagination
        v-model:paged-items="currentPageItems"
        v-model:total-items="filteredItems"
    />

    <div class="mt-4">
        <p>Total items: {{ allItems.length }}</p>
        <p>Filtered/searched items: {{ filteredItems.length }}</p>
        <p>Current page items: {{ currentPageItems.length }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const allItems = ref([/* 1000 items */]);
const currentPageItems = ref([]); // items on current page (e.g. 50)
const filteredItems = ref([]);    // all items after search/sort (e.g. 300)
</script>
```

> Use `v-model:paged-items` for current page items and `v-model:total-items` for all filtered/sorted items. Both update automatically on page change, search, or sort.

```html
<template>
    <vs-table
        :columns="columns"
        :items="items"
        :pagination="{
            pageSizeOptions: [
                { label: '10', value: 10 },
                { label: '20', value: 20 },
                { label: '50', value: 50 }
            ],
            showPageSizeSelect: true,
            showingLength: 5,
            edgeButtons: true,
            showTotal: true
        }"
        v-model:pageSize="pageSize"
    />
</template>
```

> The page automatically resets when page size or search/sort conditions change.

### Row Expand

```html
<template>
    <vs-table
        :columns="[
            { key: 'name', label: 'Name' },
            { key: 'age', label: 'Age' },
        ]"
        :items="items"
        :expandable="(item) => item.age >= 30"
    >
        <template #expand="{ item, rowIdx }">
            <div class="p-4 bg-slate-50">
                <p class="font-semibold">Details (row {{ rowIdx }})</p>
                <p>{{ item.name }} / {{ item.age }} yrs</p>
            </div>
        </template>
    </vs-table>
</template>
```

### Row Drag

```html
<template>
    <vs-table
        :columns="['name', 'age', 'email']"
        :items="items"
        draggable
        @drag="handleDrag"
    />
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
    { id: '1', name: 'Alice', age: 24, email: 'alice@example.com' },
    { id: '2', name: 'Bob', age: 30, email: 'bob@example.com' },
    { id: '3', name: 'Charlie', age: 28, email: 'charlie@example.com' },
]);

function handleDrag(event) {
    const { oldIndex, newIndex } = event;
    const movedItem = items.value.splice(oldIndex, 1)[0];
    items.value.splice(newIndex, 0, movedItem);
}
</script>
```

### Virtual Scroll

```html
<template>
    <!-- Virtual scroll enabled by default -->
    <vs-table :columns="columns" :items="largeDataset" />

    <!-- Disable virtual scroll (render all rows at once) -->
    <vs-table :columns="columns" :items="items" no-virtual-scroll />
</template>
```

### Loading State

```html
<template>
    <vs-table :columns="['name', 'age', 'email']" :items="items" :loading="isLoading" />
</template>
```

## Props

| Prop                      | Type                                             | Default | Required | Description                                                                                                                                    |
| ------------------------- | ------------------------------------------------ | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `colorScheme`             | `ColorScheme`                                    | -       | -        | Color scheme for the component                                                                                                                 |
| `styleSet`                | `string \| VsTableStyleSet`                      | -       | -        | Custom style configuration object                                                                                                              |
| `columns`                 | `VsTableColumnDef[] \| string[] \| null`         | `[]`    | -        | Table column definitions                                                                                                                       |
| `items`                   | `VsTableItem[]`                                  | -       | **Yes**  | Array of items to display                                                                                                                      |
| `dense`                   | `boolean`                                        | `false` | -        | Compact mode — reduces padding and font-size                                                                                                   |
| `primary`                 | `boolean`                                        | `false` | -        | Apply primary color to the header. When used with `styleSet.header`, the inline style takes precedence                                         |
| `responsive`              | `boolean`                                        | `false` | -        | Enable responsive layout. Default `false`. When `true`, switches to card layout below 1024px                                                   |
| `search`                  | `boolean \| VsTableSearchOptions`                | `false` | -        | Show search input and configure search options                                                                                                 |
| `pagination`              | `boolean \| VsTablePaginationOptions`            | `false` | -        | Enable pagination and configure pagination options                                                                                             |
| `selectable`              | `boolean \| (item, index?, items?) => boolean`   | `false` | -        | Enable row selection or conditional selection function                                                                                         |
| `expandable`              | `boolean \| (item, index?, items?) => boolean`   | `false` | -        | Enable row expansion or conditional expansion function                                                                                         |
| `stickyHeader`            | `boolean`                                        | `false` | -        | Pin header while scrolling                                                                                                                     |
| `loading`                 | `boolean`                                        | `false` | -        | Show skeleton UI and disable search                                                                                                            |
| `serverMode`              | `boolean`                                        | `false` | -        | Server-side pagination mode — only renders provided data without client-side pagination                                                        |
| `noVirtualScroll`         | `boolean`                                        | `false` | -        | Disable virtual scroll. Default `false`. When `true`, renders all rows at once                                                                 |
| `draggable`               | `boolean`                                        | `false` | -        | Enable drag-and-drop row reordering                                                                                                            |
| `state`                   | `UIState \| (row, rowIndex?, items?) => UIState` | -       | -        | Per-row UI state — constant or callback. Returning `info` / `success` / `warning` / `error` applies `vs-state-*` class to that row            |
| `selectedItems` (v-model) | `VsTableItem[]`                                  | `[]`    | -        | Array of selected rows (v-model)                                                                                                               |
| `page` (v-model)          | `number`                                         | -       | -        | Current page index — 0-based (v-model). Used when pagination is enabled.                                                                       |
| `pageSize` (v-model)      | `number`                                         | -       | -        | Items per page (v-model). Set to `-1` to show all data on one page.                                                                            |
| `pagedItems` (v-model)    | `VsTableItem[]`                                  | `[]`    | -        | Items on the current page (v-model). Only includes items on the current page after pagination, search, and sort are applied.                   |
| `totalItems` (v-model)    | `VsTableItem[]`                                  | `[]`    | -        | All items after search/filter/sort (v-model). Contains all items before pagination is applied.                                                 |

## Types

```typescript
interface VsTableStyleSet {
    component?: CSSProperties;
    header?: CSSProperties;
    row?: CSSProperties;
    selectedRow?: CSSProperties;
    cell?: CSSProperties;
}
```

```typescript
type VsTableColumnKey<I = VsTableItem> = JoinDotField<I>;

interface VsTableColumnDef<I = VsTableItem> {
    key: VsTableColumnKey<I>;
    label: string;
    align?: TextAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    sortable?: boolean;
    sortBy?: VsTableColumnKey<I>;
    skipSearch?: boolean;
    transform?: (value: unknown, item: I) => unknown;
}

interface VsTableSearchOptions {
    placeholder?: string;
    useCaseSensitive?: boolean;
    useRegex?: boolean;
}

type VsTablePageSizeOptions = { label: string; value: number }[];

interface VsTablePaginationOptions {
    pageSizeOptions?: VsTablePageSizeOptions;
    showPageSizeSelect?: boolean;
    showingLength?: number;
    edgeButtons?: boolean;
    showTotal?: boolean;
    totalItemCount?: number; // required when serverMode is true
}

interface VsTableHeaderCell extends VsTableCell {
    tag: 'th';
    sortable: boolean;
}

interface VsTableBodyCell<I = VsTableItem> extends VsTableCell<I> {
    tag: 'td';
    item: I;
}
```

## Slots

| Slot Pattern                       | Description                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| `caption`                          | Customize the `<caption>` element                                                  |
| `select`                           | Selection column area (`{ item, value, rowIdx }`)                                  |
| `expand`                           | Expanded row area (`{ item, value, rowIdx }`)                                      |
| `header`                           | Common rendering for all header cells (`{ item: ColumnDef, value, colIdx, rowIdx }`) |
| `header-${colKey}`                 | Header cell for a specific column key                                              |
| `header-${id}`                     | Specific header cell by id (highest priority)                                      |
| `header-col${colIdx}-row${rowIdx}` | Header cell by column/row index                                                    |
| `header-row${rowIdx}`              | All cells in a specific header row                                                 |
| `header-col${colIdx}`              | All cells in a specific header column                                              |
| `body`                             | Common rendering for all body cells (`{ item: Item, value, colIdx, rowIdx }`)     |
| `body-${colKey}`                   | Body cell for a specific column key                                                |
| `body-${id}`                       | Specific body cell by id (highest priority)                                        |
| `body-col${colIdx}-row${rowIdx}`   | Body cell by column/row index                                                      |
| `body-row${rowIdx}`                | All cells in a specific body row                                                   |
| `body-col${colIdx}`                | All cells in a specific body column                                                |

> Slot priority: `*-id` (most specific) → `*-colKey` → index-based → generic slot.

### Slot Binding Details

| Slot Type | `item`             | `value`              | `colIdx` | `rowIdx` |
| --------- | ------------------ | -------------------- | -------- | -------- |
| header    | `ColumnDef` object | Header display value | ✓        | ✓        |
| body      | Row item (`I`)     | Cell display value   | ✓        | ✓        |
| select    | Row item / `null`  | Selected state       | -        | ✓        |
| expand    | Row item           | Expanded state       | -        | ✓        |

## Events

| Event        | Payload                                           | Description                                                |
| ------------ | ------------------------------------------------- | ---------------------------------------------------------- |
| `click-cell` | `(cell: VsTableBodyCell, event: MouseEvent)`      | Emitted when a cell is clicked                             |
| `select-row` | `(row: VsTableBodyCell[], event: MouseEvent)`     | Emitted when a row (cell array) is selected                |
| `expand-row` | `(row: VsTableBodyCell[], event: MouseEvent)`     | Emitted when a row's expand button is clicked              |
| `search`     | `(rows: VsTableBodyCell[][], searchText: string)` | Emitted on search — provides filtered rows and search text |
| `paginate`   | `(page: number, pageSize: number)`                | Emitted on pagination change                               |
| `drag`       | `(event: SortableEvent)`                          | Emitted when drag is complete (includes oldIndex, newIndex) |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Multiple column input types**: Supports object/string/null column definitions for flexible initial configuration
- **Slot-based customization**: Fine-grained priority slot rendering at the header/body cell level
- **Responsive styling**: Maintains design system consistency with `styleSet` and `colorScheme`
- **Responsive table**: Activated via the `responsive` prop. Switches to card layout below 1024px container width, showing header info alongside each cell
- **Pagination**: Provides VsPagination-based page navigation and total items/page size selection
- **Data tracking**: Real-time tracking of current page and filtered data via `v-model:paged-items` and `v-model:total-items`
- **Row selection**: Checkbox-based row selection and conditional selection via the `selectable` prop
- **Row expansion**: Toggle per-row detail areas via the `expandable` prop and `expand` slot
