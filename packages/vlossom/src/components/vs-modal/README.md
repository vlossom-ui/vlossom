# VsModal

A modal dialog component that renders content in an overlay layer via the Vlossom modal plugin.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Opens and closes a modal dialog controlled by a `v-model` boolean.
- Content is teleported to a configurable container element (default: `body`).
- Supports dimmed overlay background, focus locking, ESC key close, and dim click close.
- Optionally locks page scroll, or a specific scroll container by CSS selector, via `scroll-lock`.
- Can be moved by dragging a grip handle at the top center with `draggable`.
- Configurable width via predefined size keywords (`xs`, `sm`, `md`, `lg`, `xl`) or custom values; height fits the content unless specified explicitly.
- Emits `open` and `close` events for lifecycle hooks.
- Removes its open modal when the component unmounts, and when it is deactivated inside `KeepAlive` (reopened on activation if `v-model` is still `true`).

## Basic Usage

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal v-model="isOpen">
        <div>
            <h2>Modal Title</h2>
            <p>Modal content goes here.</p>
            <vs-button @click="isOpen = false">Close</vs-button>
        </div>
    </vs-modal>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### With Dimmed Overlay

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal v-model="isOpen" :dimmed="true" :dim-close="true">
        <div>Click outside to close.</div>
    </vs-modal>
</template>
```

### Predefined Size

A size keyword or a single value sets only the width. The height grows with the content and scrolls inside the modal when it exceeds the container.

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal v-model="isOpen" size="lg">
        <div>Large modal content.</div>
        <vs-button @click="isOpen = false">Close</vs-button>
    </vs-modal>
</template>
```

### Custom Size

Use an object to set the width and height separately. Both accept size keywords or custom values.

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal v-model="isOpen" :size="{ width: '600px', height: '400px' }">
        <div>Custom size modal.</div>
        <vs-button @click="isOpen = false">Close</vs-button>
    </vs-modal>
</template>
```

### Focus Lock and ESC Close

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal v-model="isOpen" :focus-lock="true" :esc-close="true">
        <div>Press ESC to close. Focus is trapped inside.</div>
    </vs-modal>
</template>
```

### Draggable

Set `draggable` to show a grip handle at the top center of the modal. Drag the handle with a mouse or touch to move the modal within its container.

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal v-model="isOpen" :draggable="true" size="sm">
        <div>Drag the handle at the top to move me.</div>
        <vs-button @click="isOpen = false">Close</vs-button>
    </vs-modal>
</template>
```

### Before Close Hook

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal v-model="isOpen" :before-close="confirmClose">
        <div>Try to close me.</div>
        <vs-button @click="isOpen = false">Close</vs-button>
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

### Scroll Lock

Set `scroll-lock` to `true` to lock the page (`body`) scroll while the modal is open:

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal v-model="isOpen" :scroll-lock="true">
        <div>Background page scroll is locked while open.</div>
        <vs-button @click="isOpen = false">Close</vs-button>
    </vs-modal>
</template>
```

Pass a CSS selector string to lock a specific scroll container instead of `body`. The page keeps scrolling while only the targeted element is locked:

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <div id="scroll-area" style="height: 200px; overflow: auto">
        <p v-for="n in 20" :key="n">Line {{ n }}</p>
    </div>

    <vs-modal v-model="isOpen" scroll-lock="#scroll-area">
        <div>Only #scroll-area is locked; the page can still scroll.</div>
        <vs-button @click="isOpen = false">Close</vs-button>
    </vs-modal>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

## Props

