# vlossom-mcp 개발 규칙

> `packages/vlossom-mcp`에만 적용되는 개발 가이드입니다.

---

## 세션 시작 시

이 CLAUDE.md가 로드되면 아래 배너를 출력하여 개발자에게 규칙이 활성화되었음을 알립니다:

```
╔══════════════════════════════════════════════════════╗
║  📦 vlossom-mcp CLAUDE.md 규칙이 적용 중입니다       ║
║  tool 설계 · 데이터 · 검증 · 배포 가이드를 따릅니다  ║
╚══════════════════════════════════════════════════════╝
```

- 깃허브 이슈·PR·스프린트 작업 요청이 있으면 → **Agent Team 구성**을 먼저 제안합니다 (하단 가이드 참조)
- context 사용량이 **50% 초과** 시 `/compact` 실행을 제안합니다

---

## Tool 설계 원칙

### 신규 Tool 추가 전 검증 프로세스

개발자가 새 tool을 제안하면 **추가 전 반드시 아래 순서로 검토**합니다.

**1단계 — 기존 tool 중복 확인**

PLAN.md의 전체 tool 목록과 현재 구현된 tool을 대조하여 아래 질문에 답합니다:

- 이미 동일한 역할의 tool이 존재하는가?
- 기존 tool 두 개를 조합하면 동일한 결과를 얻을 수 있는가?
- 기존 tool의 파라미터 추가로 대체 가능한가?

하나라도 **Yes**이면 신규 추가 대신 기존 tool 개선을 우선합니다.

**2단계 — `/insights` 스킬로 사용 패턴 검토**

```
/insights 이 tool이 실제로 필요한지 세션 데이터를 분석해주세요.
사용자가 <도구명>과 유사한 작업을 얼마나 자주 요청했나요?
```

`/insights` 결과에서 다음을 확인합니다:

- 해당 작업 유형이 실제 세션에서 반복적으로 등장하는가?
- 기존 tool로 해결하지 못한 마찰 패턴이 있는가?
- 유사 기능을 다른 UI 라이브러리 MCP가 제공하는 방식이 있는가?

**3단계 — 코드 포맷**

tool 구현 후 prettier를 실행하여 코드 스타일을 통일합니다:

```bash
npx prettier --write src/tools/<tool-name>.ts
```

**4단계 — 결정 기록**

검토 결과를 `DECISIONS.md`에 기록합니다:

- 검토한 기존 tool 목록
- `/insights` 근거 (반복 패턴 여부)
- 추가 또는 기각 결정 이유

---

### 최소 단위 분리 (파이프라이닝)

- 하나의 tool은 **하나의 책임**만 가집니다
- 여러 단계가 필요한 작업은 반드시 개별 tool로 분리합니다
- 각 tool은 독립 실행 가능하고, 다른 tool의 출력을 입력으로 받을 수 있어야 합니다
- 신규 tool 추가 전 기존 tool의 조합으로 해결 가능한지 먼저 검토합니다

**올바른 예 (파이프라인)**

```
draft_issue → [사용자 대화] → report_issue
suggest_components → get_component → generate_component_code
```

**잘못된 예 (모든 것을 단일 tool로)**

```
create_and_submit_issue  ← 단일 tool에 전체 흐름을 담는 방식
```

### Tool Description 작성 템플릿

모든 tool의 description은 아래 **4개 문장** 구조를 따릅니다:

```
① [선행 조건]  ALWAYS call X before this. (선행 tool이 있는 경우에만)
② [트리거]     Call this when <사용자가 ~를 요청할 때>.
③ [동작]       <이 tool이 하는 일>.
④ [다음 단계]  Then pass <반환값> to Y. (후속 tool이 있는 경우에만)
```

**목적 1 — 사용자 이해**: ②번 문장을 사용자 자연어 표현으로 작성합니다.

- `"이슈를 등록하고 싶어"`, `"컴포넌트 알려줘"` 같은 표현을 기준으로 트리거를 정의합니다.
- AI가 어떤 상황에 이 tool을 선택해야 할지 모호하지 않아야 합니다.

**목적 2 — tool 간 연계**: ①④번 문장으로 파이프라인을 인코딩합니다.

