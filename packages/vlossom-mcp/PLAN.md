# Vlossom MCP — Next Phase Plan

**Created**: 2026-04-02
**Current version**: 0.2.0 (npm `vlossom-mcp`)
**Branch**: feat/mcp

---

## Expected INPUT / OUTPUT Examples

The flows users will experience once all phases are complete.

---

### Example 1 — Simple: List components

**INPUT**

```
"What components does Vlossom have?"
```

**Tool calls**

```
✔ 1. List components   list_components   38ms
```

**OUTPUT**

```
Vlossom has 50 components in total.

Form inputs: VsInput, VsTextarea, VsSelect, VsCheckbox, VsRadio, VsSwitch ...
Layout: VsLayout, VsHeader, VsFooter, VsDrawer, VsContainer ...
Feedback: VsModal, VsToast, VsLoading, VsSkeleton ...

Tools used: list_components · 38ms total
```

---

### Example 2 — Medium: Component detail lookup

**INPUT**

```
"Show me VsSelect props and StyleSet"
```

**Tool calls**

```
✔ 1. Component detail       get_component("VsSelect")               52ms
✔ 2. Relationship check     get_component_relationships("VsSelect")  31ms
```

**OUTPUT**

```
## VsSelect

### Props
| Prop        | Type    | Default | Description           |
|-------------|---------|---------|---------------------- |
| modelValue  | any     | -       | Selected value        |
| options     | array   | []      | Option list           |
| multiple    | boolean | false   | Multi-select          |
| searchable  | boolean | false   | Enable search         |

### StyleSet
variables:
  height?: string
  selected.backgroundColor?: string
  focused.border?: string
component?: CSSProperties
option?: CSSProperties

### Related components
VsForm (parent), VsInputWrapper (internal), VsChip (multiple mode)

Tools used: get_component · get_component_relationships · 83ms total
```

---

### Example 3 — Complex: Code generation

**INPUT**

```
"Create a login form with email and password inputs. Validation would be great."
```

**Tool calls**

```
✔ 1. Find relevant components   suggest_components("login form, validation")    89ms
✔ 2. VsForm detail              get_component("VsForm")                         44ms
✔ 3. VsInput detail             get_component("VsInput")                        41ms
✔ 4. VsButton detail            get_component("VsButton")                       39ms
✔ 5. Relationship check         get_component_relationships("VsForm")            33ms
✔ 6. Code generation            generate_component_code                         872ms
```

**OUTPUT**

````
```vue
<template>
    <vs-form ref="formRef">
        <vs-input
            v-model="email"
            label="Email"
            :rules="[emailRule]"
            placeholder="example@email.com"
        />
        <vs-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[required]"
        />
        <vs-button @click="handleSubmit" :loading="isLoading">
            Login
        </vs-button>
    </vs-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref()
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const emailRule = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email format'
const required = (v: string) => !!v || 'This field is required'

async function handleSubmit() {
    const valid = await formRef.value?.validate()
    if (!valid) return
    // ...
}
</script>
```

Tools used: suggest_components · get_component ×3 · get_component_relationships · generate_component_code · 1.1s total
````

---

## Current Status

Implementation status — last updated 2026-04-06 (v0.8.13):

