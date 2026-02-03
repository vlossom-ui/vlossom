# Optional: Scope this rule to specific files

## Rules

- • Avoid duplicate tests that repeat style-set-composable coverage
- • Component-level style-set tests increase maintenance cost unnecessarily
- • Centralize style-set testing at composable layer to reduce test overhead

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, component, testing, test, 테스트, style-set, architecture, set, style-set-composable, test-duplication, maintenance-cost, test-coverage, centralized-testing
**Category:** testing

- • Avoid duplicate tests across layers to reduce maintenance cost
- • Test shared logic once at composable/utility level, not per component
- • High test volume increases development cost; focus on value-added coverage

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, component, testing, test, 테스트, style-set, architecture, set, style-set-composable, test-duplication, maintenance-cost, test-coverage, layered-testing, composable-pattern
**Category:** testing