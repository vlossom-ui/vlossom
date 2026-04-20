# vlossom-mcp 개발 규칙

> `packages/vlossom-mcp`에만 적용됩니다. 이 프로젝트를 지배하는 두 가지 규칙 범주:
> **가드레일** — 절대 일어나서는 안 되는 것 · **하네스** — 올바른 동작을 강제하는 구조.

---

## 세션 시작

CLAUDE.md가 로드되면 아래 배너를 출력합니다:

```
╔══════════════════════════════════════════════════════╗
║  📦 vlossom-mcp CLAUDE.md 규칙이 적용 중입니다       ║
║  가드레일: 5개 활성  ·  하네스: 6개 활성             ║
╚══════════════════════════════════════════════════════╝
```

- 깃허브 이슈·PR·스프린트 작업 요청이 있으면 → **Agent Team 구성**을 먼저 제안합니다 (하단 가이드 참조)
- context 사용량이 **50% 초과** 시 `/compact` 실행을 제안합니다

---

## 가드레일

가드레일은 하드 스탑입니다. 이 중 하나라도 위반하면 스타일 문제가 아닌 버그입니다.

### G1 — 서버 사이드 LLM 판단 금지

도구는 LLM의 영역에 속하는 범주적 판단을 스크립트로 내려서는 안 됩니다.

| ❌ 금지                                                                                   | ✅ 허용                                                                      |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 문장 구조를 파싱해서 쿼리가 "유효한지" 판단                                               | **데이터 조회 결과가 비어있을 때** (객관적 사실) `next_action` 방출          |
| 행동 신호를 발생시키는 휴리스틱 카운터 (예: `needsClarify = count === 0 && results >= 3`) | **토큰이 없을 때** (관찰 가능한 상태) `next_action: "set_github_token"` 방출 |
| 사용자 의도를 분류하는 문자열 매칭                                                        | **이름 조회 실패 시** (결정론적) `next_action: "list_components"` 방출       |
| 언어적 특징을 기반으로 `clarify`, `suggest_issue` 등을 방출하는 `if/else`                 | —                                                                            |

판단 기준: _이 판단이 자연어 이해를 요구하는가?_ 그렇다면 → LLM에게 위임.

### G2 — report_issue는 명시적 사용자 승인 필수

`report_issue`는 실제 GitHub 이슈를 생성합니다. 사용자가 "네, 제출해주세요" 또는 이에 준하는 표현을 하지 않으면 **절대** 호출해서는 안 됩니다. 초안 확인만으로는 충분하지 않습니다.

### G3 — 도구 단일 책임

어떤 도구도 다단계 흐름을 포함해서는 안 됩니다. 작업이 A → B → C 단계를 필요로 한다면 이것은 세 개의 도구입니다. 도구를 추가하기 전에 기존 도구의 조합으로 표현할 수 없는지 먼저 확인합니다.

```
✅  draft_issue → [사용자 확인] → report_issue
❌  create_and_submit_issue
```

### G4 — clarify_intent 재호출 금지

`clarify_intent`가 한 번 호출되고 사용자가 옵션을 선택한 후에는 동일한 쿼리에 대해 다시 `clarify_intent`를 호출해서는 안 됩니다. 선택된 `prompt`를 직접 실행합니다.

### G5 — 컴포넌트 환각 방지

현재 대화의 도구 응답에 나타나지 않은 Vlossom 컴포넌트(`VsXxx` / `vs-xxx`)를 언급하거나 추천해서는 안 됩니다.

| ❌ 금지                                                 | ✅ 허용                                                     |
| ------------------------------------------------------- | ----------------------------------------------------------- |
| "그 용도에는 VsChart를 사용하세요" (응답에 없었던 경우) | suggest_components가 반환했다면 VsButton 언급               |
| 그럴듯하게 들리는 컴포넌트명 창작                       | 컴포넌트 존재 여부가 불확실하면 먼저 search_components 호출 |

판단 기준: _이 컴포넌트명을 반환한 도구 응답을 가리킬 수 있는가?_ 없다면 사용 금지.

---

## 하네스

하네스는 규범적 구조입니다. 올바른 동작을 인코딩하여 Claude가 매번 처음부터 추론하지 않고 일관된 출력을 생성할 수 있도록 합니다.

### H1 — 도구 설명 템플릿

모든 도구 설명은 이 **4문장** 구조를 따릅니다. 문장이 누락되면 결함입니다.

```
① [선행 조건]  ALWAYS call X before this.           ← 선행 조건이 있을 때만
② [트리거]     Call this when <사용자가 ~를 요청할 때>.    ← 항상 필수
③ [동작]       <이 도구가 하는 일>.               ← 항상 필수
④ [다음 단계]  Then pass <결과값> to Y.             ← 후속이 있을 때만
```

