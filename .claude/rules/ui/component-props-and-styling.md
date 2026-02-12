---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Style

## Rules

- • Keep styleSetVariables in :style prop for CSS variables
- • Pass componentStyleSet directly to :style-set prop instead of merging
- • Avoid mixing style concerns by using appropriate props for their purpose

## Reviewed Code

File: `packages/vlossom/src/components/vs-theme-button/VsThemeButton.vue` (lines 6-6)

```
@@ -2,9 +2,8 @@
     <vs-toggle
         :model-value="isDarkTheme"
         class="vs-theme-button"
-        :color-scheme="colorScheme"
-        :style="styleSetVariables"
-        :style-set="componentStyleSet"
+        :color-scheme
+        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, variable, aria, naming, accessibility, stylesetvariables, vs-toggle, style-set, prop-separation, css-variables, component-props, object-spreading
**Category:** style
