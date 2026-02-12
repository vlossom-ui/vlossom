---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Git Style

## Rules

- • Leverage built-in CSSProperties type for style definitions
- • Avoid custom object wrappers when standard types suffice

## Reviewed Code

File: `packages/vlossom/src/components/vs-modal/types.ts` (lines 34-34)

```
@@ -21,10 +20,17 @@ export interface VsModalNodeRef extends ComponentPublicInstance<typeof VsModalNo
 
 export interface VsModalViewRef extends ComponentPublicInstance<typeof VsModalView> {}
 
-export interface VsModalNodeStyleSet extends SizeStyleSet, BoxStyleSet {
-    boxShadow?: string;
-    fontColor?: string;
-    zIndex?: string;
-
+export interface VsModalNodeStyleSet {
+    variables?: {
+        width?: string;
+        height?: string;
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        padding?: string;
+        opacity?: number;
+        boxShadow?: string;
+        fontColor?: string;
+    };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** git, compoent, cssproperties, type-reuse, built-in-types, simplification, typescript-utilities
**Category:** style