| Tool                          | Planned | Current status                                                     |
| ----------------------------- | ------- | ------------------------------------------------------------------ |
| `list_components`             | ✅      | ✅ 0.1.x                                                           |
| `draft_issue`                 | ✅      | ✅ 0.1.x — language support, sections, H1/G2 compliant            |
| `report_issue`                | ✅      | ✅ 0.1.x — input validation, labels whitelist, try/catch          |
| `set_github_token`            | ✅      | ✅ 0.1.x — PAT regex validation                                   |
| `check_github_token`          | ✅      | ✅ 0.1.x                                                           |
| `get_component`               | ✅      | ✅ 0.3.0 — full ComponentMeta                                     |
| `search_components`           | ✅      | ✅ 0.3.0 — name/desc/props search                                 |
| `suggest_components`          | ✅      | ✅ 0.4.0 — metadata keyword search (HEURISTIC_MAP removed, G1)    |
| `get_component_relationships` | ✅      | ✅ 0.4.0 — relationships.json                                     |
| `compare_components`          | ✅      | ✅ 0.4.0 — structural diff (RECOMMENDATIONS removed, G1)          |
| Stepper UX (`_meta`)          | ✅      | ✅ 0.5.0 — all tools emit `_meta`                                 |
| `clarify_intent`              | 🆕      | ✅ 0.6.0 — disambiguation gate, min(3).max(3) candidates          |
| `get_component_source`        | ✅      | ✅ 0.7.x                                                           |
| `get_directive`               | ✅      | ✅ 0.7.x                                                           |
| `get_composables`             | ✅      | ✅ 0.7.x                                                           |
| `get_css_tokens`              | ✅      | ✅ 0.8.x — empty result handling (H6)                             |
| `get_vlossom_options`         | ✅      | ✅ 0.8.x                                                           |
| `get_changelog`               | 🆕      | ✅ 0.8.x                                                           |
| `check_vlossom_setup`         | 🆕      | ✅ 0.8.x                                                           |
| `get_plugin`                  | 🆕      | ✅ 0.8.x — merged into get_vlossom_options (plugins field)        |
| `get_version_info`            | ✅      | ✅ merged into check_vlossom_setup                                |
| `get_style_set`               | ✅      | ✅ merged into get_component (styleSet field)                     |
| `generate_component_code`     | ✅      | ✅ 0.9.0                                                           |
| `generate_style_set`          | ✅      | ✅ 0.9.1                                                           |
| `adapt_type_to_component`     | ✅      | ✅ 0.9.2                                                           |
| `validate_component_usage`    | ✅      | ❌ 0.9.3 (merged from 1.0.0)                                      |
| search_components semantic    | 🆕      | ❌ 0.9.4 (enhancement, merged from 1.0.0)                         |

### Data pipeline — resolved

`components-meta.json` (v0.3.0+) contains full props, StyleSet, events, slots, methods for all 50 components. `relationships.json` (v0.4.0+) contains curated parent/children/siblings for 34 components.

---

## Tech Stack

Original plan was .NET → changed to Node.js. Currently publishing as a Node.js TypeScript npm package.

| Item             | Confirmed                                        |
| ---------------- | ------------------------------------------------ |
| Runtime          | Node.js 18+                                      |
| Language         | TypeScript                                       |
| MCP SDK          | `@modelcontextprotocol/sdk`                      |
| Distribution     | `npx vlossom-mcp` (stdio transport)              |
| Metadata parsing | `remark` (Markdown), `ts-morph` (TypeScript AST) |

---

## Phase 1: Metadata Pipeline ← **Top Priority**

Currently `list_components` returns only name and description. `get_component`, `search_components`, and `generate_component_code` all need rich metadata, so **the pipeline is a prerequisite for all subsequent tools**.

### Goal: Implement `scripts/build-meta.mjs`

Parse README.md + types.ts to generate `src/data/components-meta.json`.

#### Parse targets (README.md)

```
## Props      → prop list (name, type, default, required, description)
## Types      → StyleSet interface (TypeScript code block)
## Events     → event list (name, payload, description)
## Slots      → slot list (name, description)
## Methods    → method list (name, params, description)
```

#### Parse targets (types.ts) — using ts-morph

```
Vs{Name}StyleSet interface
  → variables?: { ... }     CSS variables
  → component?: CSSProperties
  → child component StyleSet references (loading?: VsLoadingStyleSet)
```

#### Output schema (components-meta.json)

```typescript
interface ComponentMeta {
  name: string; // "VsButton"
  kebabName: string; // "vs-button"
  description: string;
  availableVersion: string; // "2.0.0+"
  props: PropMeta[];
  styleSet: StyleSetMeta;
  events: EventMeta[];
  slots: SlotMeta[];
  methods: MethodMeta[];
}

interface PropMeta {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
}

interface StyleSetMeta {
  variables: Record<string, string>; // property → type
  component: boolean; // whether CSSProperties is supported
  childRefs: string[]; // ["VsLoadingStyleSet", ...]
  raw: string; // original TypeScript interface string
}
```

