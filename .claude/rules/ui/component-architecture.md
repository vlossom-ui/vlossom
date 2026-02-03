# Optional: Scope this rule to specific files

## Rules

- • Define VsBlockStyleSet with component, title, content properties
- • Apply styles directly to vs-responsive and child divs, not nested scroll
- • Maintain responsive functionality while simplifying component coupling

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** responsive-design, component-decoupling, style-interface, css-properties, component-structure
**Category:** architecture

- • Define VsTooltipStyleSet interface with variables and component properties
- • Apply styleSetVariables and component styles separately in template
- • Better aligns with original design intent for style management

- • Keep only styleSetVariables in style prop for clarity
- • Move other style props to vs-toggle's style-set for better organization

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, variable, aria, naming, accessibility, stylesetvariables, vs-toggle, style-set, prop-separation, component-organization, style-delegation
**Category:** architecture

## Examples

### ✅ Correct

```
vs-placement-${computedPlacement}, vs-align-${align}
```

Dynamic class bindings for tooltip positioning and alignment

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** class, component, style, variable, naming, aria, export, computedplacement, align, div, architecture, accessibility, git, dependencies, vstooltipstyleset, interface-design, css-variables, style-separation, props-structure
**Category:** architecture