- ①④번은 **코드 레벨 강제가 아니라 AI 유도 힌트**입니다. 선행 tool 없이 단독 호출해도 기술적으로 동작합니다.
- 선행 tool이 있으면 ①번을 **반드시** 포함합니다.
- 후속 tool이 있으면 ④번을 **반드시** 포함합니다.
- 이 두 문장 덕분에 AI는 description만 읽고 올바른 호출 순서를 스스로 추론합니다.

**작성 예시**

```ts
// ✅ 파이프라인 시작 tool (후속 있음)
"Call this when the user wants to file a GitHub issue. " +
  "Generates a structured template with required sections. " +
  "Then collect each requiredSection from the user and pass sections to report_issue.";

// ✅ 파이프라인 종료 tool (선행 있음)
"ALWAYS call draft_issue before this. " +
  "Call this when the user has filled in all sections and is ready to submit. " +
  "Creates a real GitHub issue from the collected sections.";

// ✅ 독립 tool (선행·후속 없음)
"Call this when the user asks about available Vlossom components " +
  "or needs to find which component fits a UI element. " +
  "Returns all component names and one-line descriptions.";

// ❌ 잘못된 예 — 기능 설명만 있고 트리거·흐름 없음
("List all Vlossom components with their descriptions.");
```

---

## 대화형 하네스 (Stepper UX)

- 여러 tool이 순차 호출되는 흐름은 **stepper 형식**으로 표시합니다
- 각 tool 응답에 `_meta` 필드를 포함하여 AI가 진행 단계를 표현할 수 있도록 합니다

**터미널 출력 포맷**

```
╔══════════════════════ vlossom-mcp ══════════════════════╗
  ✔ 1. 컴포넌트 탐색        suggest_components    89ms
  ✔ 2. VsInput 상세 조회    get_component         43ms
  ✔ 3. 코드 생성            generate_component_code  951ms

  사용된 도구: suggest_components · get_component · generate_component_code
  총 소요 시간: 1.1s
╚═════════════════════════════════════════════════════════╝
```

- 모든 응답 하단에 `사용된 도구:` 브리프를 포함합니다
- `textResponse()` 유틸 또는 전용 응답 헬퍼를 통해 응답 포맷을 통일합니다

---

## 데이터 관리

- tool에서 필요한 데이터는 `src/data/*.json` 파일로 생성·관리합니다
- 새 tool 작성 전 `packages/vlossom`의 **최신 버전** 소스에서 데이터를 충분히 추출했는지 확인합니다
- 데이터 생성 스크립트는 `scripts/*.mjs` 또는 `scripts/*.ts`로 작성합니다
- 빌드 전 `npm run generate`로 데이터를 최신 상태로 갱신합니다
- `prepublishOnly` 훅에 generate 실행을 포함합니다

**데이터 파일 역할:**

| 파일                   | 생성 스크립트             | 용도                             |
| ---------------------- | ------------------------- | -------------------------------- |
| `components-data.json` | `generate-components.mjs` | 단순 목록 (폴백)                 |
| `components-meta.json` | `build-meta.mjs`          | props/StyleSet/events/slots 전체 |
| `css-tokens.json`      | `build-tokens.mjs`        | `--vs-*` CSS 변수 전체           |
| `known-issues.json`    | 수동 관리                 | `diagnose_issue` 용 알려진 이슈  |

---

## 코드 스타일

- 모든 스크립트 파일은 `.ts` (TypeScript)로 작성합니다
- 파일명은 kebab-case: `get-component.ts`
- tool 등록 함수 시그니처: `register{ToolName}(server: McpServer): void`
- 동일 모듈 import는 하나의 구문으로 합칩니다
- 불변 패턴을 사용합니다 (객체 직접 수정 금지)

---

## 검증 프로세스

작업 완료 후 반드시 아래 순서로 검증합니다:

```bash
npm run generate    # 데이터 최신화
npm run build       # TypeScript 컴파일
```

- 빌드 오류는 다른 작업보다 먼저 수정합니다
- tool 추가 시 `server.ts`에 등록되어 있는지 확인합니다
- 새 JSON 데이터 파일 추가 시 generate 스크립트에 반영합니다

---

## 버전 관리

### 버전 분류 기준

