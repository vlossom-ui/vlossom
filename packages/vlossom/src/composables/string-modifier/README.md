> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useStringModifier

**Available Version**: 2.0.0+

Applies reactive string transformation modifiers (`capitalize`, `lower`, `upper`) to a string value.

## Feature

- Applies `capitalize` to uppercase the first character of the string
- Applies `lower` to convert the entire string to lowercase
- Applies `upper` to convert the entire string to uppercase
- Returns the original string unchanged when no modifiers are active
- Modifier precedence: `capitalize` → `lower` → `upper` (later modifiers overwrite earlier ones)

## Basic Usage

```html
<template>
    <input v-model="inputValue" @input="onInput" />
</template>

<script setup>
import { ref } from 'vue';
import { useStringModifier } from '@/composables';

const modifiers = ref({ upper: true });
const { modifyStringValue } = useStringModifier(modifiers);

const inputValue = ref('');
function onInput(e) {
    inputValue.value = modifyStringValue(e.target.value);
}
</script>
```

## Args

| Arg         | Type                    | Default | Required | Description                                              |
| ----------- | ----------------------- | ------- | -------- | -------------------------------------------------------- |
| `modifiers` | `Ref<StringModifiers>`  | —       | Yes      | Reactive object with optional boolean modifier flags.    |

## Types

```typescript
interface StringModifiers {
    capitalize?: boolean;
    lower?: boolean;
    upper?: boolean;
}
```

## Return Refs

| RefType | Type | Description |
| ------- | ---- | ----------- |

## Return Methods

| Method              | Parameters       | Description                                                              |
| ------------------- | ---------------- | ------------------------------------------------------------------------ |
| `modifyStringValue` | `value: string`  | Returns the transformed string based on the active modifiers.            |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions

- When multiple modifiers are enabled simultaneously, they are applied sequentially in code order (`capitalize` → `lower` → `upper`), so the last active modifier wins.
