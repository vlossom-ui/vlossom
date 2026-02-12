---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Architecture

## Rules

- • Use direct properties (label, messages) instead of nesting under 'variables'
- • Remove unnecessary 'width' property to eliminate need for wrapper
- • Prefer CSSProperties over custom nested object structures

## Reviewed Code

File: `packages/vlossom/src/components/vs-input-wrapper/types.ts` (lines 26-26)

```
@@ -13,12 +13,20 @@ export type { VsInputWrapper };
 export interface VsInputWrapperRef extends ComponentPublicInstance<typeof VsInputWrapper> {}
 
 export interface VsInputWrapperStyleSet {
-    label?: TextStyleSet & {
-        marginBottom?: string;
+    variables?: {
+        width?: string;
+        label?: {
+            marginBottom?: string;
+            fontColor?: string;
+            fontSize?: string;
+            fontWeight?: number;
+        };
+        messages?: {
+            marginTop?: string;
+        };
```

## Examples

### ✅ Correct

```
export interface VsInputWrapperStyleSet {
    component?: CSSProperties; // 꼭 필요한지 판단 안 서긴 하는데 일단 넣어봄 ㅋㅋㅋ
    label?: CSSProperties;
    messages?: CSSProperties;
    message?: CSSProperties;
}
```

Flattened interface using CSSProperties directly

### ✅ Correct

```
ts
export interface VsInputWrapperStyleSet {
    component?: CSSProperties; // 꼭 필요한지 판단 안 서긴 하는데 일단 넣어봄 ㅋㅋㅋ
    label?: CSSProperties;
    messages?: CSSProperties;
    message?: CSSProperties;
}
```

Same flattened structure avoiding nested variables wrapper

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, variable, component, accessibility, aria, label, export, naming, architecture, git, dependencies, vsinputwrapperstyleset, interface, variables, flat-structure, nesting, cssproperties, interface-design
**Category:** architecture
