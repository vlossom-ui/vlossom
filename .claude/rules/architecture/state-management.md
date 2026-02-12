---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Architecture

## Rules

- • Place default values in baseStyleSet for better separation of concerns
- • Avoid mixing fallback logic with component-specific style computation

## Reviewed Code

File: `packages/vlossom/src/components/vs-footer/VsFooter.vue` (lines 59-59)

```
@@ -31,22 +31,34 @@ export default defineComponent({
         const { colorScheme, styleSet, primary, position, height } = toRefs(props);
 
         const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
+        const baseStyleSet: ComputedRef<Partial<VsFooterStyleSet>> = computed(() => ({}));
         const additionalStyleSet: ComputedRef<Partial<VsFooterStyleSet>> = computed(() => {
             return objectUtil.shake({
-                position: position.value ? position.value : undefined,
-                height: height.value ? height.value : undefined,
+                component: objectUtil.shake({
+                    height: height.value || undefined,
+                }),
             });
         });
-        const { componentStyleSet } = useStyleSet<VsFooterStyleSet>(componentName, styleSet, additionalStyleSet);
+        const { componentStyleSet } = useStyleSet<VsFooterStyleSet>(
+            componentName,
+            styleSet,
+            baseStyleSet,
+            additionalStyleSet,
+        );
+
+        const isPositioned = computed(() => position.value && ['absolute', 'fixed', 'sticky'].includes(position.value));
+
         const computedStyleSet: ComputedRef<VsFooterStyleSet> = computed(() => {
-            const isPositioned = position.value && ['absolute', 'fixed', 'sticky'].includes(position.value);
-            return objectUtil.shake({
-                ...componentStyleSet.value,
-                bottom: (isPositioned && componentStyleSet.value.bottom) || 0,
-                left: (isPositioned && componentStyleSet.value.left) || 0,
-                height: componentStyleSet.value.height || '3rem',
-                zIndex: componentStyleSet.value.zIndex || 'var(--vs-bar-z-index)',
-            });
+            return {
+                component: objectUtil.shake({
+                    ...componentStyleSet.value.component,
+                    position: position.value || undefined,
+                    bottom: (isPositioned.value && componentStyleSet.value.component?.bottom) || 0,
+                    left: (isPositioned.value && componentStyleSet.value.component?.left) || 0,
+                    height: componentStyleSet.value.component?.height || '3rem',
+                    zIndex: componentStyleSet.value.component?.zIndex || 'var(--vs-bar-z-index)',
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** style, fallback, basestyleset, error-handling, default-values, separation-of-concerns, style-composition
**Category:** architecture
