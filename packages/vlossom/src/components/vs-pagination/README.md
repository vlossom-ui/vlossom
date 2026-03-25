> 한국어: [README.ko.md](./README.ko.md)

# VsPagination

A pagination component for page navigation. Supports `v-model` and automatically generates page buttons based on the total page count.

**Available Version**: 2.0.0+

## Basic Usage

### Default Pagination

```html
<template>
    <vs-pagination v-model="currentPage" :length="10" @change="handlePageChange" />
</template>
```

### With Edge Buttons

```html
<template>
    <vs-pagination v-model="currentPage" :length="20" edge-buttons />
</template>
```

### Adjust Visible Page Count

```html
<template>
    <vs-pagination v-model="currentPage" :length="100" :showing-length="5" />
</template>
```

### Style Variants

```html
<template>
    <vs-pagination v-model="currentPage" :length="10" ghost />
    <vs-pagination v-model="currentPage" :length="10" outline />
</template>
```

### Custom Page Number

```html
<template>
    <vs-pagination v-model="currentPage" :length="10">
        <template #page="{ page }">
            Page {{ page }}
        </template>
    </vs-pagination>
</template>
```

## Props

| Prop            | Type                             | Default | Required | Description                                   |
| --------------- | -------------------------------- | ------- | -------- | --------------------------------------------- |
| `modelValue`    | `number`                         | `0`     | -        | Current page bound via v-model (0-based)      |
| `length`        | `number`                         | `1`     | ✓        | Total number of pages (must be 1 or more)     |
| `showingLength` | `number`                         | `10`    | -        | Number of page buttons to display (1 or more) |
| `edgeButtons`   | `boolean`                        | `false` | -        | Show first/last page buttons                  |
| `disabled`      | `boolean`                        | `false` | -        | Disable the entire pagination                 |
| `ghost`         | `boolean`                        | `false` | -        | Apply ghost style                             |
| `outline`       | `boolean`                        | `false` | -        | Apply outline style                           |
| `colorScheme`   | `ColorScheme`                    | -       | -        | Color scheme for the component                |
| `styleSet`      | `string \| VsPaginationStyleSet` | -       | -        | Custom style configuration object             |

## Events

| Event               | Parameters | Description                            |
| ------------------- | ---------- | -------------------------------------- |
| `update:modelValue` | `number`   | Emitted when the v-model value changes |
| `change`            | `number`   | Emitted when the page changes          |

## Slots

| Slot    | Props      | Description                          |
| ------- | ---------- | ------------------------------------ |
| `first` | -          | Content for the first-page button    |
| `prev`  | -          | Content for the previous-page button |
| `page`  | `{ page }` | Content for page number buttons      |
| `next`  | -          | Content for the next-page button     |
| `last`  | -          | Content for the last-page button     |

## Types

```typescript
interface VsPaginationStyleSet {
    component?: CSSProperties;
    pageButton?: Omit<VsButtonStyleSet, 'loading'>;
    controlButton?: Omit<VsButtonStyleSet, 'loading'>;
}
```

> [!NOTE]
>
> - `pageButton` uses [VsButtonStyleSet](../vs-button/README.md#types).
> - `controlButton` uses [VsButtonStyleSet](../vs-button/README.md#types).

### StyleSet Example

```html
<template>
    <vs-pagination
        v-model="currentPage"
        :length="20"
        :style-set="{
            component: {
                gap: '1rem',
            },
            pageButton: {
                component: {
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#f5f5f5',
                },
            },
            controlButton: {
                component: {
                    borderRadius: '50%',
                },
            },
        }"
    />
</template>
```

## Features

- **v-model support**: Manage current page state with two-way data binding (0-based index)
- **Automatic page calculation**: Automatically calculates the visible page range centered on the current page
- **VsButton based**: Consistent styling using VsButton for edge and page buttons
