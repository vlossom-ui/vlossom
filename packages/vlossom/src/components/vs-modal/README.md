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
| `dimmed`      | `boolean`                                              | `false` | -        | Show dimmed background                             |
| `escClose`    | `boolean`                                              | `true`  | -        | Close modal when ESC key is pressed                |
| `focusLock`   | `boolean`                                              | `false` | -        | Lock keyboard focus inside the modal               |
| `hideScroll`  | `boolean`                                              | `false` | -        | Hide scrollbar when modal is open                  |
| `size`        | `SizeProp \| { width?: SizeProp; height?: SizeProp }`  | -       | -        | Modal size                                         |

## Types

```typescript
interface VsModalNodeStyleSet {
    component?: CSSProperties;
    dimmed?: VsDimmedStyleSet;
}

type SizeProp = Size | string | number;

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface OverlayCallbacks<T = void> {
    [eventName: string]: (...args: any[]) => T | Promise<T>;
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
