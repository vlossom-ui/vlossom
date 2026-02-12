---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Architecture

## Rules

- • Split styles by UI element (component/tab/activeTab) not CSS variables
- • Include nested component styles (scrollButton) for composition
- • Use CSSProperties for direct style application

## Reviewed Code

File: `packages/vlossom/src/components/vs-tabs/types.ts` (lines 21-21)

```
@@ -15,7 +15,16 @@ export interface VsTabsRef extends ComponentPublicInstance<typeof VsTabs> {
     goNext: () => void;
 }
 
-export interface VsTabsStyleSet extends BoxStyleSet {
-    height?: string | number;
-    gap?: string;
+export interface VsTabsStyleSet {
+    variables?: {
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        gap?: string;
+        height?: string;
+        opacity?: number;
+        padding?: string;
+        width?: string;
+    };
```

## Examples

### ✅ Correct

```
export interface VsTabsStyleSet {
    component?: CSSProperties;
    tab?: CSSProperties;
    activeTab?: CSSProperties;
    scrollButton?: Omit<VsButtonStyleSet, 'loading'>;
}
```

Separates styles by UI element with nested component types

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, component, style-set, export, architecture, git, dependencies, vstabsstyleset, activetab, scrollbutton, vsbuttonstyleset, set, interface, 인터페이스, vs-tabs, css-properties, composition, ui-elements, nested-types
**Category:** architecture
