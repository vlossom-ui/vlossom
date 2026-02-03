# Optional: Scope this rule to specific files

## Rules

- • Variables prop may be redundant since primary already uses theme variables
- • Consider simplifying interface to only component?: CSSProperties
- • Uncertainty about styling needs for x button element

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** variable, component, 스타일, aria, naming, style, architecture, accessibility, git, prop-simplification, css-properties, theme-variables, interface-design
**Category:** architecture

- • Remove 'variables' prop if not needed, keep only 'component?: CSSProperties'
- • Theme variables already handle primary styling adequately
- • Consider if x-button needs custom styling before adding complexity

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** variable, component, 스타일, aria, naming, style, architecture, accessibility, git, props-interface, css-properties, theming, simplification, api-design
**Category:** architecture