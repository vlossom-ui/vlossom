> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useStateClass

**Available Version**: 2.0.0+

Converts a reactive `UIState` value into the corresponding CSS class objects for component state styling.

## Feature

- Detects non-idle states (`info`, `success`, `error`, `warning`) via the `isStated` computed ref
- Returns `stateClasses` with `vs-stated` and `vs-state-{state}` for component-level state styling
- Returns `stateBoxClasses` with an additional `vs-state-box` class for wrapper/box-level state styling
- Both class objects are empty when the state is `'idle'`

## Basic Usage

```html
<template>
    <div :class="['vs-input', stateClasses]">
        <input v-model="value" />
    </div>
    <div :class="['vs-input-box', stateBoxClasses]">
        <!-- wrapper with state box styling -->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStateClass } from '@/composables';

const state = ref('error');
const { isStated, stateClasses, stateBoxClasses } = useStateClass(state);
</script>
```

## Args

| Arg     | Type           | Default | Required | Description                                                |
| ------- | -------------- | ------- | -------- | ---------------------------------------------------------- |
| `state` | `Ref<UIState>` | —       | Yes      | Reactive ref holding the current UI state of the component.|

## Types

```typescript
type UIState = 'idle' | 'info' | 'success' | 'warning' | 'error';
```

## Return Refs

| RefType          | Type                             | Description                                                                         |
| ---------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| `isStated`       | `ComputedRef<boolean>`           | `true` when the state is one of `info`, `success`, `error`, `warning`.             |
| `stateClasses`   | `ComputedRef<Record<string, boolean>>` | Class object with `vs-stated` and `vs-state-{state}` when stated, empty otherwise. |
| `stateBoxClasses`| `ComputedRef<Record<string, boolean>>` | Extends `stateClasses` with `vs-state-box`. Empty when state is `'idle'`.          |

## Return Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions
