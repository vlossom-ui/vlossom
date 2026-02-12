# Optional: Scope this rule to specific files

## Rules

- • Nested 'variables' object adds unnecessary depth when CSS variables work
- • Keeping only 'component?: CSSProperties' may be sufficient
- • Consider styling needs for x button before finalizing structure

- • Split style properties into 'variables' object and separate 'component' field
- • Use CSSProperties type for component-level styling

## Reviewed Code

File: `packages/vlossom/src/components/vs-toast/types.ts` (lines 23-23)

```
@@ -16,7 +15,11 @@ export interface VsToastRef extends ComponentPublicInstance<typeof VsToast> {}
 
 export interface VsToastViewRef extends ComponentPublicInstance<typeof VsToastView> {}
 
-export interface VsToastStyleSet extends BoxStyleSet {
-    height?: string;
-    fontColor?: string;
+export interface VsToastStyleSet {
+    variables?: {
+        backgroundColor?: string;
+        border?: string;
+        fontColor?: string;
+    };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** variable, component, 스타일, aria, naming, style, architecture, accessibility, git, css-properties, type-structure, theme-variables, nesting
**Category:** architecture

File: `packages/vlossom/src/components/vs-grid/types.ts` (lines 19-19)

```
@@ -12,8 +11,10 @@ export type { VsGrid };
 
 export interface VsGridRef extends ComponentPublicInstance<typeof VsGrid> {}
 
-export interface VsGridStyleSet extends SizeStyleSet {
-    gridSize?: number;
-    rowGap?: string;
-    columnGap?: string;
+export interface VsGridStyleSet {
+    variables?: {
+        gridSize?: number;
+        columnGap?: string;
+        rowGap?: string;
+    };
 }
```

## Examples

### ✅ Correct

```
export interface VsGridStyleSet {
    variables?: {
        gridSize?: number;
    },
    component?: CSSProperties;
}
```

Proposed structure with variables and component separation

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, variable, component, aria, export, naming, architecture, accessibility, git, dependencies, vsgridstyleset, gridsize, interface, cssproperties, type-structure, separation-of-concerns, styleset-pattern
**Category:** architecture