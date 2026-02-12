---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Partial Style

## Rules

- • Using Partial<T> is redundant when type already has optional properties
- • Question mark operators (?) already make properties optional
- • Explicit optional properties better express intent than Partial wrapper

## Reviewed Code

File: `packages/vlossom/src/components/vs-bar/VsBar.vue` (lines 34-34)

```
@@ -26,14 +30,18 @@ export default defineComponent({
         const { colorScheme, styleSet, primary, position } = toRefs(props);
 
         const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
+        const baseStyleSet: ComputedRef<Partial<VsBarStyleSet>> = computed(() => ({}));
         const additionalStyleSet: ComputedRef<Partial<VsBarStyleSet>> = computed(() => {
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** partial, optional, typescript, redundancy, type-definition
**Category:** style
