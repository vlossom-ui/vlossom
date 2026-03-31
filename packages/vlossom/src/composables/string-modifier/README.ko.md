> For English documentation, see [README.md](./README.md).

# useStringModifier

**Available Version**: 2.0.0+

반응형 문자열 변환 수정자(`capitalize`, `lower`, `upper`)를 문자열 값에 적용합니다.

## Feature

- `capitalize`를 적용하여 문자열의 첫 번째 문자를 대문자로 만듭니다
- `lower`를 적용하여 전체 문자열을 소문자로 변환합니다
- `upper`를 적용하여 전체 문자열을 대문자로 변환합니다
- 활성 수정자가 없을 때 원래 문자열을 변경 없이 반환합니다
- 수정자 우선순위: `capitalize` → `lower` → `upper` (나중에 적용되는 수정자가 이전 것을 덮어씁니다)

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

| 인자        | 타입                   | 기본값 | 필수 | 설명                                                |
| ----------- | ---------------------- | ------ | ---- | --------------------------------------------------- |
| `modifiers` | `Ref<StringModifiers>` | —      | Yes  | 선택적 boolean 수정자 플래그가 있는 반응형 객체.     |

## Types

```typescript
interface StringModifiers {
    capitalize?: boolean;
    lower?: boolean;
    upper?: boolean;
}
```

## Return Refs

| RefType | 타입 | 설명 |
| ------- | ---- | ---- |

## Return Methods

| 메서드              | 파라미터        | 설명                                                       |
| ------------------- | --------------- | ---------------------------------------------------------- |
| `modifyStringValue` | `value: string` | 활성 수정자를 기반으로 변환된 문자열을 반환합니다.          |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- 여러 수정자가 동시에 활성화되면 코드 순서(`capitalize` → `lower` → `upper`)대로 순차적으로 적용되므로 마지막으로 활성화된 수정자가 우선합니다.
