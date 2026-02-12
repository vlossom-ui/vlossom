---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Merging State Management

## Rules

- • Hardcoded base styles get overridden when users provide custom styleSet
- • Loading config must be merged with user styleSet to preserve defaults

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

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style-merging, default-config, override-loss, styleset-preservation
**Category:** state-management
