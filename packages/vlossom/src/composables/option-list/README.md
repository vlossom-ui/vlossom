> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useOptionList

**Available Version**: 2.0.0+

Transforms a raw options array into a normalized, computed list with stable ids, extracted labels/values, and per-item disabled state.

## Feature

- Computes a normalized option list reactively from the raw `options` array
- Generates a stable `id` for each option using a hash of its label and index
- Extracts `label` and `value` via `useOptionLabelValue`
- Evaluates per-item or global `disabled` state into each option object
- The returned `computedOptions` array is ready to use in list rendering

## Basic Usage

```html
<template>
    <ul>
        <li
            v-for="option in computedOptions"
            :key="option.id"
            :class="{ disabled: option.disabled }"
        >
            {{ option.label }}
        </li>
    </ul>
</template>

<script setup>
import { ref } from 'vue';
import { useOptionList } from '@/composables';

const options = ref([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
]);
const optionLabel = ref('label');
const optionValue = ref('value');
const disabled = ref(false);

const { computedOptions } = useOptionList(options, optionLabel, optionValue, disabled);
</script>
```

## Args

| Arg           | Type                                                                           | Default | Required | Description                                                                     |
| ------------- | ------------------------------------------------------------------------------ | ------- | -------- | ------------------------------------------------------------------------------- |
| `options`     | `Ref<any[]>`                                                                   | —       | Yes      | Raw array of option items.                                                      |
| `optionLabel` | `Ref<string>`                                                                  | —       | Yes      | Key path for extracting the display label.                                      |
| `optionValue` | `Ref<string>`                                                                  | —       | Yes      | Key path for extracting the value.                                              |
| `disabled`    | `Ref<boolean \| ((option: any, index: number, options: any[]) => boolean)>`    | —       | Yes      | Global boolean or per-item function determining whether the option is disabled.  |

## Types

```typescript
interface ComputedOption {
    id: string;      // stable hash based on label + index
    item: any;       // original option object
    label: string;   // extracted display label
    value: any;      // extracted value
    index: number;   // original index in the options array
    disabled: boolean;
}
```

## Return Refs

| RefType           | Type                         | Description                                    |
| ----------------- | ---------------------------- | ---------------------------------------------- |
| `computedOptions` | `ComputedRef<ComputedOption[]>` | Normalized and reactive option list.         |

## Return Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions
