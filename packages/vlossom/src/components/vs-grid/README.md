> 한국어: [README.ko.md](./README.ko.md)

# VsGrid

A grid component for easily composing CSS Grid layouts. Provides a responsive grid system with customizable gaps.

**Available Version**: 2.0.0+

## Basic Usage

### Default Grid

```html
<template>
    <vs-grid
        :grid-size="6"
        :column-gap="16"
        :row-gap="24"
        width="800px"
        height="400px"
    >
        <div>Grid Item 1</div>
        <div>Grid Item 2</div>
        <div>Grid Item 3</div>
        <div>Grid Item 4</div>
    </vs-grid>
</template>
```

### Custom Tag

```html
<template>
    <vs-grid tag="section" :grid-size="3">
        <article>Article 1</article>
        <article>Article 2</article>
        <article>Article 3</article>
    </vs-grid>
</template>
```

## Props

| Prop        | Type                       | Default | Required | Description                           |
| ----------- | -------------------------- | ------- | -------- | ------------------------------------- |
| `gridSize`  | `string \| number`         | -       | -        | Number of grid columns (default 12)   |
| `columnGap` | `string \| number`         | -       | -        | Gap between columns (default 0)       |
| `rowGap`    | `string \| number`         | -       | -        | Gap between rows (default 0)          |
| `width`     | `string \| number`         | -       | -        | Component width (default 100%)        |
| `height`    | `string \| number`         | -       | -        | Component height (default 100%)       |
| `tag`       | `string`                   | `div`   | -        | HTML tag to render as                 |
| `styleSet`  | `string \| VsGridStyleSet` | -       | -        | Custom style configuration object     |

## Types

```typescript
interface VsGridStyleSet {
    component?: CSSProperties;
    variables?: {
        gridSize?: number;
        columnGap?: string;
        rowGap?: string;
    };
}
```

### StyleSet Example

#### Setting Grid via variables

```html
<template>
    <vs-grid :style-set="{
        variables: {
            gridSize: 4,
            columnGap: '1rem',
            rowGap: '1rem',
        },
    }">
        <div>Item 1</div>
        <div>Item 2</div>
    </vs-grid>
</template>
```

#### Setting Container Style via component

```html
<template>
    <vs-grid :style-set="{
        component: {
            width: '600px',
            height: '200px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
        },
    }">
        <div>Item 1</div>
        <div>Item 2</div>
    </vs-grid>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                           |
| --------- | ------------------------------------- |
| `default` | Content to place inside the grid      |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **CSS Grid based**: Uses the CSS Grid layout system
- **Container Query**: Supports `container-type: inline-size`
