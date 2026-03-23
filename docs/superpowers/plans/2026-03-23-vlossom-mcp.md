# Vlossom MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-hosted MCP server that gives AI assistants accurate, structured knowledge of the Vlossom Vue UI library — enabling reliable component lookup, type adaptation, and code generation for external developers.

**Architecture:** A build pipeline (`build-meta.ts`) runs at each Vlossom release, parsing `README.md` and `types.ts` for all ~50 components into a single `components-meta.json`. An MCP server reads this file and exposes 11 tools grouped into Discovery, Understanding, Adaptation, Generation/Validation, and Action. Both the pipeline and server live in `packages/vlossom-mcp/` inside the existing monorepo.

**Tech Stack:** Node.js 20+, TypeScript, `@modelcontextprotocol/sdk`, `ts-morph` (TypeScript AST), `unified` + `remark` + `remark-parse` (Markdown), `@vue/compiler-dom` (Vue template AST), `@octokit/rest` (GitHub API), `vitest` (tests), `tsx` (script runner)

---

## File Map

```
packages/vlossom-mcp/
├── package.json
├── tsconfig.json          # src/ compilation (server build)
├── tsconfig.scripts.json  # scripts/ compilation (pipeline type-check)
├── vitest.config.ts
├── scripts/
│   ├── build-meta.ts          # Pipeline entry point
│   └── relationships.ts       # Hand-maintained component pairing data
├── src/
│   ├── server.ts              # MCP server entry — registers tools, starts listener
│   ├── types.ts               # Shared TypeScript types for meta schema (ComponentMeta, PropMeta, etc.)
│   ├── loader.ts              # Loads + caches components-meta.json at startup
│   └── tools/
│       ├── index.ts           # Exports all tool registrations
│       ├── discovery.ts       # list_components, search_components, suggest_components, get_component_relationships
│       ├── understanding.ts   # get_component, get_style_set, get_version_info
│       ├── adaptation.ts      # adapt_type_to_component
│       ├── generation.ts      # generate_component_code, validate_component_usage
│       └── action.ts          # report_issue
│   └── extension/
│       └── semantic.ts        # Stub — future semantic search swap-in
└── __tests__/
    ├── fixtures/
    │   ├── VsButton/
    │   │   ├── README.md      # Minimal sample README for parser tests
    │   │   └── types.ts       # Minimal sample types.ts for parser tests
    │   └── components-meta.json  # Pre-built fixture for tool tests
    ├── pipeline/
    │   ├── readme-parser.test.ts
    │   └── ts-parser.test.ts
    └── tools/
        ├── discovery.test.ts
        ├── understanding.test.ts
        ├── adaptation.test.ts
        ├── generation.test.ts
        └── action.test.ts
```

---

## Task 1: Package Scaffolding

**Files:**
- Create: `packages/vlossom-mcp/package.json`
- Create: `packages/vlossom-mcp/tsconfig.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "vlossom-mcp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build:meta": "tsx scripts/build-meta.ts",
    "dev": "tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "@octokit/rest": "^20.0.0",
    "@vue/compiler-dom": "^3.4.0",
    "remark": "^15.0.0",
    "remark-parse": "^11.0.0",
    "ts-morph": "^22.0.0",
    "unified": "^11.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.4.0",
    "vitest": "^1.0.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`** (src/ only — used for `pnpm build`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "__tests__"]
}
```

- [ ] **Step 2b: Create `tsconfig.scripts.json`** (scripts/ type-check — `tsx` runs scripts directly but this enables `tsc --project tsconfig.scripts.json` for CI type-checking)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["scripts/**/*", "src/types.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2c: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['__tests__/**/*.test.ts'],
    globals: false,
  },
});
```

- [ ] **Step 3: Install dependencies**

```bash
pnpm install
```

Expected: lockfile updated, `node_modules` populated.

- [ ] **Step 4: Commit**

```bash
git add packages/vlossom-mcp/package.json packages/vlossom-mcp/tsconfig.json packages/vlossom-mcp/tsconfig.scripts.json packages/vlossom-mcp/vitest.config.ts
git commit -m "chore(vlossom-mcp): scaffold package"
```

---

## Task 2: Shared Types (`src/types.ts`)

The schema for `components-meta.json`. Define this first — everything else depends on it.

**Files:**
- Create: `packages/vlossom-mcp/src/types.ts`

- [ ] **Step 1: Write the type definitions**

```typescript
// packages/vlossom-mcp/src/types.ts

export interface PropMeta {
  name: string;
  type: string;
  default: string | null;
  required: boolean;
  description: string;
}

export interface EventMeta {
  name: string;
  payload: string;
  description: string;
}

export interface SlotMeta {
  name: string;
  description: string;
}

export interface MethodMeta {
  name: string;
  parameters: string;
  description: string;
}

export interface StyleSetParsed {
  variables?: Record<string, unknown>;
  component?: string;           // "CSSProperties"
  [key: string]: unknown;       // child component StyleSet refs
}

export interface StyleSetMeta {
  raw: string;                  // raw TypeScript string from README ## Types block
  parsed: StyleSetParsed | null; // ts-morph extracted structure; null if parse failed
}

export interface ComponentMeta {
  name: string;
  description: string;
  availableVersion: string;
  props: PropMeta[];
  events: EventMeta[];
  slots: SlotMeta[];
  methods: MethodMeta[];
  styleSet: StyleSetMeta;
  examples: string[];
  dependencies: string[];       // StyleSet cross-refs, e.g. ["VsLoadingStyleSet"]
  relationships: string[];      // Paired components, e.g. ["VsLoading"]
}

export interface MetaExtension {
  embeddingReady: boolean;
  vectorStorePath: string | null;
}

export interface ComponentsMeta {
  version: string;
  generatedAt: string;
  components: Record<string, ComponentMeta>;
  _meta: {
    extension: MetaExtension;
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vlossom-mcp/src/types.ts
git commit -m "feat(vlossom-mcp): add shared meta schema types"
```

---

## Task 3: Test Fixtures

Create minimal sample files that the parser tests will use. These should NOT use real Vlossom files — isolated fixtures make tests deterministic.

