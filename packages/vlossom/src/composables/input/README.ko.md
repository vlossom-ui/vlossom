> For English documentation, see [README.md](./README.md).

# useInput

**Available Version**: 2.0.0+

폼 입력 컴포넌트를 위한 중앙 컴포저블입니다. 유효성 검사 규칙, 사용자 메시지, 폼 통합, 비활성화/읽기 전용 상태, 라이프사이클 콜백을 단일 호출로 오케스트레이션합니다.

## Feature

- 양방향 감시자를 통해 `inputValue`와 `modelValue`를 동기화하고 `update:modelValue` 및 `change` 이벤트를 발생시킵니다
- 동기 및 비동기 규칙 유효성 검사를 위해 `useInputRules`와 통합됩니다
- 정적 및 규칙 기반 메시지를 표시하기 위해 `useInputMessages`와 통합됩니다
- `useInputForm`을 통해 부모 `VsForm`과 연결하여 폼 수준의 validate/clear를 지원합니다
- prop 값과 폼 수준 오버라이드를 병합하여 `computedDisabled`와 `computedReadonly`를 도출합니다
- prop이 없을 경우 `stringUtil.createID()`로 고유한 요소 `id`를 생성합니다
- 실패 시 시각적 오류 표시와 흔들기 애니메이션을 트리거하는 `validate()` 메서드를 노출합니다

## Basic Usage

```html
<template>
    <vs-input-wrapper :id="computedId" :messages="computedMessages" :state="computedState">
        <input
            :id="computedId"
            v-model="inputValue"
            :disabled="computedDisabled"
            :readonly="computedReadonly"
            :class="{ 'vs-shake': shake }"
        />
    </vs-input-wrapper>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { useInput } from '@/composables';

const props = defineProps({
    modelValue: { type: String, default: '' },
    disabled: Boolean,
    readonly: Boolean,
    rules: { type: Array, default: () => [] },
    messages: { type: Array, default: () => [] },
    id: { type: String, default: '' },
    state: { type: String, default: 'idle' },
});

const emit = defineEmits(['update:modelValue', 'update:valid', 'update:changed', 'change']);
const { modelValue, disabled, readonly, rules, messages, id, state } = toRefs(props);

const inputValue = ref(props.modelValue);

const { computedId, computedDisabled, computedReadonly, computedMessages, computedState, validate, clear, shake } =
    useInput({ emit }, { inputValue, modelValue, disabled, readonly, rules, messages, id, state });
</script>
```

## Args

| 인자          | 타입                      | 기본값 | 필수 | 설명                                              |
| ------------- | ------------------------- | ------ | ---- | ------------------------------------------------- |
| `ctx`         | `{ emit: Function }`      | —      | Yes  | `emit` 함수를 제공하는 컴포넌트 컨텍스트.         |
| `inputParams` | `InputComponentParams<T>` | —      | Yes  | 입력의 반응형 상태와 콜백을 설명하는 객체 (Types 참고). |

## Types

```typescript
interface InputComponentParams<T> {
    inputValue: Ref<T>;
    modelValue: Ref<T | undefined>;
    id?: Ref<string>;
    disabled?: Ref<boolean>;
    readonly?: Ref<boolean>;
    messages?: Ref<Message<T>[]>;
    rules?: Ref<Rule<T>[]>;
    defaultRules?: Ref<Rule<T>[]>;
    noDefaultRules?: Ref<boolean>;
    state?: Ref<UIState>;
    callbacks?: {
        onBeforeMount?: () => void;
        onMounted?: () => void;
        onBeforeUnmount?: () => void;
        onUnmounted?: () => void;
        onChange?: (value: T, oldValue: T) => void;
        onClear?: () => void;
    };
}
```

## Return Refs

| RefType            | 타입                          | 설명                                                                        |
| ------------------ | ----------------------------- | --------------------------------------------------------------------------- |
| `changed`          | `Ref<boolean>`                | 초기화 후 사용자가 값을 변경하면 `true`가 됩니다.                            |
| `valid`            | `ComputedRef<boolean>`        | 활성 규칙 메시지가 없으면 `true`.                                            |
| `shake`            | `Ref<boolean>`                | `validate()` 실패 시마다 토글됩니다 — 흔들기 CSS 클래스에 바인딩하세요.     |
| `computedMessages` | `ComputedRef<StateMessage[]>` | 표시할 정적 및 규칙 메시지의 통합 목록.                                      |
| `showRuleMessages` | `Ref<boolean>`                | 현재 규칙 메시지가 표시되는지 여부.                                          |
| `computedId`       | `ComputedRef<string>`         | 요소 id (prop 값 또는 자동 생성).                                            |
| `computedDisabled` | `ComputedRef<boolean>`        | prop 또는 부모 폼이 입력을 비활성화할 때 `true`.                             |
| `computedReadonly` | `ComputedRef<boolean>`        | prop 또는 부모 폼이 읽기 전용으로 설정할 때 `true`.                          |
| `computedState`    | `ComputedRef<UIState>`        | 규칙 메시지가 표시되고 유효하지 않으면 `'error'`; 그 외에는 prop 상태.      |

## Return Methods

| 메서드     | 파라미터 | 설명                                                                        |
| ---------- | -------- | --------------------------------------------------------------------------- |
| `validate` | —        | 규칙 메시지를 표시하고 유효하지 않으면 `shake`를 토글합니다. 유효하면 `true`를 반환합니다. |
| `clear`    | —        | `onClear` 콜백을 호출하고 메시지/변경 상태를 초기화합니다.                  |

## Hooks

| Hook              | 설명                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| `onBeforeMount`   | 제공된 경우 `callbacks.onBeforeMount`를 호출합니다.                       |
| `onMounted`       | `callbacks.onMounted`를 호출하고, 초기 `checkMessages` / `checkRules`를 실행합니다. |
| `onBeforeUnmount` | 제공된 경우 `callbacks.onBeforeUnmount`를 호출합니다.                     |
| `onUnmounted`     | 제공된 경우 `callbacks.onUnmounted`를 호출합니다.                         |
| `watch`           | 변경 시 `inputValue` ↔ `modelValue`를 동기화하고, 이벤트를 발생시키며 재유효성 검사를 합니다. |

## Cautions

- `inputValue`는 `modelValue`와 별개의 `ref`여야 합니다 — 컴포저블이 내부적으로 동기화를 관리합니다.
- `noDefaultRules`가 `true`가 아닌 한 `defaultRules`는 `rules` 앞에 추가됩니다.
