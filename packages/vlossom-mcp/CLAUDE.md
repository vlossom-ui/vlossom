# vlossom-mcp Development Rules

> Applied only to `packages/vlossom-mcp`. One taxonomy governs this project:
> **Harnesses** — all behavioral constraints on the LLM, split into two sub-types:
> **Guardrails** (G) — things that must never happen · **Scaffolds** (H) — structures that enforce correct behavior.

---

## Session Start

Print this banner when CLAUDE.md is loaded:

```
╔══════════════════════════════════════════════════════╗
║  📦 vlossom-mcp CLAUDE.md rules are active           ║
║  Harnesses: 12  (Guardrails: 5  ·  Scaffolds: 7)     ║
╚══════════════════════════════════════════════════════╝
```

- For GitHub issue / PR / sprint requests → suggest **Agent Team setup** first (see bottom of file)
- When context usage exceeds **50%**, suggest running `/compact`

---

## Harnesses

Harnesses are all behavioral constraints on the LLM. They split into two sub-types by polarity.

---

### Guardrails

Negative constraints — hard stops. Violating any of these is a bug, not a style choice.

### G1 — No server-side LLM judgments

Tools must never use scripts to make categorical judgments that belong to the LLM.

| ❌ Prohibited | ✅ Allowed |
|---|---|
| Parse sentence structure to decide if a query is "valid" | Emit `next_action` when a **data lookup returns empty** (objective fact) |
| Heuristic counters that trigger behavioral signals (e.g. `needsClarify = count === 0 && results >= 3`) | Emit `next_action: "set_github_token"` when **token is absent** (observable state) |
| String matching to classify user intent | Emit `next_action: "list_components"` when **name lookup fails** (deterministic) |
| Any `if/else` that emits `clarify`, `suggest_issue`, etc. based on linguistic features | — |

The test: *does this judgment require understanding natural language?* If yes → delegate to LLM.

### G2 — report_issue requires explicit user approval

`report_issue` creates a real GitHub issue. It must **never** be called without the user explicitly saying "yes, submit it" or equivalent. Confirming the draft is not enough.

### G3 — One tool, one responsibility

No tool may contain a multi-step flow. If a task requires steps A → B → C, those are three tools. Before adding a tool, verify it cannot be expressed as a combination of existing tools.

```
✅  draft_issue → [user confirms] → report_issue
❌  create_and_submit_issue
```

### G4 — clarify_intent must not re-trigger itself

Once `clarify_intent` has been called and the user has chosen an option, never call `clarify_intent` again for the same query. Execute the chosen `prompt` directly.

### G5 — No component hallucination

Never mention or recommend a Vlossom component (`VsXxx` / `vs-xxx`) that did not appear in a tool response within the current conversation.

| ❌ Prohibited | ✅ Allowed |
|---|---|
| "You could use VsChart for that" (not in any response) | Mention VsButton if it was returned by suggest_components |
| Inventing plausible-sounding component names | Call search_components first if unsure whether a component exists |

The test: *can I point to the tool response that returned this component name?* If not, do not use the name.

---

### Scaffolds

Positive prescriptions — encode the correct behavior so that Claude produces consistent output without needing to reason from scratch each time.

### H1 — Tool description template

Every tool description follows this **4-sentence** structure. Missing a sentence is a defect.

```
① [Prerequisite]  ALWAYS call X before this.           ← only when a prerequisite exists
② [Trigger]       Call this when <user requests ~>.    ← required always
③ [Action]        <What this tool does>.               ← required always
④ [Next step]     Then pass <result> to Y.             ← only when a follow-up exists
```

```ts
// ✅ Middle of pipeline
"ALWAYS call draft_issue before this. " +
"Call this when the user has confirmed all sections and is ready to submit. " +
"Creates a real GitHub issue from the confirmed sections."

// ✅ Pipeline start
"Call this when the user describes a use case to build. " +
"Recommends relevant Vlossom components. " +
"Then call get_component for each result."

// ✅ Standalone
"Call this when the user asks about available Vlossom components. " +
"Returns all component names and descriptions."

// ❌ Missing trigger and flow
"List all Vlossom components with their descriptions."
```

### H2 — next_action linked-list

Every tool response must include `next_action` (tool name string) and `next_action_message` (reason).
Two patterns:

| Pattern | When | Example |
|---|---|---|
| **Precondition failure** | Tool cannot proceed; dependency is missing | `next_action: "set_github_token"` when token absent |
| **Success continuation** | Tool succeeded; natural next step exists | `next_action: "get_component"` after `suggest_components` |

Cross-domain links are also required:
- `get_composables` (found) → `next_action: "get_directive"` ("may also be a directive")
- `get_directive` (found) → `next_action: "get_composables"` ("may also be a composable")
- `get_component` (found) → `next_action: "get_css_tokens"`
- `get_css_tokens` → `next_action: "get_vlossom_options"` (and vice versa)

### H3 — clarify_intent choice format

`clarify_intent` must include a `presentation_format` field in its response — a ready-to-render string the LLM outputs verbatim. This ensures the user sees consistent, indexed choices.

```
💬 I want to make sure I understand what you need. Which of these best matches?

[1] <label for candidate 1>
[2] <label for candidate 2>
[3] <label for candidate 3>

Please reply with a number (1–3).
```

Rules:
- Always exactly 3 candidates, each with a distinct `pipeline` hint
- Always include one candidate that covers the issue-filing path when the query might indicate a missing feature
- Labels ≤ 50 chars; truncate with `…` if longer

### H4 — Stepper UX (_meta)

Every tool response includes `_meta` (via `recordStep()`). The LLM renders the stepper **after** the main response, never before.

