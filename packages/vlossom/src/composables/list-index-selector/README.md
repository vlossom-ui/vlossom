> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useIndexSelector

**Available Version**: 2.0.0+

Manages index-based selection for a list of items with optional per-item or global disabled support, keyboard navigation, and edge detection.

## Feature

- Tracks a single `selectedIndex` across a reactive list
- Supports a boolean or per-item function as the `disabled` argument
- Skips disabled items when navigating forward/backward with `findActiveIndexForwardFrom` / `findActiveIndexBackwardFrom`
- Handles keyboard navigation (Arrow keys, Home, End) for both horizontal and vertical orientations
- Exposes `isFirstEdge` and `isLastEdge` computed refs for boundary detection
- Moves `selectedIndex` to the nearest selectable item when `list` or `disabled` changes, and keeps it while no item is selectable

## Basic Usage

```html
<template>
    <div @keydown="(e) => handleKeydown(e, true)">
        <div
            v-for="(step, i) in steps"
            :key="i"
            :class="{ selected: isSelected(i), disabled: isDisabled(i) }"
            @click="selectIndex(i)"
        >
            {{ step }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useIndexSelector } from '@/composables';

const steps = ref(['Step 1', 'Step 2', 'Step 3']);
const disabled = ref(false);

const { selectedIndex, isSelected, isDisabled, selectIndex, handleKeydown } = useIndexSelector(steps, disabled);
</script>
```

## Args

| Arg        | Type                                                                   | Default     | Required | Description                                                                     |
| ---------- | ---------------------------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------- |
| `list`     | `Ref<any[]>`                                                           | —           | Yes      | Reactive array of items to select from.                                         |
| `disabled` | `Ref<boolean \| ((item: any, index: number) => boolean) \| undefined>` | `undefined` | No       | Global boolean or per-item function. When a function, receives `(item, index)`. |

## Types

No additional exported types. Uses `NOT_SELECTED` constant (`-1`) for the unselected state.

## Return Refs

| RefType         | Type                   | Description                                                                                                                        |
| --------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `selectedIndex` | `Ref<number>`          | Currently selected index. `NOT_SELECTED` (`-1`) when nothing is selected. While no item is selectable, it can be outside the list. |
| `isFirstEdge`   | `ComputedRef<boolean>` | `true` when the selected index is the first active (non-disabled) item.                                                            |
| `isLastEdge`    | `ComputedRef<boolean>` | `true` when the selected index is the last active (non-disabled) item.                                                             |

## Return Methods

| Method                        | Parameters                              | Description                                                                                                                                             |
| ----------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isSelected`                  | `index: number`                         | Returns `true` if `selectedIndex` equals `index`.                                                                                                       |
| `isDisabled`                  | `index: number`                         | Returns `true` if the item at `index` is disabled.                                                                                                      |
| `isPrevious`                  | `index: number`                         | Returns `true` if `index` is before `selectedIndex`.                                                                                                    |
| `findActiveIndexForwardFrom`  | `targetIndex: number`                   | Finds the first non-disabled index at or after `targetIndex`.                                                                                           |
| `findActiveIndexBackwardFrom` | `targetIndex: number`                   | Finds the first non-disabled index at or before `targetIndex`.                                                                                          |
| `selectIndex`                 | `index: number`                         | Sets `selectedIndex` to `index` if valid and not disabled. Out-of-range clears to `NOT_SELECTED`; disabled is a no-op (current selection is preserved). |
| `syncIndex`                   | `index: number`                         | Sets `selectedIndex` from an outside value such as `modelValue`. Uses the nearest selectable index. See [Cautions](#cautions) for the rule.             |
| `handleKeydown`               | `e: KeyboardEvent, isVertical: boolean` | Handles Arrow, Home, and End keys. Uses vertical/horizontal key mapping based on `isVertical`.                                                          |

## Cautions

- `selectedIndex` starts at `0` (the first item), not `NOT_SELECTED`. Ensure the first item is selectable on mount, or reset manually if needed.
- If all items are disabled (or the target index is disabled), `selectIndex` is a no-op: the current `selectedIndex` is preserved rather than cleared.
- `syncIndex` and changes to `list` or `disabled` use the same rule:
    - `NOT_SELECTED` stays.
    - If an item is selectable, `selectedIndex` moves to the nearest selectable index. If two indexes are at the same distance, the lower index is used.
    - If no item is selectable (`list` is empty or all items are disabled), `selectedIndex` keeps its value. It also keeps a value outside the list. When an item becomes selectable, the rule above applies.
- To apply this rule, `useIndexSelector` calls the `disabled` function for every item. It calls the function at setup, and again when `list`, `disabled`, or a reactive value that the function reads changes.
