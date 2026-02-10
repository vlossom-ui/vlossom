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

---

## Overview

All components can be customized via the `styleSet` prop.

```vue
<vs-button
  :style-set="{
    variables: { padding: '2rem' },
    component: { backgroundColor: 'red' },
  }"
>
  Click
</vs-button>
```

---

## Core Concepts

### 1. Merge System

```
baseStyleSet < styleSet < additionalStyleSet
```

| Stage                        | Role               | Set By    |
| ---------------------------- | ------------------ | --------- |
| baseStyleSet (optional)      | Internal defaults  | Component |
| styleSet                     | User customization | User      |
| additionalStyleSet (optional) | Runtime override   | Component |

```typescript
const { componentStyleSet, styleSetVariables } = useStyleSet(
  'vs-button',
  styleSet,
  baseStyleSet,
  additionalStyleSet
);
```

### 2. Style Control Methods

#### variables (CSS Variables)

```typescript
variables?: {
  padding?: string;  // --vs-button-padding
  focused?: { border?: string; };  // --vs-button-focused-border
}
```

**Use for**: pseudo-elements, calc calculations, state changes, animations

#### CSSProperties (Direct Styles)

```typescript
component?: CSSProperties;
elementName?: CSSProperties;
```

**Use for**: one-time settings, theme tokens, independent element control

### 3. Global StyleSet (VlossomOptions)

```typescript
// main.ts
app.use(
  createVlossom({
    components: {
      /* ... */
    },
    styleSet: {
      primary: {
        'vs-button': { variables: { padding: '1rem 2rem' } },
        'vs-input': { variables: { height: '3rem' } },
      },
    },
  })
);
```

```vue
<vs-button style-set="primary">Click</vs-button>
<vs-button style-set="primary" :style-set="{ component: { color: 'red' } }">
Click
</vs-button>
```

---

## Implementation

### 1. Type Definition

```typescript
// types.ts
export interface VsButtonStyleSet {
  variables?: { padding?: string };
  component?: CSSProperties;
  loading?: VsLoadingStyleSet;
}
```

### 2. Component Setup

```typescript
export default defineComponent({
  props: {
    ...getColorSchemeProps(),
    ...getStyleSetProps<VsButtonStyleSet>(),
  },
  setup(props) {
    const { styleSet } = toRefs(props);
    const baseStyleSet = computed(() => ({
      loading: { component: { width: '30%' } },
    }));

    const { componentStyleSet, styleSetVariables } = useStyleSet(
      'vs-button',
      styleSet,
      baseStyleSet
    );

    return { styleSetVariables, componentStyleSet };
  },
});
```

### 3. Template Application

```vue
<button :style="{ ...styleSetVariables, ...componentStyleSet.component }">
  <vs-loading :style-set="componentStyleSet.loading" />
  <div :style="componentStyleSet.content"><slot /></div>
</button>
```

### 4. CSS Implementation

```css
.vs-button {
  --vs-button-padding: initial;
  padding: var(--vs-button-padding, 0.75rem 1.5rem);
}
```

**Naming**: `--[component]-[property]`, `--[component]-[group]-[property]`

---

## Design Rules

### Variables Exposure Criteria

#### ✅ Expose as Variables

- Inaccessible by CSS pseudo-elements (::before, ::after)
- Required for dynamic calculations (calc, etc.)
- Frequently changes with state (hover, focus, checked)
- Linked to animations

#### ❌ Control via CSSProperties

- Values that are set once and don't change
- Properties sufficiently handled by global theme tokens
- Independent control per element

### Nesting Depth

Maximum 2 levels allowed

### Naming Convention

| Type           | Rule                | Example                       |
| -------------- | ------------------- | ----------------------------- |
| Basic element  | camelCase           | `component`, `content`        |
| State element  | state + ElementName | `activeTab`, `selectedOption` |
| Nested element | camelCase           | `loading`, `chip`             |

---

## FAQ

**Q. When to use variables vs component?**
A. Use variables for frequent changes, component for one-time settings

**Q. baseStyleSet vs additionalStyleSet?**
A. baseStyleSet for internal defaults, additionalStyleSet for prop-based overrides

**Q. Why only 2 levels of nesting?**
A. CSS variable name length, useStyleSet support scope, practical sufficiency

**Q. Global styleSet priority?**
A. Individual styleSet takes priority over global, deep merge supported

**Q. Can variables be omitted?**
A. When CSSProperties is sufficient or customization points are unclear

**Q. When to use global styleSet?**
A. When reusing design system presets across multiple components

---

## Anti-patterns

```typescript
// ❌ Overusing Variables
variables?: { width?: string; height?: string; backgroundColor?: string; }

// ✅ Only what's dynamically needed
variables?: { padding?: string; };
component?: CSSProperties;

// ❌ 3-level nesting
variables?: { container?: { inner?: { padding?: string; }; }; }

// ✅ Maximum 2 levels
variables?: { focused?: { border?: string; }; }
```

---

## Reference

**Core**: [useStyleSet](../packages/vlossom/src/composables/style-set-composable.ts), [VlossomOptions](../packages/vlossom/src/declaration/types.ts)

**Examples**: [VsButton](../packages/vlossom/src/components/vs-button/), [VsSwitch](../packages/vlossom/src/components/vs-switch/), [VsSelect](../packages/vlossom/src/components/vs-select/)

---

**Questions?** Create an issue or contact the team
