# Optional: Scope this rule to specific files

## Rules

- • Use component's native style-set prop instead of custom variables structure
- • Pass header/content styles directly to vs-inner-scroll via :style-set prop
- • Simplifies style composition by leveraging existing component interfaces

- • Active state styles being merged with base styles unexpectedly
- • Decision to proceed with current structure despite inconsistency
- • Pattern applies to both vs-select and vs-steps components

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

File: `packages/vlossom/src/components/vs-steps/VsSteps.vue` (lines 156-156)

```
@@ -124,16 +134,34 @@ export default defineComponent({
             handleKeydown,
         } = useIndexSelector(steps, disabled);
 
-        const progressWidth = computed(() => {
+        const progressWidth: ComputedRef<CSSProperties> = computed(() => {
             const dimensionKey = vertical.value ? 'height' : 'width';
             if (gapCount.value === 0) {
                 return { [dimensionKey]: '0%' };
             }
 
             const percentage = selectedIndex.value === NOT_SELECTED ? 0 : (selectedIndex.value / gapCount.value) * 100;
-            return { [dimensionKey]: `${percentage}%` };
+            return {
+                ...componentStyleSet.value.progress,
+                ...(isSelected(selectedIndex.value) ? componentStyleSet.value.progressActive : {}),
+                [dimensionKey]: `${percentage}%`,
+            };
         });
 
+        function getStepStyleSet(index: number): CSSProperties {
+            return {
+                ...componentStyleSet.value.step,
+                ...(isPrevious(index) || isSelected(index) ? componentStyleSet.value.activeStep : {}),
+            };
+        }
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** architecture, state-management, git, vs-select, style-merging, conditional-styling, css-properties, component-consistency
**Category:** style

## Examples

### ✅ Correct

```
<vs-responsive :class="['vs-block', colorSchemeClass]" :style="componentStyleSet.component" :grid :width>
        <vs-inner-scroll :style-set="{ header: componentStyleSet.title,  content: componentStyleSet.content }">
            <template #header v-if="$slots['title']">
                <div class="vs-block-title">
                    <slot name="title" />
                </div>
            </template>
            <div class="vs-block-content">
                <slot />
            </div>
        </vs-inner-scroll>
    </vs-responsive>
```

Proposed approach using VsInnerScrollStyleSet for cleaner API

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style-set-prop, component-composition, vue-props, nested-styles
**Category:** architecture