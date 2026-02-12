---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Css Properties Architecture

## Rules

- • Leverage standard CSSProperties for styling over custom variable definitions
- • Reduces redundant type definitions when CSS types already exist

## Reviewed Code

File: `packages/vlossom/src/components/vs-theme-button/types.ts` (lines 18-18)

```
@@ -12,6 +11,11 @@ export type { VsThemeButton };
 
 export interface VsThemeButtonRef extends ComponentPublicInstance<typeof VsThemeButton> {}
 
-export interface VsThemeButtonStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
-    iconColor?: string;
+export interface VsThemeButtonStyleSet {
+    variables?: {
+        width?: string;
+        height?: string;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** css-properties, type-definition, style-delegation, component-api
**Category:** architecture
