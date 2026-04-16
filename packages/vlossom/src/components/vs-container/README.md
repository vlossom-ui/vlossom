> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsContainer

A layout container component that automatically adjusts its padding when used inside `VsLayout` to accommodate positioned headers, footers, and drawers.

**Available Version**: 2.0.0+

## Feature

- Automatically calculates and applies padding based on the layout context (header, footer, drawer sizes)
- Smooth padding transition animation when drawer open/close state changes
- Acts as a CSS container (`container-type: inline-size`) enabling container queries in child components
- Renders as any HTML element via the `tag` prop (defaults to `div`)
- No style customization needed — layout adjustments happen automatically

## Basic Usage

```html
<template>
    <vs-layout>
        <vs-header>Header</vs-header>
        <vs-container>
            <p>Main content area</p>
        </vs-container>
        <vs-footer>Footer</vs-footer>
    </vs-layout>
</template>
```

### Custom Tag

```html
<template>
    <vs-layout>
        <vs-container tag="main">
            <p>Semantic main content</p>
        </vs-container>
    </vs-layout>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `tag` | `string` | `'div'` | | HTML tag to render |

## Types

VsContainer does not have a StyleSet interface.

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Main content of the container |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Caution

- `VsContainer` only applies automatic layout padding when it is a **direct child of `VsLayout`**. In other contexts it behaves as a plain container element.
