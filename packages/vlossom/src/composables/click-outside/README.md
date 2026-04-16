> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useClickOutside

**Available Version**: 2.0.0+

Registers a global click listener that fires a callback whenever a click occurs outside of the specified excluded elements.

## Feature

- Attaches a capturing-phase click listener to `document` for reliable outside-click detection
- Accepts multiple CSS selector strings to define excluded regions
- Provides explicit `addClickOutsideListener` / `removeClickOutsideListener` methods for full lifecycle control
- Uses `Element.closest()` to match ancestors, so clicks on children of excluded elements are also ignored

## Basic Usage

```html
<template>
    <div ref="dropdownRef" class="dropdown">
        <button @click="open">Open</button>
        <ul v-if="isOpen">
            <li>Item 1</li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useClickOutside } from '@/composables';

const isOpen = ref(false);

function open() {
    isOpen.value = true;
}

const { addClickOutsideListener, removeClickOutsideListener } = useClickOutside(['.dropdown'], () => {
    isOpen.value = false;
});

onMounted(addClickOutsideListener);
onBeforeUnmount(removeClickOutsideListener);
</script>
```

## Args

| Arg                 | Type         | Default | Required | Description                                                                                     |
| ------------------- | ------------ | ------- | -------- | ----------------------------------------------------------------------------------------------- |
| `excludedSelectors` | `string[]`   | —       | Yes      | Array of CSS selector strings. Clicks on elements matching any selector (or their ancestors) are ignored. |
| `callback`          | `() => void` | —       | Yes      | Function called when a click occurs outside all excluded elements.                              |

## Types

No additional exported types.

## Return Refs

| RefType | Type | Description |
| ------- | ---- | ----------- |

## Return Methods

| Method                     | Parameters | Description                                                 |
| -------------------------- | ---------- | ----------------------------------------------------------- |
| `addClickOutsideListener`  | —          | Adds a capturing-phase `click` listener to `document`.      |
| `removeClickOutsideListener` | —        | Removes the previously added `click` listener from `document`. |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions

- Call `addClickOutsideListener` after the component mounts and `removeClickOutsideListener` before it unmounts to avoid memory leaks.
- The listener is attached in the capture phase (`true`), so it fires before any bubbling handlers.
