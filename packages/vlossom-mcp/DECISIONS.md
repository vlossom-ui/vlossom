# Vlossom MCP — 스펙 결정 기록

> feat/mcp 브랜치 Claude Code 세션에서 검토한 옵션과 그 결정 근거를 기록합니다.
> "무엇을 만들었는가"보다 "왜 그렇게 결정했는가"에 초점을 맞춥니다.

---

## 결정 1: 컴포넌트 데이터 포맷

**질문**: 빌드된 패키지가 컴포넌트 목록 데이터를 어떻게 보유할 것인가?

| #   | 옵션                    | 내용                                                        | 검토 결과                                                                               |
| --- | ----------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | TypeScript 모듈 (`.ts`) | 데이터를 TS 파일로 생성, `import`로 사용                    | ❌ tsc 컴파일 대상에 포함되어 빌드 결과물이 `.js`로 변환됨. 데이터와 코드의 경계가 모호 |
| 2   | **JSON 파일**           | `components-data.json` 생성, 런타임에 `readFileSync`로 로드 | ✅ 채택                                                                                 |
| 3   | 런타임 파싱             | 실행 시마다 vlossom 소스를 직접 읽기                        | ❌ npm 패키지 환경에서 vlossom 소스 경로 의존성 문제                                    |

**결정**: JSON 파일

**근거**

- 데이터(`.json`)와 로직(`.ts`)의 역할이 명확히 분리됨
- tsc 컴파일 파이프라인에서 독립적 — 빌드 결과물에 포함되지 않고 그대로 유지
- `generate` 스크립트가 `src/data/`와 `dist/data/` 두 곳에 동시 생성하여 런타임 경로 문제 해결

---

## 결정 2: Issue 하네스 구조

**질문**: `report_issue`가 body를 어떻게 받을 것인가?

**배경**: `draft_issue`가 섹션 구조가 있는 템플릿을 반환하는데, LLM이 `report_issue`를 호출할 때 자유 형식 `body: string`으로 전달하면 포맷이 깨질 수 있음.

| #   | 옵션                             | 내용                                                                    | 검토 결과                                          |
| --- | -------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| 1   | 자유 형식 `body: string`         | LLM이 완성된 body 텍스트를 직접 전달                                    | ❌ LLM이 섹션 헤딩을 임의로 변경하거나 재구성 가능 |
| 2   | **구조화된 `sectionContents[]`** | 섹션별 `{ heading, content }` 배열로 분리 전달, 서버 내부에서 body 조합 | ✅ 채택                                            |

**결정**: `sectionContents[]` 구조화 방식

**근거**

- 서버 내부 `getSectionOrder(type)` 함수가 헤딩 순서를 고정하므로 LLM이 포맷을 변경할 수 없음
- `draft_issue`와 `report_issue` 간의 계약이 타입 수준에서 명시적으로 정의됨
- `src/types/issue.ts`에 `IssueType`, `IssueSection`, `IssueDraft`, `SectionContent` 공통 타입을 분리하여 두 도구 간 일관성 보장

**스펙**

```typescript
// report_issue 입력
sectionContents: Array<{ heading: string; content: string }>;

// 서버 내부 조합
function buildBody(type, language, sectionContents): string {
  const order = getSectionOrder(type, language); // 순서 고정
  return order
    .map((heading) => `**${heading}**\n\n${contentMap.get(heading)}`)
    .join("\n\n");
}
```

---

## 결정 3: Issue 섹션 포맷 표준

**질문**: 섹션 헤더 형식과 타이틀 형식을 어떻게 정할 것인가?

**배경**: 초기 구현은 `## 헤더` (h2)와 `fix:` / `feat:` 형식을 사용. 실제 GitHub 이슈와 불일치.

**조사 방법**: GitHub API(`/repos/vlossom-ui/vlossom/issues`, `/contents/.github/ISSUE_TEMPLATE`)로 실제 이슈와 템플릿 확인

| #   | 항목           | 초기 구현                                  | GitHub 실제 포맷                                     | 결정                       |
| --- | -------------- | ------------------------------------------ | ---------------------------------------------------- | -------------------------- |
| 1   | 섹션 헤더      | `## 버그 설명`                             | `**버그 내용**`                                      | ✅ `**bold**` 형식 채택    |
| 2   | 타이틀 형식    | `fix: ...` / `feat: ...`                   | `[bug] ...` / `[feat] ...`                           | ✅ `[tag]` 형식 채택       |
| 3   | bug 섹션명     | 버그 설명, 재현 방법, 예상 동작, 실제 동작 | 버그 내용, 재현 스텝, 기대 동작, 스크린샷, 개발 환경 | ✅ GitHub 템플릿 기준 채택 |
| 4   | feature 타입명 | `enhancement`                              | `feature`                                            | ✅ `feature`로 변경        |

**근거**: MCP를 통해 등록된 이슈가 GitHub 템플릿으로 등록된 기존 이슈와 포맷이 달라지면 리포지토리 일관성이 깨짐. 실제 데이터 기반으로 결정.

---

## 결정 4: 다국어 지원 방식

**질문**: 사용자가 영어로 요청했을 때 섹션 헤딩도 영어로 출력할 수 있는가?

**문제 식별**: 섹션 헤딩이 한국어로 하드코딩 → 영어 요청 시 헤딩·내용 혼용 발생

| #   | 옵션                         | 내용                                                                       | 검토 결과                                   |
| --- | ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | **`language` 파라미터 추가** | `draft_issue`에 `language: "ko" \| "en"` 추가, LLM이 사용자 언어 자동 감지 | ✅ 채택                                     |
| 2   | GitHub 이슈 템플릿 두 벌     | `.github/ISSUE_TEMPLATE/`에 한/영 템플릿 각각 유지                         | ❌ MCP 도구와 무관한 접근, 서버 외부 의존성 |

**결정**: 방법 1 — `language` 파라미터

**근거**

- LLM이 사용자 요청 언어를 자동 감지하여 파라미터로 전달하므로 별도 설정 불필요
- `draft_issue`와 `report_issue`가 동일한 `language` 값을 공유하여 헤딩 일관성 보장
- `IssueLanguage = "ko" | "en"` 타입으로 확장 가능 구조

**스펙**

```typescript
language: z.enum(["ko", "en"])
  .default("ko")
  .describe("Use 'en' if the user writes in English, 'ko' if in Korean.");
```

---

## 결정 5: 대화형 UX 구현 방향

**질문**: 여러 tool이 순차 호출될 때 사용자 경험을 어떻게 개선할 것인가?

**배경**: 처음에는 별도 대화형 CLI 모드(`--interactive` 플래그)를 제안했으나 방향 수정.

| #   | 옵션                                   | 내용                                                             | 검토 결과                                  |
| --- | -------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| 1   | `--interactive` 플래그 + 별도 CLI 모드 | `process.stdin.isTTY` 감지 후 전용 CLI 진입                      | ❌ 철회 — 이미 MCP 도구 흐름 자체가 대화형 |
| 2   | **MCP 응답 `_meta` 필드 포함**         | 각 도구 응답에 stepper 정보와 tool attribution 포함, AI가 렌더링 | ✅ 채택                                    |

**결정 과정**

1. 초기 제안: `--interactive` 플래그로 별도 CLI 모드
2. 피드백: "tool 동작 과정에서 티키타카하는 것이 대화형. 별도 옵션이 필요한 게 아님"
3. 최종 결정: `draft_issue → 대화 → report_issue` 흐름이 이미 대화형. CLI 모드 제거.

**결정**: MCP 응답 메타데이터 방식

**스펙**

```typescript
interface McpResponseMeta {
  steps: StepInfo[]; // 각 도구 호출 단계
  toolsUsed: string[]; // 사용된 도구 목록
  totalDurationMs: number; // 총 소요 시간
}
```

---

## 결정 6: 배포 전략

**질문**: npm 패키지 단일 배포 vs 팀 내부 서버 호스팅 병행 여부

| #   | 옵션                      | 내용                                | 검토 결과                                   |
| --- | ------------------------- | ----------------------------------- | ------------------------------------------- |
| 1   | **npm 패키지 단일 배포**  | `npx vlossom-mcp` (stdio)           | ✅ 채택                                     |
| 2   | npm + 내부 서버 이중 배포 | npm(외부용) + k8s 서버(내부용) 병행 | ❌ 제거 — 현 단계에서 복잡도 대비 이득 없음 |

**근거**: 도구가 충분히 성숙해지기 전 이중 배포는 관리 부담만 증가. 단일 npm 패키지로 내외부 모두 `npx vlossom-mcp`로 통일.

