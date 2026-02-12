# Optional: Scope this rule to specific files

## Rules

- • 5 loading bars at 11.11% width each total 55.55%
- • 4 gaps between bars split remaining 44.44% space (≈11.11% each)
- • Total approaches 99.99% due to repeating decimal precision

- • Apply consistent width CSS variable pattern across wrapped components
- • Use `--vs-input-wrapper-width: initial` with fallback to 100%
- • Align with existing responsive wrapper components like vs-accordion

- • Use CSS custom properties with fallback values for flexible sizing
- • Calculate child element dimensions as percentages of parent height
- • Combine Tailwind utilities with custom calc() expressions

- • Remove all CSS styles from input element except padding for inheritance
- • Set height separately on input to match container area properly

## Examples

### ✅ Correct

```
> .vs-loading-rect ~ .vs-loading-rect {
        margin-left: calc((100% - (var(--vs-loading-barWidth, 11.11%) * 5)) / 4);
}
```

Calculates equal spacing between 5 loading bars

### ✅ Correct

```
css
> .vs-loading-rect ~ .vs-loading-rect {
        margin-left: calc((100% - (var(--vs-loading-barWidth, 11.11%) * 5)) / 4);
}
```

Same calculation with CSS language marker

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** css-calc, spacing-distribution, loading-animation, percentage-math, margin-calculation
**Category:** style

### ✅ Correct

```
.vs-search-input {
    --vs-search-input-height: initial;
    @apply relative;
    .vs-search-input-toggles {
        @apply flex items-center gap-1;
        .vs-search-input-toggle {
            @apply cursor-pointer;
            width: calc(var(--vs-search-input-height, var(--vs-default-comp-height-md)) * 0.8);
            height: calc(var(--vs-search-input-height, var(--vs-default-comp-height-md)) * 0.8);
            font-size: calc(var(--vs-search-input-height, var(--vs-default-comp-height-md)) * 0.4);
            .vs-search-input-toggle-text {
                @apply select-none;
            }
        }
    }
}
```

Shows CSS var fallback pattern for responsive sizing

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** css-variables, calc-function, tailwind-css, fallback-pattern, responsive-sizing
**Category:** style

## Reviewed Code

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

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** css-variables, consistency, responsive-wrapper, component-width
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

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** css-inheritance, input-styling, height-sizing, style-removal
**Category:** style