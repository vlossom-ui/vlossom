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

| Tool                  | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `list_components`     | Returns the full list of Vlossom components with names and descriptions     |
| `check_github_token`  | Checks whether a GitHub token is configured for submitting issues           |
| `set_github_token`    | Stores a GitHub PAT in memory for the current session                       |
| `draft_issue`         | Generates a structured issue template (bug / enhancement / question)        |
| `report_issue`        | Creates a GitHub issue on the vlossom-ui/vlossom repository                 |

---

## GitHub Issue Flow

```
1. check_github_token
   → isConfigured: false  →  set_github_token(token)   (ask user for PAT)
   → isConfigured: true   →  proceed to step 2

2. draft_issue(summary, type)
   → returns suggestedTitle, bodyTemplate, requiredSections

3. Collect each requiredSection from the user one by one

4. Show the final content and ask for user confirmation

5. report_issue(title, body, labels?)
   → returns the created issue URL and number
```

> **Note:** `set_github_token` stores the token in memory only. It is not written to disk and is cleared when the process restarts.

---

## Local Development (inside the monorepo)

```bash
cd packages/vlossom-mcp

# Install dependencies
npm install

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
