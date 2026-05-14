# Vlossom Style-Set System Guidelines

> Type-safe interface for component style customization

**Version**: 2.0.0+

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Implementation](#implementation)
4. [Design Rules](#design-rules)
5. [FAQ](#faq)
6. [Anti-patterns](#anti-patterns)

---

## Overview

All components can be customized via the `styleSet` prop. `VsXxxStyleSet` interfaces **extend `CSSProperties`** and use the `$` prefix to distinguish CSS variables, slot/element styles, and nested child style-sets from standard root CSS.

```vue
<vs-button
  :style-set="{
    padding: '1rem 2rem',          // root CSS → inline style on the button
    backgroundColor: 'tomato',
    $content: { fontWeight: 600 }, // slot style
    $loading: { $barColor: '#fff' } // nested child style-set
  }"
>
  Click
</vs-button>
```

---

## Core Concepts

### 1. Key Convention

`VsXxxStyleSet extends CSSProperties` — keys are split by `$` prefix.

| Key form | Meaning | Where it is applied |
|----------|---------|---------------------|
| `width`, `padding`, ... (non-`$`) | Standard CSS — applied as inline style on the component's root | `componentInlineStyle` |
| `$X` (primitive: string/number) | Exposed as a CSS variable `--vs-{kebab-component}-X` | `styleSetVariables` |
| `$X` (object) | Slot/element CSSProperties **or** nested child StyleSet | `componentStyleSet.$X` |

```typescript
import type { CSSProperties } from 'vue';

export interface VsButtonStyleSet extends CSSProperties {
    $padding?: string;            // CSS variable: --vs-button-padding
    $content?: CSSProperties;     // slot/element style
    $loading?: VsLoadingStyleSet; // nested child style-set
}
```

> 💡 Because root CSS lives on `extends CSSProperties` and customization points live under `$X`, there are no key collisions and no need for a wrapper key like `component?: CSSProperties`.

### 2. Merge System

```
baseStyleSet < styleSet (prop) < additionalStyleSet
```

| Stage                  | Role                                | Set By    |
| ---------------------- | ----------------------------------- | --------- |
| `baseStyleSet`         | Internal defaults                   | Component |
| `styleSet`             | User customization                  | User      |
| `additionalStyleSet`   | Runtime override (from other props) | Component |

```typescript
const { componentStyleSet, styleSetVariables, componentInlineStyle } =
    useStyleSet<VsButtonStyleSet>(
        VsComponent.VsButton,
        styleSet,
        baseStyleSet,        // optional, lowest priority
        additionalStyleSet,  // optional, highest priority
    );
```

`useStyleSet` returns three views:

- `componentStyleSet` — fully merged object. Access `$X` slots / child style-sets here.
- `styleSetVariables` — flat map of CSS custom properties derived from root-level `$X` primitives.
- `componentInlineStyle` — `CSSProperties` derived from root-level non-`$` keys. Spread into the root element's `:style`.

### 3. Global StyleSet (VlossomOptions)

```typescript
// main.ts
app.use(
  createVlossom({
    styleSet: {
      primary: {
        'vs-button': { $padding: '1rem 2rem', backgroundColor: 'tomato' },
        'vs-input': { $height: '3rem' },
      },
    },
  })
);
```

```vue
<vs-button style-set="primary">Click</vs-button>
<!-- Named global style-set + per-instance override -->
<vs-button style-set="primary" :style-set="{ color: 'red' }">Click</vs-button>
```

---

## Implementation

### 1. Type Definition

```typescript
import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { VsLoadingStyleSet } from '@/components/vs-loading/types';
import type VsButton from './VsButton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsButton: typeof VsButton;
    }
}

export type { VsButton };

export interface VsButtonRef extends ComponentPublicInstance<typeof VsButton> {}

export interface VsButtonStyleSet extends CSSProperties {
    $content?: CSSProperties;
    $loading?: VsLoadingStyleSet;
}
```

> No wrapper key like `component?: CSSProperties` — root standard CSS is already exposed through `extends CSSProperties`.

### 2. Component Setup

```typescript
import { computed, defineComponent, ref, toRefs, type ComputedRef, type Ref } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { objectUtil } from '@/utils';
import type { VsButtonStyleSet } from './types';

const componentName = VsComponent.VsButton;

export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsButtonStyleSet>(),
        // ... other props
    },
    setup(props) {
        const { colorScheme, styleSet, primary } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        // Internal defaults (low priority). `ref` is preferred when truly constant;
        // `computed` is fine when defaults depend on other props.
        const baseStyleSet: ComputedRef<VsButtonStyleSet> = computed(() => ({
            $loading: {
                $barColor: primary.value ? 'var(--vs-cs-font-primary)' : undefined,
                width: '30%',
                height: '60%',
            },
        }));

        const { componentStyleSet, styleSetVariables, componentInlineStyle } =
            useStyleSet<VsButtonStyleSet>(componentName, styleSet, baseStyleSet);

        return {
            colorSchemeClass,
            styleSetVariables,
            componentInlineStyle,
            componentStyleSet,
        };
    },
});
```

### 3. Template Application

```vue
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
```

Three rules:
1. **Root element**: spread `{ ...styleSetVariables, ...componentInlineStyle }`.
2. **Slot/element**: bind `componentStyleSet.$X` to `:style` (CSSProperties).
3. **Child component**: forward `componentStyleSet.$X` to `:style-set` (nested StyleSet).

### 4. CSS Implementation

Only declare CSS variables for `$X` primitives that the `.css` actually consumes — typically because they feed into `calc()`, pseudo-elements, or state-based selectors. Provide a sensible fallback so the component still looks right when the variable is not set.

```css
.vs-button {
    --vs-button-padding: initial;

    background-color: var(--vs-comp-bg);
    border: 1px solid var(--vs-line-color);
    border-radius: calc(var(--vs-radius-ratio) * var(--vs-radius-md));
    padding: var(--vs-button-padding, 0.75rem 1.5rem);
    color: var(--vs-comp-font);
}
```

**Naming**: `--vs-{component-kebab}-{property}`. Property name keeps the camelCase form from TypeScript (e.g. `--vs-accordion-arrowColor`).

### 5. Forwarding a merged StyleSet to a child

When the parent already merged its style-set and the child re-uses the same generic (e.g. `VsSelectTrigger` inside `VsSelect`), call `useStyleSet` again in the child to re-derive `componentInlineStyle` for its root:

```typescript
// VsSelectTrigger.vue
const { componentInlineStyle } = useStyleSet<VsSelectStyleSet>(VsComponent.VsSelect, styleSet);
```

---

## Design Rules

### When to expose a `$X` CSS variable (all four must apply)

- [ ] **Frequency** — users will actually customize it often.
- [ ] **CSS-driven** — the `.css` uses the variable in `calc()`, pseudo-elements, or state selectors.
- [ ] **Reuse** — the value participates in more than one declaration or element.
- [ ] **Clear meaning** — the name maps to one well-defined property.

If even one criterion fails, **don't** expose it as `$X`. Common cases that should stay as root CSS (non-`$`):

- `width`, `height`, `padding`, `margin`, `boxShadow`, `backgroundColor`
- Any one-off override the user might set ad-hoc

These are already covered by `extends CSSProperties`, so the user can pass them directly without us defining a key.

### ColorScheme owns base theme colors

`var(--vs-comp-bg)`, `var(--vs-comp-font)` etc. are driven by ColorScheme. Don't expose `$backgroundColor` / `$fontColor`. If a user wants to override on a single instance, they can still pass `backgroundColor` / `color` via root CSSProperties.

### Naming

| Concept | Rule | Example |
|---------|------|---------|
| Slot/element | content-based, camelCase | `$content`, `$title`, `$label` |
| State modifier | nested under the element it modifies | `$step.$active`, `$option.$selected` |
| Child style-set | name matches the conceptual role | `$loading`, `$chip`, `$wrapper` |

Don't write `$activeStep` / `$stepActive` at the top level. Place state under the element:

```typescript
// ✅ nested-state
$step?: CSSProperties & {
    $active?: CSSProperties;
};

// ❌ flattened with prefix/suffix
$step?: CSSProperties;
$activeStep?: CSSProperties;
```

Apply states in the component with a merge:

```ts
const stepStyle = computed(() => ({
    ...componentStyleSet.value.$step,
    ...(isActive.value ? componentStyleSet.value.$step?.$active : {}),
}));
```

### Type-safe CSS values

For constrained CSS properties, index `CSSProperties` instead of `string`:

```typescript
$objectFit?: CSSProperties['objectFit'] & {}; // & {} keeps autocomplete
```

### Nesting depth

Two levels are the practical limit: `$X` → `$state` or `$X` → child `StyleSet`. Anything deeper is a smell.

### Form components

Form components that compose `VsInputWrapper` should include `$wrapper?: VsInputWrapperStyleSet` so users can style label/messages through the same prop.

---

## FAQ

**Q. When should I use root CSSProperties vs `$X` primitive?**
A. Default to root CSSProperties — it's free via `extends CSSProperties`. Promote a property to `$X` only when the `.css` truly needs the value (pseudo-elements, calc, state selectors).

**Q. `baseStyleSet` vs `additionalStyleSet`?**
A. `baseStyleSet` carries fixed internal defaults (lowest priority). `additionalStyleSet` carries values derived from *other* props at runtime (highest priority — overrides the user's `styleSet`). Use `additionalStyleSet` sparingly; usually props should not silently override user styling.

**Q. Why is there no wrapper `component?: CSSProperties` key anymore?**
A. Because `VsXxxStyleSet extends CSSProperties` already exposes the root surface. Adding a wrapper would duplicate it and create two ways to say the same thing.

**Q. `ref` vs `computed` for `baseStyleSet`?**
A. `ref({...})` if the defaults are constant, `computed(() => ({...}))` if they react to other props. Both work; `ref` skips the reactivity overhead.

**Q. Where do I document the StyleSet for users?**
A. In the component's `README.md` under the **Types** section — copy the interface verbatim from `types.ts`.

---

## Anti-patterns

```typescript
// ❌ Wrapper key — root CSSProperties is already inherited
export interface VsButtonStyleSet extends CSSProperties {
    component?: CSSProperties;
}

// ❌ Old `variables?: {}` / `component?: CSSProperties` shape
export interface VsButtonStyleSet {
    variables?: { padding?: string };
    component?: CSSProperties;
}

// ❌ Exposing theme colors that ColorScheme already owns
$backgroundColor?: string;
$fontColor?: string;

// ❌ Flattened state modifier
$step?: CSSProperties;
$activeStep?: CSSProperties;

// ❌ Three-level nesting
$X?: { $Y?: { $Z?: CSSProperties } };

// ❌ Vague group name
$styles?: CSSProperties;
$config?: CSSProperties;
```

```css
/* ❌ Every property as a variable */
.vs-button {
    --vs-button-backgroundColor: initial;
    --vs-button-border: initial;
    --vs-button-borderRadius: initial;
    background-color: var(--vs-button-backgroundColor, var(--vs-comp-bg));
    border: var(--vs-button-border, 1px solid var(--vs-line-color));
}

/* ✅ Only what the CSS truly needs */
.vs-button {
    --vs-button-padding: initial;
    background-color: var(--vs-comp-bg);
    border: 1px solid var(--vs-line-color);
    padding: var(--vs-button-padding, 0.75rem 1.5rem);
}
```

---

## Reference

- [`useStyleSet`](../packages/vlossom/src/composables/style-set/README.md)
- Examples: [`VsButton`](../packages/vlossom/src/components/vs-button/), [`VsSelect`](../packages/vlossom/src/components/vs-select/), [`VsAccordion`](../packages/vlossom/src/components/vs-accordion/)

---

**Questions?** Create an issue or contact the team.
