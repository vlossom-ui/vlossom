---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Css Variables Style

## Rules

- • Width styling not critical for this component unlike other components
- • Already wrapped in vs-responsive, making width variable redundant
- • Avoid adding unnecessary CSS custom properties without clear use case

## Reviewed Code

File: `packages/vlossom/src/components/vs-input-wrapper/VsInputWrapper.css` (lines 11-11)

```
@@ -1,13 +1,15 @@
 @reference 'tailwindcss';
 
 .vs-input-wrapper {
+    --vs-input-wrapper-width: initial;
     --vs-input-wrapper-label-marginBottom: initial;
     --vs-input-wrapper-label-fontColor: initial;
     --vs-input-wrapper-label-fontSize: initial;
     --vs-input-wrapper-label-fontWeight: initial;
-
     --vs-input-wrapper-messages-marginTop: initial;
 
+    width: var(--vs-input-wrapper-width, 100%);
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** css-variables, unnecessary-code, component-design, responsive-wrapper
**Category:** style
