---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Explicit Api Architecture

## Rules

- • Explicit styling options provide clear API surface despite redundancy
- • Component-level control is valid alternative approach

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

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** explicit-api, style-interface, component-control, api-design
**Category:** architecture