---

## 결정 7: CLAUDE.md 설계

**배경**: `packages/vlossom-mcp/CLAUDE.md`를 이 프로젝트 전용 규칙 파일로 작성. 세션에서 합의된 스펙들이 규칙으로 문서화됨.

### 7-1. Tool 설계 원칙 — 최소 단위 분리

**결정**: 하나의 tool은 하나의 책임만 가진다 (파이프라이닝)

```
draft_issue → [사용자 대화] → report_issue   ← 올바른 분리
create_and_submit_issue                       ← 잘못된 통합
```

**근거**: MCP tool은 AI 어시스턴트가 조합하여 사용하는 단위. 단일 책임 원칙이 재사용성과 흐름 제어를 높임.

### 7-2. Tool Description 작성 규칙

**결정**: 트리거 조건 + 선행 tool + 다음 단계를 description에 명시

```typescript
"ALWAYS call draft_issue first and fill in all required sections with the user before calling this.";
"Detect the language from the user's request and pass it as the language parameter.";
```

**근거**: LLM은 tool description을 보고 언제 어떤 도구를 호출할지 결정. description이 LLM의 행동을 제어하는 하네스 역할.

### 7-3. 버전 관리 기준

**결정**:

| 변경 내용                                 | 버전    |
| ----------------------------------------- | ------- |
| 버그 수정, 문서 수정, 기존 tool 미세 조정 | `patch` |
| 새 tool 추가, 기존 tool 인터페이스 변경   | `minor` |
| 기존 tool 제거, 하위 호환 불가 변경       | `major` |

**적용 사례**: 이번 세션 `0.1.5 → 0.2.0` (minor) — `language` 파라미터 추가 + 구조 변경

### 7-4. 검증 프로세스

**결정**: 작업 완료 후 반드시 순서대로 실행

```bash
npm run generate    # 데이터 최신화
npm run build       # TypeScript 컴파일
```

**근거**: generate 없이 build하면 stale 데이터로 빌드됨. prepublishOnly에도 동일 순서 강제.

---

## 결정 8: Tool 선행 조건의 강제 여부

**질문**: `ALWAYS call X before this` 선행 조건은 코드 레벨에서 강제되어야 하는가?

| #   | 옵션             | 내용                                                                               | 검토 결과                                              |
| --- | ---------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | 코드 강제        | 선행 tool 호출 여부를 서버에서 검사, 미충족 시 오류 반환                           | ❌ 불필요한 복잡도. 단독 호출이 유효한 시나리오도 존재 |
| 2   | **AI 유도 힌트** | description에 `ALWAYS call X before this`를 명시, AI가 스스로 순서를 따르도록 유도 | ✅ 채택                                                |

**결정**: AI 유도 힌트 방식

**근거**

- 선행 tool 없이 단독 호출해도 기술적으로 동작함 (예: `report_issue`를 직접 호출 가능)
- MCP description은 LLM이 도구 선택 전략을 수립하는 재료이므로, 올바른 순서를 description에 인코딩하면 LLM이 스스로 따름
- 코드 레벨 강제는 자동화 스크립트 등 정상 단독 호출 시나리오를 막을 수 있어 유연성을 해침

**적용 규칙** (CLAUDE.md 반영)

- ① 선행 조건과 ④ 다음 단계는 **프롬프트 힌트**이며, 코드 강제가 아님을 description 작성자가 인지해야 함
- 선행 조건이 반드시 필요한 비즈니스 규칙이 생기면 코드 레벨 검증을 별도 결정으로 추가

---

## 결정 9: 메타데이터 파싱 소스 이중화

**질문**: `components-meta.json`을 생성할 때 어떤 소스를 파싱해야 하는가?

| #   | 옵션                               | 내용                                                                   | 검토 결과                                                   |
| --- | ---------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | types.ts만 파싱                    | ts-morph로 TypeScript AST 분석                                         | ❌ props, events, slots, methods 정보가 없음                |
| 2   | README.md만 파싱                   | Markdown 테이블에서 모든 정보 추출                                     | ❌ StyleSet 인터페이스 전체 구조를 텍스트로 파싱하기 어려움 |
| 3   | **README.md + types.ts 이중 파싱** | README.md → props/events/slots/methods, types.ts → StyleSet 인터페이스 | ✅ 채택                                                     |

**결정**: README.md(remark) + types.ts(ts-morph) 이중 파싱

**근거**

- README.md는 사람이 읽기 위해 작성된 문서이므로 props/events/slots 정보가 테이블로 정리되어 있어 파싱하기 적합
- StyleSet 인터페이스는 중첩 객체 구조가 복잡하여 Markdown 코드 블록보다 TypeScript AST 파싱이 정확함
- `raw` 필드(원본 인터페이스 문자열)를 함께 저장하면, 파서가 놓친 케이스도 LLM이 직접 읽어서 처리 가능

**스펙**

```
README.md  →  remark   →  props, events, slots, methods
types.ts   →  ts-morph →  StyleSet (variables, component, childRefs, raw)
```

---

## 결정 10: 컴포넌트 관계(relationships) 관리 방식

**질문**: 컴포넌트 간 부모·자식·형제 관계를 어떻게 관리할 것인가?

| #   | 옵션                | 내용                                          | 검토 결과                                                           |
| --- | ------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| 1   | 소스 코드 자동 파싱 | Vue SFC에서 import 관계를 분석하여 자동 생성  | ❌ 기술적으로 가능하나 "함께 자주 쓰이는" 관계는 소스에서 추론 불가 |
| 2   | **수동 JSON 파일**  | `scripts/relationships.json`을 직접 작성·관리 | ✅ 채택                                                             |

**결정**: 수동 JSON 파일 (`scripts/relationships.json`)

**근거**

- 컴포넌트 관계는 기술적 의존성뿐 아니라 설계 의도(권장 조합)를 담아야 함
- `VsForm + VsInput + VsButton` 같은 "함께 자주 쓰이는" 관계는 소스 코드에서 자동 파싱 불가
- 수동 관리로 관계의 의미(parent/children/siblings)를 명시적으로 제어 가능
- 변경 빈도가 낮아 수동 관리 부담이 크지 않음

**스펙**

```json
{
  "VsForm": {
    "children": ["VsInput", "VsSelect", "VsCheckbox"],
    "siblings": ["VsButton"]
  }
}
```

---

## 결정 11: AI 추론 위임 원칙

**질문**: `suggest_components`, `generate_component_code` 등에서 서버가 직접 추론해야 하는가?

| #   | 옵션                      | 내용                                                                   | 검토 결과                                                         |
| --- | ------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | 서버 직접 추론            | 서버 내부에서 규칙 기반 또는 임베딩으로 컴포넌트 추천·코드 생성        | ❌ 서버가 LLM 수준의 추론 능력을 가질 수 없음. 유지보수 비용 높음 |
| 2   | **LLM에게 컨텍스트 전달** | 서버는 관련 메타데이터를 조합하여 LLM에게 전달, 실제 추론은 LLM이 수행 | ✅ 채택                                                           |

**결정**: 서버는 컨텍스트 조합, 추론은 LLM 위임

**근거**

- MCP 서버의 역할은 LLM이 더 잘 추론할 수 있도록 **정확한 데이터를 적절히 조합해서 제공**하는 것
- 서버가 추론까지 담당하면 LLM의 자연어 이해 능력을 활용하지 못하는 역설 발생
- 동일한 tool이 Claude, GPT 등 다른 LLM에서도 동작 가능하도록 LLM 중립적으로 설계

**적용 범위**

- `suggest_components`: description + props 컨텍스트 제공 → LLM이 추천
- `generate_component_code`: 관련 컴포넌트 메타데이터 조합 → LLM이 코드 생성
- `adapt_type_to_component`: 타겟 컴포넌트 스펙 제공 → LLM이 변환

---

## 결정 12: search_components 확장 전략

**질문**: `search_components`의 초기 구현 방식과 장기 확장 방향을 어떻게 설계할 것인가?

| #   | 옵션                                  | 내용                                                           | 검토 결과                                             |
| --- | ------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | 처음부터 시맨틱 검색                  | 임베딩 기반 벡터 검색으로 시작                                 | ❌ 초기 복잡도가 높고, 외부 임베딩 서비스 의존성 발생 |
| 2   | **단순 매칭 → 시맨틱 교체 가능 설계** | 단순 문자열 매칭으로 시작, 인터페이스 고정 후 내부 구현만 교체 | ✅ 채택                                               |

**결정**: 단순 문자열 매칭으로 시작, `extension/semantic.ts` stub 유지

**근거**

- 도구 인터페이스(`입력: query`, `출력: ComponentMeta[]`)는 검색 방식에 무관하게 동일
- stub 파일을 통해 시맨틱 검색 교체 지점을 명시적으로 표시하면, 나중에 내부 구현만 스왑 가능
- 외부 LLM이 `suggest_components`를 통해 의미 기반 추천을 보완하므로, 단순 매칭만으로도 초기 가치 제공 가능

**확장 지점**

```
search_components (tool 인터페이스 고정)
    └── searchByKeyword()     ← 현재: 단순 문자열 매칭
    └── searchBySemantic()    ← 장기: 임베딩 기반 (extension/semantic.ts)
```

---

## 결정 13: Tool Description 4개 문장 구조

**질문**: tool description 작성 형식을 표준화해야 하는가?

**배경**: tool마다 description 스타일이 달라 AI가 호출 순서와 트리거 조건을 일관되게 파악하기 어려움.

**결정**: 4개 문장 고정 구조 채택

```
① [선행 조건]  ALWAYS call X before this.        (선행 tool이 있는 경우에만)
② [트리거]     Call this when <사용자가 ~할 때>.
③ [동작]       <이 tool이 하는 일>.
④ [다음 단계]  Then pass <반환값> to Y.           (후속 tool이 있는 경우에만)
```

**근거**

- ② 트리거를 사용자 자연어 기준으로 작성하면 AI가 상황에 맞는 tool을 정확히 선택
- ①④ 문장이 파이프라인 순서를 description에 인코딩하여 AI가 스스로 올바른 흐름을 따름
- 팀 전체가 동일한 형식을 따르면 description 품질이 균일해짐

---

## 결정 14: scripts 파일 확장자 .mjs → .ts 전환

**질문**: 데이터 생성 스크립트를 `.mjs`로 유지할 것인가, `.ts`로 전환할 것인가?

| #   | 옵션           | 내용                                                | 검토 결과                                               |
| --- | -------------- | --------------------------------------------------- | ------------------------------------------------------- |
| 1   | `.mjs` 유지    | 현재 `generate-components.mjs` 방식                 | ❌ 프로젝트 나머지 코드와 언어 불일치. 타입 안전성 없음 |
| 2   | **`.ts` 전환** | `tsx` 또는 `ts-node`로 실행, 프로젝트 tsconfig 공유 | ✅ 채택                                                 |

**결정**: 신규 스크립트는 `.ts`로 작성, 기존 `.mjs`는 점진적 전환

**근거**

- 메타데이터 파싱 스크립트(`build-meta.ts`)는 `ComponentMeta` 타입을 직접 사용하므로 TypeScript가 필수
- 스크립트와 소스 코드가 동일한 타입을 공유하면 스키마 변경 시 컴파일 오류로 즉시 감지 가능
- 팀 전체가 TypeScript 환경에 익숙하여 별도 컨텍스트 전환 비용 없음

---

## 결정 8: 신규 도구 확장 방향

**질문**: 어떤 기준으로 신규 도구를 추가할 것인가?

**조사 방법**: GitHub API로 vlossom 오픈 이슈 분석 + 유명 UI 라이브러리 MCP 서버 조사 (Ant Design, shadcn/ui, Storybook, PrimeVue, Vuetify, Context7, Chakra UI)

**추가 확정된 도구 10개:**

| #   | 도구                   | 영감 출처               | 근거                                                                 |
| --- | ---------------------- | ----------------------- | -------------------------------------------------------------------- |
| 1   | `compare_components`   | PrimeVue                | 첫 사용자의 가장 빈번한 질문 ("VsModal vs VsDrawer?")                |
| 2   | `get_component_source` | shadcn/v0 Registry      | 파서 누락 케이스를 원본 소스로 보완. AI가 수정 가능한 실제 코드 제공 |
| 3   | `get_directive`        | Vuetify                 | `v-vs-scroll-shadow` 등 디렉티브 전용 문서 부재                      |
| 4   | `get_composables`      | -                       | 이슈 #381 — 공개 컴포저블 사용 가능 여부 불명확                      |
| 5   | `get_css_tokens`       | Ant Design `antd_token` | AI가 임의 색상 하드코딩 방지. `--vs-*` 변수 체계적 제공              |
| 6   | `get_vlossom_options`  | -                       | `createVlossom()` 글로벌 설정 문서 부재                              |
| 7   | `generate_style_set`   | -                       | StyleSet 철학(variables/component/child) 오용이 잦음                 |
| 8   | `get_form_recipe`      | -                       | 실용 코드 즉시 제공 — 가장 흔한 사용 패턴                            |
| 9   | `diagnose_issue`       | -                       | 이슈 #390, #385 등 알려진 버그 즉시 매칭                             |
| 10  | `get_component`        | -                       | (Phase 2 기존 계획 — 재확인)                                         |

**핵심 기준**:

1. GitHub 이슈 데이터로 실제 사용자 페인포인트 확인된 것 우선
2. 다른 라이브러리 MCP에서 검증된 패턴 적용
3. 기존 PLAN 도구들과 중복 없이 보완 관계 형성

---

## 결정 15: 버전 관리 가이드 상세화

**날짜**: 2026-04-02

**질문**: CLAUDE.md의 버전 관리 섹션을 어느 수준으로 작성할 것인가?

**배경**: 기존 버전 관리 섹션은 3줄짜리 표와 명령어 한 줄만 있어 실제 릴리즈 시 판단 근거가 부족했음.

**결정**: 버전 분류 기준표(변경 내용 + 예시), 릴리즈 전 체크리스트, `release:*` 스크립트 동작 설명, 주의 사항을 포함한 상세 섹션으로 확장.

**근거**: 릴리즈 담당자가 판단 기준 없이 버전을 임의로 올리면 semver 일관성이 깨짐. 예시(기존 tool 삭제 → major 등)를 명시하여 모호한 경우에도 결정 기준 제공.

**적용**: `CLAUDE.md` 버전 관리 섹션 — patch/minor/major 분류 기준표 + 릴리즈 전 체크리스트 + `git push --tags` 안내.

---

## 결정 18: Stepper UX 렌더링 방식 진화

**날짜**: 2026-04-02 (feat/mcp 세션)

**배경**: `_meta` 필드를 각 tool 응답에 포함시킨 후, Claude가 이를 화면에 어떻게 렌더링할지에 대한 방식이 여러 차례 변경됨.

| # | 시도 | 결과 |
|---|------|------|
| 1 | 매 호출마다 전체 스텝 박스 반복 출력 | ❌ 이전 스텝이 계속 반복되어 로그 노이즈 |
| 2 | 중간: 1줄씩 + 마지막에 요약 박스 | ❌ 박스 너비(╔══╝) Claude가 정확히 못 맞춤 |
| 3 | Agent 서브에이전트에 위임 + 최종 박스 | ❌ 서브에이전트 컨텍스트 로딩 오버헤드 (~40-70s)로 오히려 느림 |
| 4 | **응답 이후 1회, open-ended header** | ✅ 채택 |

**최종 결정 스펙**:
```
vlossom-mcp ─────────────────────────────────────────────
✔  {N. 3}  {tool 22}  {label 24}
─────────────────────────────────────────────────────────
{toolsUsed}
```
- 닫는 테두리(`╚══╝`) 없음 → 너비 맞춤 불필요
- ms 컬럼 없음 → 서버 실행 시간(~0ms)은 round-trip 반영 안 해 오해 소지

---

## 결정 19: per-step 타이밍(ms) 제거

**날짜**: 2026-04-02

**문제**: `_meta.steps[].durationMs`는 서버 내부 JSON 조회 시간만 측정 (~0ms). 실제 Claude → MCP → Claude round-trip은 1-3초/호출이지만 서버는 측정 불가.

**결정**: 스테퍼에서 ms 컬럼 완전 제거. `toolsUsed`(어떤 도구를) 만 표시.

**근거**: 항상 0ms로 표시되는 수치는 정보가 아니라 혼란. 의미 없는 데이터를 보여주는 것보다 제거가 낫다.

---

## 결정 20: Agent 서브에이전트 위임 방식 철회

**날짜**: 2026-04-02

**배경**: Stepper를 메인 대화에서 보이게 하려고 "NEVER use sub-agent" 규칙을 SKILL.md와 INSTRUCTIONS에 추가했으나, 이후 "응답 이후 1회 출력"으로 방식을 바꾸면서 근거가 사라짐. 또한 서브에이전트 컨텍스트 초기화 비용이 (~40-70s) 직접 호출보다 훨씬 커서 오히려 역효과.

