---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Git Style

## Rules

- • CSS custom properties must be preserved if referenced in component styles
- • Replacing variable with hardcoded value removes theming flexibility

## Reviewed Code

File: `packages/vlossom/src/components/vs-accordion/VsAccordion.css` (lines 10-10)

```
@@ -1,46 +1,35 @@
 .vs-accordion {
-    --vs-accordion-backgroundColor: initial;
+    --vs-accordion-arrowColor: initial;
+    --vs-accordion-arrowSize: initial;
+    --vs-accordion-arrowSpacing: initial;
     --vs-accordion-border: initial;
-    --vs-accordion-borderRadius: initial;
-    --vs-accordion-padding: initial;
-    --vs-accordion-opacity: initial;
-
     --vs-accordion-width: initial;
-    --vs-accordion-arrowColor: initial;
-
-    --vs-accordion-title-backgroundColor: initial;
-    --vs-accordion-title-fontColor: initial;
-    --vs-accordion-title-height: initial;
-    --vs-accordion-title-padding: initial;
-
-    --vs-accordion-expand-fontColor: initial;
 
     @apply relative overflow-hidden;
 
-    opacity: var(--vs-accordion-opacity, 1);
-    border: var(--vs-accordion-border, 1px solid var(--vs-line-color));
-    border-radius: var(--vs-accordion-borderRadius, calc(var(--vs-radius-ratio) * var(--vs-radius-md)));
+    border: 1px solid var(--vs-line-color);
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** git, https, http, image, security, api, ci-cd, accordion, border, vs-accordion-border, user-attachments, b336-39a345706f62, css-variables, theming, customization, breaking-change
**Category:** style
