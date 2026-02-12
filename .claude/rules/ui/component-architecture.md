# Optional: Scope this rule to specific files

## Rules

- • Separate handle-specific styles from general component styles
- • Consider moving non-handle CSS properties to component CSSProperties
- • Uncertain about optimal location for style property organization

- • Spread content styles onto component via :style binding
- • Define nested styleSet properties (header, content, footer)
- • Restructure interface to separate variables from component-specific styles

- • Retain 'component' property when removing 'variables' structure
- • messageSize presents challenges as it requires script-injected values

## Reviewed Code

File: `packages/vlossom/src/components/vs-switch/types.ts` (lines 25-25)

```
@@ -13,13 +13,16 @@ export type { VsSwitch };
 
 export interface VsSwitchRef extends ComponentPublicInstance<typeof VsSwitch>, FocusableRef, FormChildRef {}
 
-export interface VsSwitchStyleSet extends SizeStyleSet {
-    backgroundColor?: string;
-    border?: string;
-    borderRadius?: string;
-    fontColor?: string;
-    handleColor?: string;
-    handleSize?: string;
-
+export interface VsSwitchStyleSet {
+    variables?: {
+        width?: string;
+        height?: string;
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        fontColor?: string;
+        handleColor?: string;
+        handleSize?: string;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** css-properties, style-organization, component-architecture, separation-of-concerns, style-variables
**Category:** architecture

File: `packages/vlossom/src/components/vs-drawer/types.ts` (lines 21-21)

```
@@ -16,11 +16,17 @@ export interface VsDrawerRef extends ComponentPublicInstance<typeof VsDrawer> {
     closeDrawer: () => void;
 }
 
-export interface VsDrawerStyleSet extends BoxStyleSet {
-    position?: 'absolute' | 'fixed';
-    size?: string;
-    boxShadow?: string;
-    zIndex?: number;
-
+export interface VsDrawerStyleSet {
+    variables?: {
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        padding?: string;
+        opacity?: number;
+        size?: string;
+        boxShadow?: string;
+    };
```

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
:style="{ ...componentStyleSet.content }"
```

Spreads content CSS properties directly onto element

### ✅ Correct

```
:style-set="{
    header: componentStyleSet.header,
    footer: componentStyleSet.footer,
}"
```

Passes nested style objects to child component sections

### ✅ Correct

```
export interface VsDrawerStyleSet {
    variables?: {
        size?: string;
    };
    component?: CSSProperties;
    dimmed?: VsDimmedStyleSet;
    header?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
}
```

Separates CSS variables from component section styles

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** style-binding, interface-structure, css-properties, nested-styles, vue-component
**Category:** architecture

### ✅ Correct

```
export interface VsInputWrapperStyleSet {
    component?: CSSProperties;
    label?: CSSProperties;
    message?: CSSProperties;
    messageSize?: Size;
}
```

Suggested flat structure with component and messageSize props

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** style-interface, component-props, css-properties, dynamic-values
**Category:** architecture