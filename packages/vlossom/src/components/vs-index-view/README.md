# VsIndexView

A container component that shows only the child element at the current index, with optional keep-alive support.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Renders only the child node corresponding to the current `v-model` index.
- Supports keep-alive to preserve the state of hidden child components.
- Integrates with `vs-responsive` for responsive `width` and `grid` layout.
- Exposes `updateIndex` to programmatically change the displayed index.
- Filters out comment nodes and empty text nodes automatically.

## Basic Usage

```html
<template>
    <vs-index-view v-model="currentIndex">
        <div>Page 0</div>
        <div>Page 1</div>
        <div>Page 2</div>
    </vs-index-view>
</template>

<script setup>
import { ref } from 'vue';
const currentIndex = ref(0);
</script>
```

### Keep Alive

Preserve component state when switching between views.

```html
<template>
    <vs-index-view v-model="currentIndex" :keep-alive="true">
        <ComponentA />
        <ComponentB />
        <ComponentC />
    </vs-index-view>
</template>
```

### Responsive Width

```html
<template>
    <vs-index-view v-model="currentIndex" width="50%">
        <div>View A</div>
        <div>View B</div>
    </vs-index-view>
</template>
```

## Props

| Prop         | Type                                     | Default | Required | Description                                              |
| ------------ | ---------------------------------------- | ------- | -------- | -------------------------------------------------------- |
| `modelValue` | `number`                                 | `0`     | -        | The index of the currently displayed child (v-model).    |
| `keepAlive`  | `boolean`                                | `false` | -        | Wraps children in `<KeepAlive>` to preserve their state. |
| `width`      | `string \| number \| Breakpoints`        | -       | -        | Width of the component (responsive breakpoints allowed). |
| `grid`       | `string \| number \| Breakpoints`        | -       | -        | Grid column span for layout (responsive breakpoints).    |

## Types

```typescript
// No StyleSet interface — this component does not accept a styleSet prop.
```

## Events

| Event               | Payload  | Description                          |
| ------------------- | -------- | ------------------------------------ |
| `update:modelValue` | `number` | Emitted when the displayed index changes. |

## Slots

| Slot      | Description                                   |
| --------- | --------------------------------------------- |
| `default` | Child elements to switch between by index.    |

## Methods

| Method        | Parameters       | Description                              |
| ------------- | ---------------- | ---------------------------------------- |
| `updateIndex` | `index: number`  | Programmatically sets the current index. |