| Prop          | Type                                                                                                  | Default  | Required | Description                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `colorScheme` | `string`                                                                                              | -        | -        | Color scheme for the modal.                                                                                |
| `styleSet`    | `string \| VsModalNodeStyleSet`                                                                       | -        | -        | Custom style set for the modal node.                                                                       |
| `modelValue`  | `boolean`                                                                                             | `false`  | -        | Controls the visibility of the modal (v-model).                                                            |
| `beforeClose` | `() => Promise<boolean> \| boolean`                                                                   | -        | -        | Hook invoked before the modal closes. Resolve `false` to abort the close. Bypassed by `$vs.modal.clear()`. |
| `container`   | `string`                                                                                              | `'body'` | -        | CSS selector of the element to teleport the modal into.                                                    |
| `draggable`   | `boolean`                                                                                             | `false`  | -        | Shows a grip handle at the top center that moves the modal within its container when dragged.              |
| `escClose`    | `boolean`                                                                                             | `false`  | -        | Closes the modal when the ESC key is pressed.                                                              |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string \| number \| { width?: SizeProp; height?: SizeProp }` | -        | -        | Modal width as a keyword or custom value. Use an object to also set the height; otherwise it fits content. |
| `callbacks`   | `OverlayCallbacks`                                                                                    | `{}`     | -        | Overlay callback handlers.                                                                                 |
| `dimClose`    | `boolean`                                                                                             | `false`  | -        | Closes the modal when clicking the dimmed area.                                                            |
| `dimmed`      | `boolean`                                                                                             | `false`  | -        | Shows a dimmed overlay behind the modal.                                                                   |
| `focusLock`   | `boolean`                                                                                             | `false`  | -        | Traps focus within the modal while it is open.                                                             |
| `hideScroll`  | `boolean`                                                                                             | `false`  | -        | Hides the scroll on the container when the modal is open.                                                  |
| `scrollLock`  | `boolean \| string`                                                                                   | `false`  | -        | Locks scrolling while the modal is open. Pass a CSS selector to lock that element instead of `container`.  |
| `id`          | `string`                                                                                              | `''`     | -        | Custom ID for the modal overlay instance.                                                                  |

## Types

```typescript
interface VsModalNodeStyleSet extends CSSProperties {
    $content?: CSSProperties;
    $dimmed?: VsDimmedStyleSet;
}
```

> [!NOTE]
> The root style set styles the modal box (size, border, background, radius, shadow). `$content` styles the scrollable content area inside it, which owns the default padding.
> `$dimmed` uses `VsDimmedStyleSet`. See the [VsDimmed README](../vs-dimmed/README.md) for details.

### StyleSet Example

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal
        v-model="isOpen"
        :dimmed="true"
        :style-set="{
            borderRadius: '16px',
            backgroundColor: '#fff',
            color: '#1f2937',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            $content: {
                padding: '2rem',
            },
            $dimmed: {
                backgroundColor: 'rgba(0,0,0,0.6)',
            },
        }"
    >
        <div>Styled modal content.</div>
        <vs-button @click="isOpen = false">Close</vs-button>
    </vs-modal>
</template>
```

## Events

| Event               | Payload   | Description                                |
| ------------------- | --------- | ------------------------------------------ |
| `update:modelValue` | `boolean` | Emitted when the modal open state changes. |
| `open`              | -         | Emitted when the modal opens.              |
| `close`             | -         | Emitted when the modal closes.             |

## Slots

| Slot      | Description                                   |
| --------- | --------------------------------------------- |
| `default` | The content rendered inside the modal dialog. |

## Caution

`VsModal` requires the Vlossom plugin to be installed in your Vue application. The modal content is mounted via `$vs.modal.open()` and teleported to the `container` element.

Set padding through `$content` rather than the root style set. The default padding belongs to the content area, so a root `padding` adds space around it and moves the scrollbar away from the modal edge.

With `draggable`, the handle takes its own row above the content area, and the content area's top padding is removed by default. The handle is for mouse and touch only and is not focusable. The dragged position resets each time the modal opens.

A modal with a `size` is a query container, so [breakpoints](../vs-responsive/README.md#breakpoints) inside it follow the modal width. A modal without `size`, or with a content-based width such as `auto` or `fit-content`, is sized by its content and is not a query container.
