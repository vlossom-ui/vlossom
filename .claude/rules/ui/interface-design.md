---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Architecture

## Rules

- • Split StyleSet into 'variables' and 'component' properties for clarity
- • Use CSSProperties type for component-level styles
- • Apply variables via spread operator in template style binding

## Reviewed Code

File: `packages/vlossom/src/components/vs-tooltip/types.ts` (lines 18-18)

```
@@ -12,7 +11,16 @@ export type { VsTooltip };
 
 export interface VsTooltipRef extends ComponentPublicInstance<typeof VsTooltip> {}
 
-export interface VsTooltipStyleSet extends SizeStyleSet, BoxStyleSet {
-    arrowColor?: string;
-    arrowSize?: string;
+export interface VsTooltipStyleSet {
+    variables?: {
+        width?: string;
+        height?: string;
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        padding?: string;
+        opacity?: number;
+        arrowColor?: string;
+        arrowSize?: string;
+    };
```

## Examples

### ✅ Correct

```
export interface VsTooltipStyleSet {
    variables?: {
        arrowColor?: string;
        arrowSize?: string;
    };
    component?: CSSProperties;
}
```

Proposed structure separating CSS vars from component styles

### ✅ Correct

```
:style="{ ...styleSetVariables, ...componentStyleSet.component }"
```

Template usage spreading both variables and component styles

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, variable, class, component, naming, aria, export, architecture, accessibility, git, dependencies, vstooltipstyleset, arrowcolor, arrowsize, colorschemeclass, css-properties, interface-design, spread-operator, template-binding
**Category:** architecture