#### Pipeline execution timing

- `npm run generate` — manual execution during local development
- `prepublishOnly` — automatic execution before publish (same flow as current)

---

## Phase 2: Core Lookup Tools

Tools that can be implemented immediately after the pipeline is complete. These are the core value of the MCP.

### `get_component`

**Priority**: 🔴 Highest

Receives a component name and returns full info: props, StyleSet, events, slots. The key tool for AI to generate accurate code.

```typescript
input: {
  name: string;
} // "VsButton" or "vs-button"
output: ComponentMeta; // props, styleSet, events, slots
```

### `search_components`

**Priority**: 🔴 Highest

Searches components by keyword. Unlike `list_components`, searches across name/description/props.

```typescript
input: { query: string }
output: ComponentMeta[]           // list of matching components
```

### `suggest_components`

**Priority**: 🟡 Medium

Receives a natural-language use case and recommends relevant components. Where `search_components` is keyword matching, this is intent-based recommendation.

```typescript
input: { useCase: string }       // "build a login form", "file upload feature"
output: { components: ComponentMeta[], reasoning: string }
```

> The server doesn't reason directly — it passes description + props context to the LLM. The LLM performs the actual recommendation.

### `get_component_relationships`

**Priority**: 🟡 Medium

Returns component composition relationships. Based on `scripts/relationships.json` (manually managed).

```typescript
input: { name: string }
output: {
    parent: string[];           // components that wrap this one
    children: string[];         // components used inside this one
    siblings: string[];         // components frequently used together
}
```

**Example relationships.json entry:**

```json
{
  "VsForm": {
    "children": ["VsInput", "VsSelect", "VsCheckbox", "VsRadio", "VsTextarea"],
    "siblings": ["VsButton"]
  },
  "VsLayout": {
    "children": ["VsHeader", "VsFooter", "VsDrawer", "VsContainer"]
  }
}
```

### `compare_components`

**Priority**: 🟡 Medium | **Inspired by**: PrimeVue

Compares two components side-by-side, returning props, use cases, and differences.

```typescript
input: { a: string; b: string }   // "VsModal", "VsDrawer"
output: {
    a: ComponentMeta;
    b: ComponentMeta;
    differences: string[];        // key differences summary
    recommendation: string;       // which component to use in which situation
}
```

> Usage: "When should I use VsModal vs VsDrawer?" / "What's the difference between VsInput and VsSearchInput?"

### `get_component_source`

**Priority**: 🟡 Medium | **Inspired by**: shadcn/v0 Registry

Returns the raw Vue source file for a component. Allows AI to see the actual implementation and generate accurate usage code.

```typescript
input: {
  name: string;
}
output: {
  source: string; // Vs{Name}.vue source code
  path: string; // file path
}
```

> If `get_component` provides parsed metadata, `get_component_source` delivers the raw source to cover cases the parser missed.

### `get_directive`

**Priority**: 🟡 Medium | **Inspired by**: Vuetify

Returns usage and options for Vlossom directives (e.g. `v-vs-scroll-shadow`).

```typescript
input: { name?: string }          // omit to list all directives
output: {
    name: string;                 // "v-vs-scroll-shadow"
    description: string;
    options: DirectiveOption[];
    example: string;
}
```

### `get_composables`

**Priority**: 🟢 Low | **Related issue**: #381

Returns usage info for public composables and utility functions like `useColorScheme`, `useStyleSet`.

```typescript
input: { name?: string }          // omit to list all
output: {
    name: string;                 // "useColorScheme"
    isPublic: boolean;            // whether externally usable
    signature: string;            // TypeScript signature
    description: string;
    example: string;
}
```

---

## Phase 2-B: Style System Tools

### `get_css_tokens`

**Priority**: 🟠 High | **Inspired by**: Ant Design `antd_token`

