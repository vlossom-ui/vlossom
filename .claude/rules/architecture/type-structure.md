---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Architecture

## Rules

- • Apply same style structure pattern used in vs-block component
- • Break down VsInnerScrollStyleSet into smaller, more granular parts

## Reviewed Code

File: `packages/vlossom/src/components/vs-grouped-list/types.ts` (lines 24-24)

```
@@ -15,10 +16,14 @@ export interface VsGroupedListRef extends ComponentPublicInstance<typeof VsGroup
     hasScroll: () => boolean;
 }
 
-export interface VsGroupedListStyleSet extends SizeStyleSet, BoxStyleSet {
-    gap?: string;
-    group?: BoxStyleSet;
-    item?: BoxStyleSet;
+export interface VsGroupedListStyleSet {
+    variables?: {
+        gap?: string;
+        height?: string;
+    };
+    layout?: VsInnerScrollStyleSet;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, vsinnerscrollstyleset, block, vs-block, type-decomposition, style-structure, interface-composition
**Category:** architecture
