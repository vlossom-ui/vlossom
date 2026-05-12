> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useStyleSet

**Available Version**: 2.0.0+

Resolves and merges a component's style-set, then exposes three derived views: the merged object (`componentStyleSet`), a flat CSS custom property map (`styleSetVariables`), and a CSSProperties object for inline `:style` binding (`componentInlineStyle`).

## Style-Set Convention

A `VsXxxStyleSet` interface extends `CSSProperties`. Keys are split by prefix:

- **non-`$` keys** — standard CSS properties, applied to the component's root element (via `componentInlineStyle`).
- **`$X` (primitive)** — CSS variables emitted as `--{component-kebab}-X` (via `styleSetVariables`).
- **`$X` (object)** — slot-/element-level CSSProperties or a nested child StyleSet, accessed via `componentStyleSet.$X`.

```ts
import type { CSSProperties } from 'vue';

export interface VsButtonStyleSet extends CSSProperties {
    $content?: CSSProperties;        // element slot
    $loading?: VsLoadingStyleSet;    // child component
}
```

## Feature

- Resolves a string `styleSet` prop to a registered global style-set via `useOptionsStore`
- Merges three layers in priority order: `baseStyleSet` < `styleSet` (prop) < `additionalStyleSet`
- Converts root-level `$X` primitive entries into CSS custom properties (`--{component-kebab}-X`)
- Returns root-level CSS properties as a ready-to-spread `componentInlineStyle` object
- Returns `componentStyleSet` for direct access to `$X` slots and nested child style-sets

## Basic Usage

```html
<template>
    <button
        :class="['vs-button', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
    >
        <vs-loading v-if="loading" :style-set="componentStyleSet.$loading" />
        <div class="vs-button-content" :style="componentStyleSet.$content">
            <slot />
        </div>
    </button>
</template>

<script setup>
import { toRefs } from 'vue';
import { useStyleSet } from '@/composables';

const props = defineProps({ styleSet: [String, Object] });
const { styleSet } = toRefs(props);

const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet('VsButton', styleSet);
</script>
```

## Args

| Arg                  | Type                                    | Default   | Required | Description                                                                             |
| -------------------- | --------------------------------------- | --------- | -------- | --------------------------------------------------------------------------------------- |
| `component`          | `VsComponent \| string`                 | —         | Yes      | Component name used for CSS variable prefix and global style-set lookup.                |
| `styleSet`           | `Ref<string \| T \| undefined>`         | —         | Yes      | The `styleSet` prop value. A string resolves to a named global style-set.               |
| `baseStyleSet`       | `Ref<Partial<T>>`                       | `ref({})` | No       | Default style-set applied before the user prop (lowest priority).                       |
| `additionalStyleSet` | `Ref<Partial<T>>`                       | `ref({})` | No       | Dynamic overrides derived from other component props (highest priority).                |

## Types

```typescript
// The generic T must extend { [key: string]: any }
// Common StyleSet structure (extends CSSProperties at root):
interface ExampleStyleSet extends CSSProperties {
    $primitiveVar?: string;         // becomes --vs-example-primitiveVar
    $element?: CSSProperties;       // slot/element style
    $childComponent?: ChildStyleSet; // nested child style-set
}
```

## Return Refs

| RefType                | Type                                  | Description                                                                                                |
| ---------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `componentStyleSet`    | `ComputedRef<Partial<T>>`             | Fully merged style-set object. Use it to access `$X` slot keys or nested child style-sets.                 |
| `styleSetVariables`    | `ComputedRef<Record<string, string>>` | Flat map of CSS custom properties derived from root-level `$X` primitive entries.                          |
| `componentInlineStyle` | `ComputedRef<CSSProperties>`          | Inline CSSProperties derived from non-`$` root-level keys. Spread into the root element's `:style` prop.   |

## Return Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions

- Only **root-level** `$X` primitive keys are converted to CSS custom properties. `$X` object values are exposed via `componentStyleSet` for direct binding (`:style` / `:style-set`).
- `componentInlineStyle` only collects **root-level** non-`$` keys. Nested CSSProperties (e.g. `componentStyleSet.$content`) must be bound on the corresponding element/slot manually.
- `objectUtil.shake` is applied to `baseStyleSet` and `additionalStyleSet` before merging, removing `undefined` and empty values.
- When forwarding an already-merged style-set to a child component (e.g. `VsSelectTrigger` receiving `componentStyleSet` from `VsSelect`), call `useStyleSet` again on that prop to re-derive `componentInlineStyle` — no extra helper is needed.
