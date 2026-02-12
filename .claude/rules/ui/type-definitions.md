# Optional: Scope this rule to specific files

## Rules

- • Replace custom StepVariables interface with standard CSSProperties type
- • Use CSSProperties for element-specific styles (step, label, progress)
- • Keep simple variables like stepSize in variables object

- • Flatten style properties by using `content?: CSSProperties` directly
- • Avoid unnecessary nesting with `variables` wrapper object
- • Apply consistent structure across all slot-related style definitions

- • Define style properties directly with CSSProperties type
- • Avoid wrapping styles in a 'variables' object layer
- • Keep type structure flat for CSS-related properties

- • Leverage React's built-in CSSProperties for CSS style type safety
- • Avoid reinventing CSS type definitions that already exist in the framework

- • Apply CSSProperties type directly to each styleable component part
- • Avoid nested objects with specific properties like padding only
- • Flatten structure for better type safety and CSS flexibility

- • Add `component` property with `CSSProperties` type to match checkbox pattern
- • Maintain consistent StyleSet interface structure across similar components

- • StyleSet property configuration uses non-existent 'type' property
- • Verify available properties in StyleSet API documentation

## Reviewed Code

File: `packages/vlossom/src/components/vs-steps/types.ts` (lines 17-17)

```
@@ -12,11 +11,21 @@ export type { VsSteps };
 
 export interface VsStepsRef extends ComponentPublicInstance<typeof VsSteps> {}
 
-interface StepStyleSet extends BoxStyleSet {
+interface StepVariables {
+    backgroundColor?: string;
+    border?: string;
+    borderRadius?: string;
+    padding?: string;
+    opacity?: number;
     size?: string;
 }
 
-export interface VsStepsStyleSet extends SizeStyleSet {
-    step?: StepStyleSet;
-    activeStep?: StepStyleSet;
+export interface VsStepsStyleSet {
+    variables?: {
+        height?: string;
+        width?: string;
+        step?: StepVariables;
+        activeStep?: StepVariables;
+    };
```

File: `packages/vlossom/src/components/vs-skeleton/types.ts` (lines 17-17)

```
@@ -12,6 +11,10 @@ export type { VsSkeleton };
 
 export interface VsSkeletonRef extends ComponentPublicInstance<typeof VsSkeleton> {}
 
-export interface VsSkeletonStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding' | 'opacity'> {
-    fontColor?: string;
+export interface VsSkeletonStyleSet {
+    variables?: {
+        backgroundColor?: string;
+        fontColor?: string;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** variable, aria, naming, accessibility, git, content, cssproperties, type-flattening, interface-design, css-properties, slot-styling
**Category:** style

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

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** variable, aria, naming, accessibility, git, css-properties, type-structure, flatten, style-typing
**Category:** style

File: `packages/vlossom/src/components/vs-input/README.md` (lines 192-192)

```
@@ -174,24 +174,25 @@ function clearInput() {
 ## Types
 
 ```typescript
-interface VsAttachmentStyleSet {
-    backgroundColor?: string;
-    padding?: string;
-    opacity?: number;
-}
-
 interface VsInputStyleSet {
-    backgroundColor?: string;
-    border?: string;
-    borderRadius?: string;
-    padding?: string;
-    opacity?: number;
-    fontColor?: string;
-    fontSize?: string;
-    fontWeight?: number;
-    height?: string;
-    append?: VsAttachmentStyleSet; // append 슬롯 영역 스타일
-    prepend?: VsAttachmentStyleSet; // prepend 슬롯 영역 스타일
+    variables?: {
+        padding?: string;
+        fontColor?: string;
+        fontSize?: string;
+        fontWeight?: number;
+        prepend?: {
+            opacity?: number;
+            backgroundColor?: string;
+            padding?: string;
+        };
+        append?: {
+            opacity?: number;
+            backgroundColor?: string;
+            padding?: string;
+        };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** git, css-properties, type-reuse, react-types, built-in-types
**Category:** style

File: `packages/vlossom/src/components/vs-page/types.ts` (lines 19-19)

```
@@ -12,9 +12,10 @@ export type { VsPage };
 export interface VsPageRef extends ComponentPublicInstance<typeof VsPage> {}
 
 export interface VsPageStyleSet {
-    padding?: string;
-
-    title?: { padding?: string };
-
-    description?: { padding?: string };
+    variables?: {
+        padding?: string;
+        title?: { padding?: string };
+        description?: { padding?: string };
+    };
+    component?: CSSProperties;
 }
```

File: `packages/vlossom/src/components/vs-radio/types.ts` (lines 34-34)

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
 }
 
 export interface VsRadioSetStyleSet {
-    gap?: string;
-    flexWrap?: string;
-
-    radio?: Omit<VsRadioStyleSet, 'wrapper'>;
+    variables?: {
+        gap?: string;
+        flexWrap?: string;
+    };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** component, style, architecture, git, vscheckboxsetstyleset, cssproperties, consistency, interface-design, type-definition
**Category:** style

File: `packages/vlossom/src/components/vs-inner-scroll/README.md` (lines 82-82)

```
@@ -71,6 +71,39 @@ function checkScroll() {
 </script>
 ```
 
+## StyleSet 사용 예시
+
+```html
+<template>
+    <vs-inner-scroll
+        :style-set="{
+            component: {
+                backgroundColor: '#f5f5f5',
+            },
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** type, styleset, property-validation, api-contract, component-props
**Category:** documentation

## Examples

### ✅ Correct

```
export interface VsStepsStyleSet {
    variables?: {
        stepSize?: string;
    };
    step?: CSSProperties;
    activeStep?: CSSProperties;
    label?: CSSProperties;
    activeLabel?: CSSProperties;
    progress?: CSSProperties;
    progressActive?: CSSProperties;
}
```

Uses CSSProperties for style definitions, simpler approach

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** CSSProperties, type-interface, style-definition, typescript, standardization
**Category:** style

### ✅ Correct

```
export interface VsPageStyleSet {
    title?: CSSProperties;
    description?: CSSProperties;
    content?:  CSSProperties;
}
```

Proper: Each part uses full CSSProperties type

### ✅ Correct

```
ts
export interface VsPageStyleSet {
    title?: CSSProperties;
    description?: CSSProperties;
    content?:  CSSProperties;
}
```

Same as Example 1 - correct CSSProperties usage

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** css-properties, type-definition, interface-design, style-typing
**Category:** style