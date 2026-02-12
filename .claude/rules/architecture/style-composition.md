---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Naming Architecture

## Rules

- • Use separate style properties (option, selectedOption) instead of variables
- • Apply conditional styles via computed function based on selection state
- • Spread selected styles when condition matches, cleaner than nested config

## Reviewed Code

File: `packages/vlossom/src/components/vs-select/types.ts` (lines 28-28)

```
@@ -18,9 +19,23 @@ export interface VsSelectRef extends ComponentPublicInstance<typeof VsSelect> {}
 
 export interface VsSelectTriggerRef extends ComponentPublicInstance<typeof VsSelectTrigger>, FocusableRef {}
 
-export interface VsSelectStyleSet extends SizeStyleSet {
-    trigger?: BoxStyleSet;
-    options?: Omit<VsGroupedListStyleSet, 'width' | 'items'>;
+export interface VsSelectStyleSet {
+    variables?: {
+        height?: string;
+        selected?: {
+            backgroundColor?: string;
+            fontWeight?: number;
+        };
```

## Examples

### ✅ Correct

```
export interface VsSelectStyleSet {
    ...
    option?: CSSProperties;
    selectedOption?: CSSProperties;
}
```

Defines separate style props for normal and selected states

### ✅ Correct

```
<div class="vs-select-option" :style="getOptionStyleSet(option)">
    ...
</div>
```

Applies computed styles dynamically to option element

### ✅ Correct

```
function getOptionStyleSet(optionId) {
    return {
        ...componentStyleSet.option,
        ....(isSelected(optionId) ? componentStyleSet.selectedOption : {}),
    }
});
```

Merges base and conditional styles using spread operator

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** naming, style, variable, function, class, component, accessibility, selectedoption, getoptionstyleset, optionid, componentstyleset, aria, focus, export, architecture, conditional-styling, style-composition, css-properties, spread-operator, computed-styles
**Category:** architecture
