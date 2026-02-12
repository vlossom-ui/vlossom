---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Component Architecture

## Rules

- • Consolidate border, borderRadius, objectFit into a `component` CSSProperties
- • Keep width/height separate from other style properties

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
**Keywords:** component, architecture, git, cssproperties, css-properties, type-grouping, interface-design
**Category:** architecture
