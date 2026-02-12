---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Partial Type Style

## Rules

- • Avoid using Partial<T> wrapper in type annotations unnecessarily
- • Define complete types instead of making all properties optional

## Reviewed Code

File: `packages/vlossom/src/components/vs-text-wrap/VsTextWrap.vue` (lines 63-63)

```
@@ -53,16 +58,25 @@ export default defineComponent({
     setup(props, { emit }) {
         const { styleSet, link, width } = toRefs(props);
 
-        const additionalStyleSet = computed(() => {
+        const baseStyleSet: ComputedRef<Partial<VsTextWrapStyleSet>> = computed(() => ({}));
+
+        const additionalStyleSet: ComputedRef<Partial<VsTextWrapStyleSet>> = computed(() => {
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** partial-type, type-annotation, typescript, computed-ref
**Category:** style
