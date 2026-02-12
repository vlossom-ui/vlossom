# Optional: Scope this rule to specific files

## Rules

- • Use CSSProperties for component/title/content instead of variables
- • Avoid coupling with VsInnerScrollStyleSet layout dependency
- • Apply styles directly to DOM elements for simpler responsive design

- • Use interface extension to inherit common properties from base interface
- • Apply same pattern consistently across similar components (VsHeader/VsFooter)

- • Consider if width/border fit better in component CSS properties object
- • Reduce duplication by leveraging existing CSSProperties type structure

## Reviewed Code

File: `packages/vlossom/src/components/vs-block/types.ts` (lines 26-26)

```
@@ -12,13 +12,16 @@ export type { VsBlock };
 
 export interface VsBlockRef extends ComponentPublicInstance<typeof VsBlock> {}
 
-export interface VsBlockStyleSet extends SizeStyleSet, BoxStyleSet {
-    boxShadow?: string;
-    fontColor?: string;
-
-    title?: {
-        backgroundColor?: string;
-        fontColor?: string;
-        padding?: string;
+export interface VsBlockStyleSet {
+    variables?: {
+        border?: string;
+        width?: string;
+        title?: {
+            backgroundColor?: string;
+            color?: string;
+            padding?: string;
+        };
     };
+    component?: CSSProperties;
+    layout?: VsInnerScrollStyleSet;
```

File: `packages/vlossom/src/components/vs-footer/README.md` (lines 92-92)

```
@@ -89,23 +89,7 @@
 
 ```typescript
 interface VsFooterStyleSet {
-    width?: string;
-    height?: string;
-
-    backgroundColor?: string;
-    border?: string;
-    borderRadius?: string;
-    padding?: string;
-    opacity?: string | number;
-
-    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
-    top?: string | number;
-    bottom?: string | number;
-    left?: string | number;
-    right?: string | number;
-    zIndex?: string;
-    fontColor?: string;
-    boxShadow?: string;
+    component?: CSSProperties;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** interface-extension, inheritance, DRY, consistency, type-reuse
**Category:** architecture

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

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** component, architecture, git, cssproperties, type-consolidation, interface-design, css-variables
**Category:** architecture

## Examples

### ✅ Correct

```
export interface VsBlockStyleSet {
    component?: CSSProperties;
    title?: CSSProperties;
    content?: CSSProperties;
}
```

Simplified interface using CSSProperties for each element

### ✅ Correct

```
<vs-responsive :class="['vs-block', colorSchemeClass]" :style="componentStyleSet.component" :grid :width>
        <vs-inner-scroll>
            <template #header v-if="$slots['title']">
                <div class="vs-block-title" :style="componentStyleSet.title">
                    <slot name="title" />
                </div>
            </template>
            <div class="vs-block-content" :style="componentStyleSet.content">
                <slot />
            </div>
        </vs-inner-scroll>
    </vs-responsive>
```

Direct style binding to component, title, and content elements

### ✅ Correct

```
ts
export interface VsBlockStyleSet {
    component?: CSSProperties;
    title?: CSSProperties;
    content?: CSSProperties;
}, html
    <vs-responsive :class="['vs-block', colorSchemeClass]" :style="componentStyleSet.component" :grid :width>
        <vs-inner-scroll>
            <template #header v-if="$slots['title']">
                <div class="vs-block-title" :style="componentStyleSet.title">
                    <slot name="title" />
                </div>
            </template>
            <div class="vs-block-content" :style="componentStyleSet.content">
                <slot />
            </div>
        </vs-inner-scroll>
    </vs-responsive>
```

Complete solution showing interface and template together

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** css-properties, style-binding, decoupling, responsive-design, interface-simplification
**Category:** architecture