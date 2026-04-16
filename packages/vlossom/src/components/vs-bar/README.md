> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsBar

A full-width horizontal bar component typically used as a header, footer, or toolbar container.

**Available Version**: 2.0.0+

## Feature

- Renders as any HTML element via the `tag` prop (defaults to `div`)
- Supports `position` prop for `absolute`, `fixed`, `sticky`, and other CSS position values
- Primary variant for prominent toolbar/header styling
- Full style override via `component` CSSProperties

## Basic Usage

```html
<template>
    <vs-bar>
        <span>My Application Title</span>
    </vs-bar>
</template>
```

### Fixed Position Header

```html
<template>
    <vs-bar position="fixed" primary>
        <span>Fixed Header Bar</span>
    </vs-bar>
</template>
```

### Custom Tag

```html
<template>
    <vs-bar tag="header">
        <nav>Navigation content</nav>
    </vs-bar>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | Color scheme for the component |
| `styleSet` | `string \| VsBarStyleSet` | | | Custom style set |
| `position` | `CssPosition` | | | CSS position value (`static`, `relative`, `absolute`, `fixed`, `sticky`) |
| `primary` | `boolean` | `false` | | Applies primary color scheme |
| `tag` | `string` | `'div'` | | HTML tag to render |

## Types

```typescript
interface VsBarStyleSet {
    component?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-bar
        :style-set="{
            component: {
                backgroundColor: '#1a1a2e',
                color: '#ffffff',
                padding: '0 1.5rem',
                height: '4rem',
            },
        }"
    >
        <span>Custom Styled Bar</span>
    </vs-bar>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Bar content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
