---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Consistency Architecture

## Rules

- • Border styling conflicts with vs-block's divider styling pattern
- • Need to maintain consistent border treatment across similar components

## Reviewed Code

File: `packages/vlossom/src/components/vs-label-value/types.ts` (lines 17-17)

```
@@ -12,17 +11,12 @@ export type { VsLabelValue };
 
 export interface VsLabelValueRef extends ComponentPublicInstance<typeof VsLabelValue> {}
 
-export interface VsLabelValueStyleSet extends Omit<BoxStyleSet, 'backgroundColor' | 'padding'> {
-    label?: TextStyleSet & {
-        backgroundColor?: string;
-        padding?: string;
-        verticalAlign?: string;
+export interface VsLabelValueStyleSet {
+    variables?: {
         width?: string;
+        border?: string;
     };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** style-consistency, border-styling, component-api, design-system
**Category:** architecture
