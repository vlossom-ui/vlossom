> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsFooter

A page footer bar component that supports fixed, sticky, and absolute positioning with layout store integration when used inside `VsLayout`.

**Available Version**: 2.0.0+

## Feature

- Renders as a `<footer>` element by default (configurable via `tag`)
- Supports CSS `position` values: `static`, `relative`, `absolute`, `fixed`, `sticky`
- Default height of `3rem` — overridable via the `height` prop
- Primary color scheme styling via the `primary` prop
- Opt-in `VsLayout` integration via the `layout` prop — when set, reports footer height for drawer offset calculations
- Accepts `CSSProperties` via `styleSet.component` for full style control

## Basic Usage

```html
<template>
    <vs-footer>
        <p>© 2024 My App</p>
    </vs-footer>
</template>
```

### Fixed Footer

```html
<template>
    <vs-footer position="fixed" height="4rem">
        <nav>Navigation links</nav>
    </vs-footer>
</template>
```

### Primary Styled Footer

```html
<template>
    <vs-footer primary>
        <span>App v1.0.0</span>
    </vs-footer>
</template>
```

### Inside VsLayout

Set the `layout` prop to register the footer with the layout store so `VsContainer` and `VsDrawer` can offset around it. Wrapping the footer in another component is supported.

```html
<template>
    <vs-layout>
        <vs-container layout>
            <p>Content</p>
        </vs-container>
        <vs-footer layout position="fixed" height="3rem">© 2026</vs-footer>
    </vs-layout>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsFooterStyleSet` | | | Custom style set for the component |
| `position` | `'static' \| 'relative' \| 'absolute' \| 'fixed' \| 'sticky'` | | | CSS position value for the footer |
| `height` | `string` | | | Height of the footer. Defaults to `3rem` |
| `primary` | `boolean` | `false` | | Apply the primary color scheme |
| `layout` | `boolean` | `false` | | Opt in to `VsLayout` integration. Requires a `VsLayout` ancestor; without one this prop has no effect |
| `tag` | `string` | `'footer'` | | HTML tag to render as |

## Types

```typescript
interface VsFooterStyleSet extends VsBarStyleSet {}

// VsBarStyleSet:
interface VsBarStyleSet {
    component?: CSSProperties;
}
```

> [!NOTE]
> `VsFooterStyleSet` extends [VsBarStyleSet](../vs-bar/README.md).

### StyleSet Example

```html
<template>
    <vs-footer
        :style-set="{
            component: {
                backgroundColor: '#1a1a2e',
                color: '#ffffff',
                padding: '0 2rem',
                height: '4rem',
            },
        }"
    >
        <span>Custom styled footer</span>
    </vs-footer>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Footer content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