**결정**: Agent 위임 강제 규칙 제거. Claude가 컨텍스트에 따라 자율 판단.

**근거**: "어떻게 호출할지"는 Claude의 판단 영역. SKILL.md는 "무엇을 출력할지"(스테퍼 형식)에만 집중.

---

## 결정 21: _meta 세션 누적 문제 → 시작 도구에서 resetSession()

**날짜**: 2026-04-02

**문제**: MCP 서버가 단일 프로세스로 동작하므로, 서브에이전트나 여러 워크플로우가 동일 세션에서 도구를 호출하면 `_meta.steps`가 수십 개로 누적됨. 스테퍼가 이 모든 스텝을 표시하면 의미 없는 반복.

| # | 옵션 | 검토 결과 |
|---|------|-----------|
| 1 | 세션 타임아웃 단축 (60s → 10s) | ❌ 빠른 연속 호출 시 여전히 누적 |
| 2 | 요청별 연결 ID로 세션 분리 | ❌ stdio 전송에서 연결 ID가 `RequestHandlerExtra`에 미노출 |
| 3 | **시작 도구 호출 시 세션 리셋** | ✅ 채택 |

**결정**: `suggest_components`, `search_components`, `list_components` 핸들러 시작 시 `resetSession()` 호출.

**근거**: 이 세 도구는 새 워크플로우의 시작점. 호출 시 세션을 초기화하면 각 워크플로우가 독립적인 `_meta`를 가짐. `get_component` 등 후속 도구는 세션을 이어가며 누적.

---

## 결정 22: get_form_recipe, diagnose_issue 계획 제거

**날짜**: 2026-04-02

**결정**: PLAN.md에서 `get_form_recipe`, `diagnose_issue` tool 구현 계획을 완전히 제거.

**근거**: `generate_component_code`가 일반적인 코드 생성을 담당하므로 `get_form_recipe`의 역할이 중복됨. `diagnose_issue`는 known-issues.json 수동 관리 부담이 크고 실용성 불분명. 두 도구 모두 현 단계에서 ROI가 낮음.

---

## 결정 23: get_plugin 도구 추가

**날짜**: 2026-04-02

**배경**: Vlossom은 컴포넌트 외에 플러그인 시스템(`createVlossom`, `VlossomOptions`)을 가짐. 현재 MCP에는 플러그인 관련 정보를 조회하는 도구가 없음.

**결정**: `get_plugin` 도구를 `get_component`, `get_css_tokens`과 동일한 위계로 Phase 2-B에 추가.

```typescript
input: { name?: string }  // 생략 시 전체 플러그인 옵션 반환
output: {
    options: PluginOption[];  // createVlossom() 옵션 목록
    example: string;          // 사용 예시
}
```

**근거**: 사용자가 전역 StyleSet이나 colorScheme 설정 방법을 물어볼 때 조회 가능. `get_vlossom_options` 계획과 합쳐 `get_plugin`으로 통합 (별도 결정 아님).

---

## 결정 24: generate_component_code 시 StyleSet 우선 생성 규칙

**날짜**: 2026-04-02

**결정**: `generate_component_code`가 스타일이 포함된 컴포넌트 코드를 생성할 때, `generate_style_set` 철학(variables/component/child 분리)을 먼저 적용하고 그 결과를 바탕으로 코드를 생성함.

**생성 순서**:
```
1. StyleSet 설계 (variables vs component vs child ref 분류)
2. StyleSet 코드 생성
3. 컴포넌트 template/script에 styleSet prop으로 전달
```

**근거**: StyleSet을 나중에 추가하면 template 구조와 불일치가 생기기 쉬움. StyleSet 우선 설계로 스타일 구조와 컴포넌트 구조를 동시에 일관성 있게 생성.

---

## 결정 16: CLAUDE.md 300줄 제한 규칙 제거

**날짜**: 2026-04-02

**질문**: CLAUDE.md의 300줄 이하 제한을 계속 유지할 것인가?

**배경**: 버전 관리 섹션 상세화 후 파일이 304줄이 되어 자체 규칙을 위반함. 규칙이 파일 구조 트리 주석(`# 이 파일 (300줄 이하 유지)`)에 묻혀 있어 편집 시 능동적으로 확인하기 어려운 구조였음.

| # | 옵션 | 내용 | 검토 결과 |
|---|------|------|-----------|
| 1 | 규칙을 상단 섹션으로 이동 | 눈에 띄는 위치에 배치하여 강제성 유지 | 여전히 AI가 편집 전 줄 수를 능동적으로 확인해야 함 |
| 2 | **숫자 제한 제거, 원칙으로 대체** | "간결하게 유지"라는 원칙만 남김 | ✅ 채택 |

**결정**: 방법 2 — 숫자 제한 제거

**근거**: AI가 스스로 숫자 제한을 강제하기 어려운 구조적 한계. 숫자 제한의 목적(컨텍스트 과부하 방지)은 "간결하게 유지"라는 원칙으로 충분히 표현 가능.

**적용**: `CLAUDE.md` 파일 구조 항목 `(300줄 이하 유지)` → `(간결하게 유지)` 로 변경.

---

## 결정 17: 다국어 MD 파일 구성

**날짜**: 2026-04-02

**질문**: CLAUDE.md, PLAN.md, README.md를 어떻게 다국어로 제공할 것인가?

| # | 옵션 | 내용 | 검토 결과 |
|---|------|------|-----------|
| 1 | 단일 파일에 한/영 병기 | 각 섹션 아래 한국어/영어 순서로 병기 | ❌ 파일 길이 2배, 가독성 저하 |
| 2 | **메인(`.md`) = 영어, 한국어(`.ko.md`) 별도** | 표준 관행 따라 영어를 기본, 한국어 파일 추가 | ✅ 채택 |

**결정**: 방법 2 — 영어 메인, `.ko.md` 한국어 버전

**파일 구성**:

| 파일 | 언어 | 비고 |
|------|------|------|
| `CLAUDE.md` | 영어 | 메인 규칙 파일 |
| `CLAUDE.ko.md` | 한국어 | 기존 파일 내용 유지 |
| `PLAN.md` | 영어 | 메인 계획 파일 |
| `PLAN.ko.md` | 한국어 | 기존 파일 내용 유지 |
| `README.md` | 영어 | 기존 파일 유지 (이미 영어) |
| `README.ko.md` | 한국어 | 신규 생성 |

**근거**: README.md는 이미 영어로 작성되어 있어 일관성을 위해 나머지 파일도 영어를 기본으로 통일.

---

## 결정 25: skill/SKILL.md를 npm 패키지에 번들링

**날짜**: 2026-04-02

**질문**: npm으로 설치한 사용자도 Claude Code 스킬(clarify_intent 워크플로 포함)을 사용할 수 있게 하려면?

**배경**: `.claude/skills/vlossom/SKILL.md`는 레포 클론 사용자에게만 적용됨. npm 설치 사용자는 MCP 서버는 갖지만 스킬 워크플로 가이드가 없어 clarify_intent 등 권장 흐름을 따르지 않을 수 있음.

| # | 옵션 | 내용 | 검토 결과 |
|---|------|------|-----------|
| 1 | **npm 패키지에 `skill/` 디렉토리 포함** | `package.json` `files`에 `"skill"` 추가 | ✅ 채택 |
| 2 | postinstall 스크립트로 자동 복사 | `~/.claude/skills/`에 자동 설치 | ❌ 사용자 홈 디렉토리 수정은 부작용 우려 |

**결정**: 방법 1 — `packages/vlossom-mcp/skill/SKILL.md` 생성, `package.json` `files`에 `"skill"` 추가

**적용 방법 (사용자)**:
```bash
cp node_modules/vlossom-mcp/skill/SKILL.md ~/.claude/skills/vlossom.md
# 또는 프로젝트 로컬
cp node_modules/vlossom-mcp/skill/SKILL.md .claude/skills/vlossom.md
```

**근거**: MCP 서버 INSTRUCTIONS가 이미 JSON 설정만으로 clarify_intent 워크플로를 자동 주입하므로, SKILL.md는 보조 수단. 강제 자동 설치보다 명시적 복사가 사용자 통제권 면에서 적절.

---

## 결정 26: clarify_intent 판단을 LLM에게 위임

**날짜**: 2026-04-02

**질문**: clarify_intent를 언제 호출할지 서버 INSTRUCTIONS에서 규칙으로 강제할 것인가, LLM의 판단에 맡길 것인가?

**배경**: `server.ts` INSTRUCTIONS에 rigid rule block이 있었음:
- "Call when: action verb 없을 때, 3개 이상 컴포넌트 매핑 시..."
- "Do NOT call when: action verb 있을 때..."

