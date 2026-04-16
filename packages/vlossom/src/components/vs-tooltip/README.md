> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsTooltip

A floating tooltip component that attaches to a target element and supports hover, click, and keyboard interactions.

**Available Version**: 2.0.0+

## Feature

- Attaches to any target element via a CSS selector
- Supports hover, click-to-open, and contents-hover modes
- Configurable placement (top, bottom, left, right) and alignment (start, center, end)
- Arrow indicator with customizable color and size
- Escape key closes the tooltip (configurable)
- Configurable enter and leave delays

## Basic Usage

```html
<template>
    <button id="my-btn">Hover me</button>
    <vs-tooltip target="#my-btn">
        This is a tooltip
    </vs-tooltip>
</template>
```

### Click-to-Open Tooltip

```html
<template>
    <button id="click-btn">Click me</button>
    <vs-tooltip target="#click-btn" clickable>
        Opened by click
    </vs-tooltip>
</template>
```

### Bottom Placement

```html
<template>
    <button id="bottom-btn">Hover me</button>
    <vs-tooltip target="#bottom-btn" placement="bottom" align="start">
        Bottom-start tooltip
    </vs-tooltip>
</template>
```

### Contents Hover

```html
<template>
    <button id="hover-btn">Hover me</button>
    <vs-tooltip target="#hover-btn" contents-hover>
        <a href="#">Click this link inside the tooltip</a>
    </vs-tooltip>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsTooltipStyleSet` | | | Custom style set for the component |
| `target` | `string` | `''` | Yes | CSS selector of the trigger element |
| `align` | `Alignment` | `'center'` | | Alignment of the tooltip relative to the target (`start`, `center`, `end`) |
| `clickable` | `boolean` | `false` | | Requires a click on the target to open |
| `contentsHover` | `boolean` | `false` | | Keeps the tooltip open while hovering its contents |
| `disabled` | `boolean` | `false` | | Disables the tooltip |
| `enterDelay` | `string \| number` | `0` | | Delay (ms) before the tooltip appears |
| `escClose` | `boolean` | `true` | | Closes the tooltip when Escape is pressed |
| `leaveDelay` | `string \| number` | `0` | | Delay (ms) before the tooltip disappears |
| `margin` | `string \| number` | `10` | | Gap (px) between the target and the tooltip |
| `noAnimation` | `boolean` | `false` | | Disables the open/close animation |
| `placement` | `Placement` | `'top'` | | Placement of the tooltip (`top`, `bottom`, `left`, `right`) |

## Types

```typescript
interface VsTooltipStyleSet {
    variables?: {
        arrowColor?: string;
        arrowSize?: string;
    };
    component?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <button id="styled-btn">Hover me</button>
    <vs-tooltip
        target="#styled-btn"
        :style-set="{
            variables: { arrowColor: '#323232', arrowSize: '0.5rem' },
            component: {
                backgroundColor: '#323232',
                color: '#ffffff',
                borderRadius: '0.25rem',
                padding: '0.4rem 0.8rem',
            },
        }"
    >
        Custom tooltip
    </vs-tooltip>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Tooltip content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
