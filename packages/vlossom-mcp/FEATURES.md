# vlossom-mcp Feature Briefs

This file gives one-sentence briefs for active feature areas. For mission and policy, see [PHILOSOPHY.md](./PHILOSOPHY.md); for implementation structure, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Core Contract

- `search_vlossom` is the compact discovery entry point; component search uses a lightweight index by default and heavier domains are explicit targets.
- `get_vlossom_reference` is the source-of-truth lookup layer for exact GitHub-backed metadata, source, release data, relationships, setup options, tokens, and rules.
- `scaffold_vlossom_code` creates project setup, StyleSet, and explicit component-usage harnesses while reporting unknown or version-unsupported registry ids.
- `validate_vlossom_usage` checks SFCs, snippets, StyleSets, project setup, and detected Vlossom version support against source-of-truth metadata.

## Policy And Enforcement

- Vlossom-first guidance is the default; it reports native or third-party UI alternatives when the detected Vlossom version has coverage, with explicit opt-out support.
- Project setup validation checks Vlossom dependencies, plugin setup, styles, required `createVlossom` options, and third-party UI dependencies by default.
- Version support enforcement resolves `packageJson` or explicit `version`, returns `versionContext`, annotates `versionSupport`, and reports `VERSION_UNSUPPORTED` for unavailable APIs.
- StyleSet validation compares objects against GitHub-resolved component metadata and flags unsupported keys, variable misuse, and token naming issues.

## Supporting Surfaces

- Core resources expose stable `vlossom://` references for components, tokens, setup options, rules, changelog, decisions, and usage examples without adding public tools.
- The old granular tool surface has been removed so the public contract stays compact.
- Issue submission and debug stepper side workflows have been removed so the MCP remains a source-of-truth harness.
- Component, directive, composable, token, source, and release references are fetched from GitHub on demand instead of bundled in data JSON.
- Build verification runs TypeScript compilation, script type-checking, and contract tests before publish.

## Internal Module Map

- `internal/search` resolves queries, synonym expansion, and UI requirement coverage.
- `internal/reference` turns exact ids into source-of-truth component, option, token, changelog, source, and rule references.
- `internal/scaffold` builds setup, StyleSet, and explicit component usage harnesses around registry facts.
- `internal/validation` runs API, setup, default Vlossom-first, and StyleSet checks.
- `resources` registers read-only MCP references that support the four-tool workflow without expanding the tool count.
