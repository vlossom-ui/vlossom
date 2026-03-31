> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useInputRules

**Available Version**: 2.0.0+

Evaluates an array of synchronous and asynchronous validation rules against the current input value, collecting error messages into a reactive list.

## Feature

- Combines `defaultRules` and `rules`, with `defaultRules` prepended unless `noDefaultRules` is `true`
- Supports synchronous rules returning a string error message or falsy value
- Supports asynchronous rules returning `Promise<string>`
- Re-runs validation automatically whenever the computed rule list changes

## Basic Usage

```html
<script setup>
import { ref } from 'vue';
import { useInputRules } from '@/composables';

const inputValue = ref('');
const rules = ref([
    (val) => val.length >= 3 || 'Minimum 3 characters required',
    async (val) => {
        const taken = await checkIfUsernameTaken(val);
        return taken ? 'Username already taken' : '';
    },
]);
const defaultRules = ref([]);
const noDefaultRules = ref(false);

const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
</script>
```

## Args

| Arg              | Type                  | Default | Required | Description                                                              |
| ---------------- | --------------------- | ------- | -------- | ------------------------------------------------------------------------ |
| `inputValue`     | `Ref<T>`              | —       | Yes      | The current input value passed to each rule function.                    |
| `rules`          | `Ref<Rule<T>[]>`      | —       | Yes      | User-supplied validation rules.                                          |
| `defaultRules`   | `Ref<Rule<T>[]>`      | —       | Yes      | Built-in rules provided by the component (e.g. required, type checks).   |
| `noDefaultRules` | `Ref<boolean>`        | —       | Yes      | When `true`, only `rules` are applied; `defaultRules` are ignored.       |

## Types

```typescript
type Rule<T> = (value: T) => string | false | null | undefined | Promise<string>;

interface StateMessage {
    state: 'error';
    text: string;
}
```

## Return Refs

| RefType        | Type                    | Description                                               |
| -------------- | ----------------------- | --------------------------------------------------------- |
| `ruleMessages` | `Ref<StateMessage[]>`   | List of error messages produced by failing rules.         |

## Return Methods

| Method       | Parameters | Description                                                                             |
| ------------ | ---------- | --------------------------------------------------------------------------------------- |
| `checkRules` | —          | Runs all computed rules against `inputValue` and updates `ruleMessages` synchronously or after async resolution. |

## Hooks

| Hook    | Description                                                              |
| ------- | ------------------------------------------------------------------------ |
| `watch` | Watches `computedRules` deeply and re-runs `checkRules` on any change.   |

## Cautions

- A rule should return a non-empty string to indicate an error. A falsy return value (`false`, `null`, `undefined`, empty string) means the rule passed.
- Async rules are resolved with `Promise.all` after all synchronous rules are processed.