```ts
// ✅ 파이프라인 중간
"ALWAYS call draft_issue before this. " +
  "Call this when the user has confirmed all sections and is ready to submit. " +
  "Creates a real GitHub issue from the confirmed sections.";

// ✅ 파이프라인 시작
"Call this when the user describes a use case to build. " +
  "Recommends relevant Vlossom components. " +
  "Then call get_component for each result.";

// ✅ 독립 도구
"Call this when the user asks about available Vlossom components. " +
  "Returns all component names and descriptions.";

// ❌ 트리거와 흐름 누락
("List all Vlossom components with their descriptions.");
```

### H2 — next_action 링크드리스트

모든 도구 응답에는 `next_action` (도구명 문자열)과 `next_action_message` (이유)가 포함되어야 합니다.
두 가지 패턴:

| 패턴               | 상황                                 | 예시                                                   |
| ------------------ | ------------------------------------ | ------------------------------------------------------ |
| **선행 조건 실패** | 도구가 진행할 수 없음; 의존성 누락   | 토큰 없을 때 `next_action: "set_github_token"`         |
| **성공 이후 연속** | 도구 성공; 자연스러운 다음 단계 존재 | `suggest_components` 후 `next_action: "get_component"` |

교차 도메인 링크도 필수:

- `get_composables` (찾음) → `next_action: "get_directive"` ("디렉티브일 수도 있음")
- `get_directive` (찾음) → `next_action: "get_composables"` ("컴포저블일 수도 있음")
- `get_component` (찾음) → `next_action: "get_css_tokens"`
- `get_css_tokens` → `next_action: "get_vlossom_options"` (역방향도 마찬가지)

### H3 — clarify_intent 선택지 포맷

`clarify_intent`는 응답에 `presentation_format` 필드를 포함해야 합니다 — LLM이 그대로 출력할 준비된 문자열입니다. 이를 통해 사용자에게 일관된 인덱스된 선택지가 표시됩니다.

```
💬 어떤 내용이 필요하신지 확인하고 싶습니다. 다음 중 가장 잘 맞는 것을 선택해주세요?

[1] <후보 1 레이블>
[2] <후보 2 레이블>
[3] <후보 3 레이블>

번호로 답해 주세요 (1–3).
```

규칙:

- 항상 정확히 3개의 후보, 각각 고유한 `pipeline` 힌트 포함
- 쿼리가 누락된 기능을 나타낼 수 있을 때는 항상 이슈 등록 경로를 포함하는 후보 하나 포함
- 레이블 ≤ 50자; 초과 시 `…`으로 자름

### H4 — 스테퍼 UX (\_meta)

모든 도구 응답은 `_meta`를 포함합니다 (`recordStep()` 사용). LLM은 메인 응답 **이후에** 스테퍼를 렌더링하고, 그 전에 렌더링해서는 안 됩니다.

**스테퍼를 건너뛰는 경우:**

- `_meta`가 없을 때 (오류 응답 등)
- `_meta.steps.length < 2` — 단일 단계 추적은 가치가 없음

형식:

```
vlossom-mcp ─────────────────────────────────────────────
✔   1.  suggest_components    Suggest: login form
✔   2.  get_component         VsInput detail
✔   3.  get_component         VsButton detail
─────────────────────────────────────────────────────────
suggest_components · get_component ×2
```

열 너비는 고정: `N.` = 3자 우정렬 · `tool` = 22자 좌정렬 · `label` = 24자 좌정렬 (23자 초과 시 `…`으로 자름). 단계별 타이밍 없음.

### H5 — 이슈 등록 흐름

이슈 파이프라인은 엄격하게 순서가 정해져 있습니다. 각 단계는 `next_action`을 통해 다음 단계를 허용합니다:

```
check_github_token
  → 토큰 없음  → set_github_token → draft_issue → [사용자가 각 섹션 확인] → report_issue
  → 토큰 있음  → draft_issue      → [사용자가 각 섹션 확인] → report_issue
```

`draft_issue`는 `requiredSections`를 반환합니다. LLM은 `report_issue`를 호출하기 전에 사용자에게서 각 섹션을 수집해야 합니다. 유형별 필수 섹션:

| 유형          | 필수                                       |
| ------------- | ------------------------------------------ |
| `bug`         | 재현 단계, 예상 동작, 실제 동작, 코드 예시 |
| `enhancement` | 동기 / 사용 사례, 제안 API / 동작          |
| `question`    | 시도한 것, 관련 코드                       |

### H6 — 빈 결과 시 사용자 고지

도구가 빈 결과 집합을 반환할 때 (`components: []`, `results: []`, `tokens: []` 등), LLM은 `next_action`을 따르기 전에 반드시 사용자에게 빈 결과를 **알려야** 합니다. 절대 다음 도구로 조용히 넘어가면 안 됩니다.

```
✅  "No Vlossom components matched 'chart'. Let me offer some alternatives…"
    → 그 다음 next_action 따르기 (예: clarify_intent)

❌  [사용자에게 아무 말 없이 clarify_intent 호출]
```

적용 대상: `search_components` (빈 결과), `suggest_components` (빈 결과), `get_css_tokens` (매칭 토큰 없음), `list_components` (엣지 케이스).

---

## 참조

