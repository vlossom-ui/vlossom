# Optional: Scope this rule to specific files

## Rules

- • Leverage TypeScript's CSSProperties for CSS property type safety
- • Replace generic string type with specific CSS property union types
- • Enable autocomplete and compile-time validation for CSS values

- • Use CSSProperties interface for standard CSS properties instead of variables
- • Only move to variables when CSSProperties cannot represent the style

## Reviewed Code

File: `packages/vlossom/src/components/vs-avatar/types.ts` (lines 16-16)

```
@@ -12,7 +11,9 @@ export type { VsAvatar };
 
 export interface VsAvatarRef extends ComponentPublicInstance<typeof VsAvatar> {}
 
-export interface VsAvatarStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
-    fontColor?: string;
-    objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down';
+export interface VsAvatarStyleSet {
+    variables?: {
+        objectFit?: string;
```

File: `packages/vlossom/src/components/vs-label-value/types.ts` (lines 17-17)

```
@@ -12,17 +11,25 @@ export type { VsLabelValue };
 
 export interface VsLabelValueRef extends ComponentPublicInstance<typeof VsLabelValue> {}
 
-export interface VsLabelValueStyleSet extends Omit<BoxStyleSet, 'backgroundColor' | 'padding'> {
-    label?: TextStyleSet & {
-        backgroundColor?: string;
-        padding?: string;
-        verticalAlign?: string;
-        width?: string;
-    };
+interface ValueVariables {
+    backgroundColor?: string;
+    fontColor?: string;
+    fontSize?: string;
+    fontWeight?: string | number;
+    padding?: string;
+    verticalAlign?: string;
+}
 
-    value?: TextStyleSet & {
-        backgroundColor?: string;
-        padding?: string;
-        verticalAlign?: string;
+interface LabelVariables extends ValueVariables {
+    width?: string;
+}
+
+export interface VsLabelValueStyleSet {
+    variables?: {
+        width?: string;
+        border?: string;
+        borderRadius?: string;
+        label?: LabelVariables;
+        value?: ValueVariables;
     };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** variable, aria, naming, accessibility, git, css-properties, type-safety, css-variables, typescript-interface
**Category:** style

## Examples

### ✅ Correct

```
objectFit?: CSSProperties['object-fit'] & {};
```

Uses indexed CSSProperties type for type-safe objectFit

### ✅ Correct

```
suggestion
        objectFit?: CSSProperties['object-fit'] & {};
```

Suggested replacement for string type with CSSProperties

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** git, variable, https, aria, http, image, naming, security, accessibility, api, database, ci-cd, objectfit, user-attachments, b9f5-5e0ded9b8dba, type-inference, cssproperties, type-safety, typescript-utility
**Category:** style