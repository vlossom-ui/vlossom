> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useSizeClass

**Available Version**: 2.0.0+

Converts a reactive `Size` value into the corresponding CSS class string for component size styling.

## Feature

- Produces `vs-{size}` class names (e.g. `vs-md`, `vs-lg`) from a reactive `Size` ref
- Returns an empty string when the size ref is `undefined`, so it can be dropped into class bindings safely
- Centralizes the size-class pattern shared across components like `VsButton`, `VsChip`, `VsAccordion`, etc.

## Basic Usage

```html
<template>
    <div :class="['vs-button', classObj]">
        <slot />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useSizeClass } from '@/composables';

const size = ref('md');
const { sizeClass } = useSizeClass(size);

const classObj = computed(() => ({
    [sizeClass.value]: !!sizeClass.value,
}));
</script>
```

## Args

| Arg    | Type                     | Default | Required | Description                                            |
| ------ | ------------------------ | ------- | -------- | ------------------------------------------------------ |
| `size` | `Ref<Size \| undefined>` | —       | Yes      | Reactive ref holding the current size of the component. |

## Types

```typescript
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

## Return Refs

| RefType     | Type                  | Description                                                                |
| ----------- | --------------------- | -------------------------------------------------------------------------- |
| `sizeClass` | `ComputedRef<string>` | `vs-{size}` when a size is provided, otherwise an empty string.            |

## Return Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions
