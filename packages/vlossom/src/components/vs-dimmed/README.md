> 한국어: [README.ko.md](./README.ko.md)

# VsDimmed

A component that darkens the background for overlays, modals, and similar UI patterns. Fills its positioned parent by default and supports opacity-based fade animations.

**Available Version**: 2.0.0+

## Basic Usage

### Default Dimmed

```html
<template>
    <div class="relative h-screen w-full">
        <vs-dimmed v-model="isVisible" />
    </div>
</template>
```

### Toggle Visibility with v-model

```html
<template>
    <div class="relative h-screen w-full">
        <button @click="isVisible = !isVisible">Toggle</button>
        <vs-dimmed v-model="isVisible" />
    </div>
</template>
```

### StyleSet Example

```html
<template>
    <div class="relative h-screen w-full">
        <vs-dimmed
            v-model="isVisible"
            :style-set="{
                component: {
                    backgroundColor: '#000000',
                    opacity: 0.6,
                    backdropFilter: 'blur(4px)',
                },
            }"
        />
    </div>
</template>
```

## Props

| Prop         | Type                         | Default | Required | Description                        |
| ------------ | ---------------------------- | ------- | -------- | ---------------------------------- |
| `modelValue` | `boolean`                    | `false` | -        | Whether the dimmed overlay is shown (v-model) |
| `styleSet`   | `string \| VsDimmedStyleSet` | -       | -        | Custom style configuration object  |

## Types

```typescript
interface VsDimmedStyleSet {
    component?: CSSProperties;
}
```

## Events

| Event                | Payload   | Description                        |
| -------------------- | --------- | ---------------------------------- |
| `update:modelValue`  | `boolean` | Emitted when visibility changes    |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Absolute positioning**: Fills the parent element with `position: absolute` by default (`top: 0, left: 0, width: 100%, height: 100%`)
- **v-model support**: Control show/hide via `v-model`
- **Built-in animation**: Built-in opacity-based fade in/out effect
- **Accessibility**: Hidden from screen readers via `aria-hidden="true"`
- **Customizable**: Flexible style changes via CSS variables and styleSet

## Notes

- The parent element requires a `position: relative` or `position: absolute` style
