> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsResponsive

A layout wrapper component that applies responsive width and grid column settings based on container breakpoints.

**Available Version**: 2.0.0+

## Feature

- Applies responsive `width` and `grid` column spanning via container query breakpoints (xs, sm, md, lg, xl)
- Accepts breakpoint objects for fine-grained control per screen size
- Renders as any HTML element via the `tag` prop
- Used internally by many Vlossom input components for layout consistency

## Basic Usage

```html
<template>
    <vs-responsive width="50%">
        <p>This takes 50% width.</p>
    </vs-responsive>
</template>
```

### With Grid Column Span

```html
<template>
    <vs-responsive :grid="6">
        <p>This spans 6 grid columns.</p>
    </vs-responsive>
</template>
```

### With Breakpoint Object

```html
<template>
    <vs-responsive :width="{ xs: '100%', md: '50%', lg: '33%' }">
        <p>Responsive width per breakpoint.</p>
    </vs-responsive>
</template>
```

### Custom Tag

```html
<template>
    <vs-responsive tag="section" width="80%">
        <p>Rendered as a section element.</p>
    </vs-responsive>
</template>
```

## Props

| Prop    | Type                                 | Default | Required | Description                                           |
| ------- | ------------------------------------ | ------- | -------- | ----------------------------------------------------- |
| `width` | `string \| number \| Breakpoints`    | -       | -        | Responsive width; can be a fixed value or breakpoint object |
| `grid`  | `string \| number \| Breakpoints`    | -       | -        | Grid column span; can be a fixed value or breakpoint object |
| `tag`   | `string`                             | `'div'` | -        | HTML tag used as the root element                     |

## Types

No custom StyleSet interface for this component.

```typescript
// Breakpoints type used for width and grid
type Breakpoints = {
    xs?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
};
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description      |
| --------- | ---------------- |
| `default` | Content to wrap  |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
