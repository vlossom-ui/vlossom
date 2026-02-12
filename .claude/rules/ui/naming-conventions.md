# Optional: Scope this rule to specific files

## Rules

- • Rename component? to input? for clearer purpose
- • Position style properties closer to what they actually style

- • Use correct CSS property name 'background' instead of 'backGround'
- • Maintain consistent naming with standard CSS properties

- • Use descriptive semantic names that reflect component purpose
- • 'content' better conveys inner structure meaning than generic 'inner'

## Reviewed Code

File: `packages/vlossom/src/components/vs-input/README.md` (lines 182-182)

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
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** component, cssproperties, architecture, git, input, semantic-naming, property-grouping, interface-design, style-organization
**Category:** naming

File: `packages/vlossom/src/components/vs-skeleton/types.ts` (lines 15-15)

```
@@ -12,6 +11,8 @@ export type { VsSkeleton };
 
 export interface VsSkeletonRef extends ComponentPublicInstance<typeof VsSkeleton> {}
 
-export interface VsSkeletonStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding' | 'opacity'> {
-    fontColor?: string;
+export interface VsSkeletonStyleSet {
+    backGround?: CSSProperties;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** typo, css-properties, naming-convention, camelcase, property-name
**Category:** naming

File: `packages/vlossom/src/components/vs-skeleton/VsSkeleton.vue` (lines 4-4)

```
@@ -1,7 +1,7 @@
 <template>
-    <div :class="['vs-skeleton', colorSchemeClass]" :style="styleSetVariables">
-        <div class="vs-skeleton-bg" />
-        <div class="vs-skeleton-inner">
+    <div :class="['vs-skeleton', colorSchemeClass]" :style="componentStyleSet.component">
+        <div class="vs-skeleton-bg" :style="componentStyleSet.backGround" />
+        <div class="vs-skeleton-inner" :style="componentStyleSet.inner">
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** semantic-naming, class-names, component-structure, css-naming
**Category:** naming