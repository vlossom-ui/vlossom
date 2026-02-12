---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Architecture

## Rules

- • Move width/height transformations into additionalStyleSet's variables
- • Avoid creating separate computedStyle for style merging
- • Keep style logic centralized in one place

## Reviewed Code

File: `packages/vlossom/src/components/vs-grid/VsGrid.vue` (lines 47-47)

```
@@ -25,20 +25,29 @@ export default defineComponent({
     setup(props) {
         const { width, height, gridSize, columnGap, rowGap, styleSet } = toRefs(props);
 
-        const additionalStyleSet = computed(() => {
+        const baseStyleSet: ComputedRef<Partial<VsGridStyleSet>> = computed(() => ({}));
+        const additionalStyleSet: ComputedRef<Partial<VsGridStyleSet>> = computed(() => {
             return objectUtil.shake({
-                width: width.value === undefined ? undefined : stringUtil.toStringSize(width.value),
-                height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
-                gridSize: gridSize.value === undefined ? undefined : Number(gridSize.value),
-                columnGap: columnGap.value === undefined ? undefined : stringUtil.toStringSize(columnGap.value),
-                rowGap: rowGap.value === undefined ? undefined : stringUtil.toStringSize(rowGap.value),
+                variables: objectUtil.shake({
+                    gridSize: gridSize.value === undefined ? undefined : Number(gridSize.value),
+                    columnGap: columnGap.value === undefined ? undefined : stringUtil.toStringSize(columnGap.value),
+                    rowGap: rowGap.value === undefined ? undefined : stringUtil.toStringSize(rowGap.value),
+                }),
             });
         });
 
-        const { styleSetVariables } = useStyleSet(componentName, styleSet, additionalStyleSet);
+        const { styleSetVariables } = useStyleSet<VsGridStyleSet>(componentName, styleSet, baseStyleSet, additionalStyleSet);
+
+        const computedStyle = computed((): CSSProperties => {
+            return {
+                ...styleSetVariables.value,
+                width: width.value === undefined ? undefined : stringUtil.toStringSize(width.value),
+                height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
+            };
+        });
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, additionalstyleset, computed-style, centralization, style-variables, refactoring
**Category:** architecture