이로 인해 `"버튼 만들어주세요"` 처럼 액션 동사가 있어도 실제로는 모호한 경우에 clarify_intent가 호출되지 않는 문제 발생.

| # | 옵션 | 내용 | 검토 결과 |
|---|------|------|-----------|
| 1 | 규칙을 더 정교하게 보완 | 예외 케이스를 추가로 열거 | ❌ 경직성 근본 해결 불가, 유지보수 비용 증가 |
| 2 | **INSTRUCTIONS 규칙 제거, 도구 description에 위임** | LLM이 description 기반으로 자체 판단 | ✅ 채택 |

**결정**: 방법 2 — INSTRUCTIONS의 clarify_intent 조건 블록 전체 삭제

**변경 내용**:
- `server.ts`: `## clarify_intent — disambiguation gate` 섹션 삭제, flow guide에 `"When intent is unclear: clarify_intent → then chosen pipeline"` 한 줄만 유지
- `clarify-intent.ts` description: `"use your own judgment about whether clarification adds value"` 명시

**근거**: MCP에서 LLM의 도구 선택 근거는 도구 description. INSTRUCTIONS의 규칙이 이를 덮어쓰는 구조는 LLM 자연 판단을 방해함. 도구 description을 신뢰하는 것이 더 유연하고 의도에 충실.

---

## 결정 27: next_action 필드를 tool 응답 데이터에 인코딩

**질문**: tool pipeline 체인을 어떻게 보장할 것인가?

**배경**

사용자가 "차트 컴포넌트를 그리고 싶다"고 요청했을 때 `search_components`가 빈 결과를 반환했으나, AI가 이슈 제안 대신 서드파티 라이브러리(Chart.js 등)를 추천하는 문제가 발생. INSTRUCTIONS 텍스트만으로는 AI가 다음 단계를 신뢰성 있게 따르지 않음.

**분석**

두 가지 접근법을 검토:

| # | 방법 | 신뢰도 | 이유 |
|---|------|--------|------|
| 1 | INSTRUCTIONS 텍스트 규칙만 사용 | 낮음 | AI가 문맥에 따라 무시할 수 있음 |
| 2 | tool 응답 데이터에 `next_action` 필드 추가 | 중간 | 구체적 데이터 신호로 AI 행동을 유도 |
| 3 | **INSTRUCTIONS + `next_action` 병행** | 높음 | 텍스트 규칙과 데이터 신호가 일치하면 AI가 따를 수밖에 없음 |

**결정**: 방법 3 — INSTRUCTIONS에 Missing Component Rule 추가 + 모든 관련 tool 응답에 `next_action` 인코딩

**`next_action` 추가 기준 (두 가지 패턴)**

**패턴 A — 선행 조건 미충족 (실패 시)**: tool이 실행됐지만 필요한 전제가 없어 실패할 때, 무엇을 먼저 해야 하는지 알려줌

| Tool | 시나리오 | next_action |
|---|---|---|
| `report_issue` | GitHub 토큰 없음 | `"set_github_token"` |
| `check_github_token` | 토큰 미설정 | `"set_github_token"` |
| `get_component` | 이름 못 찾음 | `"list_components"` |
| `get_component_source` | 이름 못 찾음 | `"list_components"` |
| `compare_components` | 컴포넌트 못 찾음 | `"list_components"` |
| `search_components` | 결과 없음 | `"suggest_issue"` |
| `suggest_components` | 결과 없음 | `"suggest_issue"` |

**패턴 B — 성공 후 다음 단계 (정상 흐름)**: tool이 성공했을 때 pipeline의 다음 노드를 명시

| Tool | 시나리오 | next_action |
|---|---|---|
| `list_components` | 목록 반환 | `"get_component"` |
| `check_github_token` | 토큰 설정됨 | `"draft_issue"` |
| `set_github_token` | 토큰 저장 성공 | `"draft_issue"` |
| `draft_issue` | 템플릿 생성 완료 | `"report_issue"` |
| `search_components` | 결과 있음 | `"get_component"` |
| `suggest_components` | 결과 있음 | `"get_component"` |
| `get_component_relationships` | 관계 반환 | `"get_component"` |

**근거**: tool 응답 데이터는 AI가 반드시 읽는 구조화된 정보. INSTRUCTIONS 텍스트보다 무시하기 어렵다. 두 레이어가 같은 방향을 가리킬 때 AI 행동의 일관성이 높아진다. 링크드리스트처럼 각 노드(tool)가 다음 노드를 명시적으로 가리키는 구조.

**3차 보완 (교차 도메인 관계)**: 같은 기능의 다른 형태, 스타일링 컨텍스트 연결 추가:
- `get_composables` ↔ `get_directive`: 같은 기능이 composable(프로그래매틱)과 directive(선언적) 두 형태로 제공될 수 있음
- `get_css_tokens` ↔ `get_vlossom_options`: 디자인 토큰과 전역 설정은 상호 참조 관계
- `get_component` 성공 → `get_css_tokens`: 컴포넌트 스타일링 컨텍스트로 자연스럽게 연결
- `get_composables`/`get_directive` 없음 → `suggest_issue`: 없는 composable/directive도 enhancement 요청 대상

**4차 보완 (clarify_intent 적극 개입)**: off-topic 쿼리와 검색 실패 시 clarify_intent를 먼저 호출하도록 변경:
- LLM 특성상 Vlossom과 무관한 질문이 들어올 수 있음 → clarify_intent로 Vlossom 관련 맥락으로 재유도
- `search_components` 빈 결과 → 바로 `suggest_issue`가 아니라 `clarify_intent` 먼저 (쿼리 표현이 다를 수 있음)
- `suggest_components` 빈 결과는 휴리스틱까지 적용한 결과이므로 `suggest_issue` 유지 (진짜 없는 것)
- INSTRUCTIONS에 Proactive Clarification Rule 추가

**2차 보완 (인과관계 전체 검토)**: 전체 tool 그래프를 재검토하여 누락된 연결 4개 추가:
- `list_components` → `get_component`: 목록 조회 후 특정 컴포넌트 상세 조회는 자연스러운 흐름
- `get_component_relationships` 성공 → `get_component`: 관계 파악 후 각 관련 컴포넌트 상세 조회
- `get_component_relationships` 실패 → `list_components`: 다른 not-found 패턴과 일관성
- `get_directive` 실패 → `suggest_issue`: 없는 directive는 컴포넌트와 동일하게 enhancement 요청 대상

---

## 결정 28: 서버 사이드 clarify 메커니즘 제거 (LLM 위임 원칙)

**날짜**: 2026-04-02

**배경**: `suggest_components`에 `needsClarify = heuristicCount === 0 && components.length >= 3` 로직이 있었음. 휴리스틱 매핑 없이 결과가 3개 이상이면 `_meta.clarify: true`를 반환하여 LLM이 `clarify_intent`를 호출하도록 유도.

**문제**: 이 판단은 "쿼리가 모호한가?"라는 언어적 추론을 스크립트가 수행하는 것. 결과 수로 모호성을 판별하는 것은 신뢰할 수 없는 휴리스틱.

| # | 옵션 | 검토 결과 |
|---|------|-----------|
| 1 | 휴리스틱 개선 (임계값 조정, 가중치 부여) | ❌ 근본적으로 스크립트가 언어 판단을 대행하는 구조 |
| 2 | **서버 사이드 판단 완전 제거, LLM에 위임** | ✅ 채택 |

**결정**: `needsClarify` 로직 삭제, `McpResponseMeta.clarify?: boolean` 필드 삭제, `recordStep`의 `clarify` 파라미터 삭제.

**수정 파일**: `suggest-components.ts`, `mcp-response.ts`, `clarify-intent.ts` (description에서 `_meta.clarify` 참조 제거).

**원칙화**: CLAUDE.md에 **G1 — No server-side LLM judgments** 가드레일로 명문화.

**판단 기준**: 서버가 `next_action`을 발행하는 건 객관적 사실(조회 실패, 토큰 없음, 결과 없음)에만 한정. 언어적 판단(쿼리가 모호한가, 문장이 올바른가)은 반드시 LLM에 위임.

---

## 결정 29: clarify_intent presentation_format 하네스

**날짜**: 2026-04-02

**배경**: `clarify_intent`가 선택지를 반환해도 LLM이 사용자에게 표시하는 형식이 일관되지 않았음. 세션마다 번호 없이 나열, 마크다운 리스트, 자연어 등 다양하게 출력.

**결정**: `clarify_intent` 응답에 `presentation_format` 필드를 추가. LLM은 이 필드를 재해석 없이 그대로 사용자에게 출력.

