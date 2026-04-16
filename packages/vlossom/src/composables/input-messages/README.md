> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useInputMessages

**Available Version**: 2.0.0+

Evaluates static and function-based messages for an input value and combines them with rule messages into a single reactive list.

## Feature

- Supports static `StateMessage` objects and synchronous/asynchronous message functions
- Resolves all pending async message functions in parallel with `Promise.all`
- Toggles rule message visibility via the `showRuleMessages` ref
- Re-evaluates messages reactively whenever the `messages` array changes

## Basic Usage

```html
<script setup>
import { ref } from 'vue';
import { useInputMessages } from '@/composables';

const inputValue = ref('');
const messages = ref([
    { state: 'info', text: 'Enter your username.' },
    (val) => val.length > 10 ? { state: 'warning', text: 'Too long' } : null,
]);
const ruleMessages = ref([]);

const { computedMessages, showRuleMessages, checkMessages } = useInputMessages(inputValue, messages, ruleMessages);
</script>
```

## Args

| Arg            | Type                       | Default | Required | Description                                                              |
| -------------- | -------------------------- | ------- | -------- | ------------------------------------------------------------------------ |
| `inputValue`   | `Ref<T>`                   | —       | Yes      | The current input value passed to function-based messages.               |
| `messages`     | `Ref<Message<T>[]>`        | —       | Yes      | Array of static `StateMessage` objects or functions returning a `StateMessage`. |
| `ruleMessages` | `Ref<StateMessage[]>`      | —       | Yes      | Array of messages produced by validation rules (from `useInputRules`).   |

## Types

```typescript
type Message<T> = StateMessage | ((value: T) => StateMessage | Promise<StateMessage>);

interface StateMessage {
    state: UIState;
    text: string;
}
```

## Return Refs

| RefType            | Type                          | Description                                                                           |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------------------- |
| `showRuleMessages` | `Ref<boolean>`                | When `true`, `ruleMessages` are appended to `computedMessages`.                       |
| `computedMessages` | `ComputedRef<StateMessage[]>` | Combined list: static/function messages plus rule messages when `showRuleMessages` is `true`. |

## Return Methods

| Method          | Parameters | Description                                                                      |
| --------------- | ---------- | -------------------------------------------------------------------------------- |
| `checkMessages` | —          | Re-evaluates all messages against the current `inputValue` and updates the list. |

## Hooks

| Hook    | Description                                         |
| ------- | --------------------------------------------------- |
| `watch` | Watches `messages` deeply and re-runs `checkMessages`. |

## Cautions
