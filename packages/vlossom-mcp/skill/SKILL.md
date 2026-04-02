---
name: vlossom
description: >
  Use when working with Vlossom UI components — checking component list, reporting bugs,
  requesting enhancements, or asking questions via the vlossom-mcp MCP server.
  Trigger on: "컴포넌트 목록", "이슈 등록", "버그 리포트", "vlossom 이슈", component name lookups.
---

# Vlossom MCP Tool Guide

Calls vlossom-mcp tools to look up component information and file GitHub issues.

---

## Guardrails

**G1 — report_issue requires explicit user approval**
`report_issue` creates a real GitHub issue. Never call it without the user saying "yes, submit" or equivalent. Confirming the draft alone is not approval.

**G2 — clarify_intent must not re-trigger**
After the user picks an option from `clarify_intent`, execute the chosen `prompt` directly. Do not call `clarify_intent` again for the same query.

**G3 — Do not suggest third-party libraries for missing components**
If a component does not exist in Vlossom, the correct response is to offer to file an enhancement issue — not to suggest React/Vuetify/etc. alternatives.

**G4 — No component hallucination**
Never mention a Vlossom component (`VsXxx` / `vs-xxx`) that did not appear in a tool response in this conversation. If unsure whether a component exists, call `search_components` first.

---

## Harnesses

### Stepper — render after every multi-step response

Render the stepper **after** the main response.

**Skip when:** `_meta` is absent (error responses) **or** `_meta.steps.length < 2` (single-step trace adds no value).

```
vlossom-mcp ─────────────────────────────────────────────
✔   1.  clarify_intent        Clarify: 버튼 만들어주세요
✔   2.  suggest_components    Suggest: primary action bu…
✔   3.  get_component         VsButton detail
─────────────────────────────────────────────────────────
clarify_intent · suggest_components · get_component
```

Columns (fixed): `N.` = 3 right-aligned · `tool` = 22 left-aligned · `label` = 24 left-aligned (23 + `…`). No timing.

### Empty results — inform user before next_action

When a tool returns an empty result set (`components: []`, `results: []`, etc.), **always tell the user** before following `next_action`. Never silently jump to the next tool.

```
✅  "No Vlossom components matched 'chart'. Let me offer some alternatives…" → clarify_intent
❌  [calls clarify_intent with no user-facing message]
```

### clarify_intent — render presentation_format verbatim

When `clarify_intent` returns, render the `presentation_format` field from the response exactly as-is. Do not rephrase it.

```
💬 I want to make sure I understand what you need. Which of these best matches?

[1] <label>
[2] <label>
[3] <label>

Please reply with a number (1–3).
```

**When to call clarify_intent:**
- User intent is ambiguous (maps to meaningfully different pipelines)
- User asks something unrelated to Vlossom → steer back with 3 Vlossom-relevant interpretations
- `search_components` returns no results → try rephrasing before concluding the feature is missing

**Candidate writing rules:**
- Exactly 3, each with a distinct `pipeline` hint
- When the query might indicate a missing feature, one candidate must cover the issue-filing path

Example candidates for `"버튼 만들어주세요"`:
```json
[
  { "label": "기본 VsButton 코드 생성", "prompt": "VsButton 기본 사용 예시 코드를 생성해 주세요", "pipeline": "suggest_components → get_component" },
  { "label": "다양한 변형 버튼 예시", "prompt": "primary, outline, ghost, loading 등 VsButton 변형 예시를 모두 보여주세요", "pipeline": "get_component" },
  { "label": "커스텀 StyleSet 버튼", "prompt": "StyleSet으로 스타일을 커스터마이징한 VsButton 예시를 만들어 주세요", "pipeline": "get_component" }
]
```

---

## Pipeline Flows

### Component lookup / code generation

```
[ambiguous query] → clarify_intent(query, candidates×3) → chosen pipeline

suggest_components(useCase)
  → components found  → get_component(name) × N → generate code → stepper
  → no components     → clarify_intent → if still empty → issue filing flow
```

### Issue filing

```
check_github_token()
  → false → set_github_token(token)
  → true  ↓
draft_issue(summary, type)
  → collect each requiredSection from user
  → [user explicitly approves] → report_issue(...) → return issue URL → stepper
```

### Required sections by type

| type | Required |
|------|----------|
| `bug` | Steps to reproduce, Expected behavior, Actual behavior, Code example |
| `enhancement` | Motivation / Use case, Proposed API / behavior |
| `question` | What you tried, Related code |

### Label guide

| Situation | labels |
|-----------|--------|
| Bug | `["bug"]` |
| Feature request | `["enhancement"]` |
| Question | `["question"]` |
| Specific component | `["bug", "vs-button"]` |