Returns the full list of `--vs-*` CSS variables with default values and light/dark variants. Ensures AI always generates code using correct tokens instead of hardcoded values.

```typescript
input: { category?: "color" | "size" | "radius" | "shadow" | "all" }
output: Array<{
    name: string;                 // "--vs-comp-bg"
    defaultValue: string;
    darkValue?: string;
    category: string;
    description: string;
}>
```

> Usage: "What's the background color variable in dark mode?" / "List Vlossom color tokens"

### `get_plugin`

**Priority**: 🟠 High

Returns API documentation for Vlossom's imperative plugin system (`$vsModal`, `$vsAlert`, `$vsConfirm`, `$vsPrompt`, `$vsToast`). Same hierarchy as `get_component` and `get_css_tokens` — a lookup tool for plugins.

```typescript
input: { name?: string }   // e.g. "modal-plugin", "alert-plugin". Omit to list all.
output: {
    name: string;              // "modal-plugin"
    description: string;
    methods: PluginMethod[];   // open(), close(), emit(), emitWithId()
    options: PluginOption[];   // ModalOptions, AlertOptions, etc.
    example: string;           // $vsModal.open(MyComponent, { size: 'lg' })
}
```

> Usage: "How do I open a modal programmatically?" / "What options does $vsAlert support?" / "List all Vlossom plugins"

**Available plugins**: `modal-plugin`, `alert-plugin`, `confirm-plugin`, `prompt-plugin`, `toast-plugin`

### `get_vlossom_options`

**Priority**: 🟠 High

Returns available options for `createVlossom()` plugin registration (global StyleSet, default colorScheme, etc.).

```typescript
input: {}
output: {
    options: VlossomOption[];  // name, type, default, description
    example: string;           // createVlossom({ ... }) usage example
}
```

> Usage: "I want to change the default padding for all buttons" / "How do I set the app-wide colorScheme to 'blue'?"

---

## Phase 3: Code Generation Tools

### `generate_component_code`

**Priority**: 🟠 High

Receives requirements and generates Vue code using Vlossom components.

```typescript
input: {
    description: string;         // "email and password login form"
    components?: string[];        // component hints (optional)
    stylePreference?: string;     // style description (optional)
}
output: {
    code: string;                 // complete Vue SFC code
    usedComponents: string[];     // list of components used
    explanation: string;
}
```

> The server assembles context from relevant component props + StyleSet + examples and passes it to the LLM. The LLM generates the actual code.

**StyleSet-first generation rule**: When style is involved, always design and generate the StyleSet structure (`variables` / `component` / child refs) **before** generating template and script code. This ensures style structure and component structure are consistent from the start.

```
Generation order:
  1. StyleSet design  (variables vs component vs child ref classification)
  2. StyleSet code    (Vs{Name}StyleSet object)
  3. Component code   (template + script with :style-set prop)
```

### `adapt_type_to_component`

**Priority**: 🟠 High

Converts an existing TypeScript type to fit a Vlossom component.

```typescript
input: {
  userType: string; // "interface User { id: string; name: string; email: string }"
  targetComponent: string; // "VsTable"
  mode: "data" | "style" | "auto";
}
output: {
  converted: string; // converted code (columns array, etc.)
  explanation: string;
}
```

### `generate_style_set`

**Priority**: 🟠 High

Automatically applies the StyleSet philosophy (`variables` vs `component` vs child ref) to generate correct StyleSet code. Prevents common mistakes like placing properties in the wrong location.

```typescript
input: {
  component: string; // "VsButton"
  requirements: string; // "red background, wide padding, small loading spinner"
}
output: {
  styleSet: string; // complete StyleSet object code
  explanation: string; // reason for variables/component/child classification
}
```

### `validate_component_usage`

**Priority**: 🟠 High (merged from 1.0.0 into Phase 3)

Validates that written Vlossom component code follows library rules and best practices.
Checks import style, StyleSet usage, forbidden patterns (`<style>` tag, hardcoded colors),
and component-specific prop correctness.

