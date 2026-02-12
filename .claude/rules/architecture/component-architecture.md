# Optional: Scope this rule to specific files

## Rules

- • Pass default styleSet via getStyleSetProps() parameter instead of computed
- • Centralizes default values at prop definition level

- • Replace custom layout with VsInnerScroll component delegation
- • Move title/content styles to layout property in styleSet
- • Trade-off: lose responsive styling for simpler component structure

- • Accept component structure split even though styling complications exist
- • Acknowledge trade-off between ideal structure and styling constraints

- • Spread componentStyleSet.component into style binding for extensibility
- • Anticipates future specification changes by standardizing pattern early
- • Applied consistently across all components despite current limited use

- • Consider adding layout property to allow content overflow/breaking
- • Follow VsBlock pattern for consistent layout manipulation across components

- • Prefer keeping related style properties in content section over variables
- • Maintain consistency with existing component patterns like VsInnerScrollStyleSet

- • Encapsulate drawer styles in variables object rather than interface extension
- • Avoid exposing customization that won't be used in practice

- • Flat `component?: CSSProperties` is simpler than nested `variables` object
- • Props are overridden by additionalStyleSet anyway, making nesting unnecessary

- • Padding currently split between placeholder and files, consolidate upward
- • Remove variables wrapper by moving style properties to component level
- • Simplifies style structure by reducing nesting depth

- • Prefer semantic properties (bar, value, label) over generic 'component'
- • Use 'variables' only when semantic split doesn't cover all cases
- • Structure reflects actual UI elements for better maintainability

- • Don't extract properties that weren't important in original implementation
- • Delegate style-related logic to specialized style components

- • Extend parent StyleSet when child component wraps parent as root element
- • Avoid nested 'input?' property if no custom variables needed beyond parent

- • Width configuration moved from component interface to style variables
- • Reviewer unclear on rationale for width in StyleSet vs component props

- • Remove width/border from VsBlockStyleSet since component exists
- • Add component to vs-accordion for consistency
- • Keep variables structure, remove direct style props for components

- • Separate image-specific styles from component-level styles
- • Move width/height properties to component via .vs-image selector
- • Refactor StyleSet structure for better separation of concerns

- • Replace size property with comprehensive styleSet approach
- • Use VsMessageStyleSet for individual message styling consistency
- • Separate concerns: messages list vs individual message styling

- • Extend existing VsInputStyleSet rather than duplicating style interfaces
- • Leverage component inheritance to maintain consistency across input variants

- • Consolidate component style definitions in baseStyleSet initialization
- • Avoid scattered style configuration across multiple functions

- • Slots lack DOM attachment points for direct styling
- • Wrapping slot content in a container element enables style targeting
- • Adding 'component' property to StyleSet without content wrapper is insufficient

## Reviewed Code

File: `packages/vlossom/src/components/vs-button/VsButton.vue` (lines 54-54)

```
@@ -42,7 +42,21 @@ export default defineComponent({
 
         const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
 
-        const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(componentName, styleSet);
+        const baseStyleSet: ComputedRef<VsButtonStyleSet> = computed(() => {
+            return {
+                loading: {
+                    component: {
+                        width: '30%',
+                        height: '60%',
+                    },
+                },
+            };
+        });
```

File: `packages/vlossom/src/components/vs-block/types.ts` (lines 26-26)

```
@@ -12,13 +12,16 @@ export type { VsBlock };
 
 export interface VsBlockRef extends ComponentPublicInstance<typeof VsBlock> {}
 
-export interface VsBlockStyleSet extends SizeStyleSet, BoxStyleSet {
-    boxShadow?: string;
-    fontColor?: string;
-
-    title?: {
-        backgroundColor?: string;
-        fontColor?: string;
-        padding?: string;
+export interface VsBlockStyleSet {
+    variables?: {
+        border?: string;
+        width?: string;
+        title?: {
+            backgroundColor?: string;
+            color?: string;
+            padding?: string;
+        };
     };
+    component?: CSSProperties;
+    layout?: VsInnerScrollStyleSet;
```