**Skip the stepper when:**
- `_meta` is absent (e.g. error responses)
- `_meta.steps.length < 2` — a single-step trace adds no value

Format:

```
vlossom-mcp ─────────────────────────────────────────────
✔   1.  suggest_components    Suggest: login form
✔   2.  get_component         VsInput detail
✔   3.  get_component         VsButton detail
─────────────────────────────────────────────────────────
suggest_components · get_component ×2
```

Column widths are fixed: `N.` = 3 chars right-aligned · `tool` = 22 chars left-aligned · `label` = 24 chars left-aligned (truncate at 23 with `…`). No per-step timing.

### H5 — Issue filing flow

The issue pipeline is strictly ordered. Each step gates the next via `next_action`:

```
check_github_token
  → token missing  → set_github_token → draft_issue → [user confirms each section] → report_issue
  → token present  → draft_issue      → [user confirms each section] → report_issue
```

`draft_issue` returns `requiredSections`. The LLM must collect each section from the user before calling `report_issue`. Required sections by type:

| type | Required |
|---|---|
| `bug` | Steps to reproduce, Expected behavior, Actual behavior, Code example |
| `enhancement` | Motivation / Use case, Proposed API / behavior |
| `question` | What you tried, Related code |

### H7 — clarify_intent for free-form queries

When the user's input is a **natural language description** (not a specific component name or identifier), call `clarify_intent` first before any tool.

**Skip when:**
- User explicitly named a specific component (e.g. `"VsButton 알려줘"` → call `get_component` directly)
- Tool is already mid-pipeline (e.g. `draft_issue`, `report_issue`, `check_github_token`)

**Apply when (input is free-form):**
- `search_components` — query is a description (e.g. `"차트 같은 거"`, `"드래그할 수 있는 거"`)
- `suggest_components` — useCase is a description (e.g. `"로그인 폼"`, `"파일 업로드"`)
- Any future tool that receives a free-form natural language input

```
✅  User: "차트 그리고 싶어"
    → clarify_intent first (before search_components or suggest_components)

✅  User: "VsButton 알려줘"
    → get_component directly (name is explicit)

❌  User: "드래그 되는 컴포넌트 있어?"
    → [calls search_components immediately without clarifying intent]
```

### H6 — Inform user on empty results

When a tool returns an empty result set (`components: []`, `results: []`, `tokens: []`, etc.), the LLM must **inform the user** about the empty result before following `next_action`. Never silently jump to the next tool.

```
✅  "No Vlossom components matched 'chart'. Let me offer some alternatives…"
    → then follow next_action (e.g. clarify_intent)

❌  [calls clarify_intent without saying anything to the user]
```

This applies to: `search_components` (empty results), `suggest_components` (empty results), `get_css_tokens` (no matching tokens), `list_components` (edge case).

---

## Reference

### Adding a New Tool — Checklist

Before implementing, answer all three:

1. **Duplicate?** — Does an existing tool already do this? Can two tools be combined instead?
2. **Needed?** — Run `/insights` to confirm the usage pattern actually exists in sessions.
3. **Fits G3?** — Does this tool have exactly one responsibility?

After implementing:
```bash
npx prettier --write src/tools/<tool-name>.ts
```
Record the decision in `DECISIONS.md` (existing tools reviewed, evidence from `/insights`, reason for adding/rejecting).

### Data Files

| File | Script | Purpose |
|---|---|---|
| `components-data.json` | `generate-components.mjs` | Simple list (fallback) |
| `components-meta.json` | `build-meta.mjs` | Full props/StyleSet/events/slots |
| `css-tokens.json` | `build-tokens.mjs` | All `--vs-*` CSS variables |
| `known-issues.json` | Manually managed | Known issues |

Run `npm run generate` before building. The `prepublishOnly` hook runs this automatically.

### Code Style

- TypeScript for all source files; kebab-case filenames (`get-component.ts`)
- Registration signature: `register{ToolName}(server: McpServer): void`
- Single import statement per module; no direct object mutation

### Validation

```bash
npm run generate    # refresh data
npm run build       # TypeScript compile
```

Fix build errors before any other work. When adding a tool, verify it is registered in `server.ts`.

### Versioning

| Version | When |
|---|---|
| `patch` | Bug fixes, docs, message text changes |
| `minor` | New tool, new optional parameter, new data source |
| `major` | Remove/rename tool, change required parameter, breaking response schema |

```bash
npm run generate && npm run build
npm run release:patch | release:minor | release:major
git push && git push --tags
```

### File Structure

```
packages/vlossom-mcp/
├── scripts/          # data generation scripts
├── src/
│   ├── data/         # JSON data files
│   ├── services/     # registry, clients
│   ├── tools/        # one file = one tool
│   ├── types/        # shared TypeScript types
│   └── utils/        # textResponse, recordStep, etc.
├── CLAUDE.md         # this file
└── DECISIONS.md      # decision log
```

### Agent Team Setup

For GitHub issue / PR / sprint requests:

```
Set up an Agent team for https://github.com/vlossom-ui/vlossom.

Sprint goal: process high-priority issues related to vlossom-mcp.

Roles:
  Lead           — breaks work into 3–5 PRs, owns shared areas (src/utils, src/types, package.json)
  Implementer A  — scope: packages/vlossom/**
  Implementer B  — scope: packages/vlossom-mcp/**
  Reviewer       — runs build/test/lint on each PR, flags rule violations
  PM             — manages PRs/labels/milestones, sets assignee + reviewers (@sunio00000, @smithoo, @Baejw0111)

Rules: max 10 files per PR · separate worktrees · shared-area changes go through Lead only
PR description must include: intent / assumptions / risks / validation commands
```
