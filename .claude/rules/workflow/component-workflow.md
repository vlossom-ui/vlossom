# Component Development Workflow

## Rules

- Write StyleSet type definition (`types.ts`) before implementing the component
- StyleSet interface must be finalized before writing template or script
- No `<style>` tags in Vue SFC files — all styles go in a separate `.css` file

## Rationale

StyleSet-first development forces API design decisions upfront, preventing style interfaces from being shaped by implementation convenience. Separating CSS into its own file keeps SFCs readable and makes style auditing easier.

## Examples

### ✅ Correct order

```
1. Define VsComponentStyleSet in types.ts
2. Write component CSS in VsComponent.css (using CSS variables from StyleSet)
3. Implement VsComponent.vue (template + script only, no <style> block)
```

### ❌ Incorrect

```vue
<template>...</template>
<script>...</script>
<style>
/* Inline styles in SFC */
.vs-component { ... }
</style>
```

Inline `<style>` blocks in SFCs are not allowed.