**Files:**
- Create: `packages/vlossom-mcp/__tests__/fixtures/VsButton/README.md`
- Create: `packages/vlossom-mcp/__tests__/fixtures/VsButton/types.ts`
- Create: `packages/vlossom-mcp/__tests__/fixtures/components-meta.json`

- [ ] **Step 1: Create fixture README**

```markdown
# VsButton

A sample button component for testing.

**Available Version**: 2.0.0+

## 기본 사용법

```html
<template>
    <vs-button>Click me</vs-button>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `loading` | `boolean` | `false` | - | Show loading state |
| `disabled` | `boolean` | `false` | - | Disable the button |

## Types

```typescript
interface VsButtonStyleSet {
    variables?: {
        padding?: string;
    };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Button content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
```

- [ ] **Step 2: Create fixture types.ts**

```typescript
import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { VsLoadingStyleSet } from '../vs-loading/types';

export interface VsButtonStyleSet {
    variables?: {
        padding?: string;
    };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}
```

- [ ] **Step 3: Create fixture components-meta.json** (minimal, for tool tests)

```json
{
  "version": "2.0.0",
  "generatedAt": "2026-03-23T00:00:00Z",
  "components": {
    "VsButton": {
      "name": "VsButton",
      "description": "A sample button component for testing.",
      "availableVersion": "2.0.0+",
      "props": [
        { "name": "loading", "type": "boolean", "default": "false", "required": false, "description": "Show loading state" },
        { "name": "disabled", "type": "boolean", "default": "false", "required": false, "description": "Disable the button" }
      ],
      "events": [],
      "slots": [{ "name": "default", "description": "Button content" }],
      "methods": [],
      "styleSet": {
        "raw": "interface VsButtonStyleSet { variables?: { padding?: string }; component?: CSSProperties; loading?: VsLoadingStyleSet; }",
        "parsed": { "variables": { "padding": "string?" }, "component": "CSSProperties", "loading": { "$ref": "VsLoadingStyleSet" } }
      },
      "examples": ["<vs-button>Click me</vs-button>"],
      "dependencies": ["VsLoadingStyleSet"],
      "relationships": ["VsLoading"]
    },
    "VsInput": {
      "name": "VsInput",
      "description": "A text input component.",
      "availableVersion": "2.0.0+",
      "props": [
        { "name": "modelValue", "type": "string", "default": "''", "required": false, "description": "v-model value" }
      ],
      "events": [{ "name": "update:modelValue", "payload": "string", "description": "Emitted on input" }],
      "slots": [],
      "methods": [],
      "styleSet": { "raw": "interface VsInputStyleSet {}", "parsed": {} },
      "examples": ["<vs-input v-model=\"text\" />"],
      "dependencies": [],
      "relationships": ["VsForm", "VsInputWrapper"]
    }
  },
  "_meta": {
    "extension": { "embeddingReady": false, "vectorStorePath": null }
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/vlossom-mcp/__tests__/fixtures/
git commit -m "test(vlossom-mcp): add parser and tool test fixtures"
```

---

## Task 4: README Parser (`scripts/build-meta.ts` — README portion)

Extract a focused `parseReadme(componentDir)` function. Test it against the fixture before wiring into the full pipeline.

**Files:**
- Create: `packages/vlossom-mcp/scripts/readme-parser.ts`
- Create: `packages/vlossom-mcp/__tests__/pipeline/readme-parser.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/vlossom-mcp/__tests__/pipeline/readme-parser.test.ts
import { describe, it, expect } from 'vitest';
import path from 'path';
import { parseReadme } from '../../scripts/readme-parser';

const FIXTURE_DIR = path.resolve(__dirname, '../fixtures/VsButton');

describe('parseReadme', () => {
  it('extracts component name and description', async () => {
    const result = await parseReadme(FIXTURE_DIR);
    expect(result.name).toBe('VsButton');
    expect(result.description).toBe('A sample button component for testing.');
  });

  it('extracts availableVersion', async () => {
    const result = await parseReadme(FIXTURE_DIR);
    expect(result.availableVersion).toBe('2.0.0+');
  });

  it('extracts props table', async () => {
    const result = await parseReadme(FIXTURE_DIR);
    expect(result.props).toHaveLength(2);
    expect(result.props[0]).toEqual({
      name: 'loading',
      type: 'boolean',
      default: 'false',
      required: false,
      description: 'Show loading state',
    });
  });

  it('extracts slots table', async () => {
    const result = await parseReadme(FIXTURE_DIR);
    expect(result.slots).toHaveLength(1);
    expect(result.slots[0].name).toBe('default');
  });

  it('extracts code examples', async () => {
    const result = await parseReadme(FIXTURE_DIR);
    expect(result.examples.length).toBeGreaterThan(0);
    expect(result.examples[0]).toContain('vs-button');
  });

  it('extracts raw StyleSet from ## Types block', async () => {
    const result = await parseReadme(FIXTURE_DIR);
    expect(result.styleSetRaw).toContain('VsButtonStyleSet');
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
cd packages/vlossom-mcp && pnpm test -- readme-parser
```

Expected: FAIL — `parseReadme` not found.

- [ ] **Step 3: Implement `readme-parser.ts`**

