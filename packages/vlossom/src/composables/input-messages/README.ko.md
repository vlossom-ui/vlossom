> For English documentation, see [README.md](./README.md).

# useInputMessages

**Available Version**: 2.0.0+

입력값에 대한 정적 및 함수 기반 메시지를 평가하고, 규칙 메시지와 결합하여 단일 반응형 목록으로 만듭니다.

## Feature

- 정적 `StateMessage` 객체와 동기/비동기 메시지 함수를 지원합니다
- 모든 대기 중인 비동기 메시지 함수를 `Promise.all`로 병렬 처리합니다
- `showRuleMessages` ref를 통해 규칙 메시지 표시 여부를 토글합니다
- `messages` 배열이 변경될 때마다 메시지를 반응적으로 재평가합니다

## Basic Usage

```html
<script setup>
import { ref } from 'vue';
import { useInputMessages } from '@/composables';

const inputValue = ref('');
const messages = ref([
    { state: 'info', text: '사용자 이름을 입력하세요.' },
    (val) => val.length > 10 ? { state: 'warning', text: '너무 깁니다' } : null,
]);
const ruleMessages = ref([]);

const { computedMessages, showRuleMessages, checkMessages } = useInputMessages(inputValue, messages, ruleMessages);
</script>
```

## Args

| 인자           | 타입                  | 기본값 | 필수 | 설명                                                                     |
| -------------- | --------------------- | ------ | ---- | ------------------------------------------------------------------------ |
| `inputValue`   | `Ref<T>`              | —      | Yes  | 함수 기반 메시지에 전달되는 현재 입력값.                                  |
| `messages`     | `Ref<Message<T>[]>`   | —      | Yes  | 정적 `StateMessage` 객체 또는 `StateMessage`를 반환하는 함수의 배열.      |
| `ruleMessages` | `Ref<StateMessage[]>` | —      | Yes  | 유효성 검사 규칙에 의해 생성된 메시지 배열 (`useInputRules`에서 생성됨).  |

## Types

```typescript
type Message<T> = StateMessage | ((value: T) => StateMessage | Promise<StateMessage>);

interface StateMessage {
    state: UIState;
    text: string;
}
```

## Return Refs

| RefType            | 타입                          | 설명                                                                                   |
| ------------------ | ----------------------------- | -------------------------------------------------------------------------------------- |
| `showRuleMessages` | `Ref<boolean>`                | `true`일 때 `ruleMessages`가 `computedMessages`에 추가됩니다.                           |
| `computedMessages` | `ComputedRef<StateMessage[]>` | 정적/함수 메시지와 `showRuleMessages`가 `true`일 때의 규칙 메시지를 합친 목록.         |

## Return Methods

| 메서드          | 파라미터 | 설명                                                                          |
| --------------- | -------- | ----------------------------------------------------------------------------- |
| `checkMessages` | —        | 현재 `inputValue`에 대해 모든 메시지를 재평가하고 목록을 업데이트합니다.       |

## Hooks

| Hook    | 설명                                              |
| ------- | ------------------------------------------------- |
| `watch` | `messages`를 깊이 감시하고 `checkMessages`를 다시 실행합니다. |

## Cautions
