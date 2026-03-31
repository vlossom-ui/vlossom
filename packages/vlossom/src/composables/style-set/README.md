> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useStyleSet

**Available Version**: 2.0.0+

Resolves, merges, and transforms a component's style-set into both a typed `componentStyleSet` object and a flat `styleSetVariables` CSS custom property map.

## Feature

- Resolves a string `styleSet` prop to a registered global style-set via `useOptionsStore`
- Merges three layers in priority order: `baseStyleSet` < `styleSet` (prop) < `additionalStyleSet`
- Converts `variables` entries into CSS custom property names (`--{component-kebab}-{key}`) for use in `:style` bindings
- Supports one level of nested variable objects (`variables.group.property`) — generates `--{component}-{group}-{property}`
- Returns `componentStyleSet` for direct CSSProperties binding on elements and sub-component `:style-set` props

## Basic Usage

```html
<template>
    <button
        :class="['vs-button', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
    >
        <vs-loading v-if="loading" :style-set="componentStyleSet.loading" />
        <slot />
    </button>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { useStyleSet } from '@/composables';

const props = defineProps({ styleSet: [String, Object] });
const { styleSet } = toRefs(props);

const { componentStyleSet, styleSetVariables } = useStyleSet('VsButton', styleSet);
</script>
```

## Args

| Arg                 | Type                                    | Default   | Required | Description                                                                             |
| ------------------- | --------------------------------------- | --------- | -------- | --------------------------------------------------------------------------------------- |
| `component`         | `VsComponent \| string`                 | —         | Yes      | Component name used for CSS variable prefix and global style-set lookup.                |
| `styleSet`          | `Ref<string \| T \| undefined>`         | —         | Yes      | The `styleSet` prop value. A string resolves to a named global style-set.               |
| `baseStyleSet`      | `Ref<Partial<T>>`                       | `ref({})` | No       | Default style-set applied before the user prop (lowest priority).                       |
| `additionalStyleSet`| `Ref<Partial<T>>`                       | `ref({})` | No       | Dynamic overrides derived from other component props (highest priority).                |

## Types

```typescript
// The generic T must extend { [key: string]: any }
// Common StyleSet structure:
interface ExampleStyleSet {
    variables?: {
        propertyName?: string;
        groupName?: {
            nestedProperty?: string;
        };
    };
    component?: CSSProperties;
    childComponent?: ChildStyleSet;
}
```

## Return Refs

| RefType              | Type                              | Description                                                                          |
| -------------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| `componentStyleSet`  | `ComputedRef<Partial<T>>`         | Merged style-set object. Access `.component`, `.variables`, or sub-component keys.   |
| `styleSetVariables`  | `ComputedRef<Record<string, string>>` | Flat map of CSS custom properties derived from `componentStyleSet.value.variables`.  |

## Return Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions

- Only the `variables` key of the style-set is transformed into CSS custom properties. Other keys (e.g. `component`, `loading`) must be spread or passed directly as `:style` / `:style-set`.
- Deeply nested `variables` objects (more than one level) are not converted to CSS properties.
- `objectUtil.shake` is applied to `baseStyleSet` and `additionalStyleSet` before merging, removing `undefined` and empty values.
