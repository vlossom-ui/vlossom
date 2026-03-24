> 한국어: [README.ko.md](./README.ko.md)

# VsModal

A modal dialog component. Provides an overlay to display content above the main page. Use the `vs-modal-node` component inside to place modal content within the page, or use the `modal-plugin` for programmatic control.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### VsModalNode — Inline Modal

```html
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal-node v-model="isOpen">
        <div>Modal content</div>
        <div>Second line of content</div>
        <vs-button @click="isOpen = false">Close</vs-button>
    </vs-modal-node>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### Custom Size

```html
<template>
    <vs-modal-node v-model="isOpen" :size="{ width: '600px', height: '400px' }">
        <div>Custom size modal</div>
    </vs-modal-node>
</template>
```

### Close on Dimmed Background Click

```html
<template>
    <vs-modal-node v-model="isOpen" dim-close>
        <div>Close by clicking the background</div>
    </vs-modal-node>
</template>
```

### Close on ESC Key

```html
<template>
    <vs-modal-node v-model="isOpen" esc-close>
        <div>Close by pressing the ESC key</div>
    </vs-modal-node>
</template>
```

### Programmatic (modal-plugin)

```typescript
import { useVlossom } from '@/framework';

const $vs = useVlossom();
const modalId = $vs.modal.open('Modal content');
```

> See [Modal Plugin](../../plugins/modal-plugin/README.md) for full programmatic API.

## Props (VsModalNode)

| Prop          | Type                                                   | Default | Required | Description                                        |
| ------------- | ------------------------------------------------------ | ------- | -------- | -------------------------------------------------- |
| `modelValue`  | `boolean`                                              | `false` | -        | Show/hide state (v-model)                          |
| `colorScheme` | `ColorScheme`                                          | -       | -        | Color scheme for the component                     |
| `styleSet`    | `string \| VsModalNodeStyleSet`                        | -       | -        | Custom style configuration object                  |
| `dimClose`    | `boolean`                                              | `false` | -        | Close modal when dimmed background is clicked      |
| `dimmed`      | `boolean`                                              | `true`  | -        | Show dimmed background                             |
| `escClose`    | `boolean`                                              | `false` | -        | Close modal when ESC key is pressed                |
| `focusLock`   | `boolean`                                              | `true`  | -        | Lock keyboard focus inside the modal               |
| `hideScroll`  | `boolean`                                              | `true`  | -        | Hide scrollbar when modal is open                  |
| `size`        | `string \| { width?: string; height?: string }`        | -       | -        | Modal size                                         |

## Types

```typescript
interface VsModalNodeStyleSet {
    variables?: {
        width?: string;
        height?: string;
    };
    component?: CSSProperties;
    dimmed?: VsDimmedStyleSet;
}
```

> [!NOTE]
>
> `dimmed` uses [VsDimmedStyleSet](../vs-dimmed/README.md#types).

## Events (VsModalNode)

| Event               | Payload   | Description                             |
| ------------------- | --------- | --------------------------------------- |
| `update:modelValue` | `boolean` | Emitted when the v-model value changes  |
| `open`              | -         | Emitted when the modal opens            |
| `close`             | -         | Emitted when the modal closes           |

## Slots (VsModalNode)

| Slot      | Description                        |
| --------- | ---------------------------------- |
| `default` | Content to display inside the modal |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
