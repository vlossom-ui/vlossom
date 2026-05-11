# vlossom-mcp Architecture

This document maps the current implementation. For mission, non-goals, and policy rationale, see [PHILOSOPHY.md](./PHILOSOPHY.md).

## Runtime Surface

`src/server.ts` registers the default surface in this order:

1. `search_vlossom`
2. `get_vlossom_reference`
3. `scaffold_vlossom_code`
4. `validate_vlossom_usage`
5. core resources

The old granular public tool surface and side-workflow tools have been removed rather than kept as opt-in modes.

## Facade Tools

| Tool                     | Implementation Role                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `search_vlossom`         | Uses a compact component index by default and loads heavier domains only when the caller passes an explicit target.              |
| `get_vlossom_reference`  | Resolves source-of-truth references from GitHub-backed metadata/source/release data, registries, options, tokens, and rules.     |
| `scaffold_vlossom_code`  | Verifies explicit registry ids and detected version support, then returns project setup, StyleSet, or component-usage harnesses. |
| `validate_vlossom_usage` | Runs setup, SFC/snippet, StyleSet, version-support, prop, event, slot, and default Vlossom-first validators.                     |

All four facade tools return structured output and `next_actions` for agent routing. Serialized JSON text is retained for compatibility.

## Internal Modules

```txt
src/internal/
  search/
    component-search-service.ts
    coverage-resolver.ts
  reference/
    reference-data.ts
    reference-service.ts
  scaffold/
    component-usage-scaffolder.ts
    project-setup-scaffolder.ts
    scaffold-service.ts
    style-set-scaffolder.ts
  utils/
    synonym-expander.ts
  validation/
    project-setup-validator.ts
    rule-registry.ts
    sfc-validator.ts
    style-set-validator.ts
    validate-vlossom-usage.ts
    validation-summary.ts
    vlossom-first-validator.ts
  version/
    version-service.ts
```

Supporting services live under `src/services`, shared response/types under `src/types` and `src/utils`, and resources under `src/resources`.

## Data Sources

Runtime Vlossom API data is GitHub-backed and resolved for the project version. The MCP no longer bundles generated `src/data/*.json` or `dist/data/*.json` metadata.

The runtime registry checks GitHub refs in this order:

```txt
vlossom-v{version} -> v{version} -> {version} -> main
```

If no version-specific ref exists, the registry falls back to `main` and adds a warning to `versionContext.warnings`.

| Source                                                              | Purpose                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| GitHub `packages/vlossom/src/components/*/README.md` and `types.ts` | Component props, slots, events, v-model, methods, and StyleSet metadata. |
| GitHub `packages/vlossom/src/directives`                            | Directive reference data.                                                |
| GitHub `packages/vlossom/src/composables`                           | Composable reference data.                                               |
| GitHub `packages/vlossom/src/styles/*.css`                          | Vlossom CSS token list.                                                  |
| `relationships-registry.ts`                                         | Curated component relationship map.                                      |
| `coding-rules.ts`                                                   | Coding, StyleSet, setup, and Vlossom-first rule data.                    |
| `search-synonyms.ts`                                                | Search synonym expansion data.                                           |

The registry uses process memory cache only. There is no persistent generated cache.

Version-sensitive behavior is centralized in `internal/version/version-service.ts`. Tools resolve the user's Vlossom version from explicit `version` input or `packageJson`, return `versionContext`, annotate registry entries with `versionSupport`, and report APIs unavailable in the detected version.

The build pipeline is intentionally minimal:

```txt
npm run build     # clean dist, compile TypeScript
npm test          # build, type-check scripts, run contract tests
npm run verify    # same verification path as npm test
```

`prepublishOnly` runs `npm run verify` so the published package contains a compiled MCP server and no generated JSON data baseline.

## Resources

Resources expose stable `vlossom://` references without increasing the public tool count:

```txt
vlossom://components
vlossom://components/{name}
vlossom://tokens/css
vlossom://options/create-vlossom
vlossom://rules/coding
vlossom://rules/style-set
vlossom://rules/vlossom-first
vlossom://changelog
vlossom://decisions
vlossom://mcp/usage-examples
```

## Validation Coverage

`validate_vlossom_usage` is a source-of-truth harness, not a general code-style or product-policy gate. It checks:

- Vlossom project setup, dependency presence, plugin registration, styles, and `createVlossom({ components })`
- component existence against the registry
- component availability against the detected Vlossom version
- prop, slot, event, and `v-model` correctness against GitHub-resolved metadata
- StyleSet shape, GitHub-resolved metadata keys, and token naming
- native controls and third-party UI imports by default when Vlossom coverage exists

`PREFER_VLOSSOM_COMPONENT` is a default Vlossom-first guard. Callers can pass `context.vlossomFirst: "off"` for explicit exceptions.

## Tests

Acceptance coverage lives in `test/*.test.ts`.

Important checks include:

- only the four core tools are registered by default
- side-workflow tools are not registered
- search and scaffold use registry-backed components only
- search, reference, scaffold, and validation expose project-version support checks
- unknown ids are rejected
- default Vlossom-first validation reports native and third-party UI usage when Vlossom coverage exists
- empty code is skipped, not valid
- project setup import/options are validated
- docs describe the same current public contract
- build output is cleaned so removed tool modules do not remain in the package tarball
- package source, scripts, and tests do not use authored JS files
