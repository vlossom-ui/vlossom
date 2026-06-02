# Vlossom Agent Instructions

Vlossom is a Vue 3 and TypeScript UI component library.
The main package exposes tree-shakeable components, composables, directives, plugins, shared props, stores, styles, and utilities.
Its core product promises are consistent theming, responsive behavior, validation, overlays, and developer-friendly APIs.

Keep this file short and repo-specific.
Do not add temporary notes or version-specific cleanup history.

## Project Map

- `packages/vlossom` is the main UI library package.
- `packages/vlossom-mcp` is a separate MCP server for Vlossom reference data.
- `CLAUDE.md` imports this file for Claude Code; keep shared guidance here.
- Source code and package docs are the source of truth when this file is stale.

## Commands

Run Vlossom commands from `packages/vlossom`.

- `pnpm dev` starts the playground.
- `pnpm storybook` starts Storybook.
- `pnpm lint` runs ESLint and Stylelint.
- `pnpm type-check` runs Vue TypeScript checks.
- `pnpm test` runs Vitest.
- `pnpm test:coverage` runs coverage.
- `pnpm build` runs type-check and library build.

Run MCP commands from `packages/vlossom-mcp`.

- `npm run build` builds the server.
- `npm test` runs its test suite.
- `npm run verify` runs the publish verification path.

## Source Contracts

- Treat public component behavior as one contract.
- When that contract changes, update implementation, types, styles, docs, examples, stories, and tests together.
- Public APIs must be predictable, easy to bind, and hard to misuse.
- Do not invent public API in docs, examples, stories, or tests before it exists in code.
- When adding or removing a public component, update every public surface that exposes the component.
- Keep global plugin, overlay, theme, responsive, validation, and customization behavior compatible with existing usage.

## Implementation

- Prefer existing components, composables, prop helpers, utilities, and registration patterns before adding local machinery.
- Put repeated behavior in shared code; keep component files focused on component-specific wiring.
- Preserve user-provided options when merging defaults.
- Keep enumerable lists consistently ordered; prefer local grouping first, then alphabetical order.
- Bind data, styles, and behavior to the element that actually owns them.
- Avoid broad descendant styling that changes child components by accident.

## Documentation

- Documentation must describe the current implementation.
- Keep paired English and Korean documentation aligned.
- Follow the relevant documentation template for components, composables, plugins, directives, and utilities.
- Put practical usage examples before advanced details.
- Remove stale history and planned behavior from user-facing docs.

## Testing

- Test behavior at the layer that owns it.
- Add regression tests for fixed bugs and public contract changes.
- Avoid tests that only restate implementation structure.
- Use the narrowest reliable check first; run broader checks for shared behavior, public API, build output, or visual contract changes.

## Git

- Use Conventional Commits.
