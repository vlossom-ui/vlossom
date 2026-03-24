> 한국어: [README.ko.md](./README.ko.md)

# VsRender

A utility component for rendering dynamic content. Supports string HTML and Vue components (Options API, Composition API, functional components).

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Rendering HTML String

```html
<template>
    <vs-render content="<div>Hello World!</div>" />
</template>
```

### Rendering a Vue Component

```html
<template>
    <vs-render
        :content="MyComponent"
        title="Dynamic Component"
    />
</template>
```

### Rendering a Functional Component

```html
<template>
    <vs-render
        :content="() => h('div', 'Hello World!')"
        title="Functional Component"
    />
</template>
```

> Attributes to pass to the component are provided via `attrs`. For HTML strings, attrs are bound to the root element.

## Props

| Prop      | Type                  | Default | Required | Description                                          |
| --------- | --------------------- | ------- | -------- | ---------------------------------------------------- |
| `content` | `string \| Component` | -       | ✅       | Content to render (HTML string or Vue component)     |

## Attrs

All attrs passed to `VsRender` are bound to the rendered root element (or component).

## Types

```typescript
// No StyleSet for this component
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
