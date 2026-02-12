---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Style

## Rules

- • Replace custom style variables (backgroundColor, border, etc.) with CSSProperties
- • Allows direct CSS control without needing predefined size props
- • Simplifies interface by using standard CSS type definitions

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

## Examples

### ✅ Correct

```
export interface VsStepsStyleSet {
    component?: CSSProperties;
    step?: CSSProperties;
    activeStep?: CSSProperties;
}
```

Suggested approach using CSSProperties for flexible styling

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, component, export, architecture, git, dependencies, vsstepsstyleset, activestep, interface, size, string, vs-tabs, cssproperties, type-definition, refactoring, style-variables
**Category:** style
