# vlossom-mcp

[![npm version](https://img.shields.io/npm/v/vlossom-mcp)](https://www.npmjs.com/package/vlossom-mcp)
[![license](https://img.shields.io/npm/l/vlossom-mcp)](./LICENSE)
[![node](https://img.shields.io/node/v/vlossom-mcp)](https://nodejs.org)

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that lets AI assistants like Claude accurately reference the [Vlossom UI](https://github.com/vlossom-ui/vlossom) component library and submit GitHub issues directly from the conversation.

---

## Installation

No installation needed — run directly with `npx`:

```bash
npx vlossom-mcp
```

---

## Setup

Add the following to your MCP client configuration (e.g. `.mcp.json` for Claude Code, or `claude_desktop_config.json` for Claude Desktop):

```json
{
  "mcpServers": {
    "vlossom": {
      "command": "npx",
      "args": ["vlossom-mcp"]
    }
  }
}
```

---

## Tools

### Discovery & Lookup

| Tool                          | Description                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `list_components`             | Returns the full list of Vlossom components with names and descriptions                  |
| `get_component`               | Returns props, StyleSet, events, and slots for a component                               |
| `search_components`           | Searches components by keyword across name, description, and props                       |
| `suggest_components`          | Recommends components based on a natural-language use case                               |
| `compare_components`          | Compares two components side-by-side with differences and recommendations                |
| `get_component_relationships` | Returns parent/child/sibling component relationships                                     |
| `get_component_source`        | Returns the raw Vue source file for a component                                          |
| `get_directive`               | Returns usage and options for Vlossom directives (e.g. `v-scroll-shadow`)                |
| `get_composables`             | Returns usage info for composables like `useColorScheme`, `useStyleSet`                  |
| `get_usage_examples`          | Returns annotated end-to-end pipeline walkthroughs showing how to chain tools together   |

### Style System

| Tool             | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `get_css_tokens`      | Returns all `--vs-*` CSS variables with default and dark-mode values, filterable by category |
| `get_vlossom_options` | Returns available `createVlossom()` options and imperative plugin APIs (`$vsModal`, etc.)     |
| `get_changelog`       | Fetches Vlossom version history from npm registry; shows breaking changes and features        |
| `check_vlossom_setup` | Checks whether an installed version is up-to-date and returns a setup checklist              |

### Code Generation

| Tool                      | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `generate_component_code` | Generates a Vue SFC from a requirement; always designs StyleSet first _(planned)_              |
| `generate_style_set`      | Generates a correct StyleSet applying the variables/component/child-ref philosophy _(planned)_ |
| `adapt_type_to_component` | Converts an existing TypeScript type to Vlossom component props _(planned)_                    |

### Validation

| Tool                       | Description                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `validate_component_usage` | Validates that component usage in code follows Vlossom conventions _(planned)_      |

### GitHub Issue Reporting

| Tool                 | Description                                                                        |
| -------------------- | ---------------------------------------------------------------------------------- |
| `check_github_token` | Checks whether a GitHub token is configured for submitting issues                  |
| `set_github_token`   | Stores a GitHub PAT in memory for the current session                              |
| `draft_issue`        | Generates a structured issue template (bug / feature / question) with i18n support |
| `report_issue`       | Creates a GitHub issue on the vlossom-ui/vlossom repository                        |

---

## GitHub Issue Flow

```
1. check_github_token
   → isConfigured: false  →  set_github_token(token)   (ask user for PAT)
   → isConfigured: true   →  proceed to step 2

2. draft_issue(summary, type, language?)
   → returns suggestedTitle, sections[], type, language

3. Collect each required section from the user one by one

4. Show the final content and ask for user confirmation

5. report_issue(title, type, language, sectionContents, labels?)
   → returns the created issue URL and number
```

> **Note:** `set_github_token` stores the token in memory only. It is not written to disk and is cleared when the process restarts.
>
> **i18n:** `draft_issue` automatically detects the user's language (`ko` / `en`) and returns section headings in the matching language.

---

## Roadmap

| Version  | Tools                                                                          |
| -------- | ------------------------------------------------------------------------------ |
| ✅ 0.2.0 | `list_components`, issue tools (draft, report, token)                          |
| ✅ 0.3.0 | `get_component`, `search_components` + build-meta pipeline                     |
| ✅ 0.4.0 | `suggest_components`, `get_component_relationships`, `compare_components`      |
| ✅ 0.5.0 | Stepper UX (`_meta`), session isolation, stepper format improvements           |
| ✅ 0.6.0 | `clarify_intent` disambiguation gate (Phase 4-3)                               |
| ✅ 0.7.0 | `get_component_source`, `get_directive`, `get_composables`                               |
| ✅ 0.8.0 | `get_css_tokens`, `get_vlossom_options`, `get_changelog`, `check_vlossom_setup`           |
| 0.8.0    | `generate_component_code` (StyleSet-first), `generate_style_set`, `adapt_type_to_component` |
| 1.0.0    | `validate_component_usage`, semantic search, MCP Prompts                       |

---

## Local Development (inside the monorepo)

```bash
cd packages/vlossom-mcp

# Install dependencies
npm install

# Generate component data
npm run generate

# Build
npm run build

# Run directly
node dist/index.js
```

Use this MCP config to connect to the local build:

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

---

## Requirements

- Node.js 18+

## License

MIT
