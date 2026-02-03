---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Merging Architecture

## Rules

- The useStyleSet hook is a custom React/Vue composable that manages style sets for components with a three-tier merge strategy. The merge priority ensures baseStyleSet (component defaults) is overridden by styleSet (user-provided props), which is then overridden by additionalStyleSet (dynamic component props like height or position). The hook returns two values: componentStyleSet (the fully merged style object) and styleSetVariables (CSS custom properties converted from the variables section). A critical behavior occurs when the same property appears in both the 'variables' and 'component' sections of a styleSet: the component property always wins. This happens because of two factors: the spread operator order places component properties after variables ({ ...styleSetVariables, ...componentStyleSet.component }), and CSS specificity rules favor inline properties over CSS variable references. This documentation serves as a reference to prevent confusion about style resolution order in the system.

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** style-merging, css-variables, composable-hook, vue-composition-api, css-specificity, property-precedence, reactive-refs, design-system
**Category:** architecture
