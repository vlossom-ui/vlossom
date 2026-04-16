> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useInput

**Available Version**: 2.0.0+

Central composable for form input components. Orchestrates validation rules, user-facing messages, form integration, disabled/readonly states, and lifecycle callbacks in a single call.

## Feature

- Synchronizes `inputValue` with `modelValue` via a two-way watcher and emits `update:modelValue` and `change`
- Integrates with `useInputRules` for synchronous and asynchronous rule validation
- Integrates with `useInputMessages` to display static and rule-derived messages
- Connects to a parent `VsForm` through `useInputForm` to support form-level validate/clear
- Derives `computedDisabled` and `computedReadonly` by merging prop values with form-level overrides
- Generates a unique element `id` via `stringUtil.createID()` when none is provided
- Exposes a `validate()` method that triggers visual error display and a shake animation on failure

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

| Arg           | Type                      | Default | Required | Description                                 |
| ------------- | ------------------------- | ------- | -------- | ------------------------------------------- |
| `ctx`         | `{ emit: Function }`      | —       | Yes      | Component context providing the `emit` function. |
| `inputParams` | `InputComponentParams<T>` | —       | Yes      | Object describing the input's reactive state and callbacks (see Types). |

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

| RefType           | Type                        | Description                                                                    |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------ |
| `changed`         | `Ref<boolean>`              | `true` once the user has changed the value after initialization.               |
| `valid`           | `ComputedRef<boolean>`      | `true` when there are no active rule messages.                                 |
| `shake`           | `Ref<boolean>`              | Toggled each time `validate()` fails — bind to a shake CSS class.              |
| `computedMessages`| `ComputedRef<StateMessage[]>` | Combined list of static and rule messages to display.                        |
| `showRuleMessages`| `Ref<boolean>`              | Whether rule messages are currently visible.                                   |
| `computedId`      | `ComputedRef<string>`       | The element id (prop value or auto-generated).                                 |
| `computedDisabled`| `ComputedRef<boolean>`      | `true` when the prop or the parent form disables the input.                    |
| `computedReadonly`| `ComputedRef<boolean>`      | `true` when the prop or the parent form sets readonly.                         |
| `computedState`   | `ComputedRef<UIState>`      | `'error'` when rule messages are visible and invalid; otherwise the prop state.|

## Return Methods

| Method     | Parameters | Description                                                                 |
| ---------- | ---------- | --------------------------------------------------------------------------- |
| `validate` | —          | Shows rule messages and toggles `shake` if invalid. Returns `true` if valid.|
| `clear`    | —          | Invokes the `onClear` callback and resets message/changed state.            |

## Hooks

| Hook              | Description                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| `onBeforeMount`   | Calls `callbacks.onBeforeMount` if provided.                                 |
| `onMounted`       | Calls `callbacks.onMounted`, runs initial `checkMessages` / `checkRules`.    |
| `onBeforeUnmount` | Calls `callbacks.onBeforeUnmount` if provided.                               |
| `onUnmounted`     | Calls `callbacks.onUnmounted` if provided.                                   |
| `watch`           | Syncs `inputValue` ↔ `modelValue`, emits events, and re-validates on change. |

## Cautions

- `inputValue` must be a separate `ref` from `modelValue` — the composable manages the sync internally.
- `defaultRules` are prepended to `rules` unless `noDefaultRules` is `true`.
