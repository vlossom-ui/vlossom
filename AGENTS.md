# Vlossom Agent Instructions

This file is the canonical compressed replacement for the legacy `.claude/rules/` files. Keep shared agent instructions here. If older rule files conflict with this document, follow this document.

## Project

- Vlossom is a Vue 3 UI component library.
- Main package: `packages/vlossom`.
- MCP package: `packages/vlossom-mcp`.
- Use Node `24.12.0` for `packages/vlossom` unless a package-specific engine says otherwise.
- Run main package commands from `packages/vlossom`: `pnpm dev`, `pnpm storybook`, `pnpm lint`, `pnpm type-check`, `pnpm test`, `pnpm test:coverage`, `pnpm build`.
- Component directories follow `vs-[name]/` with `Vs[Name].vue`, `Vs[Name].css`, `types.ts`, `README.md`, optional `__tests__/`, and optional `__stories__/`.
- Complex components may add focused files such as validation rules, icons, or component-specific composables.

## General Engineering

- Prefer existing project patterns over new abstractions.
- Keep changes narrowly scoped to the requested behavior.
- Remove dead declarations, unused variables, redundant comments, and migration leftovers.
- Combine multiple imports from the same module into one import.
- Avoid `computed()` for non-reactive constants such as empty objects.
- Guard spreads of optional style objects; do not spread `undefined` in templates or computed style merges.
- Bind script variables to templates when they exist for rendering behavior, especially `:style` bindings for dynamic CSS variables.
- Use self-explanatory code. Add comments only for non-obvious rationale, constants, or behavior that code cannot express clearly.

## StyleSet Architecture

- Prefer a small, explicit API surface. Do not add StyleSet fields without a real DOM target, CSS variable consumer, or user need.
- Use `CSSProperties` for direct element styles instead of re-declaring standard CSS properties.
- Keep `variables` only for values consumed as CSS custom properties, size tokens, breakpoint-driven values, inherited child overrides, or cases where direct element styling cannot work.
- Prefer semantic StyleSet keys that mirror UI parts: `component`, `wrapper`, `header`, `content`, `footer`, `title`, `description`, `bar`, `value`, `label`, `option`, `selectedOption`, `step`, `activeStep`, etc.
- Avoid deep nesting unless it matches real component structure or is required to style nested wrappers.
- Put default StyleSet values in `baseStyleSet` or `getStyleSetProps(defaultStyleSet)`, not in ad hoc computed fallback logic.
- Use `additionalStyleSet` for dynamic values derived from props such as width, height, grid size, gaps, loading config, or runtime state.
- Merge order should preserve defaults while allowing overrides: base defaults, user `styleSet`, then dynamic component values when they must win.
- Keep component-level styles and CSS variables separate: `componentStyleSet` for direct `:style` or child `:style-set`, `styleSetVariables` for CSS custom properties.
- When both a variable and a direct component style affect the same CSS property, the direct component style should intentionally win by merge/spread order.
- Apply component classes and styles to the same element type consistently. If one component styles a wrapper and another styles a native element, make the distinction explicit.
- If slot content needs styling, wrap it in a container with a StyleSet target. A StyleSet property without a DOM attachment point is not useful.
- For components wrapping another Vlossom component, prefer delegating styles through the wrapped component's native `style-set` prop instead of duplicating its internals.
- Extend parent StyleSet types only when the child component actually wraps or behaves as that parent. Otherwise, use direct `CSSProperties` or focused semantic keys.
- Use `Omit` only to exclude clearly irrelevant inherited properties.
- Do not use `Partial<T>` when the target interface already marks properties optional.
- Verify StyleSet API names before documenting or using them; do not invent fields such as non-existent `type` configuration.

## Component Patterns