File: `packages/vlossom/src/components/vs-block/types.ts` (lines 26-26)

```
@@ -12,13 +12,16 @@ export type { VsBlock };
 
 export interface VsBlockRef extends ComponentPublicInstance<typeof VsBlock> {}
 
-export interface VsBlockStyleSet extends SizeStyleSet, BoxStyleSet {
-    boxShadow?: string;
-    fontColor?: string;
-
-    title?: {
-        backgroundColor?: string;
-        fontColor?: string;
-        padding?: string;
+export interface VsBlockStyleSet {
+    variables?: {
+        border?: string;
+        width?: string;
+        title?: {
+            backgroundColor?: string;
+            color?: string;
+            padding?: string;
+        };
     };
+    component?: CSSProperties;
+    layout?: VsInnerScrollStyleSet;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** layout-split, styling-compromise, nested-structure, component-refactor
**Category:** architecture

File: `packages/vlossom/src/components/vs-dimmed/VsDimmed.vue` (lines 6-6)

```
@@ -1,6 +1,11 @@
 <template>
     <Transition name="dimmed">
-        <div v-if="isShow" class="vs-dimmed" :style="styleSetVariables" aria-hidden="true" />
+        <div
+            v-if="isShow"
+            class="vs-dimmed"
+            :style="{ ...styleSetVariables, ...componentStyleSet.component }"
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** future-proofing, style-management, component-pattern, extensibility, standardization
**Category:** architecture

File: `packages/vlossom/src/components/vs-drawer/types.ts` (lines 31-31)

```
@@ -16,11 +16,17 @@ export interface VsDrawerRef extends ComponentPublicInstance<typeof VsDrawer> {
     closeDrawer: () => void;
 }
 
-export interface VsDrawerStyleSet extends BoxStyleSet {
-    position?: 'absolute' | 'fixed';
-    size?: string;
-    boxShadow?: string;
-    zIndex?: number;
-
+export interface VsDrawerStyleSet {
+    variables?: {
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        padding?: string;
+        opacity?: number;
+        size?: string;
+        boxShadow?: string;
+    };
+    component?: CSSProperties;
     dimmed?: VsDimmedStyleSet;
+    layout?: VsInnerScrollStyleSet;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** vsblock, layout-breaking, component-consistency, style-configuration, inner-scroll
**Category:** architecture

File: `packages/vlossom/src/components/vs-drawer/types.ts` (lines 21-21)

```
@@ -16,11 +16,17 @@ export interface VsDrawerRef extends ComponentPublicInstance<typeof VsDrawer> {
     closeDrawer: () => void;
 }
 
