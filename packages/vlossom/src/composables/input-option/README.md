> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useInputOption

**Available Version**: 2.0.0+

Keeps a selection-based input value in sync with its options list. When the options change, any selected value that no longer exists in the new list is cleared automatically.

## Feature

- Watches the `options` array and removes stale selected values when options change
- Supports both single-value and multiple-value selection via the `multiple` flag
- Delegates label/value extraction to `useOptionLabelValue`
- Uses deep equality comparison to avoid unnecessary resets

## Basic Usage

```html
<script setup>
import { ref, toRefs } from 'vue';
import { useInputOption } from '@/composables';

const inputValue = ref(null);
const options = ref([{ label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' }]);
const optionLabel = ref('label');
const optionValue = ref('value');

const { getOptionLabel, getOptionValue } = useInputOption(inputValue, options, optionLabel, optionValue);
</script>
```

## Args

| Arg           | Type                | Default     | Required | Description                                                              |
| ------------- | ------------------- | ----------- | -------- | ------------------------------------------------------------------------ |
| `inputValue`  | `Ref<any>`          | —           | Yes      | The current selected value (or array of values when `multiple` is true). |
| `options`     | `Ref<any[]>`        | —           | Yes      | The full list of available options.                                      |
| `optionLabel` | `Ref<string>`       | —           | Yes      | Key path to extract the display label from an option object.             |
| `optionValue` | `Ref<string>`       | —           | Yes      | Key path to extract the value from an option object.                     |
| `multiple`    | `Ref<boolean>`      | `ref(false)` | No      | When `true`, `inputValue` is treated as an array and filtered on change. |

## Types

No additional exported types.

## Return Refs

| RefType | Type | Description |
| ------- | ---- | ----------- |

## Return Methods

| Method           | Parameters     | Description                                                         |
| ---------------- | -------------- | ------------------------------------------------------------------- |
| `getOptionLabel` | `option: any`  | Returns the display label string for a given option.                |
| `getOptionValue` | `option: any`  | Returns the value for a given option using `optionValue` key path.  |

## Hooks

| Hook    | Description                                                                              |
| ------- | ---------------------------------------------------------------------------------------- |
| `watch` | Watches `options` and clears or filters `inputValue` when the options list changes.      |

## Cautions

- When `multiple` is `false` and the current value is not found in the new options, `inputValue` is set to `null`.
- When `multiple` is `true`, only values that still exist in the new options are retained.