### 신규 도구 추가 — 체크리스트

구현 전에 세 가지를 모두 답합니다:

1. **중복?** — 이미 같은 역할을 하는 도구가 있는가? 두 도구를 조합하면 되지 않는가?
2. **필요?** — `/insights`를 실행해서 사용 패턴이 실제로 세션에 존재하는지 확인합니다.
3. **G3 적합?** — 이 도구가 정확히 하나의 책임을 가지는가?

구현 후:

```bash
npx prettier --write src/tools/<tool-name>.ts
```

`DECISIONS.md`에 결정을 기록합니다 (검토한 기존 도구, `/insights` 증거, 추가/기각 이유).

### 데이터 파일

| 파일                   | 스크립트                  | 용도                             |
| ---------------------- | ------------------------- | -------------------------------- |
| `components-data.json` | `generate-components.mjs` | 단순 목록 (폴백)                 |
| `components-meta.json` | `build-meta.mjs`          | props/StyleSet/events/slots 전체 |
| `css-tokens.json`      | `build-tokens.mjs`        | 모든 `--vs-*` CSS 변수           |
| `known-issues.json`    | 수동 관리                 | 알려진 이슈                      |

빌드 전에 `npm run generate`를 실행합니다. `prepublishOnly` 훅이 이를 자동으로 실행합니다.

### 코드 스타일

- 모든 소스 파일에 TypeScript 사용; 파일명은 kebab-case (`get-component.ts`)
- 등록 함수 시그니처: `register{ToolName}(server: McpServer): void`
- 모듈당 import 구문 하나; 객체 직접 수정 금지

### 검증

```bash
npm run generate    # 데이터 최신화
npm run build       # TypeScript 컴파일
```

다른 작업보다 빌드 오류를 먼저 수정합니다. 도구 추가 시 `server.ts`에 등록되어 있는지 확인합니다.

### 버전 관리

| 버전    | 상황                                                                       |
| ------- | -------------------------------------------------------------------------- |
| `patch` | 버그 수정, 문서, 메시지 텍스트 변경                                        |
| `minor` | 신규 도구, 새 선택적 파라미터, 새 데이터 소스                              |
| `major` | 도구 제거/이름 변경, 필수 파라미터 변경, 응답 스키마 변경 (하위 호환 불가) |

**vlossom-mcp 릴리즈에 git tag를 만들지 마세요.** npm 레지스트리가 이 패키지의 SoT(source of truth)입니다. 이 모노레포는 루트 `vlossom` 패키지만 `vlossom-v*` 형식으로 태깅하며, 추가로 `v*` 태그를 만들면 공유 태그 네임스페이스가 오염되고 `vlossom-v*`를 기대하는 툴링이 혼란됩니다.

- `git push --tags` 금지
- `npm version`은 기본적으로 로컬 태그를 생성함 — `npm run release:*`가 `npm version`을 호출하므로, 슬쩍 만들어진 태그가 있으면 push 전에 반드시 삭제(`git tag -d vX.Y.Z`)

```bash
cd packages/vlossom-mcp
npm view vlossom-mcp versions --json      # 이미 publish되지 않았는지 확인
npm run generate && npm run build
pnpm publish --otp=<your-otp>             # package.json의 현재 version을 바로 publish
# release:* 스크립트를 사용한 경우, 자동 생성된 태그를 push 전에 삭제:
#   npm run release:patch && git tag -d "v$(node -p "require('./package.json').version")"
cd ../..
git push                                   # commit만 push — NEVER --tags
```

### 파일 구조

```
packages/vlossom-mcp/
├── scripts/          # 데이터 생성 스크립트
├── src/
│   ├── data/         # JSON 데이터 파일
│   ├── services/     # 레지스트리, 클라이언트
│   ├── tools/        # 파일 하나 = 도구 하나
│   ├── types/        # 공유 TypeScript 타입
│   └── utils/        # textResponse, recordStep 등
├── CLAUDE.md         # 이 파일
└── DECISIONS.md      # 결정 기록
```

### Agent Team 구성 가이드

깃허브 이슈·PR·스프린트 작업 요청 시:

```
https://github.com/vlossom-ui/vlossom를 위한 Agent Team을 구성합니다.

스프린트 목표: vlossom-mcp 관련 높은 우선순위 이슈 처리.

역할:
  Lead           — 작업을 3–5개 PR로 분해, 공용 영역 소유 (src/utils, src/types, package.json)
  Implementer A  — 담당 범위: packages/vlossom/**
  Implementer B  — 담당 범위: packages/vlossom-mcp/**
  Reviewer       — 각 PR에서 build/test/lint 실행, 규칙 위반 지적
  PM             — PR/레이블/마일스톤 관리, assignee + reviewer(@sunio00000, @smithoo, @Baejw0111) 설정

규칙: PR당 파일 최대 10개 · 별도 worktree · 공용 영역 변경은 Lead를 통해서만
PR 설명에 반드시 포함: 의도 / 가정 / 리스크 / 검증 명령
```
