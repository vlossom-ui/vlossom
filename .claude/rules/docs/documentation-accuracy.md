---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Documentation

## Rules

- • When claiming inheritance/extension, implementation should reflect complexity
- • Documentation should match actual code structure and complexity

## Reviewed Code

File: `packages/vlossom/src/components/vs-footer/README.md` (lines 96-96)

```
@@ -89,26 +89,12 @@
 
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
 }
 ```
 
+`VsFooterStyleSet`은 `VsBarStyleSet`을 확장하며, `component` 속성을 통해 CSS 속성을 직접 지정할 수 있습니다.
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** style, vsfooterstyleset, vsbarstyleset, inheritance, interface-design, documentation-accuracy, complexity-mismatch
**Category:** documentation
