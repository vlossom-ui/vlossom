> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useInputForm

**Available Version**: 2.0.0+

Connects an individual input component to the nearest parent `VsForm` via Vue's provide/inject mechanism, enabling form-level validation, clearing, and state synchronization.

## Feature

- Injects the parent form store using `FORM_STORE_KEY`; falls back to a no-op default store when no form is present
- Automatically registers and removes the input from the form on mount/unmount and id changes
- Watches the form's `validateFlag` and `clearFlag` to trigger the input's own `validate` and `clear` functions
- Propagates `valid` and `changed` state changes up to the form store
- Exposes form-driven `formDisabled` and `formReadonly` refs

## Basic Usage

```html
<script setup>
import { ref, computed } from 'vue';
import { useInputForm } from '@/composables';

// Typically used internally by useInput
const id = computed(() => 'my-input-id');
const valid = ref(true);
const changed = ref(false);

function validate() { return valid.value; }
function clear() { changed.value = false; }

const { formDisabled, formReadonly } = useInputForm(id, valid, changed, validate, clear);
</script>
```

## Args

| Arg        | Type               | Default | Required | Description                                                          |
| ---------- | ------------------ | ------- | -------- | -------------------------------------------------------------------- |
| `id`       | `Ref<string>`      | —       | Yes      | Reactive ref holding the input's unique id used to register in the form. |
| `valid`    | `Ref<boolean>`     | —       | Yes      | Reactive validity state of the input.                                |
| `changed`  | `Ref<boolean>`     | —       | Yes      | Reactive ref indicating whether the user has changed the value.      |
| `validate` | `() => boolean`    | —       | Yes      | Validation function called when the form triggers validation.        |
| `clear`    | `() => void`       | —       | Yes      | Clear function called when the form triggers a clear.                |

## Types

No additional exported types.

## Return Refs

| RefType        | Type           | Description                                                        |
| -------------- | -------------- | ------------------------------------------------------------------ |
| `formDisabled` | `Ref<boolean>` | `true` when the parent form sets all inputs to disabled.           |
| `formReadonly` | `Ref<boolean>` | `true` when the parent form sets all inputs to readonly.           |

## Return Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Hooks

| Hook              | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `onMounted`       | Registers the input's current `changed` and `valid` state with the form.    |
| `onBeforeUnmount` | Removes the input from the form store.                                      |
| `watch`           | Watches `changed`, `valid`, `validateFlag`, `clearFlag`, and `id` to keep the form store in sync. |

## Cautions

- This composable is intended to be used inside `useInput`. Using it standalone requires a compatible form store to be provided.
- When `id` changes, the old id is removed from the form and the new id is registered automatically.
