> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsForm

A form container component that manages validation state and propagates `disabled`/`readonly` states to all child input components.

**Available Version**: 2.0.0+

## Feature

- Provides a form store context that all child `Vlossom` form inputs can subscribe to
- Centralized `validate()` method to trigger validation across all child inputs
- Centralized `clear()` method to reset all child inputs
- `valid` and `changed` computed properties for form-level state inspection
- Propagates `disabled` and `readonly` states to all child form components
- Renders as a `<form>` element using `VsGrid` internally for responsive layout

## Basic Usage

```html
<template>
    <vs-form ref="formRef" @error="onError">
        <vs-input v-model="name" label="Name" required :grid="{ sm: 12, md: 6 }" />
        <vs-input v-model="email" label="Email" required :grid="{ sm: 12, md: 6 }" />
        <vs-button @click="submit">Submit</vs-button>
    </vs-form>
</template>

<script setup>
import { ref } from 'vue';
const formRef = ref(null);
const name = ref('');
const email = ref('');

async function submit() {
    const isValid = await formRef.value.validate();
    if (isValid) {
        console.log('Form is valid');
    }
}

function onError(invalidIds) {
    console.log('Invalid fields:', invalidIds);
}
</script>
```

### Disabled Form

```html
<template>
    <vs-form :disabled="isDisabled">
        <vs-input v-model="value" label="Read-only field" />
    </vs-form>
</template>

<script setup>
import { ref } from 'vue';
const isDisabled = ref(true);
const value = ref('');
</script>
```

### With Grid Layout

```html
<template>
    <vs-form :grid-size="12" :column-gap="16" :row-gap="8">
        <vs-input v-model="firstName" label="First Name" :grid="6" />
        <vs-input v-model="lastName" label="Last Name" :grid="6" />
    </vs-form>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `gridSize` | `number \| string` | | | Number of grid columns (default: 12) |
| `columnGap` | `number \| string` | | | Gap between grid columns |
| `rowGap` | `number \| string` | | | Gap between grid rows |
| `disabled` | `boolean` | `false` | | Disable all child form inputs |
| `readonly` | `boolean` | `false` | | Make all child form inputs read-only |

## Types

VsForm has no `StyleSet` interface.

### StyleSet Example

VsForm does not use a `styleSet` prop. Use `VsGrid` props (`gridSize`, `columnGap`, `rowGap`) to control layout.

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `error` | `string[]` | Emitted after `validate()` when the form is invalid. Payload contains the ids of invalid fields |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Form content — place Vlossom input components here |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `validate` | - | Triggers validation for all child inputs. Returns `Promise<boolean>` indicating whether the form is valid |
| `clear` | - | Resets all child inputs to their initial state |
| `valid` | - | Computed property (`ComputedRef<boolean>`) — `true` when all child inputs are valid |
| `changed` | - | Computed property (`ComputedRef<boolean>`) — `true` when any child input has been changed |
