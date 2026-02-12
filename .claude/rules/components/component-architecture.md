---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Component Architecture

## Rules

- • Apply component class/style to same element type (wrapper vs native element)
- • vs-input uses wrapper div, vs-textarea uses native textarea element

## Reviewed Code

File: `packages/vlossom/src/components/vs-textarea/VsTextarea.vue` (lines 25-25)

```
@@ -21,7 +22,7 @@
             ref="textareaRef"
             :id="computedId"
             :class="['vs-textarea', colorSchemeClass, classObj, stateClasses]"
-            :style="styleSetVariables"
+            :style="componentStyleSet.component"
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** component, architecture, vs-input, vs-textarea, textarea, consistency, styling-strategy, element-hierarchy, component-wrapper
**Category:** architecture
