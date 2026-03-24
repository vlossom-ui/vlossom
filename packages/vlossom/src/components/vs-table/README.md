> 한국어: [README.ko.md](./README.ko.md)

# VsTable

A component that renders tabular data based on column definitions and an item array. Supports fine-grained customization via header/body slots, and enables cell-level priority rendering via slot naming conventions.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

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

        <template #header-name="{ header }">
            <span class="bg-yellow-200 font-semibold">{{ header.value }}*</span>
        </template>

        <template #body-age="{ item }">
            <span class="text-emerald-600">{{ item.age }} yrs</span>
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
        :search="{ placeholder: 'Search by name', useCaseSensitive: false, useRegex: true }"
        @search="(rows, searchText) => console.log(rows, searchText)"
    />
</template>
```

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

### Row Expand

```html
<template>
    <vs-table
        :columns="[{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }]"
        :items="items"
        :expandable="(item) => item.age >= 30"
    >
        <template #expand="{ cells, rowIdx }">
            <div class="p-4 bg-slate-50">
                <p>Details for row {{ rowIdx }}: {{ cells[0].item.name }}</p>
            </div>
        </template>
    </vs-table>
</template>
```

### Row Drag

```html
<template>
    <vs-table :columns="['name', 'age']" :items="items" draggable @drag="handleDrag" />
</template>

<script setup>
function handleDrag(event) {
    const { oldIndex, newIndex } = event;
    const movedItem = items.value.splice(oldIndex, 1)[0];
    items.value.splice(newIndex, 0, movedItem);
}
</script>
```

## Props

| Prop              | Type                                              | Default | Required | Description                                                |
| ----------------- | ------------------------------------------------- | ------- | -------- | ---------------------------------------------------------- |
| `colorScheme`     | `ColorScheme`                                     | -       | -        | Color scheme for the component                             |
| `styleSet`        | `string \| VsTableStyleSet`                       | -       | -        | Custom style configuration object                          |
| `columns`         | `ColumnDef[] \| string[] \| null`                 | `[]`    | -        | Table column definitions                                   |
| `items`           | `Item[]`                                          | -       | ✅       | Array of items to display                                  |
| `dense`           | `boolean`                                         | `false` | -        | Compact mode — reduces padding and font-size               |
| `primary`         | `boolean`                                         | `false` | -        | Apply primary color to the header                          |
| `noResponsive`    | `boolean`                                         | `false` | -        | Disable responsive layout — always use table layout        |
| `search`          | `boolean \| VsTableSearchOptions`                 | `false` | -        | Show search input and configure search options             |
| `pagination`      | `boolean \| VsTablePaginationOptions`             | `false` | -        | Enable pagination and configure pagination options         |
| `selectable`      | `boolean \| (item, index?, items?) => boolean`    | `false` | -        | Enable row selection or conditional selection function     |
| `expandable`      | `boolean \| (item, index?, items?) => boolean`    | `false` | -        | Enable row expansion or conditional expansion function     |
| `stickyHeader`    | `boolean`                                         | `false` | -        | Pin header while scrolling                                 |
| `loading`         | `boolean`                                         | `false` | -        | Show skeleton UI and disable search                        |
| `serverMode`      | `boolean`                                         | `false` | -        | Server-side pagination mode — render only provided data    |
| `noVirtualScroll` | `boolean`                                         | `false` | -        | Disable virtual scroll — render all rows at once           |
| `draggable`       | `boolean`                                         | `false` | -        | Enable drag-and-drop row reordering                        |
| `state`           | `UIState \| (row, rowIdx?, items?) => UIState`    | -       | -        | Per-row UI state (info / success / warning / error)        |
| `selectedItems`   | `Item[]` (v-model)                                | `[]`    | -        | Array of selected items (v-model)                          |
| `page`            | `number` (v-model)                                | -       | -        | Current page index — 0-based (v-model)                     |
| `pageSize`        | `number` (v-model)                                | -       | -        | Items per page (v-model). `-1` shows all items on one page |
| `pagedItems`      | `Item[]` (v-model)                                | `[]`    | -        | Items on the current page (v-model)                        |
| `totalItems`      | `Item[]` (v-model)                                | `[]`    | -        | All items after search/filter/sort (v-model)               |

## Types

```typescript
interface VsTableStyleSet {
    component?: CSSProperties;
    header?: CSSProperties;
    row?: CSSProperties;
    selectedRow?: CSSProperties;
    cell?: CSSProperties;
}

interface ColumnDef<I = Item> {
    key: ColumnKey<I>;
    label: string;
    align?: TextAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    sortable?: boolean;
    sortBy?: ColumnKey<I>;
    skipSearch?: boolean;
    transform?: (value: unknown, item: I) => unknown;
}

interface VsTableSearchOptions {
    placeholder?: string;
    useCaseSensitive?: boolean;
    useRegex?: boolean;
}

interface VsTablePaginationOptions {
    pageSizeOptions?: { label: string; value: number }[];
    showPageSizeSelect?: boolean;
    showingLength?: number;
    edgeButtons?: boolean;
    showTotal?: boolean;
    totalItemCount?: number; // required when serverMode is true
}
```

## Slots

| Slot Pattern                      | Description                                        |
| --------------------------------- | -------------------------------------------------- |
| `caption`                         | Customize the `<caption>` element                  |
| `select`                          | Selection column area (`{ cells, rowIdx }`)        |
| `expand`                          | Expanded row area (`{ cells, rowIdx }`)            |
| `header`                          | Common rendering for all header cells              |
| `header-${colKey}`                | Header cell for a specific column key              |
| `header-${id}`                    | Specific header cell by id (highest priority)      |
| `header-col${colIdx}-row${rowIdx}`| Header cell by column/row index                    |
| `header-row${rowIdx}`             | All cells in a specific header row                 |
| `header-col${colIdx}`             | All cells in a specific header column              |
| `body`                            | Common rendering for all body cells                |
| `body-${colKey}`                  | Body cell for a specific column key                |
| `body-${id}`                      | Specific body cell by id (highest priority)        |
| `body-col${colIdx}-row${rowIdx}`  | Body cell by column/row index                      |
| `body-row${rowIdx}`               | All cells in a specific body row                   |
| `body-col${colIdx}`               | All cells in a specific body column                |

> Slot priority: `*-id` (most specific) → `*-colKey` → index-based → generic slot.

## Events

| Event        | Payload                                    | Description                                                   |
| ------------ | ------------------------------------------ | ------------------------------------------------------------- |
| `click-cell` | `(cell: BodyCell, event: MouseEvent)`      | Emitted when a cell is clicked                                |
| `select-row` | `(row: BodyCell[], event: MouseEvent)`     | Emitted when a row is selected                                |
| `expand-row` | `(row: BodyCell[], event: MouseEvent)`     | Emitted when a row's expand button is clicked                 |
| `search`     | `(rows: BodyCell[][], searchText: string)` | Emitted on search — provides filtered rows and search text    |
| `paginate`   | `(page: number, pageSize: number)`         | Emitted on pagination change — provides page and page size    |
| `drag`       | `(event: SortableEvent)`                   | Emitted when drag is complete (includes oldIndex, newIndex)   |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
