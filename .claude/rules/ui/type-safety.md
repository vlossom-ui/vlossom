# Optional: Scope this rule to specific files

## Rules

- • Keep width/height properties in StyleSet when CSS uses CSS variables
- • CSS custom properties (--vs-theme-button-*) require corresponding types

- • Reviewer concerned that switching to CSSProperties removes custom properties
- • Original interface had structured variables for specific styling options
- • Change may eliminate type-safe access to component-specific styles

## Reviewed Code

File: `packages/vlossom/src/components/vs-theme-button/types.ts` (lines 18-18)

```
@@ -12,6 +11,11 @@ export type { VsThemeButton };
 
 export interface VsThemeButtonRef extends ComponentPublicInstance<typeof VsThemeButton> {}
 
-export interface VsThemeButtonStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
-    iconColor?: string;
+export interface VsThemeButtonStyleSet {
+    variables?: {
+        width?: string;
+        height?: string;
```

File: `packages/vlossom/src/components/vs-drawer/types.ts` (lines 21-21)

```
@@ -16,11 +16,17 @@ export interface VsDrawerRef extends ComponentPublicInstance<typeof VsDrawer> {
     closeDrawer: () => void;
 }
 
-export interface VsDrawerStyleSet extends BoxStyleSet {
-    position?: 'absolute' | 'fixed';
-    size?: string;
-    boxShadow?: string;
-    zIndex?: number;
-
+export interface VsDrawerStyleSet {
+    variables?: {
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        padding?: string;
+        opacity?: number;
+        size?: string;
+        boxShadow?: string;
+    };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** type-safety, interface-design, css-properties, style-typing
**Category:** architecture

## Examples

### ✅ Correct

```
.vs-theme-icon {
    @apply absolute top-1/2 left-1/2 flex items-center justify-center opacity-0;
    transform: scale(0.4) rotate(270deg) translateX(-50%) translateY(-50%);
    transform-origin: top left;
    transition:
        opacity 0.4s ease-out,
        transform 0.4s ease-out;
    width: calc(var(--vs-theme-button-width, 2rem) * 2 / 3);
    height: calc(var(--vs-theme-button-height, 2rem) * 2 / 3);
    color: var(--vs-theme-button-iconColor, var(--vs-orange-400));

    &.vs-on {
        @apply opacity-100;
        transform: scale(1) rotate(0deg) translateX(-50%) translateY(-50%);
    }
}
```

Shows CSS using CSS variables that need corresponding TS types

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** css-variables, type-css-sync, custom-properties, stylesheet-reference
**Category:** style