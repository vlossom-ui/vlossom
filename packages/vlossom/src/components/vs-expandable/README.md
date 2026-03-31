> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsExpandable

A content container with animated expand and collapse transitions controlled by the `open` prop.

**Available Version**: 2.0.0+

## Feature

- Smooth height and opacity animation on expand/collapse
- Controlled via a required `open` boolean prop
- Lightweight wrapper — no extra DOM wrappers needed beyond the default slot
- Supports custom content styling via `styleSet`

## Basic Usage

```html
<template>
    <vs-button @click="isOpen = !isOpen">Toggle</vs-button>
    <vs-expandable :open="isOpen">
        <p>This content expands and collapses with animation.</p>
    </vs-expandable>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### Custom Styled Content

```html
<template>
    <vs-expandable
        :open="isOpen"
        :style-set="{
            component: { backgroundColor: '#f0f4ff', padding: '1.5rem', borderRadius: '8px' },
        }"
    >
        <p>Styled expandable content.</p>
    </vs-expandable>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `styleSet` | `string \| VsExpandableStyleSet` | | | Custom style set for the component |
| `open` | `boolean` | `false` | ✓ | Controls whether the content is expanded |

## Types

```typescript
interface VsExpandableStyleSet {
    component?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-expandable
        :open="true"
        :style-set="{
            component: { backgroundColor: '#fff8e1', padding: '2rem', borderLeft: '4px solid orange' },
        }"
    >
        <p>Highlighted expandable content.</p>
    </vs-expandable>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | The content to be shown or hidden |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
