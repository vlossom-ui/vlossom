> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsRender

A utility component that renders a string (HTML), a Vue component, or a render function as a virtual DOM node.

**Available Version**: 2.0.0+

## Feature

- Renders plain text, HTML strings, Vue components, and render functions
- Parses HTML strings using `DOMParser` and converts them to Vue virtual DOM
- Passes through HTML attributes via `attrs` to the root rendered element
- Forwards explicit props to component content via `componentProps`
- Falls back to a `<span>` wrapper for plain text or parse failures

## Basic Usage

### Render a Plain String

```html
<template>
    <vs-render content="Hello, World!" />
</template>
```

### Render an HTML String

```html
<template>
    <vs-render content="<strong>Bold Text</strong>" />
</template>
```

### Render a Vue Component

```html
<template>
    <vs-render :content="MyIcon" />
</template>

<script setup>
import MyIcon from './MyIcon.vue';
</script>
```

### Render a Component with Props

```html
<template>
    <vs-render :content="Greeting" :component-props="{ name: 'world', count: 3 }" />
</template>

<script setup>
import Greeting from './Greeting.vue';
</script>
```

`componentProps` only applies when `content` is a component. For string content it is ignored.

## Props

| Prop             | Type                        | Default | Required | Description                                           |
| ---------------- | --------------------------- | ------- | -------- | ----------------------------------------------------- |
| `content`        | `string \| Component`       | -       | Yes      | Content to render: a string, HTML string, or Vue component |
| `componentProps` | `Record<string, any>`       | `{}`    | -        | Props forwarded to the rendered component. Ignored when `content` is a string. |

## Types

No custom StyleSet interface for this component.

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
