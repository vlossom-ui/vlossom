> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useColorScheme

**Available Version**: 2.0.0+

Resolves the active color scheme for a component by merging the component-level prop, component-specific global configuration, and the global default — in that priority order.

## Feature

- Merges component `colorScheme` prop with global options from `useOptionsStore`
- Component-specific global setting takes precedence over the global default
- Returns a reactive `computedColorScheme` ref and a ready-to-use `colorSchemeClass` string
- Falls back gracefully to `'default'` when no color scheme is configured

## Basic Usage

```html
<template>
    <div :class="['vs-button', colorSchemeClass]">
        <slot />
    </div>
</template>

<script setup>
import { toRefs } from 'vue';
import { useColorScheme } from '@/composables';

const props = defineProps({
    colorScheme: String,
});

const { colorScheme } = toRefs(props);
const { computedColorScheme, colorSchemeClass } = useColorScheme('VsButton', colorScheme);
</script>
```

## Args

| Arg           | Type                          | Default | Required | Description                                               |
| ------------- | ----------------------------- | ------- | -------- | --------------------------------------------------------- |
| `component`   | `VsComponent \| string`       | —       | Yes      | Component name used to look up the component-specific global color scheme. |
| `colorScheme` | `Ref<ColorScheme \| undefined>` | —     | Yes      | Reactive ref holding the color scheme passed as a prop.   |

## Types

```typescript
type ColorScheme = string; // color scheme identifier e.g. 'blue', 'red'
```

## Return Refs

| RefType               | Type                                     | Description                                                               |
| --------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| `computedColorScheme` | `ComputedRef<ColorScheme \| undefined>`  | The resolved color scheme: prop → component global → default global.      |
| `colorSchemeClass`    | `ComputedRef<string>`                    | CSS class string in the form `vs-cs-{scheme}` (e.g. `vs-cs-blue`).       |

## Return Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions
