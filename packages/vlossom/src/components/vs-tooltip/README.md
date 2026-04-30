> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsTooltip

A floating tooltip component that wraps a trigger element via the default slot and renders tooltip content from the `tooltip` slot.

**Available Version**: 2.0.0+

## Feature

- Wraps any trigger element via the default slot — no selector or `id` plumbing required
- Works on disabled trigger elements (e.g., `<vs-button disabled>`) because listeners live on the wrapper, not the trigger itself
- Supports hover, click-to-open, and contents-hover modes
- Configurable placement (top, bottom, left, right) and alignment (start, center, end)
- Arrow indicator with customizable color and size
- Escape key closes the tooltip (configurable)
- Configurable enter and leave delays

## Basic Usage

```html
<template>
    <vs-tooltip>
        <vs-button>Hover me</vs-button>
        <template #tooltip>This is a tooltip</template>
    </vs-tooltip>
</template>
```

The trigger wrapper uses `display: contents`, so it does not introduce any layout box around the trigger element — the trigger keeps its original layout behavior.

### Click-to-Open Tooltip

```html
<template>
    <vs-tooltip clickable>
        <vs-button>Click me</vs-button>
        <template #tooltip>Opened by click</template>
    </vs-tooltip>
</template>
```

### Bottom Placement

```html
<template>
    <vs-tooltip placement="bottom" align="start">
        <vs-button>Hover me</vs-button>
        <template #tooltip>Bottom-start tooltip</template>
    </vs-tooltip>
</template>
```

### Contents Hover

```html
<template>
    <vs-tooltip contents-hover>
        <vs-button>Hover me</vs-button>
        <template #tooltip>
            <a href="#">Click this link inside the tooltip</a>
        </template>
    </vs-tooltip>
</template>
```

### Disabled Trigger

```html
<template>
    <vs-tooltip>
        <vs-button disabled>Disabled</vs-button>
        <template #tooltip>You don't have permission</template>
    </vs-tooltip>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsTooltipStyleSet` | | | Custom style set for the component |
| `align` | `Alignment` | `'center'` | | Alignment of the tooltip relative to the trigger (`start`, `center`, `end`) |
| `clickable` | `boolean` | `false` | | Requires a click on the trigger to open |
| `contentsHover` | `boolean` | `false` | | Keeps the tooltip open while hovering its contents |
| `disabled` | `boolean` | `false` | | Disables the tooltip |
| `enterDelay` | `string \| number` | `0` | | Delay (ms) before the tooltip appears |
| `escClose` | `boolean` | `true` | | Closes the tooltip when Escape is pressed |
| `leaveDelay` | `string \| number` | `0` | | Delay (ms) before the tooltip disappears |
| `margin` | `string \| number` | `10` | | Gap (px) between the trigger and the tooltip |
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
    <vs-tooltip
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
        <vs-button>Hover me</vs-button>
        <template #tooltip>Custom tooltip</template>
    </vs-tooltip>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Trigger element. Listeners (hover, click, focus) attach to the wrapper around this slot. |
| `tooltip` | Tooltip content shown in the floating layer. |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
