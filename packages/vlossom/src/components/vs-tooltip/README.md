> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsTooltip

A floating tooltip component that attaches to a target element and supports hover, click, and keyboard interactions.

**Available Version**: 2.0.0+

## Feature

- Two usage modes: wrap the trigger via the default slot, or attach to an external element via a CSS selector
- Supports hover, click-to-open, and contents-hover modes
- Configurable placement (top, bottom, left, right) and alignment (start, center, end)
- Configurable wrapper tag (`span` by default) for slot mode
- Arrow indicator with customizable color and size
- Escape key closes the tooltip (configurable)
- Configurable enter and leave delays

## Basic Usage

### Slot Mode (default)

When `target` is omitted, the default slot is wrapped by an element that becomes the trigger.

```html
<template>
    <vs-tooltip>
        <button>Hover me</button>
        <template #tooltip>This is a tooltip</template>
    </vs-tooltip>
</template>
```

### Target Mode

Pass `target` as a CSS selector to attach the tooltip to an external element.

```html
<template>
    <button id="my-btn">Hover me</button>
    <vs-tooltip target="#my-btn">
        <template #tooltip>This is a tooltip</template>
    </vs-tooltip>
</template>
```

### Click-to-Open Tooltip

```html
<template>
    <vs-tooltip clickable>
        <button>Click me</button>
        <template #tooltip>Opened by click</template>
    </vs-tooltip>
</template>
```

### Bottom Placement

```html
<template>
    <vs-tooltip placement="bottom" align="start">
        <button>Hover me</button>
        <template #tooltip>Bottom-start tooltip</template>
    </vs-tooltip>
</template>
```

### Contents Hover

```html
<template>
    <vs-tooltip contents-hover>
        <button>Hover me</button>
        <template #tooltip>
            <a href="#">Click this link inside the tooltip</a>
        </template>
    </vs-tooltip>
</template>
```

### Custom Wrapper Tag

```html
<template>
    <vs-tooltip tag="div">
        <div class="trigger-area">Block-level trigger</div>
        <template #tooltip>Wrapped by a div</template>
    </vs-tooltip>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsTooltipStyleSet` | | | Custom style set for the component |
| `target` | `string` | `''` | | CSS selector of the trigger element. If omitted, the default slot is wrapped and used as the trigger |
| `tag` | `string` | `'span'` | | Tag name of the wrapper element rendered around the default slot (slot mode only) |
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
    $arrowColor?: string;
    $arrowSize?: string;

    $tooltip?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-tooltip
        :style-set="{
            $arrowColor: '#323232',
            $arrowSize: '0.5rem',
            $tooltip: {
                backgroundColor: '#323232',
                color: '#ffffff',
                borderRadius: '0.25rem',
                padding: '0.4rem 0.8rem',
            },
        }"
    >
        <button>Hover me</button>
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
| `default` | Trigger content (rendered only when `target` is not provided; wrapped by the `tag` element) |
| `tooltip` | Tooltip content shown in the floating panel |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
