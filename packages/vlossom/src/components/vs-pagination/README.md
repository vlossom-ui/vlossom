> 한국어: [README.ko.md](./README.ko.md)

# VsPagination

A pagination component for navigating through pages of data. Supports edge buttons, customizable number of visible page buttons, and total item count display.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Pagination

```html
<template>
    <vs-pagination v-model="currentPage" :total="100" />
</template>

<script setup>
import { ref } from 'vue';
const currentPage = ref(0);
</script>
```

### Custom Page Size

```html
<template>
    <vs-pagination
        v-model="currentPage"
        :total="500"
        :page-size="20"
    />
</template>
```

### With Edge Buttons

```html
<template>
    <vs-pagination
        v-model="currentPage"
        :total="200"
        edge-buttons
    />
</template>
```

### Show Total Count

```html
<template>
    <vs-pagination
        v-model="currentPage"
        :total="150"
        show-total
    />
</template>
```

### Page Size Selector

```html
<template>
    <vs-pagination
        v-model="currentPage"
        v-model:page-size="pageSize"
        :total="500"
        show-page-size-select
        :page-size-options="[
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
        ]"
    />
</template>

<script setup>
import { ref } from 'vue';
const currentPage = ref(0);
const pageSize = ref(10);
</script>
```

## Props

| Prop                 | Type                                   | Default     | Required | Description                                      |
| -------------------- | -------------------------------------- | ----------- | -------- | ------------------------------------------------ |
| `modelValue`         | `number`                               | `0`         | -        | Current page index — 0-based (v-model)           |
| `total`              | `number`                               | `0`         | -        | Total number of items                            |
| `colorScheme`        | `ColorScheme`                          | -           | -        | Color scheme for the component                   |
| `styleSet`           | `string \| VsPaginationStyleSet`       | -           | -        | Custom style configuration object                |
| `pageSize`           | `number`                               | `10`        | -        | Number of items per page (v-model:page-size)     |
| `pageSizeOptions`    | `{ label: string; value: number }[]`   | -           | -        | Page size options for the selector               |
| `edgeButtons`        | `boolean`                              | `false`     | -        | Show first/last page buttons                     |
| `showingLength`      | `number`                               | `5`         | -        | Number of page number buttons to display         |
| `showPageSizeSelect` | `boolean`                              | `false`     | -        | Show page size selector                          |
| `showTotal`          | `boolean`                              | `false`     | -        | Show total item count                            |

## Types

```typescript
interface VsPaginationStyleSet {
    variables?: {
        gap?: string;
    };
    component?: CSSProperties;
    button?: VsButtonStyleSet;
    activeButton?: VsButtonStyleSet;
}
```

> [!NOTE]
>
> `button` and `activeButton` use [VsButtonStyleSet](../vs-button/README.md#types).

## Events

| Event               | Payload  | Description                              |
| ------------------- | -------- | ---------------------------------------- |
| `update:modelValue` | `number` | Emitted when the current page changes    |
| `update:pageSize`   | `number` | Emitted when the page size changes       |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
