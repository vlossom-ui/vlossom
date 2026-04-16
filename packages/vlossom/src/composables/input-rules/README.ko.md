> For English documentation, see [README.md](./README.md).

# useInputRules

**Available Version**: 2.0.0+

현재 입력값에 대해 동기 및 비동기 유효성 검사 규칙 배열을 평가하고, 오류 메시지를 반응형 목록에 수집합니다.

## Feature

- `defaultRules`와 `rules`를 결합하며, `noDefaultRules`가 `true`가 아닌 한 `defaultRules`가 앞에 추가됩니다
- 문자열 오류 메시지 또는 falsy 값을 반환하는 동기 규칙을 지원합니다
- `Promise<string>`을 반환하는 비동기 규칙을 지원합니다
- 계산된 규칙 목록이 변경될 때마다 유효성 검사를 자동으로 재실행합니다

## Basic Usage

```html
<script setup>
import { ref } from 'vue';
import { useInputRules } from '@/composables';

const inputValue = ref('');
const rules = ref([
    (val) => val.length >= 3 || '최소 3자 이상 입력해야 합니다',
    async (val) => {
        const taken = await checkIfUsernameTaken(val);
        return taken ? '이미 사용 중인 사용자 이름입니다' : '';
    },
]);
const defaultRules = ref([]);
const noDefaultRules = ref(false);

const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
</script>
```

## Args

| 인자             | 타입             | 기본값 | 필수 | 설명                                                                     |
| ---------------- | ---------------- | ------ | ---- | ------------------------------------------------------------------------ |
| `inputValue`     | `Ref<T>`         | —      | Yes  | 각 규칙 함수에 전달되는 현재 입력값.                                      |
| `rules`          | `Ref<Rule<T>[]>` | —      | Yes  | 사용자가 제공한 유효성 검사 규칙.                                         |
| `defaultRules`   | `Ref<Rule<T>[]>` | —      | Yes  | 컴포넌트에서 제공하는 내장 규칙 (예: required, 타입 검사).                |
| `noDefaultRules` | `Ref<boolean>`   | —      | Yes  | `true`일 때 `rules`만 적용되고, `defaultRules`는 무시됩니다.             |

## Types

```typescript
type Rule<T> = (value: T) => string | false | null | undefined | Promise<string>;

interface StateMessage {
    state: 'error';
    text: string;
}
```

## Return Refs

| RefType        | 타입                  | 설명                                          |
| -------------- | --------------------- | --------------------------------------------- |
| `ruleMessages` | `Ref<StateMessage[]>` | 실패한 규칙에 의해 생성된 오류 메시지 목록.    |

## Return Methods

| 메서드       | 파라미터 | 설명                                                                                        |
| ------------ | -------- | ------------------------------------------------------------------------------------------- |
| `checkRules` | —        | `inputValue`에 대해 모든 계산된 규칙을 실행하고 동기적으로 또는 비동기 해결 후 `ruleMessages`를 업데이트합니다. |

## Hooks

| Hook    | 설명                                                                   |
| ------- | ---------------------------------------------------------------------- |
| `watch` | `computedRules`를 깊이 감시하고 변경 시 `checkRules`를 다시 실행합니다. |

## Cautions

- 규칙은 오류를 나타내기 위해 비어있지 않은 문자열을 반환해야 합니다. falsy 반환값 (`false`, `null`, `undefined`, 빈 문자열)은 규칙이 통과했음을 의미합니다.
- 비동기 규칙은 모든 동기 규칙이 처리된 후 `Promise.all`로 해결됩니다.
