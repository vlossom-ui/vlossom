> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useValueMatcher

**Available Version**: 2.0.0+

Manages toggle-style value matching for checkbox and switch components, supporting both single-value and multiple-value (array) modes with configurable `trueValue` and `falseValue`.

## Feature

- Determines whether the input value matches `trueValue` in both single and multiple (array) modes
- Provides helpers to get, update, and clear the value in a way consistent with the current mode
- Supports deep equality comparison via `objectUtil.isEqual`
- Handles the `addTrueValue` operation for initializing multiple-mode values

## Basic Usage

```html
<template>
    <input
        type="checkbox"
        :checked="isMatched"
        @change="toggle"
    />
</template>

<script setup>
import { ref } from 'vue';
import { useValueMatcher } from '@/composables';

const multiple = ref(false);
const inputValue = ref(false);
const trueValue = ref(true);
const falseValue = ref(false);

const { isMatched, getUpdatedValue, getClearedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

function toggle(e) {
    inputValue.value = getUpdatedValue(e.target.checked);
}
</script>
```

## Args

| Arg          | Type          | Default | Required | Description                                                                     |
| ------------ | ------------- | ------- | -------- | ------------------------------------------------------------------------------- |
| `multiple`   | `Ref<boolean>` | —      | Yes      | When `true`, `inputValue` is treated as an array and `trueValue` is added/removed. |
| `inputValue` | `Ref<any>`    | —       | Yes      | The reactive current value of the input (single value or array).                |
| `trueValue`  | `Ref<any>`    | —       | Yes      | The value representing the "checked" / "on" state.                              |
| `falseValue` | `Ref<any>`    | —       | Yes      | The value representing the "unchecked" / "off" state.                           |

## Types

No additional exported types.

## Return Refs

| RefType     | Type                   | Description                                                                 |
| ----------- | ---------------------- | --------------------------------------------------------------------------- |
| `isMatched` | `ComputedRef<boolean>` | `true` when `inputValue` equals `trueValue` (single) or contains it (multiple). |

## Return Methods

| Method            | Parameters           | Description                                                                                               |
| ----------------- | -------------------- | --------------------------------------------------------------------------------------------------------- |
| `getInitialValue` | —                    | Returns the appropriate initial value: the current array (multiple) or `trueValue`/`falseValue` (single). |
| `addTrueValue`    | —                    | Pushes `trueValue` into the array when in multiple mode (no-op if already present or not an array).       |
| `getUpdatedValue` | `isTruthy: boolean`  | Returns the new value after toggling: adds/removes `trueValue` (multiple) or returns `trueValue`/`falseValue` (single). |
| `getClearedValue` | —                    | Returns the cleared value: empty array (multiple) or `falseValue` (single).                               |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions

- In multiple mode, `inputValue` must be an array. If it is not, `addTrueValue` logs a warning and is a no-op.
- Deep equality (`objectUtil.isEqual`) is used for all comparisons, so object-type `trueValue` / `falseValue` are supported.
