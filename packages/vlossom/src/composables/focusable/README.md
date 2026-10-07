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
- Optional key mode (`focusableKeys`) tracks focus by data keys, so it keeps working when focusable elements are not all rendered (e.g. virtual scroll)

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

### Key Mode

Pass `focusableKeys` when the focusable elements may not all exist in the DOM, such as in a virtual scroll list. Focus is tracked by key order instead of DOM order. Each element sets its key as the `data-focusable` value, and binds `vs-focusable-active` with `isFocused`, because elements can be re-rendered.

```html
<template>
    <div ref="listRef">
        <div
            v-for="item in renderedItems"
            :key="item.id"
            :data-focusable="item.id"
            :class="{ 'vs-focusable-active': isFocused(item.id) }"
        >
            {{ item.label }}
        </div>
    </div>
</template>

<script setup>
import { computed, useTemplateRef } from 'vue';
import { useFocusable } from '@/composables';

const listRef = useTemplateRef('listRef');
const focusableKeys = computed(() => allItems.value.map((item) => item.id));
const { focusedKey, isFocused, updateFocusIndex, addMouseMoveListener, removeMouseMoveListener } = useFocusable(
    listRef,
    focusableKeys,
);
</script>
```

## Args

| Arg              | Type                      | Default | Required | Description                                                      |
| ---------------- | ------------------------- | ------- | -------- | ---------------------------------------------------------------- |
| `wrapperElement` | `TemplateRef<HTMLElement>` | —      | Yes      | Template ref pointing to the container element that holds `[data-focusable]` children. |
| `focusableKeys`  | `Ref<string[]>`            | —      | -        | Enables key mode. Ordered keys of all focusable items, matched with each element's `data-focusable` value. |

## Types

No additional exported types.

## Return Refs

| RefType                    | Type                                     | Description                                                          |
| -------------------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| `focusIndex`               | `DeepReadonly<Ref<number>>`              | Current focus index. `-1` means nothing is focused.                  |
| `currentFocusableElement`  | `DeepReadonly<Ref<HTMLElement \| null>>` | The DOM element that currently has the `vs-focusable-active` class. Always `null` in key mode. |
| `focusedKey`               | `ComputedRef<string \| null>`            | Key at `focusIndex` in key mode. `null` when nothing is focused or key mode is not used. |

## Return Methods

| Method                  | Parameters        | Description                                                                        |
| ----------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| `isFocused`             | `key: string`     | Returns `true` if the given key is focused (key mode).                             |
| `updateFocusIndex`      | `index: number`   | Sets `focusIndex` to the given value, clamped to valid range (number of keys in key mode); `-1` clears focus. |
| `getFocusableElements`  | —                 | Returns all `[data-focusable]` elements inside the wrapper as an array.            |
| `addMouseMoveListener`  | —                 | Attaches a throttled `mousemove` listener to the wrapper element.                  |
| `removeMouseMoveListener` | —               | Removes the throttled `mousemove` listener from the wrapper element.               |

## Hooks

| Hook    | Description                                                                   |
| ------- | ----------------------------------------------------------------------------- |
| `watch` | Watches `focusIndex` to update the `vs-focusable-active` class on the target element. Not registered in key mode. |

## Cautions

- Elements must have the `data-focusable` attribute to be tracked; elements without it are invisible to this composable.
- In key mode, the composable does not add the `vs-focusable-active` class; bind it with `isFocused`.
- Call `addMouseMoveListener` after the wrapper mounts and `removeMouseMoveListener` before it unmounts to avoid event listener leaks.
