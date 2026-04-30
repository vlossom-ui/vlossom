> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsContainer

A layout container component that automatically adjusts its padding when opted in with the `layout` prop inside `VsLayout` to accommodate positioned headers, footers, and drawers.

**Available Version**: 2.0.0+

## Feature

- Opt-in `VsLayout` integration via the `layout` prop — when set, calculates and applies padding based on the layout context (header, footer, drawer sizes)
- Smooth padding transition animation when drawer open/close state changes
- Acts as a CSS container (`container-type: inline-size`) enabling container queries in child components
- Renders as any HTML element via the `tag` prop (defaults to `div`)
- No style customization needed — layout adjustments happen automatically

## Basic Usage

```html
<template>
    <vs-layout>
        <vs-header layout>Header</vs-header>
        <vs-container layout>
            <p>Main content area</p>
        </vs-container>
        <vs-footer layout>Footer</vs-footer>
    </vs-layout>
</template>
```

### Custom Tag

```html
<template>
    <vs-layout>
        <vs-container layout tag="main">
            <p>Semantic main content</p>
        </vs-container>
    </vs-layout>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `layout` | `boolean` | `false` | | Opt in to `VsLayout` integration. Requires a `VsLayout` ancestor; without one this prop has no effect |
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

- `VsContainer` only applies automatic layout padding when (1) it has the `layout` prop set, and (2) a `VsLayout` ancestor is present. In other contexts it behaves as a plain container element. Wrapping `VsContainer` in another component is supported as long as no intervening layout primitive (`VsHeader`, `VsFooter`, `VsDrawer`, `VsContainer`) sits between it and the `VsLayout`.
