> For English documentation, see [README.md](./README.md).

# v-shake

요소에 수평 흔들기 애니메이션을 실행합니다. 유효성 검사 피드백 용도로, 입력값이 유효하지 않을 때 요소를 흔드는 동작을 구현할 수 있습니다.

**사용 가능 버전**: 2.0.0+

## 기본 사용법

유효성 검사 실패 시 `true`가 되는 boolean 값을 바인딩합니다:

```html
<template>
    <div v-shake="hasError">
        <input v-model="value" />
    </div>
    <button @click="validate">제출</button>
</template>

<script setup>
import { ref } from 'vue';

const value = ref('');
const hasError = ref(false);

function validate() {
    hasError.value = !value.value;
}
</script>
```

바인딩 값이 `true`로 전환될 때마다 흔들기 애니메이션이 실행됩니다. `false`로 되돌리면 애니메이션 없이 상태만 초기화됩니다.

## 바인딩

| 바인딩  | 타입                   | 기본값      | 설명                                                                    |
| ------- | ---------------------- | ----------- | ----------------------------------------------------------------------- |
| `value` | `boolean \| undefined` | `undefined` | `true`이면 흔들기 애니메이션을 실행합니다. `false`이면 상태를 초기화합니다. |

## 훅

| 훅        | 설명                                                                                  |
| --------- | ------------------------------------------------------------------------------------- |
| `mounted` | 초기 값이 `true`인 경우 즉시 흔들기 애니메이션을 실행합니다.                          |
| `updated` | 값이 `true`로 전환되면 흔들기 애니메이션을 실행하고, `false`이면 상태를 초기화합니다. |

## 주의사항

- 값이 `false`(또는 `undefined`)에서 `true`로 전환될 때마다 애니메이션이 재실행됩니다. 값이 `true`인 상태로 유지되는 동안에는 추가 애니메이션이 실행되지 않습니다.
- 디렉티브는 `shake-horizontal` CSS 클래스를 적용합니다. 프로젝트에서 `vlossom/styles`가 임포트되어 있어야 합니다.