- Use existing layout components such as `VsInnerScroll`, `VsBlock`, `VsResponsive`, and input wrappers when they already solve the structure.
- Prefer composition over duplicating layout, scroll, label, message, or validation logic.
- For input-like components, preserve wrapper behavior and technical limits of native `input`/`textarea` styling.
- `vs-input` uses a wrapper; `vs-textarea` uses the native textarea as the styled element. Keep class/style targets consistent with that structure.
- Preserve size behavior when refactoring. Removing size classes or `--vs-*-size-*` variables must not break `xs`, `sm`, `md`, `lg`, or `xl`.
- For image-like components, put wrapper dimensions on the wrapper and object-fit/object-position behavior on the actual media element.
- For chip/loading/skeleton/progress/theme-button-style components, keep sizing math consistent and avoid changing visual defaults accidentally.
- For expandable/accordion-style components, keep background and padding on the element that preserves animation continuity.
- For select/steps-like active states, ensure active/focused/selected styles merge only when that state applies.
- Loading/default configs must merge with user StyleSet values without dropping defaults.

## CSS And Styling

- Use CSS custom properties with fallbacks only when values need runtime override, StyleSet control, nesting, or responsive behavior.
- Avoid CSS variables for static values that Tailwind utilities can express clearly.
- Prefer Tailwind utilities for fixed simple values such as `w-full`, `h-4`, and `rounded-full` when consistent with local style.
- Use `rem` for scalable component dimensions unless the surrounding component intentionally uses another unit.
- Do not explicitly set CSS properties to browser or component defaults unless it clarifies an override.
- Preserve existing responsive patterns such as wrapper width variables with `initial` fallback when similar components already use them.
- Use percentage and `calc()` carefully for parent-relative child dimensions; explain non-obvious constants or repeating-decimal layout math.
- Check CSS specificity after refactors, especially for nested input elements and child components consuming parent variables.
- Avoid `height: 100%` on inputs unless the parent has a defined height and the layout has been verified.

## TypeScript

- Prefer precise optional properties over broad `Partial<T>`.
- Use standard CSS property names such as `background`, not custom misspellings such as `backGround`.
- Use descriptive semantic names over generic names when they convey a real part of the component.
- Keep TypeScript style types aligned with how CSS consumes the values. Do not use TS-only size types in objects that become CSS variables unless conversion is explicit.
- Keep type definitions and runtime bindings in sync. Every public style interface property should be consumed by a component, delegated to a child, or removed.

## Documentation

- Write technical documentation in English.
- Documentation must match actual implementation, type names, and component complexity.
- Do not document undefined or planned types as if they already exist.
- Props tables must include all public component props, including `styleSet` when available.
- Link component-level `styleSet` behavior with global StyleSet configuration through `VlossomOptions` when relevant.
- Reference exact type names and specific sections, not generic labels.
- Prefer links to source or API docs over duplicating large interface definitions.
- Put practical examples near the beginning, then advanced usage and details.
- Keep documentation focused on current usage and rules; move migration history or cleanup notes out unless they are user-facing.
- Explain magic numbers or replace them with named constants.
- When translating or editing docs, check for accidental unrelated changes.
- Keep only documentation that serves users, API reference, project setup, or reusable agent/tool instructions.

## Testing

- Test behavior, user-facing outcomes, shared logic, edge cases, and regressions.
- Avoid tests that only assert DOM structure without behavior.
- Avoid duplicate tests across layers. Test shared composables/utilities once, then add component tests only where integration behavior differs.
- High test volume increases development cost; focus on value-added coverage.
- Use deterministic tests. If a command or feature can vary between runs, make it reproducible or document expected variability.
- Keep `given/when/then` comments only when they improve readability. Clear test names and structure are preferred over obvious comments.
- Purely visual or trivial rendering tests are optional unless they guard a known regression or StyleSet contract.

## Review And AI Tooling

- Treat AI-generated review comments as suggestions that require verification against the actual codebase.
- Check linked GitHub discussions or PR comments before acting on cross-referenced feedback.
- Do not let narrow StyleSet feedback override broader Vlossom features such as `vs-responsive`.
- If feedback is inconsistent across runs, preserve only the stable underlying rule.

## Git And PRs

- Use Conventional Commits: `<type>(<scope>): <description>`.
- Common types: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`, `ci`, `build`, `perf`, `revert`.
- Verify meaningful changes with the narrowest reliable command first, then broader checks when risk justifies it.
- Before committing or handing off larger changes in `packages/vlossom`, prefer `pnpm lint`, `pnpm type-check`, and `pnpm test` when practical.
