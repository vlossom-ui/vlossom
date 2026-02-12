---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Style Architecture

## Rules

- • Store size as string in variables property for CSS variable usage
- • Avoid TypeScript-specific types (Size) in style configuration
- • Maintain separation between styling (CSS) and type system (TS)

## Reviewed Code

File: `packages/vlossom/src/components/vs-message/types.ts` (lines 19-19)

```
@@ -10,3 +11,7 @@ declare module 'vue' {
 export type { VsMessage };
 
 export interface VsMessageRef extends ComponentPublicInstance<typeof VsMessage> {}
+
+export interface VsMessageStyleSet {
+    size?: Size;
+}
```

## Examples

### ✅ Correct

```
export interface VsMessageStyleSet {
    variables?: {
        size?: string; // icon size 때문에 variables 처리 해야 할거임
    },
    component?: CSSProperties;
}
```

Correct approach: size as string in variables for CSS

### ❌ Incorrect

```
export interface VsMessageStyleSet {
    size?: Size;
}
```

Incorrect: Size type shouldn't be in style-set directly

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, variable, component, aria, export, naming, architecture, error-handling, accessibility, git, dependencies, vsmessagestyleset, interface, style-set, css-variables, type-separation, styling-convention
**Category:** architecture
