> For English documentation, see [README.md](./README.md).

# useValueMatcher

**Available Version**: 2.0.0+

설정 가능한 `trueValue`와 `falseValue`로 단일 값 및 다중 값(배열) 모드를 모두 지원하는 체크박스 및 스위치 컴포넌트의 토글 스타일 값 매칭을 관리합니다.

## Feature

- 단일 및 다중(배열) 모드 모두에서 입력값이 `trueValue`와 일치하는지 결정합니다
- 현재 모드와 일관되게 값을 가져오고, 업데이트하고, 초기화하는 헬퍼를 제공합니다
- `objectUtil.isEqual`을 통해 깊은 동등 비교를 지원합니다
- 다중 모드 값을 초기화하는 `addTrueValue` 작업을 처리합니다

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

| 인자         | 타입           | 기본값 | 필수 | 설명                                                                           |
| ------------ | -------------- | ------ | ---- | ------------------------------------------------------------------------------ |
| `multiple`   | `Ref<boolean>` | —      | Yes  | `true`일 때 `inputValue`는 배열로 처리되고 `trueValue`가 추가/제거됩니다.      |
| `inputValue` | `Ref<any>`     | —      | Yes  | 입력의 반응형 현재 값 (단일 값 또는 배열).                                     |
| `trueValue`  | `Ref<any>`     | —      | Yes  | "선택됨" / "켜짐" 상태를 나타내는 값.                                          |
| `falseValue` | `Ref<any>`     | —      | Yes  | "선택 안 됨" / "꺼짐" 상태를 나타내는 값.                                     |

## Types

추가로 내보내는 타입이 없습니다.

## Return Refs

| RefType     | 타입                   | 설명                                                                              |
| ----------- | ---------------------- | --------------------------------------------------------------------------------- |
| `isMatched` | `ComputedRef<boolean>` | `inputValue`가 `trueValue`와 같으면(단일) 또는 포함하면(다중) `true`.             |

## Return Methods

| 메서드            | 파라미터             | 설명                                                                                              |
| ----------------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `getInitialValue` | —                    | 적절한 초기값을 반환합니다: 현재 배열(다중) 또는 `trueValue`/`falseValue`(단일).                  |
| `addTrueValue`    | —                    | 다중 모드일 때 배열에 `trueValue`를 추가합니다(이미 있거나 배열이 아니면 아무 동작도 하지 않음). |
| `getUpdatedValue` | `isTruthy: boolean`  | 토글 후 새 값을 반환합니다: `trueValue` 추가/제거(다중) 또는 `trueValue`/`falseValue` 반환(단일). |
| `getClearedValue` | —                    | 초기화된 값을 반환합니다: 빈 배열(다중) 또는 `falseValue`(단일).                                 |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- 다중 모드에서 `inputValue`는 배열이어야 합니다. 배열이 아닌 경우 `addTrueValue`는 경고를 기록하고 아무 동작도 하지 않습니다.
- 모든 비교에 깊은 동등 비교(`objectUtil.isEqual`)가 사용되므로, 객체 타입의 `trueValue` / `falseValue`도 지원됩니다.
