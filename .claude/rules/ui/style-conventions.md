# Optional: Scope this rule to specific files

## Rules

- • Replace pixel values with rem units for better responsive scaling
- • 10px is relatively large and should use relative units instead

- • CSS opacity property accepts percentage values (0-100%)
- • Percentage notation (100%) is valid alternative to decimal (1.0)

- • Avoid setting properties to default values - it adds unnecessary code
- • Check component defaults before explicitly declaring style properties

## Reviewed Code

File: `packages/vlossom/src/components/vs-accordion/VsAccordion.css` (lines 32-32)

```
@@ -1,46 +1,35 @@
 .vs-accordion {
-    --vs-accordion-backgroundColor: initial;
+    --vs-accordion-arrowColor: initial;
+    --vs-accordion-arrowSize: initial;
+    --vs-accordion-arrowSpacing: initial;
     --vs-accordion-border: initial;
-    --vs-accordion-borderRadius: initial;
-    --vs-accordion-padding: initial;
-    --vs-accordion-opacity: initial;
-
     --vs-accordion-width: initial;
-    --vs-accordion-arrowColor: initial;
-
-    --vs-accordion-title-backgroundColor: initial;
-    --vs-accordion-title-fontColor: initial;
-    --vs-accordion-title-height: initial;
-    --vs-accordion-title-padding: initial;
-
-    --vs-accordion-expand-fontColor: initial;
 
     @apply relative overflow-hidden;
 
-    opacity: var(--vs-accordion-opacity, 1);
-    border: var(--vs-accordion-border, 1px solid var(--vs-line-color));
-    border-radius: var(--vs-accordion-borderRadius, calc(var(--vs-radius-ratio) * var(--vs-radius-md)));
+    border: 1px solid var(--vs-line-color);
+    border-radius: calc(var(--vs-radius-ratio) * var(--vs-radius-md));
     width: var(--vs-accordion-width, 100%);
-    color: var(--vs-accordion-expand-fontColor, var(--vs-comp-font));
 
     .vs-accordion-title {
         @apply relative w-full cursor-pointer outline-none hover:brightness-96 active:brightness-92;
 
-        background-color: var(--vs-accordion-title-backgroundColor, var(--vs-comp-bg));
-        padding: var(--vs-accordion-title-padding, 0.75rem 1rem);
-        height: var(--vs-accordion-title-height, auto);
-        color: var(--vs-accordion-title-fontColor, var(--vs-comp-font));
+        background-color: var(--vs-comp-bg);
+        padding: 0.75rem 1rem;
+        height: auto;
+        color: var(--vs-comp-font);
 
         /* 화살표 아이콘 추가 */
         &::after {
             position: absolute;
             top: 50%;
-            right: 1rem;
+            right: var(--vs-accordion-arrowSpacing, 2rem);
             transform: translateY(-50%);
             transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
-            border-top: 8px solid var(--vs-accordion-arrowColor, var(--vs-primary-comp-bg));
-            border-right: 5px solid transparent;
-            border-left: 5px solid transparent;
+            border-top: var(--vs-accordion-arrowSize, 10px) solid
+                var(--vs-accordion-arrowColor, var(--vs-primary-comp-bg));
+            border-right: calc(var(--vs-accordion-arrowSize, 10px) * 0.8) solid transparent;
+            border-left: calc(var(--vs-accordion-arrowSize, 10px) * 0.8) solid transparent;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** rem-units, css-units, responsive-design, scalability
**Category:** style

File: `packages/vlossom/src/components/vs-image/VsImage.css` (lines 10-10)

```
@@ -1,18 +1,14 @@
 .vs-image {
     --vs-image-width: initial;
     --vs-image-height: initial;
-
-    --vs-image-backgroundColor: initial;
     --vs-image-border: initial;
     --vs-image-borderRadius: initial;
-    --vs-image-opacity: initial;
-
     --vs-image-objectFit: initial;
 
     @apply relative inline-block;
 
-    opacity: var(--vs-image-opacity, 100%);
-    background-color: var(--vs-image-backgroundColor, transparent);
+    opacity: 100%;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** ci-cd, css-variables, opacity, percentage-values, css-properties
**Category:** style

File: `packages/vlossom/src/components/vs-image/VsImage.vue` (lines 48-48)

```
@@ -40,7 +40,20 @@ export default defineComponent({
     setup(props, { emit }) {
         const { styleSet, src, fallback, lazy } = toRefs(props);
 
-        const { styleSetVariables } = useStyleSet<VsImageStyleSet>(componentName, styleSet);
+        const baseStyleSet: ComputedRef<Partial<VsImageStyleSet>> = computed(() => ({
+            skeleton: {
+                component: {
+                    width: '100%',
+                    height: '100%',
+                },
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** vs-skeleton, default-values, code-redundancy, style-inheritance, component-defaults
**Category:** style