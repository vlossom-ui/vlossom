> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsFocusTrap

A utility component that traps keyboard focus within its single child element, ensuring accessible modal and overlay interactions.

**Available Version**: 2.0.0+

## Feature

- Traps `Tab` and `Shift+Tab` key navigation within the child element
- Automatically focuses the trap on mount and restores the previously focused element on unmount
- Can be disabled at runtime via the `disabled` prop
- Exposes `focus` and `blur` methods for programmatic control
- Requires exactly one root child element

## Basic Usage

```html
<template>
    <vs-focus-trap>
        <div>
            <input type="text" placeholder="First field" />
            <input type="text" placeholder="Second field" />
            <button>Submit</button>
        </div>
    </vs-focus-trap>
</template>
```

### Conditionally Disabled

```html
<template>
    <vs-focus-trap :disabled="!isModalOpen">
        <div class="modal-content">
            <button>Action</button>
            <button @click="isModalOpen = false">Close</button>
        </div>
    </vs-focus-trap>
</template>

<script setup>
import { ref } from 'vue';
const isModalOpen = ref(true);
</script>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `disabled` | `boolean` | `false` | | Disable focus trapping without unmounting |

## Types

VsFocusTrap has no `StyleSet` interface.

### StyleSet Example

VsFocusTrap does not use a `styleSet` prop.

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Must contain exactly one child element that will act as the focus trap boundary |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `focus` | - | Move focus into the focus trap anchor |
| `blur` | - | Return focus to the element that was focused before the trap was activated |

## Caution

`VsFocusTrap` requires its default slot to contain **exactly one** root child element. Providing zero or multiple root elements will log an error and the trap will not function correctly.
