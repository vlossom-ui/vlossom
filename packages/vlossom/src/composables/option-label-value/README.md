> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useOptionLabelValue

**Available Version**: 2.0.0+

Extracts display labels and underlying values from arbitrary option objects using configurable key paths.

## Feature

- Resolves labels from nested object paths via `optionLabel` key
- Resolves values from nested object paths via `optionValue` key
- Falls back to `JSON.stringify` for objects without a matching key
- Logs an error via `logUtil.error` when a specified key is not found in the option
- Works with primitive values (string, number, etc.) by converting them with `toString()`

## Basic Usage

```html
<script setup>
import { ref } from 'vue';
import { useOptionLabelValue } from '@/composables';

const optionLabel = ref('name');
const optionValue = ref('id');

const { getOptionLabel, getOptionValue } = useOptionLabelValue(optionLabel, optionValue);

const option = { id: 1, name: 'Alice' };
console.log(getOptionLabel(option)); // 'Alice'
console.log(getOptionValue(option)); // 1
</script>
```

## Args

| Arg           | Type          | Default | Required | Description                                                      |
| ------------- | ------------- | ------- | -------- | ---------------------------------------------------------------- |
| `optionLabel` | `Ref<string>` | —       | Yes      | Key path used to extract the display label from an option object.|
| `optionValue` | `Ref<string>` | —       | Yes      | Key path used to extract the value from an option object.        |

## Types

No additional exported types.

## Return Refs

| RefType | Type | Description |
| ------- | ---- | ----------- |

## Return Methods

| Method           | Parameters    | Description                                                                 |
| ---------------- | ------------- | --------------------------------------------------------------------------- |
| `getOptionLabel` | `option: any` | Returns the display label string for the given option.                      |
| `getOptionValue` | `option: any` | Returns the value for the given option using the `optionValue` key path.    |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions

- If `optionLabel` is set but the key does not exist on the option object, an error is logged and the full JSON is returned as the label.
- If `optionValue` is set but the key does not exist on the option object, an error is logged and the original option object is returned as the value.
