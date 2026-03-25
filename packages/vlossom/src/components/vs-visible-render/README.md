> 한국어: [README.ko.md](./README.ko.md)

# VsVisibleRender

A container component that tracks the visibility of child elements using `IntersectionObserver`. Automatically sets the `data-io-visible="true"` attribute when a child element enters the viewport, enabling visibility-based rendering optimization.

**Available Version**: 2.0.0+

## Basic Usage

### Default Visibility Tracking Container

```html
<template>
    <vs-visible-render>
        <div>First item</div>
        <div>Second item</div>
        <div>Third item</div>
        <!-- More items... -->
    </vs-visible-render>
</template>
```

### Fixed Height Container

```html
<template>
    <vs-visible-render height="500px">
        <div v-for="item in items" :key="item.id">
            {{ item.content }}
        </div>
    </vs-visible-render>
</template>
```

### Custom IntersectionObserver Options

```html
<template>
    <vs-visible-render root-margin="100px" :threshold="0.5">
        <div v-for="item in items" :key="item.id">
            {{ item.content }}
        </div>
    </vs-visible-render>
</template>
```

### Disabled Mode

```html
<template>
    <vs-visible-render disabled>
        <div>All child elements are always visible</div>
    </vs-visible-render>
</template>
```

### Custom Tag

```html
<template>
    <vs-visible-render tag="ul">
        <li v-for="item in items" :key="item.id">
            {{ item.content }}
        </li>
    </vs-visible-render>
</template>
```

## Props

| Prop         | Type               | Default | Required | Description                                                                |
| ------------ | ------------------ | ------- | -------- | -------------------------------------------------------------------------- |
| `disabled`   | `boolean`          | `false` | -        | Disable IntersectionObserver — all children are always visible when `true` |
| `height`     | `string \| number` | -       | -        | Container height — automatically applies `overflow-y: auto` when set       |
| `rootMargin` | `string`           | `'0px'` | -        | `rootMargin` option for IntersectionObserver                               |
| `tag`        | `string`           | `'div'` | -        | HTML tag to render as                                                      |
| `threshold`  | `number`           | `0`     | -        | `threshold` option for IntersectionObserver (0–1)                          |

## Methods

| Method            | Parameters    | Description                           |
| ----------------- | ------------- | ------------------------------------- |
| `scrollToElement` | `HTMLElement` | Scroll to the specified child element |

## Slots

| Slot      | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `default` | Child elements to track for visibility. Each child is observed individually |

## Features

- **IntersectionObserver based**: Efficient visibility tracking using the browser's native API
- **Auto visibility attribute**: Automatically sets `data-io-visible="true"` when a child element enters the viewport
- **Auto scroll root detection**: Uses the container as root if scrollable; otherwise uses the viewport
- **Dynamic child element support**: Automatically re-observes when child elements change via MutationObserver
- **Flexible height setting**: Control container height and scroll behavior via the `height` prop
- **Option customization**: Fine-tune IntersectionObserver behavior via `rootMargin` and `threshold`
- **Disable support**: Disable visibility tracking as needed via the `disabled` prop

## Use Cases

- **Virtual scroll**: Optimize performance for large data lists by rendering only visible items
- **Lazy loading**: Load images or heavy components only when they enter the viewport
- **Infinite scroll**: Load additional data when the scroll reaches the bottom
- **Animation trigger**: Trigger animations when an element becomes visible
