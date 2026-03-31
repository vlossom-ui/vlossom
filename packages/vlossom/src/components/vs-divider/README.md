> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsDivider

A horizontal or vertical line separator used to visually divide content sections.

**Available Version**: 2.0.0+

## Feature

- Horizontal (default) and vertical orientations
- Responsive mode that switches a vertical divider to horizontal on small containers
- Customizable border style, width/height, and margin via CSS variables
- Color scheme support for themed separators

## Basic Usage

```html
<template>
    <p>Section A</p>
    <vs-divider />
    <p>Section B</p>
</template>
```

### Vertical Divider

```html
<template>
    <div style="display: flex; align-items: center; height: 2rem;">
        <span>Item 1</span>
        <vs-divider vertical />
        <span>Item 2</span>
    </div>
</template>
```

### Responsive Vertical Divider

```html
<template>
    <div style="display: flex; align-items: center;">
        <span>Left</span>
        <vs-divider vertical responsive />
        <span>Right</span>
    </div>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | Color scheme for the component |
| `styleSet` | `string \| VsDividerStyleSet` | | | Custom style set |
| `responsive` | `boolean` | `false` | | Switches a vertical divider to horizontal at small container widths |
| `vertical` | `boolean` | `false` | | Renders a vertical divider instead of horizontal |

## Types

```typescript
interface VsDividerStyleSet {
    variables?: {
        border?: string;

        horizontal?: {
            width?: string;
            margin?: string;
        };

        vertical?: {
            height?: string;
            margin?: string;
        };
    };
    component?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-divider
        :style-set="{
            variables: {
                border: '2px dashed #6200ea',
                horizontal: {
                    width: '80%',
                    margin: '1rem auto',
                },
            },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
