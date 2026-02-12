# Optional: Scope this rule to specific files

## Rules

- Make selected and focused style properties optional in type definitions
- Allows flexibility when not all style overrides are needed

- • Removed size-specific CSS classes (vs-xs, vs-md, vs-lg, vs-xl) breaks sizing
- • CSS variables now hardcoded instead of size-dependent calculations
- • Size prop customization lost when removing --vs-chip-size-* variables

- • Consider passing width through component props (CSSProperties) directly
- • Question whether CSS variable control is necessary for width property

- • CSS variables defined at parent level enable child components to override
- • Removing variables breaks existing customization patterns
- • Variables with 'initial' preserve flexibility for nested components

- • Use TypeScript's native CSSProperties for CSS-in-JS type safety
- • Leverage built-in types rather than manually defining CSS property types

- • Extract height from styleSet variables to ensure UI consistency
- • Button and input elements require matching height for proper alignment

- • object-fit CSS properties must be applied to component (img tag) directly
- • width/height should be extracted as variables for wrapper (.vs-image) element
- • Separates sizing concerns: dimensions on wrapper, fit properties on image

- • Check CSS specificity for nested input elements after refactoring
- • Ensure style variables apply correctly to input tags within component

## Reviewed Code

File: `packages/vlossom/src/components/vs-select/types.ts` (lines 28-28)

