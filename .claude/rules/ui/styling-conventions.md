# Optional: Scope this rule to specific files

## Rules

- • Maintain consistent CSS unit usage across similar components
- • VsSkeleton should use rem units to match VsLoading convention

- • Computed height variable simplifies dependent calculations
- • Direct values replaced variable overrides for cleaner CSS
- • Icon sizing uses proportional calculations based on chip height

- • Fixed values like '100%' and '1rem' should use Tailwind classes (w-full, h-4)
- • Avoid CSS custom properties when values don't need dynamic overrides

- • Replace custom CSS variables with Tailwind's utility class system
- • Use 'rounded-full' class instead of border-radius CSS property

- • Background needed on wrapper element during expandable animations
- • Moving background to content breaks animation visual continuity

- • CSS variable changes relocated background/padding from wrapper to content
- • Visual testing confirms both implementations produce same UI output

- • Input tag cannot have style-set applied due to technical limitation
- • Prior feedback about this issue was not addressed in current implementation

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, comment, documentation, style-set, input-tag, feedback-tracking, css-limitation, component-styling
**Category:** style

- • Reviewer questions if height:100% is appropriate for input element
- • May cause layout issues if parent container doesn't have defined height

## Reviewed Code

File: `packages/vlossom/playground/views/Basic.vue` (lines 169-169)

```
@@ -155,21 +155,21 @@
         <h3 class="mb-4 font-semibold">VsLoading</h3>
         <div class="flex flex-col gap-4">
             <h4 class="text-sm text-gray-500 dark:text-gray-400">Sizes</h4>
-            <div class="flex flex-wrap items-end gap-4">
-                <vs-loading width="24px" height="24px" />
-                <vs-loading width="36px" height="36px" />
-                <vs-loading width="50px" height="50px" />
-                <vs-loading width="70px" height="70px" />
+            <div class="flex flex-wrap items-center gap-4">
+                <vs-loading width="2rem" height="2rem" />
+                <vs-loading width="4rem" height="4rem" />
+                <vs-loading width="6rem" height="6rem" />
+                <vs-loading width="8rem" height="8rem" />
             </div>
         </div>
         <vs-divider style-set="playground" />
 
         <h3 class="mb-4 font-semibold">VsSkeleton</h3>
         <div class="flex flex-wrap items-center gap-4">
-            <vs-skeleton :style-set="{ width: '50px', height: '50px', borderRadius: '50%' }" />
+            <vs-skeleton :style-set="{ component: { width: '50px', height: '50px', borderRadius: '50%' } }" />
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** vs-loading, css-units, rem-unit, consistency, component-styling
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

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** css-variables, refactoring, computed-values, proportional-sizing, simplification
**Category:** style

File: `packages/vlossom/src/components/vs-progress/VsProgress.css` (lines 14-14)

```
@@ -1,21 +1,17 @@
 @reference 'tailwindcss';
 
 .vs-progress {
-    --vs-progress-width: initial;
-    --vs-progress-height: initial;
-
     --vs-progress-backgroundColor: initial;
     --vs-progress-border: initial;
     --vs-progress-borderRadius: initial;
-
     --vs-progress-fontColor: initial;
     --vs-progress-textShadow: initial;
     --vs-progress-valueColor: initial;
 
     @apply relative appearance-none text-center;
 
-    width: var(--vs-progress-width, 100%);
-    height: var(--vs-progress-height, 1rem);
+    width: 100%;
+    height: 1rem;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** tailwind, css-variables, utility-first, fixed-values
**Category:** style

File: `packages/vlossom/src/components/vs-theme-button/VsThemeButton.css` (lines 6-6)

```
@@ -1,12 +1,9 @@
 .vs-theme-button {
     --vs-theme-button-width: initial;
     --vs-theme-button-height: initial;
-
-    --vs-theme-button-borderRadius: initial;
-
     --vs-theme-button-iconColor: initial;
 
-    border-radius: var(--vs-theme-button-borderRadius, 50%);
+    border-radius: 50%;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** tailwind, utility-first, css-variables, rounded-full
**Category:** style

File: `packages/vlossom/src/components/vs-expandable/VsExpandable.css` (lines 8-8)

```
@@ -1,16 +1,12 @@
 /* VsExpandable 기본 구조 스타일 */
 .vs-expandable-wrapper {
-    --vs-expandable-backgroundColor: initial;
-    --vs-expandable-padding: initial;
-
     @apply relative w-full overflow-hidden;
 
-    background-color: var(--vs-expandable-backgroundColor, var(--vs-area-bg));
-
     .vs-expandable-content {
         @apply w-full;
 
-        padding: var(--vs-expandable-padding, 0.75rem 1rem);
+        background-color: var(--vs-area-bg);
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** animation, background-color, wrapper, css-variables, expandable
**Category:** style

File: `packages/vlossom/src/components/vs-expandable/VsExpandable.css` (lines 8-8)

```
@@ -1,16 +1,12 @@
 /* VsExpandable 기본 구조 스타일 */
 .vs-expandable-wrapper {
-    --vs-expandable-backgroundColor: initial;
-    --vs-expandable-padding: initial;
-
     @apply relative w-full overflow-hidden;
 
-    background-color: var(--vs-expandable-backgroundColor, var(--vs-area-bg));
-
     .vs-expandable-content {
         @apply w-full;
 
-        padding: var(--vs-expandable-padding, 0.75rem 1rem);
+        background-color: var(--vs-area-bg);
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** css-variables, style-refactor, background-color, padding, visual-testing
**Category:** style

File: `packages/vlossom/src/components/vs-textarea/VsTextarea.vue` (lines 25-25)

```
@@ -21,7 +22,7 @@
             ref="textareaRef"
             :id="computedId"
             :class="['vs-textarea', colorSchemeClass, classObj, stateClasses]"
-            :style="styleSetVariables"
+            :style="componentStyleSet.component"
```

## Examples

### ❌ Incorrect

```
input {
    @apply h-full w-full border-none bg-transparent outline-none;
```

Input styled with full height/width utility classes

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** tailwind-css, height-utility, layout, input-styling
**Category:** style