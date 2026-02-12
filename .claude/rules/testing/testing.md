# Optional: Scope this rule to specific files

## Rules

- • Retain test section comments (given/then) for test readability
- • Structured test comments help understand test phases

- • Test code with clear structure (given/when/then) doesn't need comments
- • Self-documenting test names and code structure preferred over comments

## Reviewed Code

File: `packages/vlossom/src/components/vs-avatar/__tests__/va-avatar.test.ts` (lines 28-28)

```
@@ -4,28 +4,86 @@ import VsAvatar from './../VsAvatar.vue';
 
 describe('VaAvatar', () => {
     it('text contents를 slot에 넣을 수 있다', () => {
-        // given
         const text = 'AVATAR';
         const wrapper = mount(VsAvatar, {
             slots: {
                 default: text,
             },
         });
 
-        // then
         expect(wrapper.html()).toContain(text);
     });
 
     it('image contents를 slot에 넣을 수 있다', () => {
-        // given
         const imgTag = '<img src="test-image" alt="avatar">';
         const wrapper = mount(VsAvatar, {
             slots: {
                 default: imgTag,
             },
         });
 
-        // then
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** test-comments, given-then, test-structure, code-comments
**Category:** testing

File: `packages/vlossom/src/components/vs-bar/__tests__/vs-bar.test.ts` (lines 36-36)

```
@@ -16,4 +16,27 @@ describe('VsBar', () => {
             expect(wrapper.classes()).toContain('vs-primary');
         });
     });
+
+    describe('복합 styleSet 조합', () => {
+        it('styleSet과 props가 동시에 주어지면 props가 우선되어야 한다', () => {
+            // given, when
+            const wrapper = mount(VsBar, {
+                props: {
+                    position: 'fixed',
+                    styleSet: {
+                        component: {
+                            position: 'absolute',
+                            backgroundColor: '#ff0000',
+                        },
+                    },
+                },
+            });
+
+            // then
+            // props(additionalStyleSet)가 styleSet보다 우선되므로 position은 'fixed'
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** 테스트, testing, documentation, code-comments, self-documenting, test-structure, given-when-then
**Category:** testing