**형식**:
```
💬 I want to make sure I understand what you need. Which of these best matches?

[1] <label>
[2] <label>
[3] <label>

Please reply with a number (1–3).
```

**근거**: `[N]` 인덱싱은 사용자가 숫자만 답해도 명확히 선택 가능. LLM이 임의로 재형식화하면 인덱스가 불분명해질 수 있음. 하네스로 응답에 포함시켜 일관성 강제.

---

## 결정 30: get_usage_examples 도구 추가

**날짜**: 2026-04-02

**배경**: "vlossom-mcp를 어떻게 쓸 수 있나요?"라는 질문에 대한 답이 없었음. 도구 목록 나열만으로는 파이프라이닝 방식의 실제 흐름이 전달되지 않음.

**결정**: `get_usage_examples` 도구를 추가하여 3개의 end-to-end 파이프라인 예제를 반환.

**포함된 예제**:

| id | 시나리오 | 단계 수 |
|----|---------|--------|
| `missing-component` | 차트 컴포넌트 없음 → 이슈 제출까지 전체 흐름 | 7 |
| `build-login-form` | 로그인 폼 제작 → 컴포넌트 조회 → 코드 생성 | 4 |
| `lookup-specific-component` | VsDrawer 상세 조회 + CSS 토큰 연결 | 3 |

**각 예제 구조**: `user_prompt` → `pipeline[]` (step마다 `tool`, `input`, `output_summary`, `why` 포함).

**핵심 설계 원칙**: `input`/`output_summary`를 명시하여 파이프라인 체인의 동작을 직관적으로 이해할 수 있게 함. `why` 필드로 각 단계의 인과관계를 설명.

**트리거**: INSTRUCTIONS flow guide에 "When user asks how to use vlossom-mcp: `get_usage_examples`" 추가.

---

## 결정 31: CLAUDE.md를 하네스/가드레일 분류 체계로 재구성

**날짜**: 2026-04-02

**배경**: 기존 CLAUDE.md는 도구 설계 원칙, 코드 스타일, 버전 관리, 에이전트 설정이 순서 없이 나열됨. 새 규칙이 추가될 때 어디에 넣을지 명확하지 않았고, 규칙의 성격(금지인지 안내인지)이 뒤섞여 있었음.

**분류 체계**:

| 개념 | 정의 | 역할 |
|------|------|------|
| **가드레일(Guardrail)** | 절대 해서는 안 되는 것 | 위반하면 버그 |
| **하네스(Harness)** | 올바른 행동을 유도하는 구조적 틀 | 따르면 일관성 보장 |
| **참고(Reference)** | 도구 추가 절차, 데이터 파일, 코드 스타일, 버전 관리 | 지원 정보 |

**가드레일 4개**: G1(서버 사이드 LLM 판단 금지), G2(report_issue 명시 승인 필요), G3(단일 책임 원칙), G4(clarify_intent 재호출 금지).

**하네스 5개**: H1(도구 description 4문장 구조), H2(next_action 링크드리스트), H3(clarify_intent 선택 형식), H4(Stepper UX), H5(이슈 제출 흐름).

**SKILL.md도 동일 체계로 재구성**: 스킬 파일에도 가드레일/하네스 섹션을 적용하여 개발자와 LLM 모두가 동일한 분류 언어를 사용.

---

## 결정 32: 대화형 응답에 이모지 최소 적용

**날짜**: 2026-04-02

**배경**: 텍스트만으로는 중요한 대화 전환점(선택 요청, 인증 요청, 초안 준비)이 시각적으로 구분되지 않음.

**결정**: 사용자와 직접 대화가 발생하는 응답 메시지에만 이모지를 적용. 5개 이모지 고정 세트로 제한.

| 이모지 | 위치 | 의미 |
|--------|------|------|
| `💬` | `clarify_intent` presentation_format | 선택 요청 다이얼로그 |
| `🔗` | `get_usage_examples` description | 파이프라인 체인 소개 |
| `💡` | `suggest_components` 빈 결과 next_action_message | 없는 기능 → 이슈 제안 |
| `🔑` | `check_github_token` / `set_github_token` message | 인증 상태 변경 |
| `📝` | `draft_issue` next_action_message | 초안 완성, 섹션 수집 요청 |

**제약**: 이 5개 이외의 이모지는 도구 응답에 추가하지 않음. LLM 내부 안내 전용 필드(`next_action_message` 대부분)에는 적용하지 않고 사용자에게 직접 보이는 텍스트에만 한정.

---

## 결정 33: get_usage_examples 스테퍼 파이프라인 시각화

**날짜**: 2026-04-02

**배경**: `get_usage_examples`는 단일 도구 호출이므로 `recordStep()`을 한 번만 호출하면 1-step 스테퍼가 렌더링됨. 이는 사용자에게 실제 파이프라인 구조를 전달하지 못하고 노이즈만 추가.

**결정**: `recordStep()` 대신 `EXAMPLES[0].pipeline`(missing-component, 7단계)의 스텝 정보로 직접 `McpResponseMeta`를 생성. 스테퍼가 실제 파이프라인 흐름을 반영.

| 옵션 | 검토 결과 |
|---|---|
| `recordStep()` 한 번 호출 | ❌ 1-step 스테퍼 → 의미 없음 |
| 모든 예제 파이프라인 합산 | ❌ 3개 예제 합산 시 순서·맥락 불명확 |
| **missing-component 예제 파이프라인만 사용** | ✅ 채택 — 가장 긴 7단계, 모든 주요 도구 포함 |

**구현**: `PipelineStep`에 `stepperLabel` 필드 추가. `McpResponseMeta`를 `pipeline.map()`으로 직접 생성, `toolsUsed`는 중복 카운트 로직 인라인.

---

## 결정 34: 스테퍼 렌더링 조건 — steps ≥ 2 (H4 수정)

**날짜**: 2026-04-02

**배경**: 단일 도구 호출(예: `list_components`, `get_vlossom_options`)에서도 스테퍼가 렌더링되면 1줄짜리 스테퍼가 나타남. 정보 가치 없이 레이아웃만 차지.

**결정**: `_meta.steps.length < 2`이면 스테퍼를 건너뜀. CLAUDE.md H4, SKILL.md, server.ts INSTRUCTIONS 세 곳에 동시 적용.

---

## 결정 35: H6 — 빈 결과 시 사용자 고지 하네스

**날짜**: 2026-04-02

**배경**: `search_components`나 `suggest_components`가 빈 배열을 반환하면 LLM이 `next_action`을 즉시 따라가면서 사용자에게 아무 설명 없이 다음 도구를 호출하는 경우가 발생.

**결정**: 빈 결과(`components: []`, `results: []` 등)를 반환한 경우, LLM은 반드시 사용자에게 "매칭된 컴포넌트가 없습니다"를 먼저 고지한 뒤 `next_action`을 따름. CLAUDE.md H6, SKILL.md, server.ts INSTRUCTIONS에 적용.

---

## 결정 36: G5 — 컴포넌트 환각 방지 가드레일

**날짜**: 2026-04-02

**배경**: LLM이 도구 응답에 없는 컴포넌트 이름을 언급하거나 추천하는 경우가 발생할 수 있음. `VsChart`, `VsDataGrid` 같은 존재하지 않는 컴포넌트를 자신 있게 안내하는 것은 사용자를 혼란시킴.

**결정**: 현재 대화의 도구 응답에 등장한 컴포넌트만 언급 가능. 불확실한 경우 `search_components`를 먼저 호출. CLAUDE.md G5, SKILL.md G4, server.ts INSTRUCTIONS에 적용.

**G5가 G1보다 뒤에 번호가 매겨진 이유**: G1–G4는 서버 사이드 구현 원칙, G5는 LLM 런타임 행동 원칙으로 나중에 추가됨. 번호는 추가 순서를 반영.

---

## 결정 37: CLAUDE.md 가드레일/하네스 체계 최종 현황

**날짜**: 2026-04-02

**현황**: 가드레일 5개(G1–G5) · 하네스 7개(H1–H7)

| ID | 분류 | 내용 |
|---|---|---|
| G1 | 가드레일 | 서버 사이드 LLM 판단 금지 |
| G2 | 가드레일 | report_issue 명시적 승인 필수 |
| G3 | 가드레일 | 도구 단일 책임 |
| G4 | 가드레일 | clarify_intent 재호출 금지 |
| G5 | 가드레일 | 컴포넌트 환각 방지 |
| H1 | 하네스 | 도구 설명 4문장 구조 |
| H2 | 하네스 | next_action 링크드리스트 |
| H3 | 하네스 | clarify_intent 선택지 포맷 |
| H4 | 하네스 | 스테퍼 UX (steps ≥ 2) |
| H5 | 하네스 | 이슈 등록 흐름 |
| H6 | 하네스 | 빈 결과 사용자 고지 |
| H7 | 하네스 | 자연어 쿼리 시 clarify_intent 우선 호출 |