```typescript
input: {
  code: string;         // raw Vue SFC string
  strict?: boolean;     // include style/import warnings (default: false)
}
output: {
  valid: boolean;
  issues: {
    rule: string;         // e.g. "R03", "R05"
    severity: "error" | "warning";
    component?: string;   // component name if applicable
    line?: number;
    message: string;
    suggestion: string;
  }[];
  summary: string;        // "2 errors, 1 warning"
}
```

**Validation rules checked:**

| Rule | Check |
|------|-------|
| R01 | Named import from 'vlossom' only (no default import) |
| R03 | No `<style>` block in SFC |
| R04 | No inline `style=""` attribute on Vlossom components |
| R05 | No hardcoded hex/rgb color values |
| R06 | SFC line count ≤ 200 (warning if exceeded) |
| R07 | `<script setup lang="ts">` used |
| R13 | Plugin ($vsModal etc.) not imported — accessed via vlossom instance |

---

### `search_components` — Semantic Enhancement

**Priority**: 🟡 Medium (merged from 1.0.0 into Phase 3)

Not a new tool — an internal enhancement to the existing `search_components` tool.
Extends keyword matching with a **synonym/alias map** so that natural language terms
(e.g. "chart", "dropdown", "popup") resolve to the correct Vlossom component even when
the term doesn't appear in the component's name or description.

**Implementation:**
- Static `SYNONYM_MAP` in `search-components.ts`:  
  `{ chart: ["table","grid"], dropdown: ["select"], popup: ["modal","drawer","tooltip"], ... }`
- Before running metadata search, expand the query keywords using the map
- No external embedding API required — pure deterministic lookup
- Map is bundled as a constant (no data file); updated via normal code commits

**No interface changes** — same `query: string` input, same `ComponentMeta[]` output.

---

## Phase 3-B: Version & Setup Tools

### `get_changelog`

**Priority**: 🟠 High

Fetches version history and migration info from npm registry or GitHub Releases. Ensures AI always has up-to-date changelog without manual maintenance.

```typescript
input: {
  from?: string;  // "1.5.0" — starting version (omit for latest only)
  to?: string;    // "2.0.0" — ending version (default: latest)
}
output: {
  latestStable: string;
  versions: Array<{
    version: string;
    date: string;
    breaking: string[];
    features: string[];
    fixes: string[];
    migrationGuide?: string;
  }>;
}
```

> Usage: "What changed in vlossom 2.0?" / "How do I migrate from 1.x to 2.0?"
>
> Pairs with `check_vlossom_setup`: when setup check detects an outdated version, call `get_changelog(from: currentVersion)` to surface migration steps.

### `check_vlossom_setup`

**Priority**: 🟠 High

Receives the installed vlossom version and returns compatibility status, peer dependency requirements, and a setup checklist. Designed for AI-assisted onboarding and version diagnosis.

```typescript
input: {
  version: string;                          // installed version e.g. "2.0.0-beta.1"
  framework?: "vite" | "webpack" | "nuxt";  // optional build tool hint
}
output: {
  version: string;
  status: "stable" | "beta" | "outdated" | "unknown";
  isLatest: boolean;
  latestStable: string;
  requiredPeerDeps: Record<string, string>; // { vue: "^3.4", tailwindcss: "^4.0" }
  setupChecklist: Array<{
    step: string;
    required: boolean;
    docs?: string;
  }>;
  knownIssues?: string[];
}
```

> Usage: "Is my vlossom setup correct?" / "I'm on 1.5.0 — what do I need to upgrade?"
>
> Pipeline: `check_vlossom_setup` → outdated detected → `get_changelog(from: currentVersion)` → migration guide.

---

## Additional Insights and Proposals

### 1. Tool Description Optimization

Current tool descriptions are function-centric. LLMs select tools based on "in what situation should I call this tool." It is recommended to specify trigger conditions in each tool's description.

```typescript
// Current
"List all Vlossom components with their descriptions."

// Proposed
"Call this FIRST when the user asks about available components,
 or when you need to find which component to use for a given UI element.
 Returns all component names and one-line descriptions."
```

### 2. Tool Call Flow Guide

Specify the call flow AI should follow in `server.ts` server instructions (system prompt):

```
"Component code generation request"
  → suggest_components (which components are needed?)
  → get_component (check props/StyleSet for each component)
  → get_component_relationships (check composition structure)
  → generate_component_code (generate code)
```

### 3. Reflect StyleSet Changes

Since PR #303, the StyleSet structure has changed significantly (removing `SizeStyleSet`, `BoxStyleSet` inheritance → `variables`, `component`, child refs structure).

The pipeline must be designed to **correctly parse the new StyleSet pattern**. In particular, storing the `raw` field (original interface string) allows the LLM to read and handle cases the parser missed.

### 4. `get_component` Caching Strategy

Load all 50 component metadata into memory at server start. `list_components` already caches, so maintain the same pattern.

### 5. Semantic Search Extension (Long-term)

Keep the `extension/semantic.ts` stub as originally planned. Even if `search_components` starts with simple string matching, design it so only the internal implementation needs to be swapped when transitioning to embedding-based search — without changing the tool interface.

---

## Phase 4: Interactive Prompting UX

### Background

Like the `draft_issue → user conversation → report_issue` flow, vlossom-mcp tools already work conversationally through AI assistants. The goal is not a separate CLI mode, but to **improve the user experience on top of this existing interactive flow**.

Two improvements:

1. When multiple tools are called sequentially, **include step information in MCP responses** so AI can visually represent each stage
2. Along with final results, display a **brief of which tools were used**

---

### 4-1. Include Stepper Info in MCP Responses

In tasks with sequential tool calls, each tool includes a `_steps` field in its response with the progress stages so far. The AI assistant receives this and naturally expresses step progress during conversation.

```typescript
// mcp-response.ts extension
export interface McpResponseMeta {
  steps: StepInfo[];
  toolsUsed: string[];
  totalDurationMs: number;
}

export interface StepInfo {
  step: number;
  label: string; // "VsInput detail lookup"
  tool: string; // "get_component"
  durationMs: number;
}
```

When the AI assistant receives `_meta.steps`, it can express it as:

```
✔ 1. Component discovery     search_components            127ms
✔ 2. VsInput detail          get_component                 43ms
✔ 3. VsButton detail         get_component                 41ms
✔ 4. Relationship check      get_component_relationships   38ms
✔ 5. Code generation         generate_component_code      951ms
```

---

### 4-2. Tool Attribution (Result Brief)

Include `_meta.toolsUsed` in all tool responses so the AI assistant displays a brief of which tools were used along with results.

```
Tools used: search_components · get_component ×2 · get_component_relationships · generate_component_code
Total time: 1.2s
```

---

### 4-3. Disambiguation (3-Choice Pipeline)

사용자 질문이 **불분명할 때**만 동작한다. AI가 의도를 확신할 수 없는 경우 `clarify_intent` tool을 호출하고, 서버는 가능한 해석 3가지를 선택지로 반환한다. 사용자가 번호를 고르면 해당 파이프라인이 시작된다.

**불분명 여부 판단 — 두 계층으로 결정:**

AI 단독 판단에 의존하지 않는다. **서버 응답 신호**가 우선이고, **서버 instructions의 명시 규칙**이 그 다음이다.

**계층 1 — 기존 tool의 `_meta` 신호 (서버 주도)**

기존 tool이 결과를 반환할 때 낮은 확신도를 감지하면 `_meta.clarify: true`를 설정한다. AI는 이 신호를 받으면 무조건 `clarify_intent`를 호출한다.

| 상황 | 신호 조건 |
| ---- | --------- |
| `search_components` 결과 ≥ 3개 & 상위 점수 차이 < 10% | `clarify: true` |
| `suggest_components` 추천 결과 ≥ 3개 & reasoning 신뢰도 낮음 | `clarify: true` |
| `get_component` 입력이 컴포넌트명으로 해석 불가 | `clarify: true` |

**계층 2 — server instructions의 명시 규칙 (기본값으로 내장)**

별도 설정 없이 **서버 시작 시 자동 활성화**된다. `server.ts`의 system prompt에 아래 규칙이 기본 포함된다:

```
Call clarify_intent BEFORE any other tool when:
  - The query is a component name only, with no action verb
    e.g. "VsSelect", "드로어", "파일 업로드"
  - The query mentions a UI concept that maps to 3+ components equally
    e.g. "목록", "입력창", "팝업"

Do NOT call clarify_intent when:
  - The query contains an explicit action: "props 보여줘", "코드 짜줘", "비교해줘"
  - The query names a specific prop or StyleSet property
```

사용자나 호스트 설정 없이도 동작하는 것이 목표이므로 opt-in이 아닌 **기본값(default-on)**으로 설계한다.

**`clarify_intent` tool:**

```typescript
input: {
  query: string;          // 원본 사용자 질문
  candidates: Choice[];   // AI가 직접 생성한 해석 후보 3개
}

interface Choice {
  label: string;   // "VsSelect props와 StyleSet 보기"
  prompt: string;  // 선택 시 AI에게 그대로 전달될 프롬프트
  pipeline: string; // 어떤 flow가 이어질지 힌트 (선택지 설명용)
}

output: {
  choices: Choice[];  // 서버가 정제·검증 후 반환
}
```

**예시 — "VsSelect 알려줘" 입력 시:**

```
어떤 내용이 필요하신가요?

  1. 📋 VsSelect props, StyleSet, 이벤트 상세 보기
  2. 💻 VsSelect 사용 코드 예시 바로 생성하기
  3. ⚖️  VsSelect vs 유사 컴포넌트 비교하기

번호를 입력하거나 직접 질문해 주세요.
```

**선택 후 파이프라인:**

```
선택 1 → get_component("VsSelect")
선택 2 → suggest_components → get_component → generate_component_code
선택 3 → compare_components("VsSelect", ...)
```

**구현 위치:** `clarify_intent`는 외부 data 조회 없이 AI가 생성한 후보를 정제해 반환하는 경량 tool. 불분명한 질문을 막는 게이트 역할을 한다.

---

### 4-4. File Changes (Phase 4)

```
src/utils/
└── mcp-response.ts   ← Add McpResponseMeta, StepInfo types and extend helpers
```

---

## Versioning Strategy

Phase 3 work opens as **minor version 0.9**. Each feature commit then bumps **patch** within 0.9.x.

```
patch  — one tool added, one enhancement, bug fix, doc update, message text change
minor  — new version range starts (major feature group begins, e.g. 0.8 → 0.9)
major  — breaking change: remove/rename tool, change required param, breaking response schema
```

| Version | What ships |
|---------|-----------|
| 0.8.13 | ← current (security hardening + CLAUDE.md compliance) |
| **0.9.0** | **generate_component_code** — Phase 3 opens here (minor bump) |
| 0.9.1 | generate_style_set |
| 0.9.2 | adapt_type_to_component |
| 0.9.3 | validate_component_usage |
| 0.9.4 | search_components semantic enhancement |

---

## Implementation Order Summary

```
[Done] 0.1.x — list_components, issue tools
[Done] 0.2.0 — JSON data migration, issue harness improvements, i18n
[Done] 0.3.0 — build-meta pipeline + get_component + search_components
[Done] 0.4.0 — suggest_components + get_component_relationships + compare_components
[Done] 0.4.x — Stepper info (_meta) + Tool Attribution in all tools (Phase 4 early apply)
[Done] 0.5.x — Session isolation + stepper UX improvements (format, timing removal)
[Done] 0.6.0 — clarify_intent disambiguation gate (Phase 4-3)
[Done] 0.7.x — get_component_source + get_directive + get_composables
[Done] 0.8.x — get_css_tokens + get_vlossom_options + get_changelog + check_vlossom_setup
             + security hardening + CLAUDE.md compliance (G1/G2/H1-H7)

[Next] 0.9.0 — generate_component_code   (Phase 3-A, minor bump)
[Then] 0.9.1 — generate_style_set         (Phase 3-B)
[Then] 0.9.2 — adapt_type_to_component    (Phase 3-C)
[Then] 0.9.3 — validate_component_usage   (merged from 1.0.0)
[Then] 0.9.4 — search_components semantic  (merged from 1.0.0)
```

