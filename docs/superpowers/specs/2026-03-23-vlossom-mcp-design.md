# Vlossom MCP Design

**Date**: 2026-03-23
**Status**: Draft

---

## Overview

Vlossom MCP is a Model Context Protocol server that helps external developers use the Vlossom Vue UI component library more effectively through AI assistants (e.g., Claude). It provides tools for component documentation lookup, type adaptation, and code generation — all grounded in structured metadata extracted from the Vlossom source.

**Target users**: External developers building projects with Vlossom who interact via AI assistants.

**Core value**: AI assistants can accurately answer "how do I use VsTable with my data type?" or "generate a login form with Vlossom" by querying precise, structured component metadata.

---

## Current Vlossom Structure

Understanding the source material is foundational to the pipeline design.

### Component Directory Layout

Every component follows an identical pattern across ~50 components:

```
packages/vlossom/src/components/vs-{name}/
├── README.md          ← documentation source (parser input 1)
├── types.ts           ← type source (parser input 2)
├── Vs{Name}.vue       ← component implementation
├── Vs{Name}.css       ← styles
├── __tests__/
└── __stories__/
```

All components are exported from:
- `component-map.ts` — `VlossomComponents` registry object
- `index.ts` — individual named exports + type exports

### README.md Structure

Each README follows a consistent template:

```markdown
# Vs{Name}              ← component name + description
**Available Version**   ← minimum supported version
## 기본 사용법           ← code examples (HTML blocks)
## Props               ← markdown table (Prop|Type|Default|Required|Description)
## Types               ← TypeScript interface code block (StyleSet)
## Events              ← markdown table
## Slots               ← markdown table
## Methods             ← markdown table (optional)
```

### types.ts Structure

Each `types.ts` follows a consistent pattern:

```typescript
// 1. Vue global component registration
declare module 'vue' {
    interface GlobalComponents { VsButton: typeof VsButton }
}

// 2. Ref type (exposed methods)
export interface VsButtonRef extends ComponentPublicInstance<typeof VsButton> {}

// 3. StyleSet (core customization API)
export interface VsButtonStyleSet {
    variables?: { padding?: string };   // CSS custom properties
    component?: CSSProperties;          // direct styles on root element
    loading?: VsLoadingStyleSet;        // child component style delegation
}
```

### Key Patterns for the Parser

- **StyleSet 3-layer structure**: always `variables`, `component`, and child component StyleSet references
- **Cross-component StyleSet references**: e.g., `loading?: VsLoadingStyleSet` — requires a dependency graph
- **Props tables**: consistently `|`-delimited markdown tables
- **StyleSet in README**: the `## Types` section contains a TypeScript code block that mirrors `types.ts` — the pipeline validates these match

---

## Architecture

### Package Location

Vlossom MCP lives as a first-class package inside the existing monorepo:

```
packages/
├── vlossom/                    ← existing library
└── vlossom-mcp/                ← new package
    ├── scripts/
    │   └── build-meta.ts       ← build pipeline entry point
    ├── src/
    │   ├── server.ts            ← MCP server entry point
    │   ├── tools/
    │   │   ├── discovery.ts     ← list, search, suggest, relationships
    │   │   ├── understanding.ts ← get_component, get_style_set, get_version_info
    │   │   ├── adaptation.ts    ← adapt_type_to_component
    │   │   └── generation.ts    ← generate_component_code, validate_component_usage
    │   └── extension/
    │       └── semantic.ts      ← (optional) approach 3 extension point
    └── data/
        └── components-meta.json ← pipeline output (git-tracked)
```

`pnpm-workspace.yaml` already includes `packages/*`, so `vlossom-mcp` is automatically included.

### Data Flow

```
[vlossom source]
  README.md + types.ts (per component)
        ↓
[build-meta.ts pipeline]
  README parser + ts-morph type parser
        ↓
[components-meta.json]
        ↓
[MCP server]
  Discovery → Understanding → Adaptation → Generation/Validation tools
        ↓
[AI assistant (Claude, etc.)]
        ↓
[external developer]
```

---

## Build Pipeline

### Trigger

The pipeline runs on `release/*` branch push or `v*` tag creation via GitHub Actions.

```yaml
# .github/workflows/build-mcp-meta.yml
on:
  push:
    branches: ['release/*']
    tags: ['v*']
```

### Pipeline Steps

```
1. pnpm install
2. pnpm --filter vlossom-mcp build:meta
   (executes scripts/build-meta.ts)
        ↓
3. components-meta.json generated
        ↓
4. Detect changes → commit & push if changed
   "chore(mcp): update components-meta [skip ci]"
        ↓
5. Trigger MCP server restart (webhook or SSH)
```

### Parser Internals (`build-meta.ts`)

**Stage 1 — Component list collection**
Read `component-map.ts`, extract `VlossomComponents` keys → `['VsButton', 'VsInput', ...]`

**Stage 2 — README parser** (runs per component, in parallel)
Uses `unified`/`remark` to parse markdown:
- Title + description
- `availableVersion`
- Props table → `{ name, type, default, required, description }[]`
- Code blocks → usage examples
- Events / Slots / Methods tables

**Stage 3 — TypeScript parser** (uses `ts-morph`)
Analyzes `types.ts` AST:
- Extracts `Vs{Name}StyleSet` interface fully
- Resolves nested types and cross-component StyleSet references
- Builds a dependency graph (e.g., `VsButtonStyleSet → VsLoadingStyleSet`)

