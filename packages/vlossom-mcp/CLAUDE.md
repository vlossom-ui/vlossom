# vlossom-mcp Development Rules

Applies only to `packages/vlossom-mcp`.

## Working Principle

Prefer deletion, consolidation, or source-of-truth reuse before adding another rule, document section, data file, or tool. If a file is no longer needed, remove it and update the small set of callers that depended on it. Do not preserve obsolete behavior by adding a new guardrail around it.

## Public Surface

The default public MCP surface is limited to four facade tools:

1. `search_vlossom`
2. `get_vlossom_reference`
3. `scaffold_vlossom_code`
4. `validate_vlossom_usage`

Side-workflow tools are not part of the surface.

## Agent Policy

Treat this package as a Vlossom-first source-of-truth harness. Do not invent component names or APIs; get exact data from `search_vlossom`, `get_vlossom_reference`, resources, or validation output.

Pass the user's installed Vlossom version whenever possible. Use `packageJson` or `version` so tools can return `versionContext`, annotate `versionSupport`, and report APIs unavailable in that project version.

When this MCP is in use, generated or reviewed UI should remain Vlossom-first by default. Use native controls or third-party UI only for explicit user exceptions, migration staging, or uncovered requirements.

Before relying on a component API, call `get_vlossom_reference`. Before treating generated or user-written Vlossom code as final, call `validate_vlossom_usage`.

## Change Discipline

When changing behavior, update only the documents that directly own that behavior:

- User-facing install or usage: `README.md`
- Runtime/module map: `ARCHITECTURE.md`
- Mission or policy: `PHILOSOPHY.md`
- Historical rationale: `DECISIONS.md`
- Agent editing rules: this file

Do not update every document by default. `DECISIONS.md` is historical and may mention removed tools.

Before adding a tool, verify the behavior cannot be expressed through the four facade tools, a resource, or an internal service. Before adding a rule, verify the simpler fix is not deleting stale code or data.

## Validation

Run the narrowest useful checks for the change, and run the full package test before release-sensitive edits:

```bash
npm run build
npm run verify
npm test
npx tsc -p tsconfig.scripts.json
```
