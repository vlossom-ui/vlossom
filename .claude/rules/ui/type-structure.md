---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Component Architecture

## Rules

- • Nest CSS custom properties under 'variables' object for clarity
- • Separate component styling structure from CSS variable definitions

## Reviewed Code

File: `packages/vlossom/src/components/vs-pagination/types.ts` (lines 24-24)

```
@@ -19,9 +19,9 @@ export interface VsPaginationRef extends ComponentPublicInstance<typeof VsPagina
 }
 
 export interface VsPaginationStyleSet {
-    gap?: string;
-
+    variables?: {
+        gap?: string;
+    };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** component, architecture, git, cssproperties, style-organization, css-variables, interface-design, type-structure
**Category:** architecture