| 버전    | 변경 내용                                                                            | 예시                                                                 |
| ------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `patch` | 버그 수정, 문서 수정, 내부 리팩토링, 기존 tool 미세 조정 (하위 호환 유지)            | tool 오류 수정, README 업데이트, 응답 메시지 텍스트 변경             |
| `minor` | 신규 tool 추가, 기존 tool에 선택적 파라미터 추가, 새 데이터 소스 추가                | `suggest_components` tool 신규 추가, tool에 `optional` 파라미터 추가 |
| `major` | 기존 tool 제거 또는 이름 변경, 필수 파라미터 변경, 응답 스키마 변경 (하위 호환 불가) | tool 삭제, 기존 파라미터 타입 변경, 응답 구조 재설계                 |

### 릴리즈 전 체크리스트

작업 완료 후 **반드시** 아래 순서를 따릅니다:

```bash
npm run generate && npm run build      # 사전 검증
npm run release:patch   # 버그 수정 / 문서 / 미세 조정
npm run release:minor   # 신규 tool / 선택적 파라미터 추가
npm run release:major   # 하위 호환 불가 변경
git push && git push --tags            # 릴리즈 후 필수
```

> `release:*` = `prepublishOnly`(generate+build) → `npm version` → `pnpm publish`

- `main` 브랜치에서 실행합니다
- 동일 버전은 재배포할 수 없으므로 분류에 신중합니다

---

## Agent Team 구성 가이드

깃허브 이슈·PR·스프린트 작업 요청 시 아래 프롬프트로 Agent Team을 구성합니다:

```
Agent team을 만들어서 https://github.com/vlossom-ui/vlossom 프로젝트를 진행합니다.

스프린트 목표:
https://github.com/vlossom-ui/vlossom/issue의 높은 우선순위에 있는 이슈들을 확인하고
처리하고 PR을 생성합니다.

팀 구성(5역할):
Lead:
  PR 3~5개로 분해하고 각 PR의 범위(폴더/파일)와 Done 기준(검증 명령)을 정의합니다.
  공용 영역(src/core, src/background, src/types, src/utils, manifest.json,
  package.json, 설정 파일)은 Lead만 수정 가능합니다.
  Implementer가 쉬고 있다면 다른 Implementer에게 일을 부여합니다.
  PR이 생성되면 PM에게 작업이 완료되었음을 알립니다.

Implementer A group (vlossom 라이브러리 담당):
  담당 범위: packages/vlossom/**

Implementer B group (vlossom mcp 서버 담당):
  담당 범위: packages/vlossom-mcp/**

Implementer C group (Reviewer):
  담당 범위: packages/vlossom/**, packages/vlossom-mcp/**
  각 PR마다 자동 검증을 수행하고(test, build, lint, prettier 만족),
  기존 코드 규칙과 맞지 않은 부분, 버그 수정 등에 대한 정보를 PR에 남김

PM (Issue 및 PR 관리):
  담당 범위: https://github.com/vlossom-ui/vlossom repository
  PR을 이슈 단위로 관리 (milestone, label, issue 링크 지정)
  PR의 assignee를 프롬프트 요청자로 설정
  PR의 reviewer는 @sunio00000, @smithoo, @Baejw0111 로 설정합니다

규칙:
  - PR당 변경 파일 10개 이하, 작은 PR 선호
  - 작업 시 별도 worktree를 구성하여 작업
  - 공용 영역 변경이 필요하면 Implementer는 절대 수정하지 말고 Lead에게 요청
  - PR 설명에 의도/가정/리스크/검증(명령)을 반드시 포함
  - 먼저 Lead가 PR 계획을 제시하고, Implementer들에게 작업을 배정
```

---

## 파일 구조

```
packages/vlossom-mcp/
├── scripts/          # 데이터 생성 스크립트 (.ts)
├── src/
│   ├── data/         # JSON 데이터 파일
│   ├── services/     # 레지스트리, 클라이언트
│   ├── tools/        # 개별 tool 파일 (1 파일 = 1 tool)
│   ├── types/        # TypeScript 타입 정의
│   └── utils/        # 공통 유틸 (응답 포맷 등)
└── CLAUDE.md         # 이 파일 (간결하게 유지)
```
