# Optional: Scope this rule to specific files

## Rules

- • Define type with nested object structure for component styling
- • Include bar, value, and label as separate configurable sections

- • Replace complex StyleSet inheritance with direct CSSProperties types
- • Use explicit property names (backGround, inner, component) for clarity
- • Avoid extending multiple StyleSet interfaces when simple types suffice

## Reviewed Code

File: `packages/vlossom/src/components/vs-progress/types.ts` (lines 15-15)

```
@@ -12,8 +11,14 @@ export type { VsProgress };
 
 export interface VsProgressRef extends ComponentPublicInstance<typeof VsProgress> {}
 
-export interface VsProgressStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'opacity' | 'padding'> {
-    fontColor?: string;
-    textShadow?: string;
-    valueColor?: string;
+export interface VsProgressStyleSet {
+    variables?: {
```

File: `packages/vlossom/src/components/vs-skeleton/types.ts` (lines 15-15)

```
@@ -12,6 +11,8 @@ export type { VsSkeleton };
 
 export interface VsSkeletonRef extends ComponentPublicInstance<typeof VsSkeleton> {}
 
-export interface VsSkeletonStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding' | 'opacity'> {
-    fontColor?: string;
+export interface VsSkeletonStyleSet {
+    backGround?: CSSProperties;
```

## Examples

### ✅ Correct

```
{
    bar: { backggkd }
    value: {}
    label: {}
}
```

Suggested type structure with nested style objects

### ✅ Correct

```
ts
{
    bar: { backggkd }
    value: {}
    label: {}
}
```

Same structure with TypeScript notation

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** nested-objects, type-structure, component-styling, interface-design
**Category:** architecture

### ✅ Correct

```
<div class="vs-skeleton-bg" :style="componentStyleSet.backGround" />
```

Shows new backGround property usage in template binding

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** typescript, interface, style-properties, vue-component, css-properties
**Category:** architecture