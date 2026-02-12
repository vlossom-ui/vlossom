---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Test Coverage Testing

## Rules

- • Reviewer uncertain if skeleton component needs any tests at all
- • Original styleSet test was removed, leaving only basic rendering test
- • Considering: remove all tests vs. restore styleSet test coverage

## Reviewed Code

File: `packages/vlossom/src/components/vs-skeleton/__tests__/vs-skeleton.test.ts` (lines 15-15)

```
@@ -3,26 +3,15 @@ import { mount } from '@vue/test-utils';
 import VsSkeleton from '../VsSkeleton.vue';
 
 describe('VsSkeleton', () => {
-    describe('style-set', () => {
-        it('styleSet을 통해 커스텀 크기를 설정할 수 있어야 한다', () => {
-            // given
-            const customStyleSet = {
-                width: '150px',
-                height: '75px',
-            };
-
-            // when
-            const wrapper = mount(VsSkeleton, {
-                props: {
-                    styleSet: customStyleSet,
-                },
-            });
+    describe('기본 렌더링', () => {
+        it('기본 상태에서 올바르게 렌더링되어야 한다', () => {
+            // given, when
+            const wrapper = mount(VsSkeleton);
 
             // then
-            expect(wrapper.vm.styleSetVariables).toEqual({
-                '--vs-skeleton-width': '150px',
-                '--vs-skeleton-height': '75px',
-            });
+            expect(wrapper.find('.vs-skeleton').exists()).toBe(true);
+            expect(wrapper.find('.vs-skeleton-bg').exists()).toBe(true);
+            expect(wrapper.find('.vs-skeleton-content').exists()).toBe(true);
         });
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** test-coverage, skeleton-component, styleSet, minimal-testing, test-removal
**Category:** testing
