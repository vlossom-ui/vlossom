# vlossom-mcp

[![npm version](https://img.shields.io/npm/v/vlossom-mcp)](https://www.npmjs.com/package/vlossom-mcp)
[![license](https://img.shields.io/npm/l/vlossom-mcp)](./LICENSE)
[![node](https://img.shields.io/node/v/vlossom-mcp)](https://nodejs.org)

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for AI agents building with [Vlossom UI](https://github.com/vlossom-ui/vlossom).

`vlossom-mcp` is a compact source-of-truth harness. It helps agents discover, reference, scaffold setup shapes, and validate Vlossom APIs without inventing component contracts.

It is not a documentation chatbot. It is not a generic Vue generator. It is not a GitHub issue bot.

## Install

Run it directly:

```bash
npx vlossom-mcp
```

Register it in Claude Code:

```bash
claude mcp add vlossom -- npx -y vlossom-mcp@latest
```

Or add it to an MCP config file:

```json
{
    "mcpServers": {
        "vlossom": {
            "command": "npx",
            "args": ["-y", "vlossom-mcp@latest"]
        }
    }
}
```

## Public Contract

The default public MCP surface is intentionally limited to four tools:

| Tool                     | Role                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `search_vlossom`         | Search a compact registry-backed component index by default, with explicit targets for directives, composables, tokens, options, changelog, and rules. |
| `get_vlossom_reference`  | Retrieve source-of-truth APIs, examples, GitHub-backed source and changelog data, relationships, setup options, tokens, and rules.                     |
| `scaffold_vlossom_code`  | Create project setup, StyleSet, or explicit component-usage harnesses while checking requested ids against detected version support.                   |
| `validate_vlossom_usage` | Validate SFCs, snippets, StyleSets, project setup, default Vlossom-first usage, and detected version support against GitHub-resolved metadata.         |

The public workflow is:

```txt
Search -> Reference -> Scaffold -> Validate
```

1. Search with `search_vlossom`.
2. Reference exact APIs and rules with `get_vlossom_reference`.
3. Scaffold a Vlossom-native starting point with `scaffold_vlossom_code`.
4. Validate before finalizing with `validate_vlossom_usage`.

## Vlossom-First Harness Defaults

When an agent uses this MCP, Vlossom-first is the default. The MCP should keep UI work on registry-backed Vlossom components whenever the detected Vlossom version has coverage.

This is still a harness, not a generic code-style reviewer. It reports Vlossom-specific facts and violations such as native controls or third-party UI where Vlossom coverage exists. Use `context.vlossomFirst: "off"` only for explicit user exceptions.

For a new project:

```txt
scaffold_vlossom_code(kind: "project-setup")
  -> validate_vlossom_usage(kind: "project-setup")
  -> search_vlossom(intent: "build-ui")
```

For a migration:

```txt
validate_vlossom_usage(kind: "project-setup")
  -> search_vlossom(intent: "build-ui")
  -> get_vlossom_reference
  -> validate_vlossom_usage
```

For feature work:

```txt
search_vlossom(intent: "build-ui")
  -> get_vlossom_reference(include: ["api"])
  -> scaffold_vlossom_code(components: ["VsButton"])
  -> validate_vlossom_usage
```

`validate_vlossom_usage` treats empty code as `status: "skipped"` with `valid: false`. Empty input is never valid.

## Installed Version

Vlossom metadata is resolved from GitHub for the user's installed version. The facade tools return `versionContext` when a project version is provided or detected.

Pass the user's installed Vlossom version through `version` or `packageJson`:

```ts
search_vlossom({ query: 'button', target: 'component', packageJson });
get_vlossom_reference({ type: 'component', id: 'VsButton', version: '2.0.0-beta.1' });
scaffold_vlossom_code({ kind: 'component-usage', description: 'form', context: { packageJson } });
validate_vlossom_usage({ kind: 'sfc', code, packageJson });
```

The runtime checks refs in this order: `vlossom-v{version}`, `v{version}`, `{version}`, then `main`. If it falls back to `main`, `versionContext.warnings` states that the version-specific guarantee is weakened.

Components, directives, and composables include `versionSupport`. Scaffolding and validation report unsupported components, while the agent decides whether to upgrade, replace, or avoid that API.

## Runtime Data

Component, directive, composable, token, source, and release references are fetched from GitHub on demand instead of bundled into generated JSON data files. Use facade tools with `version` or `packageJson` for exact version-specific guidance.

## Local Development

```bash
cd packages/vlossom-mcp
npm install
npm run build
npm test
npm run verify
node dist/index.js
```

Local MCP config:

```json
{
    "mcpServers": {
        "vlossom": {
            "command": "node",
            "args": ["packages/vlossom-mcp/dist/index.js"]
        }
    }
}
```

## Document Map

- [PHILOSOPHY.md](./PHILOSOPHY.md) explains the mission, non-goals, Vlossom-first harness policy, validation policy, and side-effect policy.
- [ARCHITECTURE.md](./ARCHITECTURE.md) maps the current implementation surface and internal modules.
- [FEATURES.md](./FEATURES.md) gives one-sentence briefs for active features.
- [DECISIONS.md](./DECISIONS.md) is a chronological decision log and may mention historical tool names.

## Requirements

- Node.js 18+

## License

MIT
