> 한국어: [README.ko.md](./README.ko.md)

# VsToggle

A button component that toggles a boolean value. Supports `v-model` and uses VsButton internally, providing all of VsButton's styling options.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Toggle Button

```html
<template>
    <vs-toggle v-model="isToggled">
        Toggle Button
    </vs-toggle>
</template>

<script setup>
import { ref } from 'vue';
const isToggled = ref(false);
</script>
```

### Style Variants

```html
<template>
    <vs-toggle v-model="toggleValue" primary>Primary Toggle</vs-toggle>
    <vs-toggle v-model="toggleValue" outline>Outline Toggle</vs-toggle>
    <vs-toggle v-model="toggleValue" ghost>Ghost Toggle</vs-toggle>
    <vs-toggle v-model="toggleValue" circle>⭕</vs-toggle>
</template>
```

### Handling Toggle Events

```html
<template>
    <vs-toggle v-model="isToggled" @toggle="handleToggle">
        State: {{ isToggled ? 'ON' : 'OFF' }}
    </vs-toggle>
</template>

<script setup>
import { ref } from 'vue';

const isToggled = ref(false);

const handleToggle = (value: boolean) => {
    console.log('Toggle state changed:', value);
};
</script>
```

### StyleSet Example

```html
<template>
    <vs-toggle
        v-model="isToggled"
        :style-set="{
            variables: {
                padding: '1rem 2rem',
            },
            component: {
                backgroundColor: '#4caf50',
                borderRadius: '8px',
            },
        }"
    >
        Toggle Me
    </vs-toggle>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isToggled = ref(false);
</script>
```

## Props

| Prop          | Type                         | Default | Required | Description                           |
| ------------- | ---------------------------- | ------- | -------- | ------------------------------------- |
| `modelValue`  | `boolean`                    | `false` | -        | Toggle state bound via v-model        |
| `colorScheme` | `ColorScheme`                | -       | -        | Color scheme for the component        |
| `styleSet`    | `string \| VsToggleStyleSet` | -       | -        | Custom style configuration object     |

**Props inherited from VsButton**: `circle`, `disabled`, `ghost`, `large`, `loading`, `outline`, `primary`, `responsive`, `small`

> **Note**: All styling props from VsButton are supported. See [VsButton README](../vs-button/README.md) for details.

## Types

```typescript
interface VsToggleStyleSet extends VsButtonStyleSet {}
```

> [!NOTE]
>
> Supports all styling props from VsButton. See [VsButton README](../vs-button/README.md#types) for details.

## Events

| Event               | Payload   | Description                            |
| ------------------- | --------- | -------------------------------------- |
| `update:modelValue` | `boolean` | Emitted when the v-model value changes |
| `toggle`            | `boolean` | Emitted when the toggle state changes  |

## Slots

| Slot      | Description                               |
| --------- | ----------------------------------------- |
| `default` | Content to display inside the toggle button |

## Methods

| Method     | Return Type | Description            |
| ---------- | ----------- | ---------------------- |
| `toggle()` | `void`      | Toggle the state       |

## Features

- **v-model support**: Manage toggle state with two-way data binding
- **VsButton based**: Fully supports all VsButton styling options
- **Event handling**: Detect state changes via the `toggle` event
- **Accessibility**: Keyboard navigation and screen reader support based on button
