> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsHeader

A page header bar component that supports fixed, sticky, and absolute positioning with layout store integration when used inside `VsLayout`.

**Available Version**: 2.0.0+

## Feature

- Renders as a `<header>` element by default (configurable via `tag`)
- Supports CSS `position` values: `static`, `relative`, `absolute`, `fixed`, `sticky`
- Default height of `3rem` — overridable via the `height` prop
- Primary color scheme styling via the `primary` prop
- Integrates with `VsLayout` to report header height for drawer offset calculations
- Accepts `CSSProperties` via `styleSet.component` for full style control

## Basic Usage

```html
<template>
    <vs-header>
        <h1>My Application</h1>
    </vs-header>
</template>
```

### Fixed Header

```html
<template>
    <vs-header position="fixed" height="4rem">
        <nav>Navigation</nav>
    </vs-header>
</template>
```

### Primary Styled Header

```html
<template>
    <vs-header primary>
        <span>Brand Name</span>
    </vs-header>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsHeaderStyleSet` | | | Custom style set for the component |
| `position` | `'static' \| 'relative' \| 'absolute' \| 'fixed' \| 'sticky'` | | | CSS position value for the header |
| `height` | `string` | | | Height of the header. Defaults to `3rem` |
| `primary` | `boolean` | `false` | | Apply the primary color scheme |
| `tag` | `string` | `'header'` | | HTML tag to render as |

## Types

```typescript
interface VsHeaderStyleSet extends VsBarStyleSet {}

// VsBarStyleSet:
interface VsBarStyleSet {
    component?: CSSProperties;
}
```

> [!NOTE]
> `VsHeaderStyleSet` extends [VsBarStyleSet](../vs-bar/README.md).

### StyleSet Example

```html
<template>
    <vs-header
        :style-set="{
            component: {
                backgroundColor: '#2c3e50',
                color: '#ffffff',
                padding: '0 2rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
        }"
    >
        <h1>Styled Header</h1>
    </vs-header>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Header content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
