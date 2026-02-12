---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Type Definition Documentation

## Rules

- • Undefined types should not appear in documentation without implementation
- • Type definitions must exist in source code before being documented

## Reviewed Code

File: `packages/vlossom/src/components/vs-inner-scroll/README.md` (lines 78-78)

```
@@ -71,6 +71,50 @@ function checkScroll() {
 </script>
 ```
 
+## Types
+
+```typescript
+interface VsInnerScrollStyleSet {
+    component?: CSSProperties;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** type-definition, documentation, interface, undeclared-type
**Category:** documentation
