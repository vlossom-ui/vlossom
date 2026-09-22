> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useFocusable

**Available Version**: 2.0.0+

Tracks keyboard focus across a list of focusable keys, with throttled mouse-move support. Focus position is counted over the key list rather than over the DOM, so it stays correct when only part of the list is rendered.

## Feature

- Tracks the focused item by its key, so a virtualized list can focus items that are not in the DOM yet
- Resolves the DOM element for a key on demand through `getFocusableElement`
- Throttles mouse-move events (25 ms interval) to minimize performance overhead
- Provides `addMouseMoveListener` / `removeMouseMoveListener` for lifecycle control

## Basic Usage

Each focusable element carries its key in `data-focusable`. The key list is the source of truth for order and length.

```html
<template>
    <ul ref="listRef">
        <li
            v-for="item in items"
            :key="item.id"
            :data-focusable="item.id"
            :class="{ 'my-active': currentFocusableKey === item.id }"
        >
            {{ item.label }}
        </li>
    </ul>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, useTemplateRef } from 'vue';
import { useFocusable } from 'vlossom';

const items = ref([]);
const listRef = useTemplateRef('listRef');
const focusableKeys = computed(() => items.value.map((item) => item.id));

const { focusIndex, currentFocusableKey, updateFocusIndex, addMouseMoveListener, removeMouseMoveListener } =
    useFocusable(listRef, focusableKeys);

function moveDown() {
    updateFocusIndex(focusIndex.value + 1);
}

onMounted(addMouseMoveListener);
onBeforeUnmount(removeMouseMoveListener);
</script>
```

## Args

| Arg | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `wrapperElement` | `TemplateRef<HTMLElement>` | | Yes | Template ref pointing to the container that holds the `[data-focusable]` elements |
| `focusableKeys` | `Ref<string[]>` | — | No | Every focusable key in focus order. When omitted, focus order is read from rendered `[data-focusable]` elements. |

## Types

No additional exported types.

## Return Refs

| RefType | Type | Description |
| ---- | ---- | ----------- |
| `focusIndex` | `DeepReadonly<Ref<number>>` | Current focus position in `focusableKeys`. `-1` means nothing is focused |
| `currentFocusableKey` | `ComputedRef<string \| null>` | Key at `focusIndex`, or `null` when nothing is focused |
| `currentFocusableElement` | `DeepReadonly<Ref<HTMLElement \| null>>` | The rendered element at the current focus position in DOM-order mode; use `getFocusableElement` in key-list mode |

## Return Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `updateFocusIndex` | `index: number` | Sets `focusIndex`, clamped to the last key. A negative index clears focus |
| `getFocusableElement` | `key: string` | Returns the element whose `data-focusable` equals the key, or `null` when it is not rendered |
| `getFocusableElements` | — | Returns all rendered `[data-focusable]` elements. Available for DOM-order mode and compatibility. |
| `addMouseMoveListener` | - | Attaches a throttled `mousemove` listener to the wrapper element |
| `removeMouseMoveListener` | - | Removes the throttled `mousemove` listener from the wrapper element |

## Hooks

No lifecycle hooks are registered. Call `addMouseMoveListener` and `removeMouseMoveListener` yourself.

## Cautions

- Each focusable element must set `data-focusable` to its key. An element without a key is invisible to this composable, and a key that is not in `focusableKeys` is ignored on hover.
- Keys must be unique within the wrapper, otherwise `getFocusableElement` resolves the wrong element.
- In key-list mode, apply the focused style from `currentFocusableKey` so it survives virtualized re-renders. In legacy DOM-order mode, the composable retains its original `vs-focusable-active` class behavior.
- Call `addMouseMoveListener` after the wrapper mounts and `removeMouseMoveListener` before it unmounts to avoid event listener leaks.
