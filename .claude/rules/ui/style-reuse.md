---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Reuse Architecture

## Rules

- • Leverage existing VsInnerScroll header styling via layout property
- • Avoid redundant title styling in variables when layout can handle it

## Reviewed Code

File: `packages/vlossom/src/components/vs-block/types.ts` (lines 26-26)

```
@@ -12,13 +12,16 @@ export type { VsBlock };
 
 export interface VsBlockRef extends ComponentPublicInstance<typeof VsBlock> {}
 
-export interface VsBlockStyleSet extends SizeStyleSet, BoxStyleSet {
-    boxShadow?: string;
-    fontColor?: string;
-
-    title?: {
-        backgroundColor?: string;
-        fontColor?: string;
-        padding?: string;
+export interface VsBlockStyleSet {
+    variables?: {
+        border?: string;
+        width?: string;
+        title?: {
+            backgroundColor?: string;
+            color?: string;
+            padding?: string;
+        };
     };
+    component?: CSSProperties;
+    layout?: VsInnerScrollStyleSet;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** style-reuse, inner-scroll, layout-styling, style-consolidation
**Category:** architecture
