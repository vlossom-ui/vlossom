---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Css Properties Style

## Rules

- • StyleSet should include CSSProperties for title, description, and content
- • Provides fine-grained styling control for each component section

## Reviewed Code

File: `packages/vlossom/src/components/vs-page/types.ts` (lines 15-15)

```
@@ -12,9 +12,10 @@ export type { VsPage };
 export interface VsPageRef extends ComponentPublicInstance<typeof VsPage> {}
 
 export interface VsPageStyleSet {
-    padding?: string;
-
-    title?: { padding?: string };
-
-    description?: { padding?: string };
+    variables?: {
+        padding?: string;
+        title?: { padding?: string };
+        description?: { padding?: string };
+    };
+    component?: CSSProperties;
```

## Examples

### ✅ Correct

```
{
    title?: CSSProperties;
    description?: CSSProperties;
    content?: CSSProperties;
}
```

Suggested structure with CSS properties for each section

### ✅ Correct

```
ts
{
    title?: CSSProperties;
    description?: CSSProperties;
    content?: CSSProperties;
}
```

Same structure showing TypeScript type annotation

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** css-properties, style-set, component-styling, type-definition, interface-design
**Category:** style
