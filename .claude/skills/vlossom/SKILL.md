---
name: vlossom
description: >
  Use when working with Vlossom UI components — checking component list, reporting bugs,
  requesting enhancements, or asking questions via the vlossom-mcp MCP server.
  Trigger on: "컴포넌트 목록", "이슈 등록", "버그 리포트", "vlossom 이슈", component name lookups.
---

# Vlossom MCP Tool 사용 가이드

vlossom-mcp MCP 서버 도구를 호출하여 컴포넌트 정보를 조회하고 GitHub 이슈를 등록합니다.

---

## Stepper 박스 — 응답 이후 1회 출력

응답을 먼저 쓴 뒤, 맨 끝에 아래 형식을 붙입니다.

### 고정 컬럼 형식 (닫는 테두리 없음 — 너비 맞춤 불필요)

```
vlossom-mcp ─────────────────────────────────────────────
✔  {N.   3}  {tool          22}  {label              24}
✔  ...
─────────────────────────────────────────────────────────
{toolsUsed joined by " · "}
```

**컬럼 규칙 (항상 고정):**

| 컬럼 | 너비 | 정렬 | 넘칠 때 |
|------|------|------|---------|
| `N.` | 3 | 우 | — |
| tool | 22 | 좌 | — (항상 22 이하) |
| label | 24 | 좌 | 22자 + `…` |

**타이밍(`ms`)은 표시하지 않습니다.** 서버 실행 시간(~0ms)은 실제 소요 시간을 반영하지 않아 오해를 줍니다.

### 예시

```
vlossom-mcp ─────────────────────────────────────────────
✔   1.  suggest_components    Suggest: settings panel t…
✔   2.  suggest_components    Suggest: drawer slider sel…
✔   3.  get_component         VsToast detail
✔   4.  get_component         VsDrawer detail
✔   5.  get_component         VsTooltip detail
─────────────────────────────────────────────────────────
suggest_components ×2 · get_component ×3
```

- `_meta`가 없는 응답(오류 등)에는 출력하지 않음

---

## 시나리오

### 컴포넌트 조회 / 코드 생성

```
suggest_components(useCase) → get_component(name) × N
→ 결과로 코드 생성 → 응답 → 스테퍼
```

### 이슈 등록

```
① check_github_token()
   → false면 사용자에게 PAT 입력 요청 → set_github_token(token)

② draft_issue(summary, type)
   → RequiredSections 항목 사용자와 확인

③ [사용자 승인 후] report_issue(title, body, labels?)
   → 이슈 URL 반환 → 응답 → 스테퍼
```

> ⚠️ `report_issue`는 실제 GitHub 이슈 생성. 사용자 명시적 승인 없이 절대 호출 금지.

---

## 이슈 타입별 RequiredSections

| type | 필수 항목 |
|------|-----------|
| `bug` | 재현 방법, 예상 동작, 실제 동작, 코드 예시 |
| `enhancement` | 동기 / 사용 사례, 제안하는 API / 동작 |
| `question` | 시도한 것, 관련 코드 |

## 라벨 가이드

| 상황 | labels |
|------|--------|
| 버그 | `["bug"]` |
| 기능 요청 | `["enhancement"]` |
| 질문 | `["question"]` |
| 특정 컴포넌트 | `["bug", "vs-button"]` |
