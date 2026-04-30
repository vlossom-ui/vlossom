# VsModal

A modal dialog component that renders content in an overlay layer via the Vlossom modal plugin.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Opens and closes a modal dialog controlled by a `v-model` boolean.
- Content is teleported to a configurable container element (default: `body`).
- Supports dimmed overlay background, focus locking, ESC key close, and dim click close.
- Configurable size via predefined size keywords (`xs`, `sm`, `md`, `lg`, `xl`) or custom values.
- Emits `open` and `close` events for lifecycle hooks.

## Basic Usage

```html
<template>
    <button @click="isOpen = true">Open Modal</button>

    <vs-modal v-model="isOpen">
        <div>
            <h2>Modal Title</h2>
            <p>Modal content goes here.</p>
            <button @click="isOpen = false">Close</button>
        </div>
    </vs-modal>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### With Dimmed Overlay

```html
<template>
    <vs-modal v-model="isOpen" :dimmed="true" :dim-close="true">
        <div>Click outside to close.</div>
    </vs-modal>
</template>
```

### Predefined Size

```html
<template>
    <vs-modal v-model="isOpen" size="lg">
        <div>Large modal content.</div>
    </vs-modal>
</template>
```

### Custom Size

```html
<template>
    <vs-modal v-model="isOpen" :size="{ width: '600px', height: '400px' }">
        <div>Custom size modal.</div>
    </vs-modal>
</template>
```

### Focus Lock and ESC Close

```html
<template>
    <vs-modal v-model="isOpen" :focus-lock="true" :esc-close="true">
        <div>Press ESC to close. Focus is trapped inside.</div>
    </vs-modal>
</template>
```

## Props

| Prop          | Type                                                        | Default   | Required | Description                                                                    |
| ------------- | ----------------------------------------------------------- | --------- | -------- | ------------------------------------------------------------------------------ |
| `colorScheme` | `string`                                                    | -         | -        | Color scheme for the modal.                                                    |
| `styleSet`    | `string \| VsModalNodeStyleSet`                             | -         | -        | Custom style set for the modal node.                                           |
| `modelValue`  | `boolean`                                                   | `false`   | -        | Controls the visibility of the modal (v-model).                                |
| `beforeClose` | `() => Promise<boolean> \| boolean`                         | -         | -        | Hook invoked before the modal closes. Resolve `false` to abort the close.       |
| `container`   | `string`                                                    | `'body'`  | -        | CSS selector of the element to teleport the modal into.                        |
| `escClose`    | `boolean`                                                   | `true`    | -        | Closes the modal when the ESC key is pressed.                                  |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string \| number \| { width?: SizeProp; height?: SizeProp }` | - | - | Modal size as a predefined keyword or custom width/height. |
| `callbacks`   | `OverlayCallbacks`                                          | `{}`      | -        | Overlay callback handlers.                                                     |
| `dimClose`    | `boolean`                                                   | `false`   | -        | Closes the modal when clicking the dimmed area.                                |
| `dimmed`      | `boolean`                                                   | `false`   | -        | Shows a dimmed overlay behind the modal.                                       |
| `focusLock`   | `boolean`                                                   | `false`   | -        | Traps focus within the modal while it is open.                                 |
| `hideScroll`  | `boolean`                                                   | `false`   | -        | Hides the scroll on the container when the modal is open.                      |
| `id`          | `string`                                                    | `''`      | -        | Custom ID for the modal overlay instance.                                      |

### Before Close Hook

```html
<template>
    <vs-modal v-model="isOpen" :before-close="confirmClose">
        <div>Try to close me.</div>
    </vs-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isOpen = ref(false);

async function confirmClose() {
    return window.confirm('Are you sure you want to close?');
}
</script>
```

## Types

```typescript
interface VsModalNodeStyleSet {
    component?: CSSProperties;
    dimmed?: VsDimmedStyleSet;
}
```

> [!NOTE]
> `dimmed` uses `VsDimmedStyleSet`. See the [VsDimmed README](../vs-dimmed/README.md) for details.

### StyleSet Example

```html
<template>
    <vs-modal
        v-model="isOpen"
        :dimmed="true"
        :style-set="{
            component: {
                borderRadius: '16px',
                padding: '2rem',
                backgroundColor: '#fff',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            },
            dimmed: {
                component: { backgroundColor: 'rgba(0,0,0,0.6)' },
            },
        }"
    >
        <div>Styled modal content.</div>
    </vs-modal>
</template>
```

## Events

| Event               | Payload   | Description                              |
| ------------------- | --------- | ---------------------------------------- |
| `update:modelValue` | `boolean` | Emitted when the modal open state changes. |
| `open`              | -         | Emitted when the modal opens.            |
| `close`             | -         | Emitted when the modal closes.           |

## Slots

| Slot      | Description                                         |
| --------- | --------------------------------------------------- |
| `default` | The content rendered inside the modal dialog.       |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Caution

`VsModal` requires the Vlossom plugin to be installed in your Vue application. The modal content is mounted via `$vs.modal.open()` and teleported to the `container` element.
