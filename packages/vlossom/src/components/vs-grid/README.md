> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsGrid

A responsive CSS grid container that supports a configurable number of columns, gap controls, and custom dimensions.

**Available Version**: 2.0.0+

## Feature

- CSS Grid layout with configurable column count via `gridSize` (default: 12 columns)
- Independent `columnGap` and `rowGap` controls
- Explicit `width` and `height` sizing props
- Renders as any HTML element via the `tag` prop
- Integrates with Vlossom responsive props (`width`, `grid`) on child components
- Exposes `StyleSet` for custom component styles and grid-size CSS variable

## Basic Usage

```html
<template>
    <vs-grid :grid-size="12" :column-gap="16" :row-gap="8">
        <div style="grid-column: span 6">Left</div>
        <div style="grid-column: span 6">Right</div>
    </vs-grid>
</template>
```

### Custom Width and Height

```html
<template>
    <vs-grid width="800px" height="400px" :grid-size="3" :column-gap="8">
        <div>Col 1</div>
        <div>Col 2</div>
        <div>Col 3</div>
    </vs-grid>
</template>
```

### Rendering as a Different Tag

```html
<template>
    <vs-grid tag="ul" :grid-size="4">
        <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </vs-grid>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `styleSet` | `string \| VsGridStyleSet` | | | Custom style set for the component |
| `gridSize` | `number \| string` | | | Number of grid columns. Default is 12 |
| `columnGap` | `number \| string` | | | Gap between grid columns |
| `rowGap` | `number \| string` | | | Gap between grid rows |
| `width` | `string \| number` | | | Width of the grid container |
| `height` | `string \| number` | | | Height of the grid container |
| `tag` | `string` | `'div'` | | HTML tag to render as |

## Types

```typescript
interface VsGridStyleSet {
    component?: CSSProperties;
    variables?: {
        gridSize?: number;
    };
}
```

### StyleSet Example

```html
<template>
    <vs-grid
        :style-set="{
            variables: { gridSize: 6 },
            component: { backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px' },
        }"
    >
        <div>Item 1</div>
        <div>Item 2</div>
    </vs-grid>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Grid items |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
