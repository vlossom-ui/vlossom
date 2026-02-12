---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Color Api

## Rules

- • Simplify prop passing by removing redundant style-set configuration
- • Component should derive styles from color-scheme alone

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

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** color, scheme, color-scheme, prop-simplification, component-interface, minimal-props
**Category:** api
