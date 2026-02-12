---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Computed Performance

## Rules

- • Avoid computed() for non-reactive constant values
- • Empty object doesn't need reactivity tracking overhead

## Reviewed Code

File: `packages/vlossom/src/components/vs-header/VsHeader.vue` (lines 62-62)

```
@@ -31,22 +31,34 @@ export default defineComponent({
         const { colorScheme, styleSet, primary, position, height } = toRefs(props);
 
         const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
+        const baseStyleSet: ComputedRef<Partial<VsHeaderStyleSet>> = computed(() => ({}));
         const additionalStyleSet: ComputedRef<Partial<VsHeaderStyleSet>> = computed(() => {
             return objectUtil.shake({
-                position: position.value ? position.value : undefined,
-                height: height.value ? height.value : undefined,
+                component: objectUtil.shake({
+                    height: height.value || undefined,
+                }),
             });
         });
-        const { componentStyleSet } = useStyleSet<VsHeaderStyleSet>(componentName, styleSet, additionalStyleSet);
+        const { componentStyleSet } = useStyleSet<VsHeaderStyleSet>(
+            componentName,
+            styleSet,
+            baseStyleSet,
+            additionalStyleSet,
+        );
+
+        const isPositioned = computed(() => position.value && ['absolute', 'fixed', 'sticky'].includes(position.value));
+
         const computedStyleSet: ComputedRef<VsHeaderStyleSet> = computed(() => {
-            const isPositioned = position.value && ['absolute', 'fixed', 'sticky'].includes(position.value);
-            return objectUtil.shake({
-                ...componentStyleSet.value,
-                top: (isPositioned && componentStyleSet.value.top) || 0,
-                left: (isPositioned && componentStyleSet.value.left) || 0,
-                height: componentStyleSet.value.height || '3rem',
-                zIndex: componentStyleSet.value.zIndex || 'var(--vs-bar-z-index)',
-            });
+            return {
+                component: objectUtil.shake({
+                    ...componentStyleSet.value.component,
+                    position: position.value || undefined,
+                    top: (isPositioned.value && componentStyleSet.value.component?.top) || 0,
+                    left: (isPositioned.value && componentStyleSet.value.component?.left) || 0,
+                    height: componentStyleSet.value.component?.height || '3rem',
+                    zIndex: componentStyleSet.value.component?.zIndex || 'var(--vs-bar-z-index)',
+                }),
+            };
         });
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** computed, vue, reactivity, performance, optimization
**Category:** performance
