> For English documentation, see [README.md](./README.md).

# useOptionLabelValue

**Available Version**: 2.0.0+

설정 가능한 키 경로를 사용하여 임의의 옵션 객체에서 표시 레이블과 기본 값을 추출합니다.

## Feature

- `optionLabel` 키를 통해 중첩 객체 경로에서 레이블을 해석합니다
- `optionValue` 키를 통해 중첩 객체 경로에서 값을 해석합니다
- 일치하는 키가 없는 객체의 경우 `JSON.stringify`로 폴백합니다
- 옵션에서 지정된 키를 찾을 수 없는 경우 `logUtil.error`로 오류를 기록합니다
- 원시값(문자열, 숫자 등)은 `toString()`으로 변환하여 처리합니다

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

| 인자          | 타입          | 기본값 | 필수 | 설명                                                |
| ------------- | ------------- | ------ | ---- | --------------------------------------------------- |
| `optionLabel` | `Ref<string>` | —      | Yes  | 옵션 객체에서 표시 레이블을 추출하는 데 사용하는 키 경로. |
| `optionValue` | `Ref<string>` | —      | Yes  | 옵션 객체에서 값을 추출하는 데 사용하는 키 경로.    |

## Types

추가로 내보내는 타입이 없습니다.

## Return Refs

| RefType | 타입 | 설명 |
| ------- | ---- | ---- |

## Return Methods

| 메서드           | 파라미터      | 설명                                                              |
| ---------------- | ------------- | ----------------------------------------------------------------- |
| `getOptionLabel` | `option: any` | 주어진 옵션의 표시 레이블 문자열을 반환합니다.                     |
| `getOptionValue` | `option: any` | `optionValue` 키 경로를 사용하여 주어진 옵션의 값을 반환합니다.   |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- `optionLabel`이 설정되었지만 옵션 객체에 해당 키가 없는 경우, 오류가 기록되고 전체 JSON이 레이블로 반환됩니다.
- `optionValue`가 설정되었지만 옵션 객체에 해당 키가 없는 경우, 오류가 기록되고 원래 옵션 객체가 값으로 반환됩니다.
