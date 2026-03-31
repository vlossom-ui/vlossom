> For English documentation, see [README.md](./README.md).

# useInputOption

**Available Version**: 2.0.0+

선택 기반 입력값을 옵션 목록과 동기화합니다. 옵션이 변경되면 새 목록에 더 이상 존재하지 않는 선택된 값을 자동으로 초기화합니다.

## Feature

- `options` 배열을 감시하고 옵션이 변경될 때 오래된 선택값을 제거합니다
- `multiple` 플래그를 통해 단일 값 및 다중 값 선택을 지원합니다
- 레이블/값 추출을 `useOptionLabelValue`에 위임합니다
- 불필요한 초기화를 피하기 위해 깊은 동등 비교를 사용합니다

## Basic Usage

```html
<script setup>
import { ref, toRefs } from 'vue';
import { useInputOption } from '@/composables';

const inputValue = ref(null);
const options = ref([{ label: '사과', value: 'apple' }, { label: '바나나', value: 'banana' }]);
const optionLabel = ref('label');
const optionValue = ref('value');

const { getOptionLabel, getOptionValue } = useInputOption(inputValue, options, optionLabel, optionValue);
</script>
```

## Args

| 인자          | 타입            | 기본값        | 필수 | 설명                                                                     |
| ------------- | --------------- | ------------- | ---- | ------------------------------------------------------------------------ |
| `inputValue`  | `Ref<any>`      | —             | Yes  | 현재 선택된 값 (`multiple`이 `true`일 때는 값 배열).                     |
| `options`     | `Ref<any[]>`    | —             | Yes  | 사용 가능한 옵션의 전체 목록.                                            |
| `optionLabel` | `Ref<string>`   | —             | Yes  | 옵션 객체에서 표시 레이블을 추출하는 키 경로.                            |
| `optionValue` | `Ref<string>`   | —             | Yes  | 옵션 객체에서 값을 추출하는 키 경로.                                     |
| `multiple`    | `Ref<boolean>`  | `ref(false)`  | No   | `true`일 때 `inputValue`는 배열로 처리되고 변경 시 필터링됩니다.         |

## Types

추가로 내보내는 타입이 없습니다.

## Return Refs

| RefType | 타입 | 설명 |
| ------- | ---- | ---- |

## Return Methods

| 메서드           | 파라미터      | 설명                                                               |
| ---------------- | ------------- | ------------------------------------------------------------------ |
| `getOptionLabel` | `option: any` | 주어진 옵션의 표시 레이블 문자열을 반환합니다.                      |
| `getOptionValue` | `option: any` | `optionValue` 키 경로를 사용하여 주어진 옵션의 값을 반환합니다.    |

## Hooks

| Hook    | 설명                                                                              |
| ------- | --------------------------------------------------------------------------------- |
| `watch` | `options`를 감시하고 옵션 목록이 변경될 때 `inputValue`를 초기화하거나 필터링합니다. |

## Cautions

- `multiple`이 `false`이고 현재 값이 새 옵션에서 찾을 수 없는 경우, `inputValue`는 `null`로 설정됩니다.
- `multiple`이 `true`인 경우, 새 옵션에 여전히 존재하는 값만 유지됩니다.
