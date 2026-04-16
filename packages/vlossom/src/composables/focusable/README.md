> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useFocusable

**Available Version**: 2.0.0+

Manages keyboard-accessible focus tracking within a wrapper element by querying `[data-focusable]` elements and updating a focus index with throttled mouse-move support.

## Feature

- Tracks the currently focused item by index within a `[data-focusable]` element list
- Applies and removes the `vs-focusable-active` CSS class automatically on index changes
- Throttles mouse-move events (25 ms interval) to minimize performance overhead
- Provides `addMouseMoveListener` / `removeMouseMoveListener` for lifecycle control
- Returns `readonly` refs to prevent accidental external mutation

## Basic Usage

```html
<template>
    <ul ref="listRef">
        <li
            v-for="(item, i) in items"
            :key="i"
            data-focusable
            @keydown.arrow-down.prevent="updateFocusIndex(i + 1)"
            @keydown.arrow-up.prevent="updateFocusIndex(i - 1)"
        >
            {{ item }}
        </li>
    </ul>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue';
import { useFocusable } from '@/composables';

const listRef = useTemplateRef('listRef');
const { focusIndex, updateFocusIndex, addMouseMoveListener, removeMouseMoveListener } = useFocusable(listRef);

onMounted(addMouseMoveListener);
onBeforeUnmount(removeMouseMoveListener);
</script>
```

## Args

| Arg              | Type                      | Default | Required | Description                                                      |
| ---------------- | ------------------------- | ------- | -------- | ---------------------------------------------------------------- |
| `wrapperElement` | `TemplateRef<HTMLElement>` | —      | Yes      | Template ref pointing to the container element that holds `[data-focusable]` children. |

## Types

No additional exported types.

## Return Refs

| RefType                    | Type                                     | Description                                                          |
| -------------------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| `focusIndex`               | `DeepReadonly<Ref<number>>`              | Current focus index. `-1` means nothing is focused.                  |
| `currentFocusableElement`  | `DeepReadonly<Ref<HTMLElement \| null>>` | The DOM element that currently has the `vs-focusable-active` class.  |

## Return Methods

| Method                  | Parameters        | Description                                                                        |
| ----------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| `updateFocusIndex`      | `index: number`   | Sets `focusIndex` to the given value, clamped to valid range; `-1` clears focus.   |
| `getFocusableElements`  | —                 | Returns all `[data-focusable]` elements inside the wrapper as an array.            |
| `addMouseMoveListener`  | —                 | Attaches a throttled `mousemove` listener to the wrapper element.                  |
| `removeMouseMoveListener` | —               | Removes the throttled `mousemove` listener from the wrapper element.               |

## Hooks

| Hook    | Description                                                                   |
| ------- | ----------------------------------------------------------------------------- |
| `watch` | Watches `focusIndex` to update the `vs-focusable-active` class on the target element. |

## Cautions

- Elements must have the `data-focusable` attribute to be tracked; elements without it are invisible to this composable.
- Call `addMouseMoveListener` after the wrapper mounts and `removeMouseMoveListener` before it unmounts to avoid event listener leaks.