---

## 결정 38: suggest_components 한국어 입력 처리 — HEURISTIC_MAP 미사용

**날짜**: 2026-04-03

**배경**: `extractKeywords()`의 정규식 `/[^a-z0-9]/g`이 한글을 포함한 모든 비ASCII 문자를 제거했음. "로그인 폼" 입력 시 키워드가 `["", ""]`로 변환되어 아무 컴포넌트도 매칭되지 않는 버그 확인.

**시도 및 거부**:

| 옵션 | 검토 결과 |
|---|---|
| 정규식 수정 + 한국어 HEURISTIC_MAP 추가 (`로그인` → VsForm 등) | ❌ 거부 — G1 위반. "로그인 폼" → VsForm,VsInput,VsButton 매핑은 의미론적 판단으로 LLM의 책임 |
| **정규식 수정만 적용** (`/[^a-z0-9\uAC00-\uD7A3]/g`) | ✅ 채택 — 한글 문자를 보존하되, 컴포넌트 매핑은 LLM에 위임 |

**결정**: 정규식에서 한글 범위(`\uAC00-\uD7A3`)를 보존하도록 수정. HEURISTIC_MAP에 한국어 항목은 추가하지 않음. 한국어 use case를 가진 사용자에게는 LLM이 영문 키워드로 변환하거나 적절히 해석하여 도구를 호출하는 것이 올바른 흐름.

**근거**: G1 — "이 판단이 자연어 이해를 필요로 하는가?" → Yes → LLM에 위임.

---

## 결정 39: get_usage_examples README 누락 수정

**날짜**: 2026-04-03

**배경**: `get_usage_examples` 도구가 server.ts에 등록되어 있으나 README.md, README.ko.md 도구 목록에서 누락되어 있었음.

**결정**: 두 README 파일의 "Discovery & Lookup" / "탐색 및 조회" 테이블에 `get_usage_examples` 행 추가.

---

## 결정 40: get_usage_examples — recordStep 패턴 통일 및 clarify_intent_candidates 추가

**날짜**: 2026-04-03

**배경**: `get_usage_examples`가 유일하게 `recordStep()`을 호출하지 않고 `EXAMPLES[0].pipeline`으로 수동 meta를 구성했음. 결과적으로 세션 step 번호가 동기화되지 않고 stepper도 렌더링되지 않는 문제 확인.

**변경 내용**:
- `recordStep("get_usage_examples", "Usage examples", ...)` 호출로 다른 도구와 패턴 통일
- `clarify_intent_candidates` 필드 추가: `EXAMPLES.map()`으로 자동 생성되는 후보 목록. LLM이 `clarify_intent` 호출 시 candidates를 직접 구성하지 않아도 되도록 스캐폴딩 제공
- 도구 설명 4번 문장 H1 규칙에 맞게 수정

**거부된 옵션**: `presentation_format` 직접 포함 — EXAMPLES가 변경될 때 문자열을 별도로 동기화해야 하므로 유지보수 위험. `clarify_intent_candidates`는 `EXAMPLES.map()`으로 자동 생성되어 항상 동기화됨.

---

## 결정 41: H7 하네스 추가 — 자연어 쿼리 시 clarify_intent 우선 호출

**날짜**: 2026-04-03

**배경**: `search_components`, `suggest_components` 같이 자연어 입력을 받는 도구에서 LLM이 `clarify_intent`를 건너뛰고 바로 도구를 호출하는 현상이 반복됨.

**결정**: CLAUDE.md에 H7 하네스 추가.
- 사용자 입력이 자연어 설명(free-form)인 경우 → 어떤 도구든 호출 전에 `clarify_intent` 먼저 호출
- 명확한 식별자(컴포넌트 이름 등)이거나 파이프라인 중간 도구인 경우 → 스킵

**근거**: 기본값을 "바로 호출"에서 "의도 확인 우선"으로 뒤집음으로써 LLM의 기본 동작을 대화형으로 유도. 식별자 판단은 LLM이 하므로 G1 준수.

---

## 결정 42: search_components description 범위 축소 — 명확한 키워드 전용

**날짜**: 2026-04-03

**배경**: `search_components`의 description에 `"or use case"`, `"which component should I use for X"` 표현이 포함되어, 모호한 free-form 쿼리도 `clarify_intent`를 거치지 않고 직접 `search_components`로 유입되는 현상 발생.

**예시**: `"steprecord 알려줘"` → `search_components("steprecord")` → 결과 없음 → `clarify_intent` 순으로 흘렀으나, H7 의도대로라면 `clarify_intent`가 먼저였어야 함.

| # | 옵션 | 검토 결과 |
|---|---|---|
| 1 | description에서 use-case 관련 표현 제거, 명확한 키워드 전용으로 명시 | ✅ 채택 |
| 2 | 별도 진입점 tool 추가 | ❌ G3 위반 가능성, 기존 clarify_intent로 충분 |

**결정**: `search_components` description을 구체적 컴포넌트 이름·명확한 키워드 전용으로 제한. `"Do NOT call this for vague or free-form descriptions — call clarify_intent first instead"` 문구 추가.

**근거**: tool description이 LLM의 호출 전략을 결정하므로, description을 좁히는 것이 코드 변경 없이 라우팅을 수정하는 가장 단순한 방법. `clarify_intent` description에도 `"Call this FIRST"` 우선순위를 명시하여 양방향으로 강제.

---

## 결정 43: resetSession() 제거 — 세션 관리를 타임아웃 전용으로 단순화

**날짜**: 2026-04-03

**배경**: `search_components`, `suggest_components`, `list_components`가 호출 시 `resetSession()`을 실행하여 세션을 초기화했음. `clarify_intent` → `search_components` 연속 흐름에서 두 번째 `search_components`가 세션을 리셋, `_meta.steps.length < 2`가 되어 stepper가 출력되지 않는 버그 발생.

**문제 흐름**:
```
search_components("steprecord")   → resetSession() → step 1
clarify_intent                    →               → step 2
[user picks option]
search_components("timeline...")  → resetSession() → step 1  ← 세션 리셋으로 누락
```

| # | 옵션 | 검토 결과 |
|---|---|---|
| 1 | `resetSession()` 전체 제거, 60초 타임아웃만 사용 | ✅ 채택 |
| 2 | `is_continuation` 파라미터로 조건부 리셋 | ❌ LLM 판단 의존 → G1 위반 가능 |
| 3 | clarify_intent에서 세션 보존 플래그 설정 | ❌ tool 간 숨겨진 상태 의존성 |

**결정**: 3개 tool에서 `resetSession()` 호출 제거. 세션 경계는 60초 inactivity timeout으로만 관리.

**트레이드오프**: 60초 내 연속 쿼리 시 이전 쿼리의 step이 stepper에 누적될 수 있음. 그러나 일반적인 대화 흐름에서 한 쿼리의 tool 호출들은 수 초 내에 완료되고, 새 쿼리 전에는 사용자 입력 대기 시간이 발생하므로 실질적인 오염 가능성은 낮음.

**근거**: `"initiating tool"` 가정이 `clarify_intent` 연속 흐름에서 깨짐. 명시적 리셋보다 타임아웃 기반이 더 robust하며 코드가 단순해짐.

---

## 결정 44: `_meta._render` — stepper 렌더링 힌트를 응답에 포함

**날짜**: 2026-04-03

**배경**: Stepper 렌더링 지침(S4)이 `CLAUDE.md`에만 있어, vlossom 모노레포 외부 프로젝트에서 vlossom-mcp 사용 시 stepper가 출력되지 않는 문제 발생. `_meta`는 응답에 항상 포함되지만 LLM에게 렌더링 지침이 없으면 무시됨.

| # | 옵션 | 검토 결과 |
|---|---|---|
| 1 | 각 tool description에 렌더링 지침 추가 | ❌ 15개+ tool 수정 필요, description 과잉, steps < 2에도 항상 포함 |
| 2 | `_meta._render` 필드로 응답에 힌트 포함 | ✅ 채택 |

**결정**: `textResponse()` 유틸리티에서 `meta.steps.length >= 2`일 때 `_meta._render` 필드를 조건부로 추가. stepper 포맷(컬럼 너비, 구분선, footer 형식)을 힌트에 명시하여 CLAUDE.md 없이도 어느 프로젝트에서나 동작.

