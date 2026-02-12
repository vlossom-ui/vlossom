---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Variable Style

## Rules

- • Variable declarations should be bound to template attributes
- • Use :style binding syntax for dynamic CSS variables
- • Avoid unused variable declarations without template bindings

## Reviewed Code

File: `packages/vlossom/src/components/vs-expandable/VsExpandable.vue` (lines 3-3)

```
@@ -1,7 +1,7 @@
 <template>
     <Transition name="vs-expand" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
-        <div v-if="open" class="vs-expandable-wrapper" :style="componentStyleSet">
-            <div class="vs-expandable-content">
+        <div v-if="open" class="vs-expandable-wrapper" :style="styleSetVariables">
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** variable, aria, naming, accessibility, v-bind, template-binding, vue-directives, css-variables
**Category:** style
