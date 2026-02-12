---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Set Architecture

## Rules

- • Reviewer questions if legacy style utility types are being deprecated
- • Removal of inherited types suggests architectural simplification

## Reviewed Code

File: `packages/vlossom/src/components/vs-button/types.ts` (lines 16-16)

```
@@ -13,8 +12,11 @@ export type { VsButton };
 
 export interface VsButtonRef extends ComponentPublicInstance<typeof VsButton> {}
 
-export interface VsButtonStyleSet extends SizeStyleSet, BoxStyleSet {
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** style-set, type-inheritance, deprecation, interface-refactor
**Category:** architecture