**Stage 4 — Merge & validate**
- Combines README data + type data
- Validates that the StyleSet code block in `## Types` matches the `ts-morph` extraction
- Logs warnings on mismatch (does not fail the build)

**Stage 5 — Output**
Writes `packages/vlossom-mcp/data/components-meta.json`

### Output Schema (`components-meta.json`)

```json
{
  "version": "2.0.0",
  "generatedAt": "2026-03-23T00:00:00Z",
  "components": {
    "VsButton": {
      "name": "VsButton",
      "description": "다양한 스타일과 상태를 지원하는 버튼 컴포넌트",
      "availableVersion": "2.0.0+",
      "props": [
        {
          "name": "loading",
          "type": "boolean",
          "default": "false",
          "required": false,
          "description": "로딩 상태 표시"
        }
      ],
      "events": [],
      "slots": [{ "name": "default", "description": "버튼 내부 콘텐츠" }],
      "methods": [],
      "styleSet": {
        "raw": "interface VsButtonStyleSet { ... }",
        "parsed": {
          "variables": { "padding": "string?" },
          "component": "CSSProperties",
          "loading": { "$ref": "VsLoadingStyleSet" }
        }
      },
      "examples": ["<vs-button primary>버튼</vs-button>"],
      "dependencies": ["VsLoadingStyleSet"]
    }
  },
  "_meta": {
    "extension": {
      "embeddingReady": false,
      "vectorStorePath": null
    }
  }
}
```

---

## MCP Tools

Tools are organized by the AI's natural workflow: discover → understand → adapt → generate/validate.

### Group 1: Discovery — "What should I use?"

| Tool | Description |
|---|---|
| `list_components` | Returns full component list with one-line descriptions |
| `search_components(keyword)` | Keyword-based search against component names and descriptions |
| `suggest_components(useCase)` | Natural language use case → recommended component combination with rationale |
| `get_component_relationships(name)` | Returns components frequently used together (e.g., VsForm ↔ VsInput, VsTable ↔ VsPagination) |

> `search_components` uses keyword matching. `suggest_components` uses intent-based reasoning. When `_meta.extension.embeddingReady` is `true`, `search_components` is automatically replaced with the semantic search implementation.

### Group 2: Understanding — "How does this work?"

| Tool | Description |
|---|---|
| `get_component(name)` | Returns full props / events / slots / methods / examples |
| `get_style_set(name)` | Returns StyleSet type structure + usage examples |
| `get_version_info(name, prop?)` | Returns minimum supported version for a component or specific prop |

### Group 3: Adaptation — "How do I fit my code to this?"

| Tool | Description |
|---|---|
| `adapt_type_to_component(userType, name, mode)` | Maps user's TypeScript type → Vlossom props (`data` mode), or style object → StyleSet (`style` mode). `auto` infers mode from type shape. Returns `mappedCode`, `explanation`, and `unmapped[]`. |

**Example — data mode:**
```typescript
// input: interface User { id: number; name: string; email: string }
// adapt_type_to_component(User, 'VsTable', 'data')
const columns = [
  { label: 'ID',    key: 'id' },
  { label: 'Name',  key: 'name' },
  { label: 'Email', key: 'email' },
]
```

**Example — style mode:**
```typescript
// input: { color: 'red', size: 'large', rounded: true }
// adapt_type_to_component({...}, 'VsButton', 'style')
const styleSet: VsButtonStyleSet = {
  component: { color: 'red', borderRadius: '9999px' },
  variables: { padding: '0 2rem' },
}
```

### Group 4: Generation & Validation — "Build and verify"

| Tool | Description |
|---|---|
| `generate_component_code(name, requirements)` | Component name + requirements → Vue template code (handles forms, tables, modals, etc.) |
| `validate_component_usage(code)` | Vue code snippet → checks prop type errors, missing required props, invalid slot usage |

### Typical AI Call Flows

```
"Make a login form"
  → suggest_components("login form")
  → get_component_relationships("VsForm")
  → adapt_type_to_component(LoginDto, "VsForm", "data")
  → generate_component_code("VsForm", { fields: [...] })
  → validate_component_usage(generatedCode)

"How do I style VsButton?"
  → get_style_set("VsButton")
  → adapt_type_to_component(myStyle, "VsButton", "style")
```

---

## Extension Point: Semantic Search (Approach 3)

`src/extension/semantic.ts` is a stub today. When the team is ready to add vector-based semantic search:

1. Run an embedding script over `components-meta.json` → vector store
2. Set `_meta.extension.embeddingReady: true` and `vectorStorePath` in the JSON
3. MCP server startup detects this and activates the semantic implementation of `search_components`
4. No changes to tool interfaces — consumers are unaffected

This preserves full backward compatibility and keeps the upgrade path zero-friction.

---

## Monorepo Integration

### `package.json`

```json
{
  "name": "vlossom-mcp",
  "scripts": {
    "build:meta": "tsx scripts/build-meta.ts",
    "dev": "tsx src/server.ts",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "ts-morph": "latest",
    "remark": "latest",
    "remark-parse": "latest"
  },
  "devDependencies": {
    "tsx": "latest"
  }
}
```

### MCP Server Startup Sequence

```
1. Load data/components-meta.json
2. Check _meta.extension.embeddingReady
   → true:  activate semantic.ts, replace search_components
   → false: use keyword-based search_components
3. Register all MCP tools
4. Begin listening
```

---

## Out of Scope

- Bundling metadata inside the `vlossom` npm package (unnecessary given self-hosted server)
- Runtime source file parsing (build-time pipeline is sufficient)
- Real-time component hot-reload in the MCP server