```typescript
// packages/vlossom-mcp/scripts/readme-parser.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { readFile } from 'fs/promises';
import path from 'path';
import type { Root, Table, Code, Heading } from 'mdast';

export interface ReadmeParseResult {
  name: string;
  description: string;
  availableVersion: string;
  props: Array<{ name: string; type: string; default: string | null; required: boolean; description: string }>;
  events: Array<{ name: string; payload: string; description: string }>;
  slots: Array<{ name: string; description: string }>;
  methods: Array<{ name: string; parameters: string; description: string }>;
  examples: string[];
  styleSetRaw: string;
}

function tableToRows(table: Table): string[][] {
  return table.children.slice(1).map((row) =>
    row.children.map((cell) =>
      cell.children.map((n: any) => n.value ?? '').join('').trim()
    )
  );
}

function textOf(node: any): string {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(textOf).join('');
  return '';
}

export async function parseReadme(componentDir: string): Promise<ReadmeParseResult> {
  const content = await readFile(path.join(componentDir, 'README.md'), 'utf-8');
  const tree = unified().use(remarkParse).parse(content) as Root;

  const result: ReadmeParseResult = {
    name: '', description: '', availableVersion: '',
    props: [], events: [], slots: [], methods: [], examples: [], styleSetRaw: '',
  };

  let currentSection = '';

  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth === 1) {
      result.name = textOf(node);
    } else if (node.type === 'paragraph' && !result.description) {
      const text = textOf(node);
      if (!text.startsWith('**Available')) result.description = text;
    } else if (node.type === 'paragraph') {
      const text = textOf(node);
      const match = text.match(/\*\*Available Version\*\*:\s*(.+)/);
      if (match) result.availableVersion = match[1].trim();
    } else if (node.type === 'heading' && node.depth === 2) {
      currentSection = textOf(node);
    } else if (node.type === 'code') {
      if (currentSection === '기본 사용법' || currentSection.includes('사용법')) {
        if (node.lang === 'html') result.examples.push(node.value);
      }
      if (currentSection === 'Types' && node.lang === 'typescript') {
        result.styleSetRaw = node.value;
      }
    } else if (node.type === 'table') {
      const rows = tableToRows(node);
      if (currentSection === 'Props') {
        result.props = rows.map(([name, type, def, required, description]) => ({
          name: name.replace(/`/g, ''),
          type: type.replace(/`/g, ''),
          default: def && def !== '-' ? def.replace(/`/g, '') : null,
          required: required === 'O' || required?.toLowerCase() === 'true',
          description,
        }));
      } else if (currentSection === 'Events') {
        result.events = rows.map(([name, payload, description]) => ({
          name: name.replace(/`/g, ''), payload, description,
        }));
      } else if (currentSection === 'Slots') {
        result.slots = rows.map(([name, description]) => ({
          name: name.replace(/`/g, ''), description,
        }));
      } else if (currentSection === 'Methods') {
        result.methods = rows.map(([name, parameters, description]) => ({
          name: name.replace(/`/g, ''), parameters, description,
        }));
      }
    }
  }

  return result;
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
cd packages/vlossom-mcp && pnpm test -- readme-parser
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/vlossom-mcp/scripts/readme-parser.ts packages/vlossom-mcp/__tests__/pipeline/readme-parser.test.ts
git commit -m "feat(vlossom-mcp): implement README parser"
```

---

## Task 5: TypeScript Parser (`scripts/ts-parser.ts`)

Use `ts-morph` to extract `Vs{Name}StyleSet` from `types.ts` and resolve cross-component references.

**Files:**
- Create: `packages/vlossom-mcp/scripts/ts-parser.ts`
- Create: `packages/vlossom-mcp/__tests__/pipeline/ts-parser.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/vlossom-mcp/__tests__/pipeline/ts-parser.test.ts
import { describe, it, expect } from 'vitest';
import path from 'path';
import { parseTypes } from '../../scripts/ts-parser';

const FIXTURE_DIR = path.resolve(__dirname, '../fixtures/VsButton');

describe('parseTypes', () => {
  it('extracts StyleSet interface structure', async () => {
    const result = await parseTypes(FIXTURE_DIR, 'VsButton');
    expect(result.parsed).not.toBeNull();
    expect(result.parsed).toHaveProperty('variables');
  });

  it('detects cross-component StyleSet references as dependencies', async () => {
    const result = await parseTypes(FIXTURE_DIR, 'VsButton');
    expect(result.dependencies).toContain('VsLoadingStyleSet');
  });

  it('returns null parsed on parse failure without throwing', async () => {
    const result = await parseTypes('/nonexistent/path', 'VsButton');
    expect(result.parsed).toBeNull();
    expect(result.dependencies).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
cd packages/vlossom-mcp && pnpm test -- ts-parser
```

Expected: FAIL

- [ ] **Step 3: Implement `ts-parser.ts`**

```typescript
// packages/vlossom-mcp/scripts/ts-parser.ts
import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';

export interface TypesParseResult {
  parsed: Record<string, unknown> | null;
  dependencies: string[];
}

function serializeType(typeNode: any): unknown {
  if (!typeNode) return null;
  const text = typeNode.getText();
  if (text === 'CSSProperties') return 'CSSProperties';
  if (typeNode.getKind() === SyntaxKind.TypeLiteral) {
    const result: Record<string, unknown> = {};
    for (const member of typeNode.getMembers()) {
      const name = member.getName?.() ?? '';
      const type = member.getTypeNode?.();
      result[name + (member.hasQuestionToken?.() ? '?' : '')] = serializeType(type);
    }
    return result;
  }
  // Check for StyleSet reference (e.g. VsLoadingStyleSet)
  if (/^Vs\w+StyleSet$/.test(text)) return { $ref: text };
  return text;
}

export async function parseTypes(componentDir: string, componentName: string): Promise<TypesParseResult> {
  try {
    const project = new Project({ useInMemoryFileSystem: false, skipAddingFilesFromTsConfig: true });
    const filePath = path.join(componentDir, 'types.ts');
    const sourceFile = project.addSourceFileAtPath(filePath);

    const interfaceName = `${componentName}StyleSet`;
    const iface = sourceFile.getInterface(interfaceName);
    if (!iface) return { parsed: null, dependencies: [] };

    const parsed: Record<string, unknown> = {};
    const dependencies: string[] = [];

    for (const member of iface.getProperties()) {
      const name = member.getName();
      const typeNode = member.getTypeNode();
      const serialized = serializeType(typeNode);
      parsed[name] = serialized;

      // Collect $ref StyleSet dependencies
      const typeText = typeNode?.getText() ?? '';
      const refMatch = typeText.match(/Vs\w+StyleSet/g);
      if (refMatch) dependencies.push(...refMatch);
    }

    return { parsed, dependencies: [...new Set(dependencies)] };
  } catch {
    return { parsed: null, dependencies: [] };
  }
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
cd packages/vlossom-mcp && pnpm test -- ts-parser
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/vlossom-mcp/scripts/ts-parser.ts packages/vlossom-mcp/__tests__/pipeline/ts-parser.test.ts
git commit -m "feat(vlossom-mcp): implement TypeScript StyleSet parser"
```

---

## Task 6: Component Relationships (`scripts/relationships.ts`)

Hand-maintained map of components that are commonly used together. Updated manually when new pairings are introduced.

**Files:**
- Create: `packages/vlossom-mcp/scripts/relationships.ts`

- [ ] **Step 1: Create the relationships map**

```typescript
// packages/vlossom-mcp/scripts/relationships.ts
// Relationships are UNIDIRECTIONAL as defined here.
// The build pipeline does NOT auto-generate reverse entries.
// Update this file manually when new component pairings are introduced.

export const relationships: Record<string, string[]> = {
  VsForm: ['VsInput', 'VsTextarea', 'VsSelect', 'VsCheckbox', 'VsRadio', 'VsSwitch', 'VsButton'],
  VsTable: ['VsPagination', 'VsLoading', 'VsCheckbox'],
  VsModal: ['VsDimmed', 'VsButton', 'VsInnerScroll'],
  VsDrawer: ['VsDimmed', 'VsInnerScroll', 'VsButton'],
  VsAccordion: ['VsExpandable'],
  VsSelect: ['VsGroupedList', 'VsChip', 'VsCheckbox'],
  VsBlock: ['VsInnerScroll'],
  VsSearchInput: ['VsInput'],
  VsToggle: ['VsButton'],
  VsThemeButton: ['VsToggle'],
  VsImage: ['VsSkeleton'],
  VsButton: ['VsLoading'],
  VsTabs: ['VsIndexView'],
  VsSteps: ['VsPagination'],
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/vlossom-mcp/scripts/relationships.ts
git commit -m "feat(vlossom-mcp): add component relationships map"
```

---

## Task 7: Build Pipeline Orchestrator (`scripts/build-meta.ts`)

Wire together the README parser, TypeScript parser, and relationships map into the full pipeline.

**Files:**
- Create: `packages/vlossom-mcp/scripts/build-meta.ts`

- [ ] **Step 1: Implement the orchestrator**

```typescript
// packages/vlossom-mcp/scripts/build-meta.ts
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { parseReadme } from './readme-parser';
import { parseTypes } from './ts-parser';
import { relationships } from './relationships';
import type { ComponentsMeta, ComponentMeta } from '../src/types';

const VLOSSOM_COMPONENTS_DIR = path.resolve(
  import.meta.dirname, '../../vlossom/src/components'
);
const OUTPUT_PATH = path.resolve(import.meta.dirname, '../data/components-meta.json');

async function getComponentNames(): Promise<string[]> {
  const mapPath = path.join(VLOSSOM_COMPONENTS_DIR, 'component-map.ts');
  const content = await readFile(mapPath, 'utf-8');
  const matches = content.matchAll(/Vs\w+(?=[:,\s])/g);
  return [...new Set([...matches].map((m) => m[0]))].filter((n) => n.startsWith('Vs'));
}

async function buildComponent(name: string): Promise<ComponentMeta | null> {
  const dir = path.join(VLOSSOM_COMPONENTS_DIR, `vs-${name.slice(2).toLowerCase()}`);
  try {
    const [readme, types] = await Promise.all([
      parseReadme(dir),
      parseTypes(dir, name),
    ]);

    // Warn on mismatch between README Types block and ts-morph result
    if (readme.styleSetRaw && types.parsed === null) {
      console.warn(`⚠  ${name}: ts-morph parse failed, using README raw as fallback`);
    }

    return {
      name,
      description: readme.description,
      availableVersion: readme.availableVersion,
      props: readme.props,
      events: readme.events,
      slots: readme.slots,
      methods: readme.methods,
      styleSet: { raw: readme.styleSetRaw, parsed: types.parsed },
      examples: readme.examples,
      dependencies: types.dependencies,
      relationships: relationships[name] ?? [],
    };
  } catch (err) {
    console.warn(`⚠  ${name}: skipped — ${(err as Error).message}`);
    return null;
  }
}

async function main() {
  const packageJson = JSON.parse(
    await readFile(path.resolve(import.meta.dirname, '../../vlossom/package.json'), 'utf-8')
  );

  console.log('📦 Collecting component list...');
  const names = await getComponentNames();
  console.log(`   Found ${names.length} components`);

  console.log('⚙️  Parsing components in parallel...');
  const results = await Promise.all(names.map(buildComponent));
  const components: Record<string, ComponentMeta> = {};
  for (const c of results) {
    if (c) components[c.name] = c;
  }

  const meta: ComponentsMeta = {
    version: packageJson.version,
    generatedAt: new Date().toISOString(),
    components,
    _meta: { extension: { embeddingReady: false, vectorStorePath: null } },
  };

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(meta, null, 2), 'utf-8');
  console.log(`✅ Written to ${OUTPUT_PATH}`);
  console.log(`   ${Object.keys(components).length}/${names.length} components succeeded`);
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Run pipeline against real Vlossom source**

```bash
cd packages/vlossom-mcp && pnpm build:meta
```

Expected: `data/components-meta.json` created, summary printed (e.g. "48/50 components succeeded").

Note: `data/components-meta.json` is git-tracked so the MCP server can start without running the pipeline locally. This first manual run generates the initial file. CI keeps it up to date on every release.

- [ ] **Step 3: Commit**

```bash
git add packages/vlossom-mcp/scripts/build-meta.ts packages/vlossom-mcp/data/components-meta.json
git commit -m "feat(vlossom-mcp): implement build pipeline orchestrator"
```

---

## Task 8: Meta Loader (`src/loader.ts`)

Single responsibility: load `components-meta.json` once at startup and expose it.

**Files:**
- Create: `packages/vlossom-mcp/src/loader.ts`

- [ ] **Step 1: Implement**

```typescript
// packages/vlossom-mcp/src/loader.ts
import { readFile } from 'fs/promises';
import path from 'path';
import type { ComponentsMeta } from './types';

const META_PATH = path.resolve(import.meta.dirname, '../data/components-meta.json');

let cache: ComponentsMeta | null = null;

export async function loadMeta(): Promise<ComponentsMeta> {
  if (cache) return cache;
  try {
    const raw = await readFile(META_PATH, 'utf-8');
    cache = JSON.parse(raw) as ComponentsMeta;
    return cache;
  } catch {
    throw new Error(
      `components-meta.json not found at ${META_PATH}. Run "pnpm build:meta" first.`
    );
  }
}

export function getComponent(meta: ComponentsMeta, name: string) {
  const component = meta.components[name];
  if (!component) {
    const suggestions = Object.keys(meta.components)
      .filter((k) => k.toLowerCase().includes(name.toLowerCase()))
      .slice(0, 3);
    throw Object.assign(new Error(`Component '${name}' not found.`), { suggestions });
  }
  return component;
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vlossom-mcp/src/loader.ts
git commit -m "feat(vlossom-mcp): add meta loader with error handling"
```

---

## Task 9: Discovery Tools (`src/tools/discovery.ts`)

**Files:**
- Create: `packages/vlossom-mcp/src/tools/discovery.ts`
- Create: `packages/vlossom-mcp/__tests__/tools/discovery.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// packages/vlossom-mcp/__tests__/tools/discovery.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { buildDiscoveryTools } from '../../src/tools/discovery';
import meta from '../fixtures/components-meta.json';
import type { ComponentsMeta } from '../../src/types';

const tools = buildDiscoveryTools(meta as ComponentsMeta);

describe('list_components', () => {
  it('returns all components with name and description', () => {
    const result = tools.list_components();
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('description');
  });
});

describe('search_components', () => {
  it('returns components matching keyword in name', () => {
    const result = tools.search_components('Button');
    expect(result.some((c) => c.name === 'VsButton')).toBe(true);
  });

  it('returns components matching keyword in description', () => {
    const result = tools.search_components('text input');
    expect(result.some((c) => c.name === 'VsInput')).toBe(true);
  });

  it('returns empty array for no matches', () => {
    expect(tools.search_components('xyznomatch')).toEqual([]);
  });
});

describe('get_component_relationships', () => {
  it('returns relationships for known component', () => {
    const result = tools.get_component_relationships('VsButton');
    expect(result).toContain('VsLoading');
  });

  it('returns empty array for unknown component', () => {
    expect(tools.get_component_relationships('VsNonExistent')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run — verify fails**

```bash
cd packages/vlossom-mcp && pnpm test -- discovery
```

- [ ] **Step 3: Implement**

```typescript
// packages/vlossom-mcp/src/tools/discovery.ts
import type { ComponentsMeta } from '../types';

export function buildDiscoveryTools(meta: ComponentsMeta) {
  const components = Object.values(meta.components);

  return {
    list_components: () =>
      components.map(({ name, description, availableVersion }) => ({
        name, description, availableVersion,
      })),

    search_components: (keyword: string) => {
      const kw = keyword.toLowerCase();
      return components
        .filter((c) =>
          c.name.toLowerCase().includes(kw) || c.description.toLowerCase().includes(kw)
        )
        .map(({ name, description }) => ({ name, description }));
    },

    // suggest_components returns all component summaries as context for the calling AI.
    // The AI performs the intent-based reasoning; the server supplies the data.
    suggest_components: (useCase: string) => ({
      useCase,
      allComponents: components.map(({ name, description, relationships }) => ({
        name, description, relationships,
      })),
    }),

    get_component_relationships: (name: string) =>
      meta.components[name]?.relationships ?? [],
  };
}
```

- [ ] **Step 4: Run — verify passes**

```bash
cd packages/vlossom-mcp && pnpm test -- discovery
```

- [ ] **Step 5: Commit**

```bash
git add packages/vlossom-mcp/src/tools/discovery.ts packages/vlossom-mcp/__tests__/tools/discovery.test.ts
git commit -m "feat(vlossom-mcp): implement discovery tools"
```

---

## Task 10: Understanding Tools (`src/tools/understanding.ts`)

**Files:**
- Create: `packages/vlossom-mcp/src/tools/understanding.ts`
- Create: `packages/vlossom-mcp/__tests__/tools/understanding.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// packages/vlossom-mcp/__tests__/tools/understanding.test.ts
import { describe, it, expect } from 'vitest';
import { buildUnderstandingTools } from '../../src/tools/understanding';
import meta from '../fixtures/components-meta.json';
import type { ComponentsMeta } from '../../src/types';

const tools = buildUnderstandingTools(meta as ComponentsMeta);

describe('get_component', () => {
  it('returns full component data', () => {
    const result = tools.get_component('VsButton');
    expect(result.name).toBe('VsButton');
    expect(result.props).toHaveLength(2);
    expect(result.slots).toHaveLength(1);
  });

  it('throws with suggestions for unknown component', () => {
    expect(() => tools.get_component('VsButtonX')).toThrow("Component 'VsButtonX' not found");
  });
});

describe('get_style_set', () => {
  it('returns styleSet data', () => {
    const result = tools.get_style_set('VsButton');
    expect(result.raw).toContain('VsButtonStyleSet');
    expect(result.parsed).not.toBeNull();
  });
});

describe('get_version_info', () => {
  it('returns component version', () => {
    expect(tools.get_version_info('VsButton')).toMatchObject({
      component: 'VsButton',
      availableVersion: '2.0.0+',
    });
  });

  it('returns prop-level version when prop exists', () => {
    const result = tools.get_version_info('VsButton', 'loading');
    expect(result.prop).toBe('loading');
  });
});
```

- [ ] **Step 2: Run — verify fails**

- [ ] **Step 3: Implement**

```typescript
// packages/vlossom-mcp/src/tools/understanding.ts
import type { ComponentsMeta } from '../types';
import { getComponent } from '../loader';

export function buildUnderstandingTools(meta: ComponentsMeta) {
  return {
    get_component: (name: string) => getComponent(meta, name),

    get_style_set: (name: string) => {
      const c = getComponent(meta, name);
      return { name, ...c.styleSet, examples: c.examples };
    },

    get_version_info: (name: string, prop?: string) => {
      const c = getComponent(meta, name);
      const result: Record<string, unknown> = {
        component: name,
        availableVersion: c.availableVersion,
      };
      if (prop) {
        const propMeta = c.props.find((p) => p.name === prop);
        result.prop = prop;
        result.propFound = !!propMeta;
      }
      return result;
    },
  };
}
```

- [ ] **Step 4: Run — verify passes**

- [ ] **Step 5: Commit**

```bash
git add packages/vlossom-mcp/src/tools/understanding.ts packages/vlossom-mcp/__tests__/tools/understanding.test.ts
git commit -m "feat(vlossom-mcp): implement understanding tools"
```

---

## Task 11: Adaptation Tool (`src/tools/adaptation.ts`)

This tool is metadata-guided, LLM-executed. The server provides structured component schema as context; the AI performs the actual type mapping.

**Files:**
- Create: `packages/vlossom-mcp/src/tools/adaptation.ts`
- Create: `packages/vlossom-mcp/__tests__/tools/adaptation.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// packages/vlossom-mcp/__tests__/tools/adaptation.test.ts
import { describe, it, expect } from 'vitest';
import { buildAdaptationTools } from '../../src/tools/adaptation';
import meta from '../fixtures/components-meta.json';
import type { ComponentsMeta } from '../../src/types';

const tools = buildAdaptationTools(meta as ComponentsMeta);

describe('adapt_type_to_component', () => {
  it('returns component schema context for data mode', () => {
    const result = tools.adapt_type_to_component(
      'interface User { id: number; name: string }',
      'VsButton',
      'data'
    );
    expect(result.mode).toBe('data');
    expect(result.componentSchema).toHaveProperty('props');
  });

  it('returns styleSet context for style mode', () => {
    const result = tools.adapt_type_to_component(
      '{ color: "red" }',
      'VsButton',
      'style'
    );
    expect(result.mode).toBe('style');
    expect(result.componentSchema).toHaveProperty('styleSet');
  });

  it('infers style mode from CSS-like input', () => {
    const result = tools.adapt_type_to_component(
      '{ backgroundColor: "red", borderRadius: "4px" }',
      'VsButton',
      'auto'
    );
    expect(result.mode).toBe('style');
  });

  it('infers data mode from non-CSS input', () => {
    const result = tools.adapt_type_to_component(
      'interface User { id: number; email: string }',
      'VsButton',
      'auto'
    );
    expect(result.mode).toBe('data');
  });
});
```

- [ ] **Step 2: Run — verify fails**

- [ ] **Step 3: Implement**

```typescript
// packages/vlossom-mcp/src/tools/adaptation.ts
import type { ComponentsMeta } from '../types';
import { getComponent } from '../loader';

const CSS_KEYWORDS = [
  'backgroundColor', 'borderRadius', 'padding', 'margin', 'color',
  'fontSize', 'fontWeight', 'border', 'opacity', 'width', 'height',
  'component', 'variables', 'CSSProperties',
];

function inferMode(userType: string): 'data' | 'style' {
  return CSS_KEYWORDS.some((kw) => userType.includes(kw)) ? 'style' : 'data';
}

export function buildAdaptationTools(meta: ComponentsMeta) {
  return {
    adapt_type_to_component: (
      userType: string,
      componentName: string,
      mode: 'data' | 'style' | 'auto'
    ) => {
      const component = getComponent(meta, componentName);
      const resolvedMode = mode === 'auto' ? inferMode(userType) : mode;

      return {
        userType,
        componentName,
        mode: resolvedMode,
        // Provide the relevant schema as context for the AI to perform the mapping
        componentSchema: resolvedMode === 'style'
          ? { styleSet: component.styleSet, name: component.name }
          : { props: component.props, name: component.name },
        instruction: resolvedMode === 'data'
          ? 'Map the user type fields to Vlossom props. Return mappedCode, explanation, and unmapped[].'
          : 'Map the user style object to VsButtonStyleSet structure. Return mappedCode, explanation, and unmapped[].',
      };
    },
  };
}
```

- [ ] **Step 4: Run — verify passes**

- [ ] **Step 5: Commit**

```bash
git add packages/vlossom-mcp/src/tools/adaptation.ts packages/vlossom-mcp/__tests__/tools/adaptation.test.ts
git commit -m "feat(vlossom-mcp): implement adapt_type_to_component tool"
```

---

## Task 12: Generation & Validation Tools (`src/tools/generation.ts`)

**Files:**
- Create: `packages/vlossom-mcp/src/tools/generation.ts`
- Create: `packages/vlossom-mcp/__tests__/tools/generation.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// packages/vlossom-mcp/__tests__/tools/generation.test.ts
import { describe, it, expect } from 'vitest';
import { buildGenerationTools } from '../../src/tools/generation';
import meta from '../fixtures/components-meta.json';
import type { ComponentsMeta } from '../../src/types';

const tools = buildGenerationTools(meta as ComponentsMeta);

describe('generate_component_code', () => {
  it('returns component context for code generation', () => {
    const result = tools.generate_component_code('VsButton', 'primary button with loading');
    expect(result.component.name).toBe('VsButton');
    expect(result.requirements).toBe('primary button with loading');
    expect(result.component).toHaveProperty('props');
  });
});

describe('validate_component_usage', () => {
  it('passes valid template', () => {
    const result = tools.validate_component_usage(
      '<template><vs-button :loading="false">Click</vs-button></template>'
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('flags unknown prop', () => {
    const result = tools.validate_component_usage(
      '<template><vs-button :unknownProp="true">Click</vs-button></template>'
    );
    expect(result.errors.some((e) => e.includes('unknownProp'))).toBe(true);
  });

  it('flags unknown component gracefully', () => {
    const result = tools.validate_component_usage(
      '<template><vs-nonexistent /></template>'
    );
    // Unknown components are warned, not errored — we only validate known Vlossom components
    expect(result.warnings.some((w) => w.includes('VsNonexistent'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run — verify fails**

- [ ] **Step 3: Implement**

```typescript
// packages/vlossom-mcp/src/tools/generation.ts
import { parse } from '@vue/compiler-dom';
import type { ComponentsMeta } from '../types';
import { getComponent } from '../loader';

function kebabToPascal(name: string): string {
  return name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

function extractTemplate(code: string): string {
  const match = code.match(/<template>([\s\S]*?)<\/template>/);
  return match ? match[0] : code;
}

export function buildGenerationTools(meta: ComponentsMeta) {
  return {
    // generate_component_code: server provides context, AI generates the actual code
    generate_component_code: (componentName: string, requirements: string) => {
      const component = getComponent(meta, componentName);
      return {
        requirements,
        component: {
          name: component.name,
          props: component.props,
          slots: component.slots,
          events: component.events,
          examples: component.examples,
          styleSet: component.styleSet,
          relationships: component.relationships,
        },
        instruction: 'Generate accurate Vue 3 template code using the component schema above.',
      };
    },

    validate_component_usage: (code: string) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      const template = extractTemplate(code);
      let ast: any;
      try {
        ast = parse(template);
      } catch (e) {
        return { valid: false, errors: [`Could not parse template: ${(e as Error).message}`], warnings };
      }

      function walk(node: any) {
        if (node.type === 1 /* ELEMENT */ && node.tag.startsWith('vs-')) {
          const pascalName = kebabToPascal(node.tag);
          const component = meta.components[pascalName];

          if (!component) {
            warnings.push(`Unknown Vlossom component: ${pascalName}`);
          } else {
            const knownProps = new Set(component.props.map((p) => p.name));
            // Add known Vue special props
            knownProps.add('class').add('style').add('key').add('ref');
            // v-model maps to modelValue
            knownProps.add('modelValue');

            for (const prop of node.props ?? []) {
              const propName = prop.name === 'bind' ? prop.arg?.content : prop.name;
              if (propName && !knownProps.has(propName) && !propName.startsWith('on')) {
                errors.push(`${pascalName}: unknown prop "${propName}"`);
              }
            }
          }
        }
        node.children?.forEach(walk);
      }

      ast.children?.forEach(walk);
      return { valid: errors.length === 0, errors, warnings };
    },
  };
}
```

- [ ] **Step 4: Run — verify passes**

- [ ] **Step 5: Commit**

```bash
git add packages/vlossom-mcp/src/tools/generation.ts packages/vlossom-mcp/__tests__/tools/generation.test.ts
git commit -m "feat(vlossom-mcp): implement generation and validation tools"
```

---

## Task 13: Action Tool — `report_issue` (`src/tools/action.ts`)

**Files:**
- Create: `packages/vlossom-mcp/src/tools/action.ts`
- Create: `packages/vlossom-mcp/__tests__/tools/action.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// packages/vlossom-mcp/__tests__/tools/action.test.ts
import { describe, it, expect, vi } from 'vitest';
import { buildActionTools } from '../../src/tools/action';

describe('report_issue', () => {
  it('returns error when token not configured', async () => {
    const tools = buildActionTools(undefined);
    const result = await tools.report_issue('title', 'body', []);
    expect(result.error).toContain('VLOSSOM_GITHUB_TOKEN');
  });

  it('calls GitHub API with correct params', async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      data: { html_url: 'https://github.com/vlossom-ui/vlossom/issues/1', number: 1 }
    });
    const tools = buildActionTools('fake-token', mockCreate);
    const result = await tools.report_issue('Bug title', 'Bug body', ['bug']);

    expect(mockCreate).toHaveBeenCalledWith({
      owner: 'vlossom-ui', repo: 'vlossom',
      title: 'Bug title', body: 'Bug body', labels: ['bug'],
    });
    expect(result.issueUrl).toContain('issues/1');
  });
});
```

- [ ] **Step 2: Run — verify fails**

- [ ] **Step 3: Implement**

```typescript
// packages/vlossom-mcp/src/tools/action.ts
import { Octokit } from '@octokit/rest';

type CreateIssueFn = (params: {
  owner: string; repo: string; title: string; body: string; labels: string[];
}) => Promise<{ data: { html_url: string; number: number } }>;

export function buildActionTools(token?: string, createIssue?: CreateIssueFn) {
  const octokit = token ? new Octokit({ auth: token }) : null;
  const issueCreator = createIssue ?? octokit?.issues.create.bind(octokit.issues);

  return {
    report_issue: async (title: string, body: string, labels: string[] = []) => {
      if (!issueCreator) {
        return { error: 'GitHub token not configured. Set VLOSSOM_GITHUB_TOKEN environment variable.' };
      }
      try {
        const response = await issueCreator({
          owner: 'vlossom-ui', repo: 'vlossom', title, body, labels,
        });
        return { issueUrl: response.data.html_url, issueNumber: response.data.number };
      } catch (err) {
        const status = (err as any).status;
        if (status === 403) return { error: 'GitHub API returned 403. Check token scope (issues: write required).' };
        return { error: `GitHub API request failed: ${(err as Error).message}` };
      }
    },
  };
}
```

- [ ] **Step 4: Run — verify passes**

- [ ] **Step 5: Commit**

```bash
git add packages/vlossom-mcp/src/tools/action.ts packages/vlossom-mcp/__tests__/tools/action.test.ts
git commit -m "feat(vlossom-mcp): implement report_issue action tool"
```

---

## Task 14: Extension Stub (`src/extension/semantic.ts`)

Placeholder for future semantic search. No tests needed — it's intentionally empty.

**Files:**
- Create: `packages/vlossom-mcp/src/extension/semantic.ts`

- [ ] **Step 1: Create stub**

```typescript
// packages/vlossom-mcp/src/extension/semantic.ts
// Stub for future semantic (vector-based) search extension.
//
// Activation path:
//   1. Run embedding script over components-meta.json → vector store
//   2. Set _meta.extension.embeddingReady: true + vectorStorePath in components-meta.json
//   3. server.ts detects this at startup and calls activateSemanticSearch()
//   4. search_components tool is replaced — no other changes needed
//
// The tool interface remains identical to the keyword-based version.
export function activateSemanticSearch(): null {
  // TODO: implement when ready
  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vlossom-mcp/src/extension/semantic.ts
git commit -m "feat(vlossom-mcp): add semantic search extension stub"
```

---

## Task 15: MCP Server Assembly (`src/server.ts`)

Wire all tools into the MCP server and handle startup logic.

**Files:**
- Create: `packages/vlossom-mcp/src/tools/index.ts`
- Create: `packages/vlossom-mcp/src/server.ts`

- [ ] **Step 1: Create tools index**

```typescript
// packages/vlossom-mcp/src/tools/index.ts
export { buildDiscoveryTools } from './discovery';
export { buildUnderstandingTools } from './understanding';
export { buildAdaptationTools } from './adaptation';
export { buildGenerationTools } from './generation';
export { buildActionTools } from './action';
```

- [ ] **Step 2: Implement server**

```typescript
// packages/vlossom-mcp/src/server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadMeta } from './loader';
import {
  buildDiscoveryTools,
  buildUnderstandingTools,
  buildAdaptationTools,
  buildGenerationTools,
  buildActionTools,
} from './tools/index';

async function main() {
  const meta = await loadMeta();
  const token = process.env.VLOSSOM_GITHUB_TOKEN;

  if (!token) {
    console.warn('⚠  VLOSSOM_GITHUB_TOKEN not set — report_issue tool will return config error');
  }

  const discovery = buildDiscoveryTools(meta);
  const understanding = buildUnderstandingTools(meta);
  const adaptation = buildAdaptationTools(meta);
  const generation = buildGenerationTools(meta);
  const action = buildActionTools(token);

  const server = new McpServer({ name: 'vlossom-mcp', version: meta.version });

  // --- Discovery ---
  server.tool('list_components', 'List all Vlossom components with descriptions', {}, () =>
    ({ content: [{ type: 'text', text: JSON.stringify(discovery.list_components()) }] })
  );

  server.tool('search_components', 'Search components by keyword', { keyword: z.string() },
    ({ keyword }) => ({ content: [{ type: 'text', text: JSON.stringify(discovery.search_components(keyword)) }] })
  );

  server.tool('suggest_components', 'Get component suggestions for a use case', { useCase: z.string() },
    ({ useCase }) => ({ content: [{ type: 'text', text: JSON.stringify(discovery.suggest_components(useCase)) }] })
  );

  server.tool('get_component_relationships', 'Get components commonly used together', { name: z.string() },
    ({ name }) => ({ content: [{ type: 'text', text: JSON.stringify(discovery.get_component_relationships(name)) }] })
  );

  // --- Understanding ---
  server.tool('get_component', 'Get full component API (props, events, slots, examples)', { name: z.string() },
    ({ name }) => ({ content: [{ type: 'text', text: JSON.stringify(understanding.get_component(name)) }] })
  );

  server.tool('get_style_set', 'Get StyleSet type structure and examples', { name: z.string() },
    ({ name }) => ({ content: [{ type: 'text', text: JSON.stringify(understanding.get_style_set(name)) }] })
  );

  server.tool('get_version_info', 'Get minimum supported version for component or prop',
    { name: z.string(), prop: z.string().optional() },
    ({ name, prop }) => ({ content: [{ type: 'text', text: JSON.stringify(understanding.get_version_info(name, prop)) }] })
  );

  // --- Adaptation ---
  server.tool('adapt_type_to_component', 'Map user TypeScript type to Vlossom props or StyleSet',
    { userType: z.string(), componentName: z.string(), mode: z.enum(['data', 'style', 'auto']) },
    ({ userType, componentName, mode }) => ({
      content: [{ type: 'text', text: JSON.stringify(adaptation.adapt_type_to_component(userType, componentName, mode)) }]
    })
  );

  // --- Generation & Validation ---
  server.tool('generate_component_code', 'Get component context for Vue template code generation',
    { name: z.string(), requirements: z.string() },
    ({ name, requirements }) => ({
      content: [{ type: 'text', text: JSON.stringify(generation.generate_component_code(name, requirements)) }]
    })
  );

  server.tool('validate_component_usage', 'Validate Vue template for Vlossom prop/slot errors',
    { code: z.string() },
    ({ code }) => ({ content: [{ type: 'text', text: JSON.stringify(generation.validate_component_usage(code)) }] })
  );

  // --- Action ---
  server.tool('report_issue', 'Create a GitHub issue on the Vlossom repository',
    { title: z.string(), body: z.string(), labels: z.array(z.string()).optional() },
    async ({ title, body, labels }) => ({
      content: [{ type: 'text', text: JSON.stringify(await action.report_issue(title, body, labels)) }]
    })
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`✅ vlossom-mcp ${meta.version} ready`);
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 3: Run server in dev mode**

```bash
cd packages/vlossom-mcp && pnpm dev
```

Expected: `✅ vlossom-mcp 2.0.0 ready` printed to stderr.

- [ ] **Step 4: Commit**

```bash
git add packages/vlossom-mcp/src/tools/index.ts packages/vlossom-mcp/src/server.ts
git commit -m "feat(vlossom-mcp): assemble MCP server with all tools"
```

---

## Task 16: CI Workflow

**Files:**
- Create: `.github/workflows/build-mcp-meta.yml`

- [ ] **Step 1: Create workflow**

```yaml
# .github/workflows/build-mcp-meta.yml
name: Build MCP Metadata

on:
  push:
    branches: ['release/*']
    tags: ['v*']

jobs:
  build-meta:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Build components metadata
        run: pnpm --filter vlossom-mcp build:meta

      - name: Commit if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add packages/vlossom-mcp/data/components-meta.json
          git diff --staged --quiet || git commit -m "chore(mcp): update components-meta [skip ci]"
          git push
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/build-mcp-meta.yml
git commit -m "ci: add MCP metadata build workflow on release"
```

---

## Task 17: Full Test Run

- [ ] **Step 1: Run all tests**

```bash
cd packages/vlossom-mcp && pnpm test
```

Expected: All tests pass.

- [ ] **Step 2: Run pipeline end-to-end**

```bash
cd packages/vlossom-mcp && pnpm build:meta
```

Expected: `components-meta.json` regenerated with all Vlossom components.

- [ ] **Step 3: Manual smoke test — query a tool**

Configure Claude Desktop `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "vlossom": {
      "command": "node",
      "args": ["<absolute-path>/packages/vlossom-mcp/dist/server.js"]
    }
  }
}
```

Then ask Claude: *"VsButton의 props를 알려줘"*

Expected: Accurate props list returned from `get_component`.

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "feat(vlossom-mcp): complete initial implementation"
```
