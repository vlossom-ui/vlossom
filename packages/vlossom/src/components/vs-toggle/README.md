> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsToggle

A stateful button that toggles between active and inactive states, wrapping `VsButton`.

**Available Version**: 2.0.0+

## Feature

- Boolean v-model binding for toggled state
- Emits a `toggle` event on every state change
- Inherits all `VsButton` props (size, ghost, outline, primary, circle, loading, etc.)
- Programmatic toggle via exposed `toggle` method
- Full color scheme support

## Basic Usage

```html
<template>
    <vs-toggle v-model="isActive">
        Toggle Me
    </vs-toggle>
</template>

<script setup>
import { ref } from 'vue';
const isActive = ref(false);
</script>
```

### Different Variants

```html
<template>
    <vs-toggle v-model="a" primary>Primary</vs-toggle>
    <vs-toggle v-model="b" outline>Outline</vs-toggle>
    <vs-toggle v-model="c" ghost>Ghost</vs-toggle>
    <vs-toggle v-model="d" circle>⭐</vs-toggle>
</template>
```

### Disabled State

```html
<template>
    <vs-toggle v-model="isActive" disabled>Disabled</vs-toggle>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsToggleStyleSet` | | | Custom style set for the component |
| `circle` | `boolean` | `false` | | Renders the button as a circle |
| `disabled` | `boolean` | `false` | | Disables the toggle |
| `ghost` | `boolean` | `false` | | Applies ghost (transparent) style |
| `loading` | `boolean` | `false` | | Shows a loading indicator |
| `modelValue` | `boolean` | `false` | | v-model for toggled state |
| `outline` | `boolean` | `false` | | Applies outline style |
| `primary` | `boolean` | `false` | | Applies primary color style |
| `responsive` | `boolean` | `false` | | Makes the button responsive |
| `size` | `Size` | `'md'` | | Button size (`xs`, `sm`, `md`, `lg`, `xl`) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | | HTML button type |

## Types

```typescript
interface VsToggleStyleSet extends VsButtonStyleSet {}
```

> [!NOTE]
> `VsToggleStyleSet` extends [`VsButtonStyleSet`](../vs-button/README.md). All `VsButtonStyleSet` properties are available.

```typescript
interface VsButtonStyleSet {
    variables?: {
        padding?: string;
    };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}
```

### StyleSet Example

```html
<template>
    <vs-toggle
        v-model="isActive"
        :style-set="{
            component: { borderRadius: '0.25rem', minWidth: '6rem' },
            variables: { padding: '0.5rem 1.5rem' },
        }"
    >
        Toggle
    </vs-toggle>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `boolean` | Emitted when the toggled state changes |
| `toggle` | `boolean` | Emitted on every toggle with the new state |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Button content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `toggle` | | Programmatically toggles the state |
