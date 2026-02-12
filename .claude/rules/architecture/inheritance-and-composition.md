---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Architecture

## Rules

- • Inherit from VsBarStyleSet to reuse shared style definitions
- • Avoid duplicating common styling properties across components

## Reviewed Code

File: `packages/vlossom/src/components/vs-footer/README.md` (lines 92-92)

```
@@ -89,23 +89,7 @@
 
 ```typescript
 interface VsFooterStyleSet {
-    width?: string;
-    height?: string;
-
-    backgroundColor?: string;
-    border?: string;
-    borderRadius?: string;
-    padding?: string;
-    opacity?: string | number;
-
-    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
-    top?: string | number;
-    bottom?: string | number;
-    left?: string | number;
-    right?: string | number;
-    zIndex?: string;
-    fontColor?: string;
-    boxShadow?: string;
+    component?: CSSProperties;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, vsbarstyleset, interface-extension, inheritance, code-reuse, type-composition
**Category:** architecture
