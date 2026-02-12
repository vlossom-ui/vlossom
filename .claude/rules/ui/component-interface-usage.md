---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Vsswitch Architecture

## Rules

- • All properties defined in style interface must have bindings in component
- • Unused declarations create confusion and maintenance burden

## Reviewed Code

File: `packages/vlossom/src/components/vs-switch/types.ts` (lines 23-23)

```
@@ -13,13 +13,11 @@ export type { VsSwitch };
 
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
+        handleColor?: string;
+        handleSize?: string;
+    };
+    component?: CSSProperties;
```

## Examples

### ❌ Incorrect

```
VsSwitch.vue
```

Component file where styleSet properties should be bound

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** vsswitch, vue, unused-declaration, type-binding, template-binding, interface-usage
**Category:** architecture
