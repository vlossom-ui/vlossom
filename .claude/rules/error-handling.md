---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Object Spread Error Handling

## Rules

- • Spreading undefined/missing variables object causes runtime errors
- • Ensure variables object exists before spreading in style binding

## Reviewed Code

File: `packages/vlossom/src/components/vs-dimmed/VsDimmed.vue` (lines 6-6)

```
@@ -1,6 +1,11 @@
 <template>
     <Transition name="dimmed">
-        <div v-if="isShow" class="vs-dimmed" :style="styleSetVariables" aria-hidden="true" />
+        <div
+            v-if="isShow"
+            class="vs-dimmed"
+            :style="{ ...styleSetVariables, ...componentStyleSet.component }"
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** object-spread, undefined-variables, style-binding, runtime-error
**Category:** error-handling
