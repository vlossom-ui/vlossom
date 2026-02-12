---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Wrapper Styling Architecture

## Rules

- • Nested wrapper components require dedicated style interface properties
- • Without wrapper property, parent wrapper elements cannot be styled
- • Consistent pattern applied across similar components

## Reviewed Code

File: `packages/vlossom/src/components/vs-radio/types.ts` (lines 26-26)

```
@@ -18,16 +18,20 @@ export interface VsRadioRef extends ComponentPublicInstance<typeof VsRadio>, Foc
 export interface VsRadioSetRef extends ComponentPublicInstance<typeof VsRadioSet>, FocusableRef, FormChildRef {}
 
 export interface VsRadioStyleSet {
-    borderRadius?: string;
-    height?: string;
-    radioColor?: string;
-    radioSize?: string;
+    variables?: {
+        borderRadius?: string;
+        height?: string;
+        radioColor?: string;
+        radioSize?: string;
+    };
+    wrapper?: VsInputWrapperStyleSet;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** wrapper-styling, nested-components, style-interface, component-composition
**Category:** architecture
