> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsDimmed

A semi-transparent overlay component that covers its parent container with a fade transition.

**Available Version**: 2.0.0+

## Feature

- `v-model` binding to control visibility programmatically
- Smooth fade-in/fade-out transition animation
- Exposes `show()` and `hide()` methods for imperative control
- Fully customizable appearance via `component` CSSProperties

## Basic Usage

```html
<template>
    <div class="relative">
        <vs-dimmed v-model="isVisible" />
        <p>Content behind the dimmed overlay</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isVisible = ref(false);
</script>
```

### Programmatic Control

```html
<template>
    <div class="relative">
        <vs-dimmed ref="dimmedRef" v-model="isVisible" />
        <vs-button @click="dimmedRef.show()">Show Dimmed</vs-button>
        <vs-button @click="dimmedRef.hide()">Hide Dimmed</vs-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isVisible = ref(false);
const dimmedRef = ref(null);
</script>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `styleSet` | `string \| VsDimmedStyleSet` | | | Custom style set |
| `modelValue` | `boolean` | `false` | | v-model binding for visibility |

## Types

```typescript
interface VsDimmedStyleSet {
    component?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
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
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `boolean` | Emitted when visibility changes |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `show` | — | Shows the dimmed overlay |
| `hide` | — | Hides the dimmed overlay |

## Caution

- The parent element must have `position: relative` (or another non-static position) for the overlay to cover it correctly, since `VsDimmed` uses `position: absolute`.
