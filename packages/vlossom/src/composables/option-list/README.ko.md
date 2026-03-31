> For English documentation, see [README.md](./README.md).

# useOptionList

**Available Version**: 2.0.0+

원시 옵션 배열을 안정적인 id, 추출된 레이블/값, 항목별 비활성화 상태가 있는 정규화된 계산 목록으로 변환합니다.

## Feature

- 원시 `options` 배열에서 반응적으로 정규화된 옵션 목록을 계산합니다
- 레이블과 인덱스의 해시를 사용하여 각 옵션에 안정적인 `id`를 생성합니다
- `useOptionLabelValue`를 통해 `label`과 `value`를 추출합니다
- 항목별 또는 전역 `disabled` 상태를 각 옵션 객체에 평가합니다
- 반환된 `computedOptions` 배열은 목록 렌더링에 바로 사용할 수 있습니다

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
    { label: '사과', value: 'apple' },
    { label: '바나나', value: 'banana' },
]);
const optionLabel = ref('label');
const optionValue = ref('value');
const disabled = ref(false);

const { computedOptions } = useOptionList(options, optionLabel, optionValue, disabled);
</script>
```

## Args

| 인자          | 타입                                                                           | 기본값 | 필수 | 설명                                                                        |
| ------------- | ------------------------------------------------------------------------------ | ------ | ---- | --------------------------------------------------------------------------- |
| `options`     | `Ref<any[]>`                                                                   | —      | Yes  | 옵션 항목의 원시 배열.                                                       |
| `optionLabel` | `Ref<string>`                                                                  | —      | Yes  | 표시 레이블을 추출하는 키 경로.                                              |
| `optionValue` | `Ref<string>`                                                                  | —      | Yes  | 값을 추출하는 키 경로.                                                       |
| `disabled`    | `Ref<boolean \| ((option: any, index: number, options: any[]) => boolean)>`    | —      | Yes  | 옵션이 비활성화되는지 결정하는 전역 boolean 또는 항목별 함수.                |

## Types

```typescript
interface ComputedOption {
    id: string;      // 레이블 + 인덱스 기반의 안정적인 해시
    item: any;       // 원래 옵션 객체
    label: string;   // 추출된 표시 레이블
    value: any;      // 추출된 값
    index: number;   // options 배열에서의 원래 인덱스
    disabled: boolean;
}
```

## Return Refs

| RefType           | 타입                            | 설명                              |
| ----------------- | ------------------------------- | --------------------------------- |
| `computedOptions` | `ComputedRef<ComputedOption[]>` | 정규화된 반응형 옵션 목록.        |

## Return Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions
