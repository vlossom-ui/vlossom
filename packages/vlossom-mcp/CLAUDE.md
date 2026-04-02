# vlossom-mcp Development Rules

> Development guide applied only to `packages/vlossom-mcp`.

---

## Session Start

When this CLAUDE.md is loaded, print the banner below to notify the developer that rules are active:

```
╔══════════════════════════════════════════════════════╗
║  📦 vlossom-mcp CLAUDE.md rules are active           ║
║  Following: tool design · data · validation · release ║
╚══════════════════════════════════════════════════════╝
```

- For GitHub issue / PR / sprint requests → suggest **Agent Team setup** first (see guide below)
- When context usage exceeds **50%**, suggest running `/compact`

---

## Tool Design Principles

### Validation Process Before Adding a New Tool

When a developer proposes a new tool, **always review in the following order before adding**.

**Step 1 — Check for duplicate existing tools**

Compare the full tool list in PLAN.md with currently implemented tools and answer:

- Does a tool with the same role already exist?
- Can the same result be achieved by combining two existing tools?
- Can it be replaced by adding a parameter to an existing tool?

If any answer is **Yes**, prioritize improving an existing tool over adding a new one.

**Step 2 — Review usage patterns with `/insights`**

```
/insights Please analyze session data to determine if this tool is actually needed.
How often did users request tasks similar to <tool-name>?
```

Check the following from `/insights` results:

- Does this type of task appear repeatedly in actual sessions?
- Is there a friction pattern that existing tools couldn't resolve?
- Do similar UI library MCPs provide this functionality?

**Step 3 — Code formatting**

After implementing a tool, run prettier to unify code style:

```bash
npx prettier --write src/tools/<tool-name>.ts
```

**Step 4 — Record decision**

Record the review result in `DECISIONS.md`:

- List of existing tools reviewed
- `/insights` evidence (whether repetition patterns exist)
- Reason for adding or rejecting

---

### Minimum Unit Separation (Pipelining)

- One tool has **one responsibility** only
- Tasks requiring multiple steps must be separated into individual tools
- Each tool must be independently executable and accept another tool's output as input
- Before adding a new tool, first check if existing tools can be combined to solve it

**Correct example (pipeline)**

```
draft_issue → [user conversation] → report_issue
suggest_components → get_component → generate_component_code
```

**Incorrect example (everything in a single tool)**

```
create_and_submit_issue  ← putting the entire flow in one tool
```

### Tool Description Template

Every tool's description follows this **4-sentence** structure:

```
① [Prerequisite]  ALWAYS call X before this. (only when a prerequisite tool exists)
② [Trigger]       Call this when <the user requests ~>.
③ [Action]        <What this tool does>.
④ [Next step]     Then pass <return value> to Y. (only when a follow-up tool exists)
```

**Purpose 1 — User understanding**: Write sentence ② using natural language expressions.

- Use expressions like `"I want to submit an issue"`, `"Tell me about components"` as trigger baselines.
- It must be unambiguous when AI should choose this tool.

**Purpose 2 — Tool chaining**: Encode the pipeline with sentences ① and ④.

- ① and ④ are **AI guidance hints, not code-level enforcement**. The tool technically works without a prerequisite tool call.
- If a prerequisite tool exists, **always** include sentence ①.
- If a follow-up tool exists, **always** include sentence ④.
- These two sentences allow AI to infer the correct call order by reading the description alone.

**Writing examples**

```ts
// ✅ Pipeline start tool (has follow-up)
"Call this when the user wants to file a GitHub issue. " +
  "Generates a structured template with required sections. " +
  "Then collect each requiredSection from the user and pass sections to report_issue.";

// ✅ Pipeline end tool (has prerequisite)
"ALWAYS call draft_issue before this. " +
  "Call this when the user has filled in all sections and is ready to submit. " +
  "Creates a real GitHub issue from the collected sections.";

// ✅ Standalone tool (no prerequisite or follow-up)
"Call this when the user asks about available Vlossom components " +
  "or needs to find which component fits a UI element. " +
  "Returns all component names and one-line descriptions.";

// ❌ Incorrect — only describes functionality, no trigger or flow
("List all Vlossom components with their descriptions.");
```

---

## Conversational Harness (Stepper UX)

- Flows with multiple sequential tool calls are displayed in **stepper format**
- Include a `_meta` field in each tool response so AI can express progress stages

**Terminal output format**

```
╔══════════════════════ vlossom-mcp ══════════════════════╗
  ✔ 1. Component discovery      suggest_components    89ms
  ✔ 2. VsInput detail           get_component         43ms
  ✔ 3. Code generation          generate_component_code  951ms

  Tools used: suggest_components · get_component · generate_component_code
  Total time: 1.1s
╚═════════════════════════════════════════════════════════╝
```

- Include a `Tools used:` brief at the bottom of all responses
- Unify response format via `textResponse()` utility or a dedicated response helper

---

## Data Management

- Data needed by tools is created and managed as `src/data/*.json` files
- Before writing a new tool, confirm that sufficient data has been extracted from the **latest version** of `packages/vlossom` source
- Data generation scripts are written as `scripts/*.mjs` or `scripts/*.ts`
- Run `npm run generate` before building to refresh data
- Include generate execution in the `prepublishOnly` hook

**Data file roles:**

| File                   | Generation script         | Purpose                           |
| ---------------------- | ------------------------- | --------------------------------- |
| `components-data.json` | `generate-components.mjs` | Simple list (fallback)            |
| `components-meta.json` | `build-meta.mjs`          | Full props/StyleSet/events/slots  |
| `css-tokens.json`      | `build-tokens.mjs`        | All `--vs-*` CSS variables        |
| `known-issues.json`    | Manually managed          | Known issues for `diagnose_issue` |

---

## Code Style

- All script files are written in `.ts` (TypeScript)
- File names in kebab-case: `get-component.ts`
- Tool registration function signature: `register{ToolName}(server: McpServer): void`
- Combine imports from the same module into a single statement
- Use immutable patterns (no direct object mutation)

---

## Validation Process

After completing work, always validate in the following order:

```bash
npm run generate    # refresh data
npm run build       # TypeScript compile
```

- Fix build errors before other tasks
- When adding a tool, verify it is registered in `server.ts`
- When adding a new JSON data file, reflect it in the generate script

---

## Versioning

### Version Classification

| Version | Changes                                                                                      | Examples                                                            |
| ------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `patch` | Bug fixes, documentation updates, internal refactoring, minor tool adjustments (compatible)  | Fix tool errors, update README, change response message text        |
| `minor` | New tool added, optional parameter added to existing tool, new data source added             | Add new `suggest_components` tool, add `optional` parameter to tool |
| `major` | Remove or rename existing tool, change required parameter, change response schema (breaking) | Delete tool, change parameter type, redesign response structure     |

### Pre-release Checklist

After completing work, **always** follow this order:

```bash
npm run generate && npm run build      # pre-validation
npm run release:patch   # bug fix / docs / minor adjustment
npm run release:minor   # new tool / optional parameter added
npm run release:major   # breaking changes
git push && git push --tags            # required after release
```

> `release:*` = `prepublishOnly`(generate+build) → `npm version` → `pnpm publish`

- Always run from the `main` branch
- The same version cannot be re-published, so classify carefully

---

## Agent Team Setup Guide

For GitHub issue / PR / sprint requests, set up an Agent Team with the following prompt:

```
Set up an Agent team to work on the https://github.com/vlossom-ui/vlossom project.

Sprint goal:
Check high-priority issues at https://github.com/vlossom-ui/vlossom/issues
and process them, creating PRs.

Team structure (5 roles):
Lead:
  Break down into 3–5 PRs and define the scope (folders/files) and Done criteria
  (validation commands) for each PR.
  Only Lead can modify shared areas (src/core, src/background, src/types, src/utils,
  manifest.json, package.json, config files).
  If an Implementer is idle, assign work to another Implementer.
  When a PR is created, notify PM that work is complete.

Implementer A group (vlossom library):
  Scope: packages/vlossom/**

Implementer B group (vlossom MCP server):
  Scope: packages/vlossom-mcp/**

Implementer C group (Reviewer):
  Scope: packages/vlossom/**, packages/vlossom-mcp/**
  Run automated validation for each PR (test, build, lint, prettier),
  and leave comments on the PR about code rule violations and bug fixes.

PM (Issue and PR management):
  Scope: https://github.com/vlossom-ui/vlossom repository
  Manage PRs by issue unit (milestone, label, issue link)
  Set PR assignee to the prompt requester
  Set PR reviewers to @sunio00000, @smithoo, @Baejw0111

Rules:
  - Max 10 changed files per PR, prefer small PRs
  - Set up separate worktrees for each task
  - If shared areas need changes, Implementers must never modify them — request from Lead
  - PR description must include intent / assumptions / risks / validation (commands)
  - Lead presents the PR plan first, then assigns work to Implementers
```

---

## File Structure

```
packages/vlossom-mcp/
├── scripts/          # data generation scripts (.ts)
├── src/
│   ├── data/         # JSON data files
│   ├── services/     # registry, clients
│   ├── tools/        # individual tool files (1 file = 1 tool)
│   ├── types/        # TypeScript type definitions
│   └── utils/        # common utilities (response formatting, etc.)
└── CLAUDE.md         # this file (keep concise)
```
