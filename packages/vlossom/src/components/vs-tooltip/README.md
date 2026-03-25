> 한국어: [README.ko.md](./README.ko.md)

# VsTooltip

A tooltip component supporting various trigger modes and positions. Supports hover, click, keyboard focus, and other interaction patterns.

**Available Version**: 2.0.0+

## Basic Usage

### Default Tooltip

```html
<template>
    <vs-button id="my-button-id">Hover Me</vs-button>
    <vs-tooltip target="#my-button-id">
        <span>This is a tooltip</span>
    </vs-tooltip>
    <vs-button class="my-button-class">Hover Me</vs-button>
    <vs-tooltip target=".my-button-class">
        <span>That is a tooltip</span>
    </vs-tooltip>
</template>
```

> **Note**
> Any CSS selector supported by `querySelector` can be used for the `target` prop.
> Examples: `#my-id`, `.my-class`, `[data-attr="value"]`, etc.

### Clickable Tooltip

```html
<template>
    <vs-button id="clickable-button">Click me</vs-button>
    <vs-tooltip target="#clickable-button" clickable>
        <span>Tooltip opened by clicking</span>
    </vs-tooltip>
</template>
```

### Hoverable Tooltip Content

```html
<template>
    <vs-button id="hover-button">Hover Me</vs-button>
    <vs-tooltip target="#hover-button" contents-hover>
        <span>You can hover over this tooltip content</span>
    </vs-tooltip>
</template>
```

### Clickable and Hoverable Tooltip

```html
<template>
    <vs-button id="click-hover-button">Click and Hover Me</vs-button>
    <vs-tooltip target="#click-hover-button" clickable contents-hover>
        <span>Opens on click and you can also hover over the tooltip content</span>
    </vs-tooltip>
</template>
```

### Various Positions

```html
<template>
    <div style="display: flex; gap: 1rem;">
        <vs-button id="top-button">Top</vs-button>
        <vs-tooltip target="#top-button" placement="top">top</vs-tooltip>

        <vs-button id="right-button">Right</vs-button>
        <vs-tooltip target="#right-button" placement="right">right</vs-tooltip>

        <vs-button id="bottom-button">Bottom</vs-button>
        <vs-tooltip target="#bottom-button" placement="bottom">bottom</vs-tooltip>

        <vs-button id="left-button">Left</vs-button>
        <vs-tooltip target="#left-button" placement="left">left</vs-tooltip>
    </div>
</template>
```

### Alignment Options

```html
<template>
    <div style="display: flex; gap: 1rem;">
        <vs-button id="start-button">Start</vs-button>
        <vs-tooltip target="#start-button" placement="top" align="start">start</vs-tooltip>

        <vs-button id="center-button">Center</vs-button>
        <vs-tooltip target="#center-button" placement="top" align="center">center</vs-tooltip>

        <vs-button id="end-button">End</vs-button>
        <vs-tooltip target="#end-button" placement="top" align="end">end</vs-tooltip>
    </div>
</template>
```

## Props

| Prop            | Type                                     | Default    | Required | Description                            |
| --------------- | ---------------------------------------- | ---------- | -------- | -------------------------------------- |
| `target`        | `string`                                 | -          | ✅       | CSS selector for the target element    |
| `colorScheme`   | `string`                                 | -          | -        | Color scheme for the component         |
| `styleSet`      | `string \| VsTooltipStyleSet`            | -          | -        | Custom style configuration object      |
| `align`         | `'start' \| 'center' \| 'end'`           | `'center'` | -        | Tooltip alignment                      |
| `clickable`     | `boolean`                                | `false`    | -        | Toggle tooltip on click                |
| `contentsHover` | `boolean`                                | `false`    | -        | Allow hovering over tooltip content    |
| `disabled`      | `boolean`                                | `false`    | -        | Disable the tooltip                    |
| `enterDelay`    | `number`                                 | `0`        | -        | Show delay in milliseconds             |
| `escClose`      | `boolean`                                | `true`     | -        | Close tooltip on ESC key               |
| `leaveDelay`    | `number`                                 | `0`        | -        | Hide delay in milliseconds             |
| `margin`        | `string \| number`                       | `10`       | -        | Gap between tooltip and target element |
| `noAnimation`   | `boolean`                                | `false`    | -        | Disable animation                      |
| `placement`     | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    | -        | Tooltip position                       |

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
    <div>
        <button id="my-button">Hover me</button>
        <vs-tooltip
            target="#my-button"
            :style-set="{
                variables: {
                    arrowColor: '#333',
                    arrowSize: '0.5rem',
                },
                component: {
                    backgroundColor: '#333',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    color: 'white',
                },
            }"
        >
            Custom styled tooltip
        </vs-tooltip>
    </div>
</template>
```

## Slots

| Slot      | Description     |
| --------- | --------------- |
| `default` | Tooltip content |

## Features

- **Multiple trigger modes**: Supports hover, click, and keyboard focus
- **Flexible positioning**: 4-direction positioning and 3 alignment options
- **Animation support**: Smooth fade in/out effects
- **Accessibility**: Keyboard navigation and ESC key support
- **Delay configuration**: Customizable show/hide delay times
