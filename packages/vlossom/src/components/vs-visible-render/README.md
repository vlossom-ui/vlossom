> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsVisibleRender

A container component that uses IntersectionObserver to track child element visibility and optimize rendering performance.

**Available Version**: 2.0.0+

## Feature

- Uses `IntersectionObserver` to track which children are visible in the viewport
- Sets a `data-io-visible` attribute on each child for CSS-driven show/hide
- Uses `MutationObserver` to respond to DOM changes automatically
- Configurable `rootMargin` and `threshold` for fine-grained intersection control
- Optional `height` prop creates an internal scroll container
- Programmatic scroll-to-element support via exposed method
- Can be disabled to show all children at once

## Basic Usage

```html
<template>
    <vs-visible-render>
        <div v-for="item in items" :key="item.id">
            {{ item.name }}
        </div>
    </vs-visible-render>
</template>
```

### With Fixed Height (Internal Scroll)

```html
<template>
    <vs-visible-render height="400px">
        <div v-for="item in largeList" :key="item.id" class="list-item">
            {{ item.name }}
        </div>
    </vs-visible-render>
</template>
```

### Disabled Mode

```html
<template>
    <vs-visible-render disabled>
        <div v-for="item in items" :key="item.id">
            {{ item.name }}
        </div>
    </vs-visible-render>
</template>
```

### Custom Root Margin and Threshold

```html
<template>
    <vs-visible-render root-margin="100px" :threshold="0.5">
        <div v-for="item in items" :key="item.id">
            {{ item.name }}
        </div>
    </vs-visible-render>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `disabled` | `boolean` | `false` | | Disables intersection observation; all children are visible |
| `height` | `string \| number` | | | Creates an internal scrollable container of the given height |
| `rootMargin` | `string` | `'0px'` | | Margin around the root for intersection calculation |
| `selector` | `string` | `null` | | CSS selector to find the scroll container element within the component |
| `tag` | `string` | `'div'` | | HTML tag for the container element |
| `threshold` | `number` | `0` | | Intersection ratio threshold (0–1) |

## Types

No StyleSet for this component.

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Child elements to be observed |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `scrollToElement` | `element: HTMLElement` | Scrolls the container so the given element is visible |

## Caution

The `threshold` prop must be a number between `0` and `1` (inclusive). Values outside this range will cause a prop validation error.
