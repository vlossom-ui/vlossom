---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Git Architecture

## Rules

- • Evaluate if VsImageStyleSet properties can use standard CSSProperties
- • Consolidate style definitions to leverage native CSS type definitions

## Reviewed Code

File: `packages/vlossom/src/components/vs-image/types.ts` (lines 21-21)

```
@@ -13,8 +12,13 @@ export type { VsImage };
 
 export interface VsImageRef extends ComponentPublicInstance<typeof VsImage> {}
 
-export interface VsImageStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
-    objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down';
-
+export interface VsImageStyleSet {
+    variables?: {
+        width?: string;
+        height?: string;
+        border?: string;
+        borderRadius?: string;
+        objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down';
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** git, css-properties, type-consolidation, style-interface, type-reusability
**Category:** architecture