**근거**: 단일 유지보수 지점(`textResponse`), 조건부 포함으로 노이즈 최소화, 데이터와 렌더링 힌트가 동기화됨. CLAUDE.md는 fallback으로 유지.

---

## 결정 45: CLAUDE.md 분류 체계 재구성 — Harnesses > Guardrails / Scaffolds

**날짜**: 2026-04-03

**배경**: 기존 `Guardrails`와 `Harnesses`를 동등한 레벨로 분리했으나, 가드레일은 개념적으로 "부정 하네스"이므로 하네스의 하위 개념이 더 정확함.

**이전 구조**:
```
## Guardrails  ← 최상위
## Harnesses   ← 최상위
```

**새 구조**:
```
## Harnesses          ← 최상위
  ### Guardrails      ← 부정 제약 (위반 = 버그)
  ### Scaffolds       ← 긍정 처방 (위반 = 품질 저하)
```

**결정**: Harnesses를 최상위로, G(Guardrails)와 H(Scaffolds)를 하위로 재구성. 식별자(G1-G5, H1-H7)는 기존 참조 호환성을 위해 유지. CLAUDE.md와 SKILL.md 동시 적용.

**근거**: 분류 체계가 실제 개념 관계를 반영. 두 sub-type의 심각도 차이는 각 섹션 설명으로 명시.

---

## 결정 46: relationships.json 완성 — 12개 누락 컴포넌트 추가 및 dist 복사 자동화

**날짜**: 2026-04-03

**배경**: `get_component_relationships` 도구 호출 시 VsAvatar, VsContainer, VsDimmed, VsDivider, VsFocusTrap, VsIndexView, VsLabelValue, VsProgress, VsRender, VsResponsive, VsTextWrap, VsVisibleRender 등 12개 컴포넌트에 대해 관계 데이터를 찾지 못하는 문제 발생. 두 가지 별개 원인이 있었음.

**원인**:
1. `scripts/relationships.json` 소스 파일에 12개 컴포넌트 항목 자체가 없음
2. `generate-components.mjs` 스크립트가 `relationships.json`을 `dist/data/`로 복사하는 로직이 없어, 배포 후 런타임에서 파일을 찾지 못함

| # | 옵션 | 검토 결과 |
|---|---|---|
| 1 | 누락 컴포넌트 수동 추가 + dist 복사 로직 추가 | ✅ 채택 |
| 2 | 런타임에 동적으로 파일 생성 | ❌ 배포된 패키지에서 소스 접근 불가 |

**결정**: `scripts/relationships.json`에 12개 컴포넌트 항목 추가. `generate-components.mjs` 마지막에 `relationships.json`을 `src/data/`와 `dist/data/` 양쪽으로 복사하는 로직 추가.

**근거**: 다른 데이터 파일(components-data, css-tokens 등)과 동일한 패턴으로 통일. 빌드 시점에 복사하므로 런타임 의존성 없음.

---

## 결정 47: get_changelog 재설계 — 런타임 fetch 제거, 빌드 타임 번들링으로 전환

**날짜**: 2026-04-03

**배경**: 기존 `get_changelog`는 런타임에 GitHub Releases API를 직접 fetch했음. 이는 네트워크 의존성, 지연, 방화벽 환경 실패 등 문제를 야기. 또한 vlossom 릴리즈 태그 형식이 `vlossom-v2.0.0-beta.1`으로 일반적인 `v1.2.3`과 달라 파싱 오류 발생.

| # | 옵션 | 검토 결과 |
|---|---|---|
| 1 | 런타임 fetch 유지, 에러 처리 강화 | ❌ 네트워크 의존성 근본 해결 안 됨 |
| 2 | 빌드 타임에 JSON 생성, 번들로 배포 | ✅ 채택 |
| 3 | 캐싱 레이어 추가 | ❌ 복잡도 증가, 오래된 데이터 위험 |

**결정**: `scripts/build-changelog.mjs` 스크립트 신규 작성. `npm run generate` 체인에 포함하여 빌드/배포 시 자동 실행. `changelog.json`을 `src/data/`와 `dist/data/`에 저장. `get-changelog.ts`를 `createRequire` 패턴으로 리팩터링하여 번들 파일을 읽도록 변경. 태그 파싱 정규식을 `/^(?:.*-)?v/`로 수정하여 `vlossom-v2.0.0-beta.1` 형식 처리. 현재 안정 릴리즈가 없을 경우 최신 프리릴리즈를 `latestStable`로 폴백.

**근거**: 다른 데이터 파일(components-meta, css-tokens 등)과 동일한 번들링 패턴으로 일관성 유지. 네트워크 없는 환경에서도 동작. 빌드 실패 시 `process.exit(0)`으로 non-fatal 처리하여 네트워크 없는 CI 환경도 지원.

---

## 결정 48: 입력 검증 오류 최소화 — 3가지 schema 개선

**날짜**: 2026-04-03

**배경**: 외부 프로젝트에서 vlossom-mcp 사용 시 세션 초반에 tool 호출이 한 번씩 validation error로 실패하는 패턴 발견. LLM이 재시도하여 성공하지만 불필요한 왕복이 발생.

**원인 분석**:

| 도구 | 문제 | 증상 |
|---|---|---|
| `clarify_intent` | `candidates.length(3)` 엄격 제약 | LLM이 2개/4개 생성 시 ZodError |
| `get_css_tokens` | enum에 `"typography"`, `"size"` 포함 | 실제 데이터에 없는 카테고리 통과 후 빈 결과 |
| `draft_issue`, `report_issue` | `type` enum에 `"enhancement"` 없음 | LLM이 "enhancement" 사용 시 ZodError |

| # | 옵션 | 검토 결과 |
|---|---|---|
| 1 | description만 수정하여 LLM 유도 | ❌ 근본 해결 안 됨, 여전히 가끔 실패 |
| 2 | schema를 유연하게 + 서버에서 정규화 | ✅ 채택 |

**결정**:
- `clarify_intent`: `.length(3)` → `.min(1).max(5)`, 서버에서 3개로 정규화 (초과 시 slice, 미달 시 마지막 항목으로 padding)
- `get_css_tokens`: enum에서 `"typography"`, `"size"` 제거, description도 정확한 값만 명시
- `draft_issue` / `report_issue`: enum에 `"enhancement"` 추가, `.transform()`으로 `"feature"`로 정규화

**근거**: "입력은 관대하게, 출력은 엄격하게" 원칙. schema 제약으로 LLM을 교육하기보다 서버에서 의미론적으로 동등한 값을 처리하는 것이 더 robust함.

---

## 결정 49: GitHub 이슈 포맷 일치 — suggestedLabels 자동 포함

**날짜**: 2026-04-03

**배경**: GitHub 리포지토리의 이슈 템플릿(`.github/ISSUE_TEMPLATE/bug_report.md`, `feature_request.md`)을 직접 확인한 결과, 템플릿 frontmatter에 `labels: bug`, `labels: feature`가 명시되어 이슈 생성 시 레이블이 자동으로 붙음. 우리 도구는 `report_issue`에 optional `labels` 파라미터가 있지만 `draft_issue`가 어떤 레이블을 써야 하는지 알려주지 않아 LLM이 대부분 레이블을 누락시키고 있었음.

**비교 결과**:
- 섹션 헤딩 (bug: 버그 내용/재현 스텝/기대 동작/스크린샷/개발 환경, feature: 개요/요구사항/설명/참고): ✅ 완전 일치
- 제목 prefix ([bug], [feat]): ✅ 일치
- labels: ❌ 누락 → 이번 결정으로 수정
- question 타입: GitHub에 없는 우리 도구 추가 기능 (허용)

| # | 옵션 | 검토 결과 |
|---|---|---|
| 1 | `report_issue`에서 type → label 매핑을 서버에서 자동 처리 | ❌ G2 위반 가능성 (사용자 확인 없이 레이블 자동 설정) |
| 2 | `draft_issue` 응답에 `suggestedLabels` 포함, LLM이 전달 | ✅ 채택 |

**결정**: `IssueDraft` 타입에 `suggestedLabels: string[]` 추가. `buildDraft`의 모든 분기(bug/feature/question, ko/en)에서 type에 맞는 레이블 반환. `report_issue`의 `labels` description에 "draft_issue의 suggestedLabels를 전달하라"고 명시.

**근거**: LLM이 데이터를 직접 전달하므로 사용자가 확인 단계에서 레이블을 볼 수 있음. 자동 처리보다 투명성 유지.
