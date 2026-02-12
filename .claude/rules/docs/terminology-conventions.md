---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Documentation

## Rules

- • Reference type definitions (StyleSet) not component names in docs
- • Link to specific type section, not general component docs

## Reviewed Code

File: `packages/vlossom/src/components/vs-button/README.md` (lines 84-84)

```
@@ -73,26 +73,45 @@
 
 ```typescript
 interface VsButtonStyleSet {
-    width?: string;
-    height?: string;
-
-    backgroundColor?: string;
-    border?: string;
-    borderRadius?: string;
-    padding?: string;
-    opacity?: string;
-
-    fontColor?: string;
-
-    loading?: {
-        width?: string;
-        height?: string;
-        color?: string;
-        barWidth?: string;
+    variables?: {
+        padding?: string;
     };
+    component?: CSSProperties;
+    loading?: VsLoadingStyleSet;
 }
 ```
 
+> **참고**: `loading`은 [VsLoadingStyleSet](../vs-loading/README.md#types)의 StyleSet을 사용합니다.
```

## Examples

### ❌ Incorrect

```
> **참고**: `loading`은 [VsLoading](../vs-loading/README.md#types)의 VsLoadingStyleSet을 사용합니다.
```

Incorrect: references component instead of type

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, readme, documentation, vsloading, vsloadingstyleset, type, vs-loading, type-reference, cross-reference, technical-writing, interface-reuse
**Category:** documentation
