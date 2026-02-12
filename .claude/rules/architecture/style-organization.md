---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Organization Architecture

## Rules

- • Group style properties within a 'variables' namespace for better organization
- • Remove inheritance from SizeStyleSet when restructuring to variables pattern

## Reviewed Code

File: `packages/vlossom/src/components/vs-switch/types.ts` (lines 25-25)

```
@@ -13,13 +13,16 @@ export type { VsSwitch };
 
 export interface VsSwitchRef extends ComponentPublicInstance<typeof VsSwitch>, FocusableRef, FormChildRef {}
 
-export interface VsSwitchStyleSet extends SizeStyleSet {
-    backgroundColor?: string;
-    border?: string;
-    borderRadius?: string;
-    fontColor?: string;
-    handleColor?: string;
-    handleSize?: string;
-
+export interface VsSwitchStyleSet {
+    variables?: {
+        width?: string;
+        height?: string;
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        fontColor?: string;
+        handleColor?: string;
+        handleSize?: string;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** style-organization, interface-structure, css-variables, nesting, refactoring
**Category:** architecture
