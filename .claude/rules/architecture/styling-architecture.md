---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Set Architecture

## Rules

- • Split styleSet into variables (CSS vars) and component styles (CSSProperties)
- • Group base component parts under 'component' namespace
- • Apply direct styles via CSSProperties to override defaults, remove unused vars

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style-set, css-variables, composable, interface-refactor, component-styling
**Category:** architecture
