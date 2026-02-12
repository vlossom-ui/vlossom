---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Shorthand Style

## Rules

- • Use object shorthand when referencing nested properties from objects
- • Consolidate componentStyleSet references using dot notation access

## Reviewed Code

File: `packages/vlossom/src/components/vs-button/VsButton.vue` (lines 11-11)

```
@@ -3,12 +3,12 @@
         ref="buttonRef"
         :type="type"
         :class="['vs-button', colorSchemeClass, classObj]"
-        :style="styleSetVariables"
+        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
         :disabled="disabled"
         :tabindex="disabled || loading ? -1 : 0"
     >
         <div v-if="loading" class="vs-button-loading">
-            <vs-loading :color-scheme="colorScheme" :style-set="loadingStyleSet" />
+            <vs-loading :color-scheme="colorScheme" :style-set="componentStyleSet.loading" />
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** shorthand, object-destructuring, property-access, refactoring, style-binding
**Category:** style