---

## Documentation Requirements

Every tool commit **must** include documentation updates in the same commit.
A commit that adds a tool without updating docs is incomplete.

### Per-tool checklist

For each new or modified tool, the following must be updated before committing:

```
[ ] README.md (en)     — move tool from Planned table → active category table
[ ] README.ko.md (ko)  — same update in Korean
[ ] DECISIONS.md       — one entry: what was added, why, alternatives considered
[ ] PLAN.md            — mark tool as ✅ in Current Status table
```

### README tool entry format

When moving a tool from **Planned** to an active section, the description must follow
the same style as existing rows: one sentence, ≤ 90 chars, starts with a verb.

```markdown
| `generate_component_code` | Generates a Vue SFC scaffold with Vlossom coding rules and StyleSet guidance |
```

### DECISIONS.md entry format

```markdown
## YYYY-MM-DD — tool_name (vX.Y.Z)

**Added**: one-line summary of what was added.
**Why**: reason (use case it enables, gap it fills).
**Alternatives considered**: what was rejected and why.
**Interface**: input schema, output schema (brief).
```

### README Roadmap update

When a tool ships, move it from a future row to the ✅ row for its version:

```markdown
| ✅ 0.9.0 | `generate_component_code`, `generate_style_set`, `adapt_type_to_component` |
```

### Planned → Active promotion

Remove the tool row from the **Planned** table in README once it ships.
If the Planned table becomes empty, remove the entire Planned section.

---

## Target File Structure (1.0.0)

```
packages/vlossom-mcp/
├── scripts/
│   ├── generate-components.mjs     ← current (simple list)
│   ├── build-meta.mjs              ← new: README + types.ts parser
│   ├── build-tokens.mjs            ← new: CSS variable extraction script
│   └── relationships.json          ← new: component relationships (manually managed)
├── src/
│   ├── data/
│   │   ├── components-data.json    ← current (simple list, kept as fallback)
│   │   ├── components-meta.json    ← new: rich metadata
│   │   ├── css-tokens.json         ← new: full --vs-* variable list
│   ├── services/
│   │   ├── component-registry.ts   ← current
│   │   └── meta-registry.ts        ← new: components-meta.json loader
│   ├── tools/
│   │   ├── list-components.ts      ← current
│   │   ├── get-component.ts        ← new (Phase 2)
│   │   ├── get-component-source.ts ← new (Phase 2)
│   │   ├── search-components.ts    ← new (Phase 2)
│   │   ├── suggest-components.ts   ← new (Phase 2)
│   │   ├── compare-components.ts   ← new (Phase 2)
│   │   ├── get-relationships.ts    ← new (Phase 2)
│   │   ├── get-directive.ts        ← new (Phase 2)
│   │   ├── get-composables.ts      ← new (Phase 2)
│   │   ├── get-css-tokens.ts       ← new (Phase 2-B)
│   │   ├── get-plugin.ts           ← new (Phase 2-B)
│   │   ├── get-changelog.ts        ← new (Phase 3-B)
│   │   ├── check-vlossom-setup.ts  ← new (Phase 3-B)
│   │   ├── generate-code.ts        ← new (Phase 3)
│   │   ├── generate-style-set.ts   ← new (Phase 3)
│   │   ├── adapt-type.ts           ← new (Phase 3)
│   │   ├── draft-issue.ts          ← current
│   │   ├── report-issue.ts         ← current
│   │   ├── set-github-token.ts     ← current
│   │   └── check-github-token.ts   ← current
│   └── types/
│       ├── issue.ts                ← current
│       └── meta.ts                 ← new: ComponentMeta schema
```
