---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# 테스트 Testing

## Rules

- • Eliminate tests that only verify DOM structure without testing behavior
- • Focus on tests that validate actual functionality and edge cases

## Reviewed Code

File: `packages/vlossom/src/components/vs-skeleton/__tests__/vs-skeleton.test.ts` (lines 32-32)

```
@@ -3,26 +3,32 @@ import { mount } from '@vue/test-utils';
 import VsSkeleton from '../VsSkeleton.vue';
 
 describe('VsSkeleton', () => {
-    describe('style-set', () => {
-        it('styleSet을 통해 커스텀 크기를 설정할 수 있어야 한다', () => {
+    describe('기본 렌더링', () => {
+        it('기본 상태에서 올바르게 렌더링되어야 한다', () => {
+            // given, when
+            const wrapper = mount(VsSkeleton);
+
+            // then
+            expect(wrapper.find('.vs-skeleton').exists()).toBe(true);
+            expect(wrapper.find('.vs-skeleton-bg').exists()).toBe(true);
+            expect(wrapper.find('.vs-skeleton-inner').exists()).toBe(true);
+        });
+    });
+
+    describe('슬롯', () => {
+        it('default 슬롯에 텍스트를 넣을 수 있어야 한다', () => {
             // given
-            const customStyleSet = {
-                width: '150px',
-                height: '75px',
-            };
+            const text = 'Something is loading...';
 
             // when
             const wrapper = mount(VsSkeleton, {
-                props: {
-                    styleSet: customStyleSet,
+                slots: {
+                    default: text,
                 },
             });
 
             // then
-            expect(wrapper.vm.styleSetVariables).toEqual({
-                '--vs-skeleton-width': '150px',
-                '--vs-skeleton-height': '75px',
-            });
+            expect(wrapper.find('.vs-skeleton-inner').text()).toBe(text);
         });
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** 테스트, testing, test-quality, meaningful-tests, DOM-testing, test-value
**Category:** testing
