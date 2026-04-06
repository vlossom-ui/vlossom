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

**Option 1 — Claude Code CLI:**

```bash
claude mcp add vlossom -- npx -y vlossom-mcp@latest
```

**Option 2 — Config file** (`.mcp.json` for Claude Code, `claude_desktop_config.json` for Claude Desktop):

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

### Options

| Environment variable | Default | Description |
|---|---|---|
| `VLOSSOM_MCP_STEPPER` | `on` | Pipeline stepper UX after each response. Set to `off` to disable. |

```json
{
  "mcpServers": {
    "vlossom": {
      "command": "npx",
      "args": ["-y", "vlossom-mcp@latest"],
      "env": {
        "VLOSSOM_MCP_STEPPER": "off"
      }
    }
  }
}
```

---

## Tools

### Components

| Tool                          | Description                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `clarify_intent`              | Disambiguates free-form or ambiguous queries; call this before searching when intent is unclear |
| `list_components`             | Returns the full list of Vlossom components with names and descriptions                  |
| `search_components`           | Searches by a specific component name or concrete keyword (e.g. `button`, `drawer`)     |
| `suggest_components`          | Recommends components based on a natural-language use case                               |
| `get_component`               | Returns props, StyleSet, events, slots, and methods for a component                      |
| `compare_components`          | Compares two components side-by-side with differences and recommendations                |
| `get_component_relationships` | Returns parent/child/sibling component relationships                                     |
| `get_component_source`        | Returns the raw Vue source file for a component                                          |

### API Reference

| Tool              | Description                                                                      |
| ----------------- | -------------------------------------------------------------------------------- |
| `get_directive`   | Returns usage and options for Vlossom directives (e.g. `v-scroll-shadow`)        |
| `get_composables` | Returns usage info for composables like `useColorScheme`, `useStyleSet`          |

### Style & Configuration

| Tool                  | Description                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `get_css_tokens`      | Returns all `--vs-*` CSS variables with default and dark-mode values, filterable by category      |
| `get_vlossom_options` | Returns available `createVlossom()` options and imperative plugin APIs (`$vsModal`, etc.)         |

### Setup & Versioning

| Tool                  | Description                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `check_vlossom_setup` | Checks whether an installed version is up-to-date and returns a setup checklist          |
| `get_changelog`       | Returns bundled Vlossom version history with breaking changes, features, and fixes        |

### GitHub Issues

| Tool                 | Description                                                                        |
| -------------------- | ---------------------------------------------------------------------------------- |
| `check_github_token` | Checks whether a GitHub token is configured for submitting issues                  |
| `set_github_token`   | Stores a GitHub PAT in memory for the current session                              |
| `draft_issue`        | Generates a structured issue template (bug / feature / question) with i18n support |
| `report_issue`       | Creates a GitHub issue on the vlossom-ui/vlossom repository                        |

### Code Generation

| Tool                      | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `generate_component_code` | Returns Vlossom coding rules, import statement, and SFC scaffold for code generation           |
| `generate_style_set`      | Returns a correctly structured StyleSet object for a component with classification explanation  |
| `adapt_type_to_component` | Maps a TypeScript interface to Vlossom component data (columns, options, etc.) with examples   |
| `validate_component_usage`| Checks a Vue SFC string for Vlossom rule violations (R01–R15) and returns issues with fixes    |

> `get_usage_examples` — call this any time to see annotated end-to-end walkthroughs of how tools chain together.

---

## Roadmap

| Version  | Tools                                                                          |
| -------- | ------------------------------------------------------------------------------ |
| ✅ 0.2.0 | `list_components`, issue tools (draft, report, token)                          |
| ✅ 0.3.0 | `get_component`, `search_components` + build-meta pipeline                     |
| ✅ 0.4.0 | `suggest_components`, `get_component_relationships`, `compare_components`      |
| ✅ 0.5.0 | Stepper UX (`_meta`), session isolation, stepper format improvements           |
| ✅ 0.6.0 | `clarify_intent` disambiguation gate                                           |
| ✅ 0.7.0 | `get_component_source`, `get_directive`, `get_composables`                     |
| ✅ 0.8.0 | `get_css_tokens`, `get_vlossom_options`, `get_changelog`, `check_vlossom_setup` |
| ✅ 0.8.x | `get_usage_examples`, `next_action` linked-list, `presentation_format` harness, `clarify_intent`-first routing, stepper session fix |
| ✅ 0.9.0 | `generate_component_code` (StyleSet-first, coding rules)                                     |
| ✅ 0.9.1 | `generate_style_set` (variables / component / child-ref philosophy)                          |
| ✅ 0.9.2 | `adapt_type_to_component` (TypeScript type → Vlossom component data)                         |
| ✅ 0.9.3 | `validate_component_usage` (rule-based SFC linter)                                           |
| ✅ 0.9.4 | `search_components` semantic enhancement (synonym map)                                       |

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