```
@@ -18,9 +18,22 @@ export interface VsSelectRef extends ComponentPublicInstance<typeof VsSelect> {}
 
 export interface VsSelectTriggerRef extends ComponentPublicInstance<typeof VsSelectTrigger>, FocusableRef {}
 
-export interface VsSelectStyleSet extends SizeStyleSet {
-    trigger?: BoxStyleSet;
-    options?: Omit<VsGroupedListStyleSet, 'width' | 'items'>;
+export interface VsSelectStyleSet {
+    variables?: {
+        height?: string;
+        selected: {
+            backgroundColor?: string;
+            fontWeight?: number;
+        };
+        focused: {
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** focus, accessibility, optional-properties, type-safety, style-override, component-styling
**Category:** style

File: `packages/vlossom/src/components/vs-chip/VsChip.css` (lines 47-47)

```
@@ -1,95 +1,69 @@
 .vs-chip {
-    --vs-chip-width: initial;
     --vs-chip-height: initial;
 
-    --vs-chip-backgroundColor: initial;
-    --vs-chip-border: initial;
-    --vs-chip-borderRadius: initial;
-    --vs-chip-padding: initial;
-    --vs-chip-opacity: initial;
-
-    --vs-chip-fontColor: initial;
-
-    --vs-chip-size-height: var(--vs-size-height, var(--vs-default-comp-height-sm));
-    --vs-chip-size-font: var(--vs-size-font, var(--vs-font-size-sm));
-    --vs-chip-size-padding: var(--vs-size-padding, var(--vs-padding-sm));
-    --vs-chip-size-icon-padding: 0.15rem;
+    --vs-chip-computed-height: var(--vs-chip-height, var(--vs-size-height));
+    --vs-chip-icon-size: calc(var(--vs-chip-computed-height) * 0.75);
+    --vs-chip-icon-margin: calc(var(--vs-chip-computed-height) * 0.13);
 
     @apply relative box-border inline-flex items-center justify-center select-none hover:brightness-96 active:brightness-92;
 
-    opacity: var(--vs-chip-opacity, 1);
-    border: var(--vs-chip-border, 1px solid var(--vs-line-color));
-    border-radius: var(--vs-chip-borderRadius, calc(var(--vs-chip-size-height) / 2));
-    background-color: var(--vs-chip-backgroundColor, var(--vs-comp-bg));
-    padding: var(--vs-chip-padding, 0 var(--vs-chip-size-padding));
-    width: var(--vs-chip-width, auto);
-    height: var(--vs-chip-height, var(--vs-chip-size-height));
-    min-height: var(--vs-chip-height, var(--vs-chip-size-height));
-    color: var(--vs-chip-fontColor, var(--vs-comp-font));
-    font-size: var(--vs-chip-size-font);
+    border: 1px solid var(--vs-line-color);
+    border-radius: calc(var(--vs-chip-computed-height) / 2);
+    background-color: var(--vs-comp-bg);
+    width: auto;
+    height: var(--vs-chip-computed-height);
+    min-height: var(--vs-chip-computed-height);
+    color: var(--vs-comp-font);
+    font-size: var(--vs-size-font);
     line-height: 2;
     user-select: none;
 
-    .vs-icon-container {
+    .vs-chip-icon {
         @apply flex items-center justify-center;
 
-        border: var(--vs-chip-border, 1px solid var(--vs-line-color));
+        border: 1px solid var(--vs-line-color);
         border-radius: 50%;
-        width: calc(var(--vs-chip-height, var(--vs-chip-size-height)) * 0.75);
-        height: calc(var(--vs-chip-height, var(--vs-chip-size-height)) * 0.75);
-        color: var(--vs-chip-fontColor, var(--vs-comp-font));
+        min-width: var(--vs-chip-icon-size);
+        max-width: var(--vs-chip-icon-size);
+        min-height: var(--vs-chip-icon-size);
+        max-height: var(--vs-chip-icon-size);
+        color: var(--vs-comp-font);
     }
 
     .vs-chip-close-button {
         @apply shrink-0 cursor-pointer;
     }
 
     &:has(.vs-chip-icon) {
-        padding-left: var(--vs-chip-size-icon-padding);
+        padding-left: var(--vs-chip-icon-margin);
     }
 
     &:has(.vs-chip-close-button) {
-        padding-right: var(--vs-chip-size-icon-padding);
+        padding-right: var(--vs-chip-icon-margin);
     }
 
     .vs-chip-content {
         @apply w-full truncate text-center;
-        padding: 0 0.4rem;
-    }
-
-    &.vs-xs {
-        --vs-chip-size-icon-padding: 0.1rem;
-    }
-
-    &.vs-md {
-        --vs-chip-size-icon-padding: 0.2rem;
-    }
-
-    &.vs-lg {
-        --vs-chip-size-icon-padding: 0.25rem;
-    }
-
-    &.vs-xl {
-        --vs-chip-size-icon-padding: 0.3rem;
+        padding: 0 var(--vs-size-padding);
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** git, css-variables, prop-binding, responsive-sizing, component-variants
**Category:** style

File: `packages/vlossom/src/components/vs-input-wrapper/VsInputWrapper.css` (lines 11-11)

```
@@ -1,13 +1,15 @@
 @reference 'tailwindcss';
 
 .vs-input-wrapper {
+    --vs-input-wrapper-width: initial;
     --vs-input-wrapper-label-marginBottom: initial;
     --vs-input-wrapper-label-fontColor: initial;
     --vs-input-wrapper-label-fontSize: initial;
     --vs-input-wrapper-label-fontWeight: initial;
-
     --vs-input-wrapper-messages-marginTop: initial;
 
+    width: var(--vs-input-wrapper-width, 100%);
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** css-variables, component-props, width-control, cssproperties, inline-styles
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

File: `packages/vlossom/src/components/vs-checkbox/types.ts` (lines 37-37)

```
@@ -20,19 +20,21 @@ export interface VsCheckboxRef extends ComponentPublicInstance<typeof VsCheckbox
 export interface VsCheckboxSetRef extends ComponentPublicInstance<typeof VsCheckboxSet>, FocusableRef, FormChildRef {}
 
 export interface VsCheckboxStyleSet {
-    borderRadius?: string;
-    borderWidth?: string;
-    checkboxColor?: string;
-    checkboxSize?: string;
-    height?: string;
-
+    variables?: {
+        borderRadius?: string;
+        borderWidth?: string;
+        checkboxColor?: string;
+        checkboxSize?: string;
+        height?: string;
+    };
     wrapper?: VsInputWrapperStyleSet;
 }
 
 export interface VsCheckboxSetStyleSet {
-    gap?: string;
-    flexWrap?: string;
-
+    variables?: {
+        gap?: string;
+        flexWrap?: string;
+    };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** component, architecture, git, cssproperties, type-safety, css-in-js, typescript-types, style-props
**Category:** style

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

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** height-sync, style-set, component-sizing, ui-consistency
**Category:** style

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

File: `packages/vlossom/src/components/vs-input/VsInput.vue` (lines 21-21)

```
@@ -17,8 +18,8 @@
             <slot name="label" />
         </template>
 
-        <div :class="['vs-input', colorSchemeClass, classObj, stateClasses]" :style="styleSetVariables">
-            <div v-if="$slots['prepend']" class="vs-prepend">
+        <div :class="['vs-input', colorSchemeClass, classObj, stateClasses]" :style="componentStyleSet.component">
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** font-size, css-specificity, style-inheritance, input-styling, component-refactoring
**Category:** style

## Examples

### ✅ Correct

```
.vs-drawer {
    --vs-drawer-backgroundColor: initial;
    --vs-drawer-border: initial;
    --vs-drawer-borderRadius: initial;
    --vs-drawer-padding: initial;
    --vs-drawer-opacity: initial;
    --vs-drawer-size: initial;
    --vs-drawer-boxShadow: initial;
```

Parent-level CSS vars enable child component customization

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** css-variables, customization, inheritance, component-styling, flexibility
**Category:** style

### ✅ Correct

```
.vs-image
```

Wrapper element where width/height variables are applied

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** object-fit, css-variables, component-styling, wrapper-pattern, style-separation
**Category:** style