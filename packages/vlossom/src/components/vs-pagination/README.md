> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsPagination

A pagination component that allows navigation through a series of pages.

**Available Version**: 2.0.0+

## Feature

- Supports v-model binding for the current page index (0-based)
- Configurable number of visible page buttons via `showingLength`
- Optional edge buttons (first/last page) via `edgeButtons`
- Ghost and outline button style options
- Customizable button styles via `pageButton` and `controlButton` style sets
- Programmatic navigation methods: `goFirst`, `goLast`, `goPrev`, `goNext`, `setPage`

## Basic Usage

```html
<template>
    <vs-pagination v-model="page" :length="10" />
</template>

<script setup>
import { ref } from 'vue';
const page = ref(0);
</script>
```

### With Edge Buttons

```html
<template>
    <vs-pagination v-model="page" :length="20" :showing-length="5" edge-buttons />
</template>
```

### With Ghost and Outline Style

```html
<template>
    <vs-pagination v-model="page" :length="10" ghost outline />
</template>
```

## Props

| Prop            | Type                            | Default | Required | Description                                              |
| --------------- | ------------------------------- | ------- | -------- | -------------------------------------------------------- |
| `colorScheme`   | `string`                        | -       | -        | Color scheme for the component                           |
| `styleSet`      | `string \| VsPaginationStyleSet` | -       | -        | Custom style set for the component                       |
| `disabled`      | `boolean`                       | `false` | -        | Disables all pagination buttons                          |
| `edgeButtons`   | `boolean`                       | `false` | -        | Shows first and last page navigation buttons             |
| `ghost`         | `boolean`                       | `false` | -        | Applies ghost style to buttons                           |
| `length`        | `number`                        | `1`     | Yes      | Total number of pages (must be greater than 0)           |
| `outline`       | `boolean`                       | `false` | -        | Applies outline style to buttons                         |
| `showingLength` | `number`                        | `10`    | -        | Number of page buttons to display at once                |
| `modelValue`    | `number`                        | `0`     | -        | Current page index (0-based), used with `v-model`        |

## Types

```typescript
interface VsPaginationStyleSet {
    variables?: {
        selectedButtonBackgroundColor?: string;
        selectedButtonFontColor?: string;
    };
    component?: CSSProperties;
    pageButton?: Omit<VsButtonStyleSet, 'loading'>;
    controlButton?: Omit<VsButtonStyleSet, 'loading'>;
}
```

> [!NOTE]
> `pageButton` and `controlButton` use [VsButtonStyleSet](../vs-button/README.md#types) (excluding `loading`).

### StyleSet Example

```html
<template>
    <vs-pagination
        v-model="page"
        :length="10"
        :style-set="{
            variables: {
                selectedButtonBackgroundColor: '#4f46e5',
                selectedButtonFontColor: '#ffffff',
            },
            component: { gap: '0.25rem' },
        }"
    />
</template>
```

## Events

| Event               | Payload  | Description                          |
| ------------------- | -------- | ------------------------------------ |
| `update:modelValue` | `number` | Emitted when the current page changes |
| `change`            | `number` | Emitted when the current page changes |

## Slots

| Slot    | Description                             |
| ------- | --------------------------------------- |
| `first` | Custom icon for the "first page" button |
| `last`  | Custom icon for the "last page" button  |
| `prev`  | Custom icon for the "prev page" button  |
| `next`  | Custom icon for the "next page" button  |
| `page`  | Custom content for each page button; receives `{ page: number }` |

## Methods

| Method      | Parameters         | Description                          |
| ----------- | ------------------ | ------------------------------------ |
| `goFirst`   | -                  | Navigates to the first page          |
| `goLast`    | -                  | Navigates to the last page           |
| `goPrev`    | -                  | Navigates to the previous page       |
| `goNext`    | -                  | Navigates to the next page           |
| `setPage`   | `page: number`     | Navigates to the specified page index |