-export interface VsDrawerStyleSet extends BoxStyleSet {
-    position?: 'absolute' | 'fixed';
-    size?: string;
-    boxShadow?: string;
-    zIndex?: number;
-
+export interface VsDrawerStyleSet {
+    variables?: {
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        padding?: string;
+        opacity?: number;
+        size?: string;
+        boxShadow?: string;
+    };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style-consistency, interface-design, content-vs-variables, component-patterns
**Category:** architecture

File: `packages/vlossom/src/components/vs-drawer/types.ts` (lines 21-21)

```
@@ -16,11 +16,17 @@ export interface VsDrawerRef extends ComponentPublicInstance<typeof VsDrawer> {
     closeDrawer: () => void;
 }
 
-export interface VsDrawerStyleSet extends BoxStyleSet {
-    position?: 'absolute' | 'fixed';
-    size?: string;
-    boxShadow?: string;
-    zIndex?: number;
-
+export interface VsDrawerStyleSet {
+    variables?: {
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        padding?: string;
+        opacity?: number;
+        size?: string;
+        boxShadow?: string;
+    };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** style-set, encapsulation, interface-design, customization, variables
**Category:** architecture

File: `packages/vlossom/src/components/vs-text-wrap/types.ts` (lines 17-17)

```
@@ -12,12 +11,10 @@ export type { VsTextWrap };
 
 export interface VsTextWrapRef extends ComponentPublicInstance<typeof VsTextWrap> {}
 
-export interface IconStyleSet extends SizeStyleSet {
-    color?: string;
-}
-
 export interface VsTextWrapStyleSet {
-    width?: string | number;
-    copyIcon?: IconStyleSet;
-    linkIcon?: IconStyleSet;
+    variables?: {
+        width?: string | number;
+    };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** component, style, variable, aria, naming, architecture, accessibility, git, additionalstyleset, cssproperties, type-definition, interface-design, props-override, flat-structure
**Category:** architecture

File: `packages/vlossom/src/components/vs-file-drop/types.ts` (lines 21-21)

```
@@ -15,11 +16,16 @@ export interface VsFileDropRef extends ComponentPublicInstance<typeof VsFileDrop
 
 export type FileDropValueType = File[];
 
-export interface VsFileDropStyleSet extends BoxStyleSet {
-    width?: string | number | Breakpoints;
-    height?: string | number | Breakpoints;
-    dragBackgroundColor?: string;
-    iconColor?: string;
-
+export interface VsFileDropStyleSet {
+    variables?: {
+        padding?: string;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** variable, component, 스타일, aria, naming, style, architecture, accessibility, refactoring, simplification, style-consolidation, nesting, code-organization
**Category:** architecture

File: `packages/vlossom/src/components/vs-progress/types.ts` (lines 30-30)

```
@@ -12,8 +11,14 @@ export type { VsProgress };
 
 export interface VsProgressRef extends ComponentPublicInstance<typeof VsProgress> {}
 
-export interface VsProgressStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'opacity' | 'padding'> {
-    fontColor?: string;
-    textShadow?: string;
-    valueColor?: string;
+export interface VsProgressStyleSet {
+    variables?: {
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        fontColor?: string;
+        textShadow?: string;
+        valueColor?: string;
+    };
+    component?: CSSProperties;
 }
```

File: `packages/vlossom/src/components/vs-search-input/VsSearchInput.vue` (lines 107-107)

```
@@ -98,23 +98,44 @@ export default defineComponent({
         const isRegexOn = ref(regex.value);
 
         const { computedColorScheme } = useColorScheme(componentName, colorScheme);
-        const { componentStyleSet, styleSetVariables } = useStyleSet<VsSearchInputStyleSet>(componentName, styleSet);
 
-        const computedStyleSet: ComputedRef<VsInputStyleSet> = computed(() => {
+        const baseStyleSet: ComputedRef<Partial<VsSearchInputStyleSet>> = computed(() => {
+            const styleSetValue = styleSet.value;
+            const height =
+                styleSetValue && typeof styleSetValue !== 'string' ? styleSetValue.variables?.height : undefined;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, component, architecture, vsinputstyleset, property-extraction, delegation, separation-of-concerns, style-encapsulation
**Category:** architecture

File: `packages/vlossom/src/components/vs-search-input/types.ts` (lines 26-26)

```
@@ -16,4 +16,9 @@ export interface VsSearchInputRef extends ComponentPublicInstance<typeof VsSearc
     select: () => void;
 }
 
-export interface VsSearchInputStyleSet extends Omit<VsInputStyleSet, 'append' | 'prepend' | 'wrapper'> {}
+export interface VsSearchInputStyleSet {
+    variables?: {
+        height?: string;
+    };
+    input?: VsInputStyleSet;
+}
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, vsinputstyleset, input, vs-input, inheritance, interface-extension, type-composition, root-element
**Category:** architecture

File: `packages/vlossom/src/components/vs-block/types.ts` (lines 17-17)

```
@@ -12,13 +11,12 @@ export type { VsBlock };
 
 export interface VsBlockRef extends ComponentPublicInstance<typeof VsBlock> {}
 
-export interface VsBlockStyleSet extends SizeStyleSet, BoxStyleSet {
-    boxShadow?: string;
-    fontColor?: string;
-
-    title?: {
-        backgroundColor?: string;
-        fontColor?: string;
-        padding?: string;
+export interface VsBlockStyleSet {
+    variables?: {
+        border?: string;
+        width?: string;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** component-props, style-configuration, interface-design, width-property
**Category:** architecture

File: `packages/vlossom/src/components/vs-block/types.ts` (lines 17-17)

```
@@ -12,13 +11,12 @@ export type { VsBlock };
 
 export interface VsBlockRef extends ComponentPublicInstance<typeof VsBlock> {}
 
-export interface VsBlockStyleSet extends SizeStyleSet, BoxStyleSet {
-    boxShadow?: string;
-    fontColor?: string;
-
-    title?: {
-        backgroundColor?: string;
-        fontColor?: string;
-        padding?: string;
+export interface VsBlockStyleSet {
+    variables?: {
+        border?: string;
+        width?: string;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** component-pattern, style-architecture, consistency, interface-design
**Category:** architecture

File: `packages/vlossom/src/components/vs-image/types.ts` (lines 21-21)

```
@@ -13,8 +12,11 @@ export type { VsImage };
 
 export interface VsImageRef extends ComponentPublicInstance<typeof VsImage> {}
 
-export interface VsImageStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
-    objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down';
-
+export interface VsImageStyleSet {
+    variables?: {
+        width?: string;
+        height?: string;
+    };
     skeleton?: VsSkeletonStyleSet;
+    component?: CSSProperties;
```

File: `packages/vlossom/src/components/vs-input-wrapper/types.ts` (lines 18-18)

```
@@ -13,12 +13,8 @@ export type { VsInputWrapper };
 export interface VsInputWrapperRef extends ComponentPublicInstance<typeof VsInputWrapper> {}
 
 export interface VsInputWrapperStyleSet {
-    label?: TextStyleSet & {
-        marginBottom?: string;
-    };
-
-    messages?: {
-        marginTop?: string;
-        size?: Size;
-    };
+    component?: CSSProperties;
+    label?: CSSProperties;
+    message?: CSSProperties;
```

File: `packages/vlossom/src/components/vs-search-input/README.md` (lines 188-188)

```
@@ -186,15 +186,10 @@ function onSearch(value: string) {
 
 ```typescript
 interface VsSearchInputStyleSet {
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, vsinputstyleset, vs-input, interface-extension, code-reuse, component-inheritance, duplication
**Category:** architecture

File: `packages/vlossom/src/components/vs-search-input/VsSearchInput.vue` (lines 140-140)

```
@@ -98,23 +98,44 @@ export default defineComponent({
         const isRegexOn = ref(regex.value);
 
         const { computedColorScheme } = useColorScheme(componentName, colorScheme);
-        const { componentStyleSet, styleSetVariables } = useStyleSet<VsSearchInputStyleSet>(componentName, styleSet);
 
-        const computedStyleSet: ComputedRef<VsInputStyleSet> = computed(() => {
+        const baseStyleSet: ComputedRef<VsSearchInputStyleSet> = computed(() => {
+            const styleSetValue = styleSet.value;
+            const height =
+                styleSetValue && typeof styleSetValue !== 'string' ? styleSetValue.variables?.height : undefined;
+
             return {
-                ...componentStyleSet.value,
-                append: {
-                    backgroundColor: 'transparent',
-                    padding: '0 0.3rem',
+                input: {
+                    variables: {
+                        append: {
+                            backgroundColor: 'transparent',
+                            padding: '0 0.3rem',
+                        },
+                    },
+                    ...(height && {
+                        component: {
+                            height,
+                        },
+                    }),
                 },
             };
         });
 
+        const { componentStyleSet, styleSetVariables } = useStyleSet<VsSearchInputStyleSet>(
+            componentName,
+            styleSet,
+            baseStyleSet,
+        );
+
         function getToggleButtonStyleSet(toggle: boolean) {
             return {
-                backgroundColor: toggle ? 'var(--vs-area-bg)' : 'transparent',
-                border: toggle ? '1px solid var(--vs-primary-comp-bg)' : '1px solid var(--vs-comp-bg)',
-                padding: '0',
+                variables: {
+                    padding: '0',
+                },
+                component: {
+                    backgroundColor: toggle ? 'var(--vs-area-bg)' : 'transparent',
+                    border: toggle ? '1px solid var(--vs-primary-comp-bg)' : '1px solid var(--vs-comp-bg)',
+                },
             };
         }
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, basestyleset, style-set, style-consolidation, configuration-centralization, computed-property
**Category:** architecture

File: `packages/vlossom/src/components/vs-page/types.ts` (lines 19-19)

```
@@ -12,9 +12,7 @@ export type { VsPage };
 export interface VsPageRef extends ComponentPublicInstance<typeof VsPage> {}
 
 export interface VsPageStyleSet {
-    padding?: string;
-
-    title?: { padding?: string };
-
-    description?: { padding?: string };
+    component?: CSSProperties;
+    title?: CSSProperties;
+    description?: CSSProperties;
 }
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** 스타일, style, architecture, vs-page, slot, wrapper, dom-structure, css-properties, container
**Category:** architecture

## Examples

### ✅ Correct

```
// props/style-props.ts
export function getStyleSetProps<T extends { [key: string]: any }>(defaultStyleSet? : T) {
    return {
        styleSet: { type: [String, Object] as PropType<string | T>, default: defaultStyleSet },
    };
}

// components/vs-button/VsButton.vue
...getStyleSetProps<VsButtonStyleSet>({ 
	loading: {
        component: {
            width: '30%',
            height: '60%',
         },
    },
 }),
```

Proposed pattern: default values in prop factory function

### ❌ Incorrect

```
const baseStyleSet: ComputedRef<VsButtonStyleSet> = computed(() => {
            return {
                loading: {
                    component: {
                        width: '30%',
                        height: '60%',
                    },
                },
            };
        });
```

Current pattern: default values in computed property

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** style, function, component, getstylesetprops, defaultstyleset, export, vsbutton, style-props, naming, architecture, git, dependencies, vue, styleset, proptype, prop-defaults, factory-pattern, code-organization, refactoring
**Category:** architecture

### ✅ Correct

```
<!-- VsBlock.vue -->
<vs-inner-scroll :style-set="componentStyleSet.layout">
    <template #header v-if="$slots['title']">
        <slot name="title" />  <!-- div 제거 -->
    </template>
    <slot />  <!-- vs-block-content도 제거 -->
</vs-inner-scroll>
```

Simplified template using VsInnerScroll, removing wrapper divs

### ✅ Correct

```
const baseStyleSet = computed(() => ({
    layout: {
        header: {
            // 기존 vs-block의 기존 title의 스타일
            width: '100%',
            borderBottom: '1px solid var(--vs-line-color)',
            backgroundColor: 'var(--vs-comp-bg)',
            padding: '0.8rem 1.6rem',
            color: 'var(--vs-comp-font)',
            fontWeight: '500',
        },
        content: {
            // 기존 vs-block의 content의 스타일
            width: '100%',
            padding: '1.6rem',
        },
    },
}));
```

Migrated title/content styles to layout property structure

### ✅ Correct

```
export interface VsBlockStyleSet {
    component?: CSSProperties;
    layout?: VsInnerScrollStyleSet;
}
```

Simplified interface using composition with VsInnerScrollStyleSet

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** component-composition, style-delegation, template-simplification, responsive-tradeoff
**Category:** architecture

### ✅ Correct

```
export interface VsProgressStyleSet {
    bar: CSSProperties;
    value: CSSProperties;
    label: CSSProperties;
}
```

Recommended structure with semantic UI element properties

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, variable, component, accessibility, aria, label, export, naming, architecture, git, dependencies, vsprogressstyleset, interface, semantic-naming, ui-structure, css-properties, interface-design
**Category:** architecture

### ✅ Correct

```
.vs-image
```

Target selector for applying component-level styles

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** component, style, image, architecture, ci-cd, componentstyleset, vs-image, separation-of-concerns, css-selector, style-organization, refactoring
**Category:** architecture

### ✅ Correct

```
messages?: CSSProperties; // message list
    message?: VsMessageStyleSet; // message 하나하나
```

Proposed structure: messages for list, message for items

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, vsmessagestyleset, git, vsmessage, styleset, component-structure, css-properties, separation-of-concerns, type-refactoring
**Category:** architecture