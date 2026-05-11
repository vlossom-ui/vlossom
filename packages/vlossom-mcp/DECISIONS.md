# Vlossom MCP — 스펙 결정 기록

> feat/mcp 브랜치 Claude Code 세션에서 검토한 옵션과 그 결정 근거를 기록합니다.
> 이 파일은 chronological decision log입니다. 과거 항목에는 legacy tool 이름이 남아 있을 수 있으며, 현재 public contract는 최근 결정과 `README.md` / `PHILOSOPHY.md` / `ARCHITECTURE.md`를 기준으로 합니다.

---

## 결정 79: vlossom-mcp를 release-please publish 파이프라인에 합류

**날짜**: 2026-05-08

**배경**: `packages/vlossom`은 release-please-action(@v4) + Release PR + dist-tag-aware `pnpm publish` 흐름으로 자동 배포되는 반면, `packages/vlossom-mcp`는 `package.json`의 `release:patch / release:minor / release:major` 수동 스크립트로만 배포 가능했다. 두 패키지가 동일 monorepo 안에 있으면서 한쪽만 수동 release인 상태는 일관성·실수 위험 양쪽에서 문제가 된다.

| #  | 옵션                                                                | 검토 결과                                                                                                          |
| -- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1  | 수동 `release:*` 스크립트 유지                                       | ❌ release-please의 changelog 자동 생성·버전 bump PR 흐름과 단절. 두 패키지에 두 다른 멘탈 모델.                    |
| 2  | release-please-config에 `packages/vlossom-mcp` 추가, publish job 신설| ✅ 채택 — 두 패키지가 동일한 PR-driven release 흐름을 공유. 수동 스크립트 폐기.                                     |
| 3  | 별도 manifest로 분리                                                 | ❌ release-please는 단일 manifest로 multi-package 지원이 표준 — 분리하면 도구 친화도 떨어짐.                       |

**변경 내용**:

- `release-please-config.json`: `packages/vlossom-mcp` 항목 추가, `prerelease: false` 명시(vlossom의 beta 채널과 구분).
- `release-please-manifest.json`: 현재 published 버전 `0.13.1` seed.
- `.github/workflows/release-please.yml`:
  - 단일 `ok-to-deploy` boolean을 패키지별 `vlossom-released` / `vlossom-mcp-released` outputs로 분리.
  - 머리 commit prefix 필터를 `refactor` / `revert`까지 확장(본 PR이 두 prefix 모두 사용).
  - `publish-vlossom-mcp` job 신설 — `npm ci` → `npm run build` → dist-tag-aware `npm publish` (prerelease 시 `--tag <token>`).
- `.github/workflows/ci.yml`: `vlossom-mcp-test` job 신설로 publish 전 보호.
- `packages/vlossom-mcp/package.json`: 수동 `release:patch / minor / major` 스크립트 제거. `prepublishOnly: npm run verify`는 유지.
- NPM token은 기존 `VLOSSOM_NPM_TOKEN` secret 재사용.

**결정**: vlossom-mcp는 release-please 단일 manifest를 통해 vlossom과 동일 흐름으로 배포한다.

**근거**: 동일 monorepo, 동일 publishing 정책. 수동 npm version + publish는 정상 흐름이 아닌 emergency-only 영역이며, 그런 경우는 PR-driven cycle을 우회해야 하므로 어차피 별도 권한이 필요하다. release-please의 multi-package 지원이 이미 존재하므로 두 흐름을 통합하는 비용은 30줄 미만.

---

## 결정 78: PR #413 인라인 review follow-up — 12개 코멘트를 commit별로 분리 반영

**날짜**: 2026-05-08

**배경**: PR #413 초기 두 commit(`6f45e06`, `24fc091`) 위에 작성자 self-review가 12개의 인라인 코멘트(P1 5개 / P2 2개 / P3 2개 / P4 1개 / P5 2개)를 남겼다. 각 코멘트는 별도의 관심사(`.ko.md` 제거, plugin API alignment, 코딩 규칙 재작성, sfc-validator의 Vue-owned 키워드 enumeration 제거 등)를 다루기 때문에 한꺼번에 처리하면 review 단위가 흐려지고, "어느 코멘트가 어느 변경으로 반영됐는지" 추적이 어려워진다.

**변경 내용**:

코멘트당 1 commit으로 분리해 다음 순서로 반영했다 (P1 → P2 → P3 → P4 → P5):

| #  | Commit                                                                | 대응 코멘트                                                              |
| -- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1  | revert(skills): restore /doc-amend numbering                          | P1 — `.claude/skills/README.md`의 의미 없는 numbering 변경 되돌림        |
| 2  | docs(vlossom-mcp): drop unused .ko.md doc variants                    | P1 — `README.ko.md` / `CLAUDE.ko.md` 제거 + 의존 참조 정리               |
| 3  | chore(vlossom-mcp): inline dist cleanup                               | P3 — `scripts/clean-dist.ts` 제거, `package.json` 인라인 처리            |
| 4  | refactor(vlossom-mcp): drop hand-curated MIGRATION_STEPS              | P2 — 버전별 migration steps 정적 데이터 제거, 에이전트 추론에 위임       |
| 5  | fix(vlossom-mcp): align VLOSSOM_PLUGINS with real plugin APIs         | P1 — Toast/Modal/Alert/Confirm/Prompt 실제 API와 정렬                    |
| 6  | refactor(vlossom-mcp): replace concrete coding rules                  | P1 — 12개의 콘크리트 규칙을 5개의 scaffolding 명제로 단순화              |
| 7  | feat(vlossom-mcp): broaden search synonyms                            | P4 — breadcrumb/fab/snack/searchbar/data-table 등 도메인 어휘 추가       |
| 8  | refactor(vlossom-mcp): move synonym-expander into utils/              | P3 — domain-agnostic helper를 `internal/utils/`로 이동                   |
| 9  | refactor(vlossom-mcp): split component-relationships data             | P5 — `src/data/component-relationships.ts`로 데이터 분리                 |
| 10 | refactor(vlossom-mcp): drop Vue-owned keyword enumerations            | P2 — `VUE_DIRECTIVES` / `COMMON_DOM_EVENTS` 제거, prefix 기반 필터로 대체|
| 11 | feat(vlossom-mcp): broaden Vlossom-first detection                    | P1 — 3rd-party 라이브러리/태그 확장, `PREFER_STYLE_SET` 검출 추가        |
| 12 | refactor(vlossom-mcp): metadata-driven component-usage scaffolder     | P5 — 하드코딩 템플릿 제거, registry meta 기반 생성                       |

**결정**: 리뷰 follow-up은 코멘트당 1 commit으로 분리하고, 본 PR scope 안에서 처리한다.

**근거**: 12개 변경이 서로 결합도가 낮고 review 흐름이 코멘트 단위로 진행되므로, 분리 commit이 추적성·revert 단위·향후 bisect 비용 면에서 모두 유리하다. 합쳐서 단일 commit으로 묶으면 작성자 self-review의 의도가 git history에서 사라진다.

---

## 결정 77: `skill/SKILL.md`와 `FEATURES.md` 제거

**날짜**: 2026-05-08

**배경**: 결정 25(skill/SKILL.md npm 번들링)와 결정 64(FEATURES.md 분리)는 server INSTRUCTIONS 자동 주입과 README/PHILOSOPHY/ARCHITECTURE 역할 분리가 굳어지기 전 시점의 결정. 현재 시점에서는 두 파일 모두 동일 정보를 권위 있는 문서가 이미 owner로 다루고 있어 잉여가 됨.

- `skill/SKILL.md`: MCP server INSTRUCTIONS가 워크플로 가이드를 자동 주입하므로, 사용자가 수동 복사해야 의미가 생기는 별도 skill 파일은 보조 수단에 머무름. README/ARCHITECTURE와도 내용이 겹침.
- `FEATURES.md`: core contract는 README, policy/enforcement는 PHILOSOPHY, internal module map은 ARCHITECTURE가 owner. 한 문장 브리프 형태로 동일 내용을 다시 두는 가치가 약함.

**변경 내용**:

- `packages/vlossom-mcp/skill/SKILL.md`와 `packages/vlossom-mcp/skill/` 디렉토리 제거
- `packages/vlossom-mcp/FEATURES.md` 제거
- `package.json` `files`에서 `"skill"`, `"FEATURES.md"` 제거, `format` 스크립트에서 `"skill/**/*.md"` 제거
- `test/docs-consistency.test.ts`에서 `docs.skill`, `docs.features`, 관련 contract docs 항목 제거
- `CLAUDE.md` / `CLAUDE.ko.md`의 문서 분담 표에서 FEATURES.md 항목 제거
- `README.md` / `README.ko.md`의 Document Map에서 FEATURES.md 링크 제거
- `DECISIONS.md` 머리말에서 FEATURES.md 참조 제거
- 같은 정리 흐름에서 repo root의 stale `.claude/skills/vlossom/SKILL.md`(legacy tool 이름 사용)와 `.mcp.json`(외부 소비자가 자기 환경에 등록할 항목)도 제거

**결정**: 결정 25와 결정 64를 폐기한다. 공식 contract 문서는 README, PHILOSOPHY, ARCHITECTURE, DECISIONS 4종으로 좁히고, agent 규칙은 `CLAUDE.md` / `CLAUDE.ko.md`가 담당한다.

**근거**: deletion-first 원칙. INSTRUCTIONS 자동 주입과 README/PHILOSOPHY/ARCHITECTURE 분리가 이미 동일 정보를 권위 있는 위치에 두고 있으므로, 추가 사본은 stale 위험만 키운다.

---

## 결정 76: Vlossom-first를 기본 하네스 정책으로 복원

**날짜**: 2026-05-08

**배경**: 결정 75에서 MCP가 agent의 product/implementation judgment를 대신 제한하지 않도록 Vlossom-first 검사를 opt-in advisory path로 낮췄다. 그러나 사용자가 `vlossom-mcp`를 호출하는 상황 자체가 “Vlossom 기준으로 구현하고 검증해 달라”는 의도에 가깝고, 기본 Vlossom-first가 빠지면 MCP의 실질적 가치가 단순 reference lookup으로 축소될 수 있음.

**변경 내용**:

- `validate_vlossom_usage`의 기본 `context.vlossomFirst`를 `strict`로 복원
- `scaffold_vlossom_code`의 component usage policy 기본값을 `vlossomFirst: "strict"`, `allowNativeControls: false`, `allowThirdPartyUi: false`로 복원
- project setup scaffold의 validation payload가 strict Vlossom-first context를 포함하도록 복원
- project setup validation은 기본적으로 third-party UI dependency를 Vlossom-first 위반으로 보고
- 문서는 `source-of-truth harness`를 유지하되 현재 정책을 `Vlossom-first harness`로 설명

**결정**: `vlossom-mcp`는 agent를 대신해 범용 구현 판단을 통제하지 않는다. 그러나 MCP를 사용하는 동안에는 Vlossom coverage와 프로젝트 버전에 맞는 GitHub metadata에 근거한 Vlossom-first guard를 기본값으로 둔다. 명시적인 사용자 예외, migration staging, coverage가 없는 요구사항에는 `context.vlossomFirst: "off"`를 사용한다.

**근거**: Vlossom-first는 stale policy가 아니라 MCP의 핵심 사용 의도다. 다만 이 guard는 native/third-party UI처럼 Vlossom coverage와 직접 연결되는 항목에 한정하고, broad code-style validation, issue workflow, debug stepper, type-adapter scaffold 같은 side workflow 제거 결정은 유지한다.

---

## 결정 75: Harness-first 축소와 side-workflow 제거

**날짜**: 2026-05-08

**배경**: `vlossom-mcp`가 스캐폴딩 하네스가 아니라 에이전트가 스스로 판단할 수 있는 구현 선택을 제한하는 방향으로 커지고 있었음. 또한 default `target: "all"` 검색, issue draft/submit, debug stepper, broad code-style validation은 source-of-truth lookup 대비 비용과 표면적이 컸음.

**변경 내용**:

- `search_vlossom` 기본 target을 compact component index로 축소하고, component search에서 README/types 전체 로드를 중단
- `validate_vlossom_usage` 기본값에서 Vlossom-first enforcement와 broad code-style validator를 제거
- Vlossom-first 검사는 `context.vlossomFirst`를 명시한 경우에만 동작하는 advisory path로 축소
- `scaffold_vlossom_code`는 project setup, StyleSet, 명시 component usage harness만 제공하고 type-adapter scaffold를 제거
- component usage scaffold는 자연어 설명에서 component를 자동 추론하지 않고, `search_vlossom`/`get_vlossom_reference`로 얻은 명시 component id를 요구
- `issueCandidate`, `submit_vlossom_issue`, `record_external_step`, debug stepper를 제거
- 문서는 Vlossom-first enforcement가 아니라 source-of-truth harness를 현재 방향으로 설명하도록 갱신

**결정**: MCP는 agent의 product/implementation judgment를 대신 제한하지 않는다. MCP의 기본 역할은 Vlossom facts를 빠르고 작게 제공하고, 실제 Vlossom API mismatch를 보고하는 것이다.

**근거**: agent가 스스로 할 수 있는 판단을 MCP가 강제하면 기능 표면과 token/runtime 비용이 증가하고, stale policy가 새로운 version truth보다 앞설 수 있다. source-of-truth 하네스로 좁히면 GitHub-backed lookup 전환의 장점이 살아나고, 에이전트가 필요한 만큼만 정확한 정보를 가져갈 수 있다.

---

## 결정 74: 모든 generated data JSON 제거와 version-resolved GitHub registry 전환

**날짜**: 2026-05-08

**배경**: `src/data/*.json`이 어떤 Vlossom version을 기준으로 만들어졌는지 사용자가 확인하기 어렵고, package 설치 환경에서 stale truth가 되면 agent가 사용자의 실제 Vlossom version에 없는 API를 추천할 수 있음. 결정 71-73은 일부 data를 남기고 baseline을 기록하는 쪽이었지만, 사용자의 version을 기준으로 GitHub source-of-truth를 조회하는 편이 더 정확함.

**변경 내용**:

- generated `src/data/*.json` 및 `dist/data/*.json` 의존 제거
- `build-info`, `build-meta`, `build-sources`, `build-tokens`, `copy-relationships`, `copy-data` generation/copy pipeline 제거
- `build`는 `clean + tsc`, `verify`는 package test flow로 단순화
- component/directive/composable/token registry를 runtime GitHub lookup으로 전환
- ref resolution은 `vlossom-v{version}` -> `v{version}` -> `{version}` -> `main` 순서로 수행
- `main` fallback 시 `versionContext.warnings`에 version-specific guarantee가 약해졌음을 명시
- persistent/generated cache는 만들지 않고 process memory cache만 사용
- MCP resources는 version input을 받을 수 없으므로 `main` preview로 동작하며 facade tool 사용 warning을 포함
- `coding-rules.ts`, `search-synonyms.ts`처럼 Vlossom source version에서 생성되는 JSON이 아닌 MCP 정책성 TS 데이터는 유지

**결정**: Vlossom API truth는 정적 JSON으로 번들하지 않고, 사용자의 detected version에 맞는 GitHub ref에서 런타임 조회한다. 결정 71-73의 bundled baseline 전략은 이 결정으로 대체한다.

**근거**: MCP context/token 비용을 줄이고, version drift로 인한 잘못된 추천을 방지한다. GitHub 접근이 불가하면 stale bundled data로 대체하지 않고 error/skipped와 next action을 반환하는 쪽이 더 정직하다.

---

## 결정 60: 기본 MCP 공개 도구 4개 facade로 축소 (v0.12.x)

**날짜**: 2026-05-06

**배경**: 기존 기본 공개 도구 수가 많아 에이전트가 검색, 참조, 생성, 검증, 이슈 등록, 스텝 기록을 혼합된 표면에서 선택해야 했음. vlossom-mcp의 핵심 목적은 문서 챗봇이나 일반 Vue 생성기가 아니라 Vlossom-native UI 코드를 만들기 위한 compact contract layer임.

**변경 내용**:

- 기본 공개 도구를 `search_vlossom`, `get_vlossom_reference`, `scaffold_vlossom_code`, `validate_vlossom_usage` 4개로 축소
- 기존 granular 도구는 `registerLegacyTools()` 뒤로 이동하고 `VLOSSOM_MCP_LEGACY_TOOLS=on`일 때만 등록
- GitHub 이슈 제출은 `VLOSSOM_MCP_GITHUB_ISSUES=on`일 때만 `submit_vlossom_issue`로 등록
- `record_external_step`과 stepper는 `VLOSSOM_MCP_DEBUG_STEPPER=on`일 때만 노출/표시
- `PREFER_VLOSSOM_COMPONENT` 규칙을 추가해 strict 모드에서 native/third-party UI 사용을 검증 실패로 처리

| #   | 옵션                                      | 검토 결과                                          |
| --- | ----------------------------------------- | -------------------------------------------------- |
| 1   | 기존 공개 도구 유지                       | ❌ 표면이 넓고 에이전트가 GitHub/stepper 경로로 샘 |
| 2   | 기능 삭제                                 | ❌ 기존 검색/참조/스캐폴드/검증 자산 손실          |
| 3   | 4개 facade + 내부 서비스 + env-gated 옵션 | ✅ 채택                                            |

**결정**: public workflow를 Search → Reference → Scaffold → Validate로 고정한다. 기능은 삭제하지 않고 내부 서비스 또는 legacy/optional registration 뒤로 이동한다.

**근거**: 기본 도구 수를 줄이면 에이전트 행동이 예측 가능해지고, Vlossom-first 정책과 검증 루프를 MCP 표면에서 직접 강제할 수 있음.

---

## 결정 61: surfaced 도구의 이슈 제안은 issueCandidate 메타데이터로 제한

**날짜**: 2026-05-07

**배경**: `search_vlossom`, `get_vlossom_reference`, `validate_vlossom_usage`가 missing coverage나 unknown API를 발견했을 때 에이전트가 이슈 작성을 제안할 수 있으면 유용함. 다만 기본 workflow가 GitHub issue bot처럼 흐르면 4개 facade 원칙과 side-effect tool policy가 약해짐.

**변경 내용**:

- core surfaced tool 응답에 선택적 `issueCandidate` 필드 추가
- missing build-ui coverage, unknown reference id, unknown component validation gap에 draft seed 제공
- `issueCandidate.requiresUserApproval = true`로 명시
- core tool의 일반 `next_actions`에는 `submit_vlossom_issue`를 넣지 않음

| #   | 옵션                                     | 검토 결과                                                  |
| --- | ---------------------------------------- | ---------------------------------------------------------- |
| 1   | `next_actions`에서 바로 submit tool 제안 | ❌ side-effect 흐름으로 쉽게 새고 기본 surface 철학과 충돌 |
| 2   | 이슈 제안을 완전히 제거                  | ❌ missing coverage 개선 신호를 잃음                       |
| 3   | `issueCandidate` draft metadata만 반환   | ✅ 채택                                                    |

**결정**: surfaced 도구는 이슈 제출을 트리거하지 않고, 이슈 후보 메타데이터만 제공한다. 실제 draft는 prompt/internal service가 담당하고, 실제 submit은 `VLOSSOM_MCP_GITHUB_ISSUES=on`과 명시 승인 조건에서만 수행한다.

---

## 결정 62: StyleSet validation을 generated metadata 기반으로 강화

**날짜**: 2026-05-07

**배경**: `validate_vlossom_usage({ kind: "style-set" })`가 `<style>` block, nested variables, hard-coded color 정도만 확인하면 `#442`의 StyleSet interface key, variables 과다 노출, child ref 오용, token naming 검증 요구를 충분히 만족하지 못함.

**변경 내용**:

- `style-set-validator.ts`를 분리해 component context 또는 `Vs*StyleSet` 타입 주석에서 대상 component를 추론
- generated `components-meta.json`의 StyleSet raw/interface metadata를 기준으로 top-level key와 variables key를 검증
- CSSProperties 성격의 값을 variables로 노출하는 패턴, 임의 CSS variable naming, hard-coded color/token 사용을 검출
- component context가 없으면 `valid: true` 대신 actionable validation issue를 반환

| #   | 옵션                                         | 검토 결과                                            |
| --- | -------------------------------------------- | ---------------------------------------------------- |
| 1   | 기존 regex validator 유지                    | ❌ interface metadata와 연결되지 않아 오탐/누락 가능 |
| 2   | TypeScript compiler 런타임 의존              | ❌ package runtime dependency 증가                   |
| 3   | generated metadata + lightweight object scan | ✅ 채택                                              |

**결정**: StyleSet validation은 런타임 의존성을 늘리지 않고 generated metadata를 source of truth로 삼아 강화한다.

---

## 결정 63: Resources와 Prompts는 기본 등록하되 public tool count에는 포함하지 않음

**날짜**: 2026-05-07

**배경**: `#443`은 minimal MCP Resources와 Prompts 추가를 요구하지만, default public tool surface는 4개로 유지해야 함. Resources/Prompts는 agent workflow를 보조하되 새로운 side-effect tool이나 granular lookup tool을 늘리면 안 됨.

**변경 내용**:

- `vlossom://components`, `vlossom://components/{name}`, `vlossom://tokens/css`, `vlossom://options/create-vlossom`, `vlossom://rules/*`, `vlossom://changelog`, `vlossom://decisions`, `vlossom://mcp/usage-examples` 등록
- `vlossom.implement-feature`, `vlossom.review-sfc`, `vlossom.create-style-set`, `vlossom.review-style-set`, `vlossom.file-issue` 등록
- `vlossom.file-issue`는 draft prompt이며 제출은 하지 않음

| #   | 옵션                                | 검토 결과                                 |
| --- | ----------------------------------- | ----------------------------------------- |
| 1   | Resource/Prompt 미등록, 문서만 유지 | ❌ `#443` 요구사항을 완전히 만족하지 못함 |
| 2   | Resource/Prompt를 tool로 노출       | ❌ public tool count 증가                 |
| 3   | MCP resource/prompt API로 등록      | ✅ 채택                                   |

**결정**: Resources/Prompts는 core tool surface 밖에서 기본 등록하고, GitHub submit 같은 side-effect는 계속 optional tool로만 유지한다.

---

## 결정 64: 기능 브리핑 문서는 `FEATURES.md`로 유지

**날짜**: 2026-05-07

**배경**: core facade, internal services, resources, prompts가 분리되면서 구현 파일을 모두 열지 않아도 기능 경계를 이해할 수 있는 짧은 브리핑 문서가 필요해짐.

**변경 내용**:

- `FEATURES.md`에 core contract, policy/enforcement, supporting surfaces, internal module map을 한 문장 단위로 정리
- `README.md`와 `ARCHITECTURE.md`에서 `FEATURES.md`를 참조
- npm package의 `files`에 `FEATURES.md`를 포함해 배포본에서도 링크가 깨지지 않도록 함

**결정**: 상세 설계는 `ARCHITECTURE.md`, 변경 근거는 `DECISIONS.md`, 빠른 기능 파악은 `FEATURES.md`가 담당한다.

---

## 결정 65: Legacy granular surface opt-in 제거

**날짜**: 2026-05-08

**배경**: 결정 60에서 기존 granular 도구를 migration/debug용 opt-in으로 남겼지만, 실제 기본 workflow는 4개 facade와 resources/prompts로 충분히 대체됨. 사용되지 않는 opt-in surface가 남아 있으면 public contract가 다시 넓어질 여지를 만들고 문서/테스트 정합성 부담도 커짐.

**변경 내용**:

- legacy registration flag와 `registerLegacyTools()` 경로 제거
- granular legacy tool 파일 제거
- legacy 경로에서만 쓰이던 registry/path helper 제거
- current docs에서 legacy opt-in 안내 제거
- 테스트에 제거된 legacy flag가 public tool surface를 늘리지 않음을 검증하는 회귀 케이스 추가

**결정**: legacy granular tool surface는 opt-in으로도 유지하지 않는다. 기본 도구는 4개 facade이며, 지원 표면은 resources/prompts, 승인 기반 optional issue submission, debug stepper로 제한한다.

---

## 결정 66: 새 프로젝트/마이그레이션 Vlossom-first 흐름 강화

**날짜**: 2026-05-08

**배경**: vlossom-mcp를 새 프로젝트 시작이나 기존 Vue UI 마이그레이션에 사용할 때 agent가 Vlossom setup과 coverage 확인을 먼저 수행하도록 유도해야 함. 도구 수를 늘리기보다는 server instructions, prompts, scaffold payload, validation gate에서 흐름을 강화하는 편이 compact contract 원칙에 맞음.

**변경 내용**:

- server instructions에 새 프로젝트와 마이그레이션의 선행 workflow 추가
- `vlossom.start-project`, `vlossom.migrate-project` prompts 추가
- `scaffold_vlossom_code(kind: "project-setup")`에 covered/uncovered requirements와 strict validation payload 추가
- `validate_vlossom_usage(kind: "project-setup")`가 strict mode에서 third-party UI dependency와 파일 내 native/third-party UI pattern을 error로 검출
- SFC/snippet validation이 generated metadata의 required prop 누락을 `PROP_REQUIRED`로 검출

**결정**: 새 프로젝트/마이그레이션에서도 public tool count는 늘리지 않고, prompts와 validation gate를 통해 Vlossom-first를 강화한다.

---

## 결정 67: 문서 역할 재분리와 README 재작성

**날짜**: 2026-05-08

**배경**: facade tool 축소, legacy opt-in 제거, Vlossom-first 강화, optional issue/debug surface 조정이 순차적으로 들어오면서 `README.md`와 `ARCHITECTURE.md`가 기존 내용을 append하는 방식으로 비대해짐. 사용자는 새 프로젝트/마이그레이션에서 agent가 적극적으로 Vlossom을 사용해야 한다는 철학을 더 선명하게 드러내길 원했고, 현재 문서 구조는 사용법, 철학, 구현 지도, 기능 브리프의 책임이 겹쳐 있었음.

**변경 내용**:

- `PHILOSOPHY.md`를 추가해 mission, non-goals, four-tool contract, Vlossom-first policy, validation policy, side-effect policy를 분리
- `README.md` / `README.ko.md`를 현재 구현 기준으로 재작성해 설치, public contract, 새 프로젝트/마이그레이션/기능 구현 loop, resources/prompts, optional surfaces만 남김
- `ARCHITECTURE.md`를 구현 지도 중심으로 재작성해 server registration, facade/internal module map, data source, validation coverage, tests를 설명
- `DIFFERENTIATORS.md`는 `PHILOSOPHY.md`와 역할이 겹치므로 제거
- npm package `files`에 배포본에서 README 링크가 깨지지 않도록 `README.ko.md`, `PHILOSOPHY.md`, `ARCHITECTURE.md`, `FEATURES.md`를 포함

| #   | 옵션                                              | 검토 결과                                            |
| --- | ------------------------------------------------- | ---------------------------------------------------- |
| 1   | 기존 README/ARCHITECTURE에 계속 append            | ❌ 현재 계약과 철학이 중복되고 문서 독해 비용이 증가 |
| 2   | README 하나에 모든 내용을 통합                    | ❌ 사용법, 정책, 구현 지도가 다시 섞임               |
| 3   | README/PHILOSOPHY/ARCHITECTURE/FEATURES 역할 분리 | ✅ 채택                                              |

**결정**: 현재 기능을 보존하되 문서의 책임을 새로 나눈다. README는 사용자가 실행하고 따라 할 계약, PHILOSOPHY는 판단 기준, ARCHITECTURE는 구현 지도, FEATURES는 빠른 기능 브리프를 담당한다.

---

## 결정 68: build 전에 dist를 정리해 stale tool 산출물 제거

**날짜**: 2026-05-08

**배경**: legacy source tool 파일은 제거되었지만 `tsc`는 `dist`를 자동으로 비우지 않으므로, 로컬 `dist`에 남은 과거 tool 산출물이 `npm pack` tarball에 포함될 수 있음. public registration에는 영향을 주지 않더라도 배포물에 제거된 도구 파일이 남으면 compact surface와 문서 정책을 흐림.

**변경 내용**:

- `scripts/clean-dist.ts` 추가
- `npm run build`가 `npm run clean`을 먼저 실행하도록 변경
- 테스트에 `dist/tools`가 현재 tool module만 포함하는지 확인하는 회귀 케이스 추가

**결정**: build는 항상 `dist`를 먼저 삭제한 뒤 컴파일한다. 제거된 source file의 산출물이 tarball에 남는 상태를 허용하지 않는다.

---

## 결정 69: historical PLAN 문서 제거

**날짜**: 2026-05-08

**배경**: `PLAN.md`와 `PLAN.ko.md`는 초기 설계와 legacy tool 계획을 보존하는 historical planning document로만 남아 있었고, 현재 public contract는 `README.md`, `PHILOSOPHY.md`, `ARCHITECTURE.md`, `FEATURES.md`, `CLAUDE.md`, `skill/SKILL.md`, `DECISIONS.md`가 담당함. 문서 표면이 넓으면 agent가 오래된 계획을 현재 계약으로 오해할 수 있음.

**변경 내용**:

- `PLAN.md`, `PLAN.ko.md` 제거
- docs consistency test에서 PLAN historical marker 검증 제거
- `CLAUDE.ko.md`의 PLAN historical 안내 제거

**결정**: historical plan은 current documentation set에서 제거한다. 과거 결정 근거가 필요하면 `DECISIONS.md`만 보존한다.

---

## 결정 70: scripts/test authored JavaScript를 TypeScript로 전환

**날짜**: 2026-05-08

**배경**: `packages/vlossom-mcp`의 source는 TypeScript였지만 data generation scripts와 acceptance tests는 `.mjs`로 남아 있었음. Node 18은 TypeScript 파일을 직접 실행하지 못하므로, 확장자만 바꾸면 build/generate/test workflow가 깨짐.

**변경 내용**:

- `scripts/*.mjs`를 `scripts/*.ts`로 전환
- `test/*.test.mjs`를 `test/*.test.ts`로 전환
- `tsx`를 dev dependency로 추가해 Node 18에서도 TS scripts/tests를 실행
- `npm run clean`, `npm run build`, `npm run generate`, `npm test`를 `tsx` 기반 실행으로 갱신
- `tsconfig.scripts.json`을 추가해 scripts/tests를 no-emit typecheck
- docs consistency test에 authored `.js/.mjs/.cjs` 파일 금지 회귀 테스트 추가

**결정**: JS로 남겨야 할 필요가 있는 파일은 없음. Node가 직접 실행해야 하는 scripts/tests는 `tsx` runtime으로 해결하고, package authored file set은 TypeScript 중심으로 유지한다.

---

## 결정 71: large/freshness-sensitive generated data 제거와 GitHub on-demand 조회

**날짜**: 2026-05-08

**배경**: `components-source.json`, `components-data.json`, `changelog.json`처럼 큰 generated data는 MCP context와 npm package를 불필요하게 키우고, GitHub에서 직접 확인 가능한 최신성 민감 정보를 정적으로 고정함. 특히 release/changelog와 component source는 Vlossom repository의 현재 상태 또는 특정 tag/ref를 직접 조회하는 편이 더 정확함.

**변경 내용**:

- `src/data/components-source.json`, `src/data/components-data.json`, `src/data/changelog.json` 제거
- `scripts/generate-components.ts`, `scripts/build-changelog.ts` 제거
- component source는 `get_vlossom_reference(include:['source'])` 시 GitHub raw에서 on demand 조회
- changelog/release data는 GitHub releases API에서 on demand 조회
- generic `search_vlossom(target:'all')`에서는 changelog를 기본 검색 대상에서 제외해 불필요한 네트워크 호출을 피함

**결정**: runtime에 필요한 compact index만 data로 유지하고, 크거나 최신성이 중요한 reference는 GitHub-backed lookup으로 전환한다.

**근거**: MCP context/token 비용을 줄이고, 정적 데이터가 stale truth가 되는 위험을 낮춘다.

---

## 결정 72: 사용자 Vlossom version 기준의 version-aware guidance

**날짜**: 2026-05-08

**배경**: static metadata가 어떤 Vlossom version을 기준으로 생성되었는지 모르면 agent가 사용자의 설치 버전에 없는 API를 추천할 수 있음. `vlossom-mcp`는 현재 사용자의 Vlossom version을 확인하고, 그 버전에서 사용할 수 있는 API만 scaffold/validate해야 함.

**변경 내용**:

- `internal/version/version-service.ts` 추가
- `version` 또는 `packageJson`에서 Vlossom version/range를 감지해 `versionContext` 반환
- component/directive/composable 결과에 `versionSupport` 추가
- `scaffold_vlossom_code`는 감지된 version에서 사용할 수 없는 component scaffold를 거부
- `validate_vlossom_usage`는 unavailable API 사용 시 `VERSION_UNSUPPORTED` issue 반환
- component source 조회는 `vlossom-v{version}` 같은 version ref를 먼저 시도하고 실패 시 `main`으로 fallback

**결정**: 모든 facade tool은 가능한 경우 사용자의 Vlossom version을 입력받고, version-aware support check를 통해 안내와 validation을 제한한다.

**근거**: generated metadata는 compact index일 뿐 timeless truth가 아니며, MCP guidance는 사용자의 실제 project version에 맞아야 한다.

---

## 결정 73: MCP build pipeline 분리와 bundled data baseline 기록

**날짜**: 2026-05-08

**배경**: MCP는 npm 설치 환경에서 `dist/index.js`로 실행되고 runtime JSON은 `dist/data`에서 읽는다. monorepo의 `packages/vlossom/package.json`은 npm package에 포함되지 않을 수 있으므로, bundled metadata가 어떤 Vlossom source baseline에서 생성되었는지를 배포 산출물 안에 기록해야 함.

**변경 내용**:

- `scripts/build-info.ts` 추가
- `src/data/build-info.json`에 bundled Vlossom source version 기록
- `versionContext.dataBaselineVersion`은 bundled `build-info.json`을 우선 사용
- `npm run generate`는 `src/data`만 갱신
- `npm run build`는 clean, TypeScript compile, `src/data/*.json` -> `dist/data` copy를 담당
- `npm run verify` 추가: `generate` 후 `test`
- `prepublishOnly`는 `npm run verify` 실행

**결정**: generation, build, verification의 책임을 분리하고, publish 전에는 generated data baseline과 contract tests를 모두 검증한다.

**근거**: npm package runtime이 self-contained data baseline을 가져야 version-aware guidance가 설치 환경에서도 정확히 동작한다.

---

## 2026-04-23 — report_issue 라벨 rename (`source: mcp` → `by MCP`, `area: mcp` → `MCP`)

**Changed**: `report_issue`가 쓰는 두 라벨 이름을 저장소의 라벨 네이밍 컨벤션에 맞춰 교체.

| 이전 (v0.12.4) | 이후     | 주입 주체 |
| -------------- | -------- | --------- |
| `source: mcp`  | `by MCP` | 서버      |
| `area: mcp`    | `MCP`    | LLM       |

정책 자체(서버 자동 주입 vs LLM 선택, G1 준수 근거)는 그대로이며, 아래 파일의 문자열만 교체:

- `src/tools/report-issue.ts` — `ALLOWED_LABELS`, `SERVER_INJECTED_LABELS`, `labels` 파라미터 description
- `README.md` / `README.ko.md` — `report_issue` 설명 한 줄

**주의**: GitHub 측 라벨도 새 이름(`by MCP`, `MCP`)으로 미리 생성되어 있어야 함. 그렇지 않으면 `createIssue`가 422로 실패하고 `getSafeErrorMessage`가 "Invalid issue data" 메시지를 반환.

---

## 2026-04-23 — report_issue 라벨 정책 (`source: mcp` / `area: mcp`, v0.12.4)

**Added**: `report_issue` 툴이 생성하는 GitHub 이슈에 출처/영역 라벨 정책을 도입.

### 정책

| 라벨          | 주입 주체 | 의미                                                             |
| ------------- | --------- | ---------------------------------------------------------------- |
| `source: mcp` | 서버      | 이슈가 MCP의 `report_issue` 파이프라인을 통해 생성됨 (출처 추적) |
| `area: mcp`   | LLM       | 이슈 대상이 `packages/vlossom-mcp` 패키지 자체 (vlossom UI 아님) |

### 설계 근거 — G1 준수

- `source: mcp`는 **결정론적 사실**(report_issue를 탔다는 것 자체)이므로 서버가 `createIssue` 호출 직전에 자동 주입.
  자연어 판단이 개입하지 않으므로 G1(서버 측 LLM judgment 금지)과 충돌하지 않음.
- `area: mcp`는 **이슈 내용이 vlossom-mcp에 관한 것인지**를 가르는 판단이 필요 — 이는 자연어 이해가 전제.
  따라서 서버가 스스로 붙이지 않고 `labels` 파라미터의 enum 값으로 노출해 LLM이 선택하도록 함.

### Files changed

- `src/tools/report-issue.ts`
    - `ALLOWED_LABELS`에 `"area: mcp"` 추가 (LLM 선택용)
    - `SERVER_INJECTED_LABELS = ["source: mcp"]` 상수 신설
    - `labels` 파라미터 description에 정책 명시 (source는 서버 자동, area는 LLM 선택)
    - `handleSubmit`에서 `createIssue` 호출 직전 `SERVER_INJECTED_LABELS`를 dedupe 병합
    - `handleDraft` 응답의 `suggestedLabels`에도 `source: mcp` 포함 (드래프트 프리뷰와 실제 제출 결과의 일관성)
- `README.md` / `README.ko.md`: `report_issue` 설명에 라벨 정책 한 줄 추가

### 검토한 대안과 기각 이유

| 대안                                           | 기각 이유                                                                  |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| `source: mcp`도 `ALLOWED_LABELS`에 포함        | LLM이 "선택 가능한 옵션"으로 오해 → 누락 가능성. 서버가 강제하는 편이 안전 |
| `area`를 별도 파라미터(`z.enum(["mcp", ...])`) | 파라미터 표면적이 불필요하게 늘어남. `labels`의 enum 확장으로 충분         |
| `area: vlossom`도 같이 추가                    | 현재 요청 범위 밖이며, `packages/vlossom` 쪽 이슈 분류 컨벤션이 아직 미정  |

**호환성**: 0.12.3 → **0.12.4** patch bump. 응답 스키마 추가만 있고(기존 필드 제거·타입 변경 없음), breaking change 아님.

---

## 2026-04-20 — createVlossom() 가이드 교정 (issue #399, v0.12.3)

**Fixed**: vlossom-mcp의 `createVlossom()` 사용 가이드가 실제 `vlossom@2.0.0-beta.1`의 동작과 두 가지 지점에서 불일치했던 것을 교정.

### 교정 내용

1. **`components` 옵션이 필수임을 명시**

    - `packages/vlossom/src/declaration/types.ts`의 `VlossomOptions.components: { [key: string]: Component }` (required, `?` 없음)
    - 누락 시 plugin install 단계에서 `Object.entries(options.components)`가 `Cannot convert undefined or null to object`를 던짐
    - 이전 가이드는 `createVlossom({ theme: 'dark' })`처럼 components 없이 호출하는 예시를 여러 도구에 걸쳐 사용했음

2. **CSS import 경로 교정: `vlossom/dist/*.css` → `vlossom/styles`**
    - `packages/vlossom/package.json` exports 실제 항목: `"./styles": "./dist/vlossom.css"`
    - `vlossom/dist/style.css`나 `vlossom/dist/vlossom.css`는 exports 맵에 정의되지 않은 내부 경로로, subpath import 정책에 따라 실패

### Files changed

- `src/tools/get-vlossom-options.ts`
    - `VLOSSOM_OPTIONS`에 `components` 항목 추가 (`required: true`, `default: "— (required)"`)
    - 나머지 옵션들도 `required: false` 명시
    - 모든 example에 `components: VlossomComponents` 포함
    - `FULL_EXAMPLE`에 `VlossomComponents` import + `import 'vlossom/styles'` 추가
- `src/tools/get-usage-examples.ts`
    - `GUIDE.installation.steps`에서 `createVlossom({ components: VlossomComponents })` 형태로 수정
    - `import 'vlossom/dist/style.css'` → `import 'vlossom/styles'`
    - `GUIDE.configuration.options`에 `components` 항목(required) 추가, `globalColorScheme`(존재하지 않는 옵션) 제거
    - `GUIDE.quickStart.note`를 VlossomComponents 맥락으로 재작성
- `src/tools/validate-project-setup.ts`
    - `SETUP_CHECKLIST`의 plugin 등록 step을 `createVlossom({ components: VlossomComponents })` 형태로 수정
    - CSS step을 `import 'vlossom/styles'`로 수정

### 근거

- 실제 `packages/vlossom/playground/playground.ts` 사용 패턴 그대로 반영:
    ```ts
    import { createVlossom, VlossomComponents } from 'vlossom';
    import 'vlossom/styles';
    app.use(createVlossom({ components: VlossomComponents, ... }));
    ```

**호환성**: 0.12.2 → **0.12.3** patch bump. 응답 스키마 변경 없음 (field 추가 + 설명 문자열 수정), 옵션 설명만 정정.

**Fixes**: https://github.com/vlossom-ui/vlossom/issues/399

---

## 2026-04-20 — get_usage_examples section 파라미터 추가 (v0.12.2)

**Added**: `get_usage_examples`에 `section` 선택 파라미터를 추가해 온보딩 가이드의 특정 섹션만 반환할 수 있게 함. 기본값은 `"all"`(기존과 동일), 선택 시 해당 한 섹션만 포함.

**New interface**:

```ts
get_usage_examples({
  section?: "all" | "install" | "config" | "quickstart" | "selling-points" | "design-tips" | "mcp-capabilities"
  // default: "all"
})

// 응답에 신규 필드 section 추가 — 호출자가 실제로 받은 섹션 식별
```

**Why — 사용자 맥락에 맞는 최소 정보**: 사용자가 "설치 어떻게 해?"라고만 물었을 때 6개 섹션(install/config/quickstart/selling-points/design-tips/mcp-capabilities) 전부를 돌려주는 건 낭비. 약 5.4KB 중 필요한 건 0.5KB뿐.

**실측 절감 (섹션 단일 선택 시)**:

| section            | chars | 절감 (full 5,374 기준) |
| ------------------ | ----: | ---------------------: |
| `install`          |   506 |                   -91% |
| `config`           |   638 |                   -88% |
| `quickstart`       |   397 |               **-93%** |
| `selling-points`   | 1,546 |                   -71% |
| `design-tips`      |   987 |                   -82% |
| `mcp-capabilities` | 1,300 |                   -76% |

평균 **-83%**. 필요한 섹션만 집중 반환.

**Alternatives considered**:

- 기본값을 `"install"` 또는 유사한 단일 섹션으로 → 기각. 전체 온보딩이 필요한 첫 사용자에게 원래 제공되던 경험이 깨짐. 대신 호출자(LLM)가 사용자 의도에 맞게 section을 선택하도록 설계.
- section 값 여러 개를 배열로 받기 (`sections: string[]`) → 기각. 복잡도만 추가. 현재 섹션 총량이 크지 않아 단일값 or all 두 모드면 충분.
- 섹션 대신 키워드 검색(`filter: string`) → 기각. 명시적 enum이 LLM 예측·문서화에 더 유리.

**Non-breaking 판정**: 기본값 `"all"`이 기존 동작 보존. 응답에 추가되는 `section` 필드는 신규 키. 기존 소비자가 `guide.installation`에 접근하던 코드는 `section="all"`일 때 동일하게 동작.

**Files changed**:

- `src/tools/get-usage-examples.ts` — zod import 추가, `GuideSection` 타입, `pickGuide()`, `section` 파라미터, 응답 필드 확장

**호환성**: 0.12.1 → **0.12.2** patch bump.

---

## 2026-04-20 — generate_component_code rules 경량화: applicable 기본값 + rulesFormat 옵션 (v0.12.1)

**Changed**: `generate_component_code`가 항상 12개 CODING_RULES 전부를 덤프하던 것을 기본적으로 **컴포넌트 조합에 실제 적용되는 rule만** 반환하도록 변경.

**New interface**:

```ts
generate_component_code({
  description, components, hasBusinessLogic,
  rulesFormat?: "applicable" | "full" // default: "applicable"
})

// 응답 추가 필드
{ applicableRules: string[], rulesFormat: "applicable" | "full", totalRuleCount: number, ... }
```

**Why — 맥락 무관 rule 제거**: 기존 구현은 디스플레이 카드(폼 없음·비즈니스 로직 없음) 요청에도 R05~R10(폼·컴포저블 rule) 전부를 포함해 전송. 이 컴포넌트 조합에는 전혀 해당 없는 규칙으로, 토큰만 소비하고 LLM 집중을 흐트러뜨림.

**판정 로직 (`determineApplicableRuleIds`)**:

- `R01~R04` (styling): 항상
- `R05~R08` (form/v-model/validation/grid): VsForm 또는 폼 입력 계열 컴포넌트(VsInput, VsSelect, VsCheckbox 등) 포함 시
- `R09~R10` (plugin/composable): `hasBusinessLogic: true` 시
- `R11~R12` (design): 항상

**실측 절감 (payload 기준)**:

| 시나리오                  |  full | applicable | 절감       |
| ------------------------- | ----: | ---------: | ---------- |
| Login Form (form)         | 4,439 |      3,751 | -15.5%     |
| Profile Edit (form + biz) | 4,439 |      4,439 | 0%         |
| Admin Dashboard (biz)     | 4,439 |      4,439 | 0%         |
| Display Card (no form)    | 4,439 |      2,615 | **-41.1%** |

복잡 시나리오(폼 + 비즈니스 로직)에서는 모든 rule이 실제 적용되어 절감이 없고, 단순 display는 최대 -41% 절감.

**Alternatives considered**:

- 기본값을 `"full"`로 두고 `"applicable"`을 옵트인 → 기각. 기본값이 옵트인일 때 LLM이 이 파라미터를 발견해 직접 선택하지 않아 자동 절감이 실현되지 않음. 기본값이 `"applicable"`이어도 `rules` 필드 형식(배열의 항목 스키마)은 동일하므로 하위 호환이 유지됨.
- `rules` 응답에 `applicable: boolean` 필드를 추가하고 항상 12개 반환 → 기각. 크기 절감 없음. "LLM이 필터링하라"는 지시는 G1(서버가 결정 대신하지 않음) 관점에선 유리하나, 실제 절감이 목표임.
- 비즈니스 로직과 폼 맥락에 기반한 정적 판정 대신 description을 자연어 분류 → 기각. G1 위반 (서버가 LLM 판단 대체).

**Non-breaking 판정**: `rules[]` 배열의 스키마는 동일(`{id, category, severity, rule}`). 항목 수만 변동. `rules.length === 12`를 가정한 소비자가 아니라면 호환. 추가 필드 `applicableRules`, `rulesFormat`, `totalRuleCount`는 모두 신규 필드. 따라서 patch bump.

**Files changed**:

- `src/tools/generate-component-code.ts` — `determineApplicableRuleIds`, `rulesFormat` 파라미터, 응답 구조 확장

**호환성**: 0.12.0 → **0.12.1** patch bump.

---

## 2026-04-20 — get_migration_guide → get_changelog 병합 (v0.12.0 breaking)

**Merged**: `get_migration_guide` 도구를 제거하고, 그 MIGRATION_NOTES 데이터를 `get_changelog`로 이관. `get_changelog` 응답의 각 버전 엔트리에 해당 버전의 `migrationSteps?: string[]` 필드가 자동 포함됨.

**New response shape (ChangelogEntry)**:

```ts
interface ChangelogEntry {
    version: string;
    date: string;
    prerelease: boolean;
    breaking: string[];
    features: string[];
    fixes: string[];
    notes?: string;
    migrationSteps?: string[]; // ← 신규 (2.0.0-beta.1 등 주요 버전에만)
}
```

**Why — 데이터 이중화 제거**: `MIGRATION_NOTES`(수동 관리, `get-migration-guide.ts`)와 `changelog.json`(자동 생성)이 동일한 "버전별 변경사항" 도메인을 다루고 있었음. 한 도구·한 데이터 원천으로 합쳐 동기화 부담을 제거.

**Why — 실사용 가치 낮음**: `get_migration_guide`의 하드코딩된 `MIGRATION_NOTES`에는 단 한 개 버전(`2.0.0-beta.1`)만 정의되어 있었음. 별도 도구로 유지할 만큼의 독립 데이터가 없음. CLAUDE.md "Adding a New Tool Checklist"의 "Duplicate?" 기준 위반.

**Why — LLM UX 단순화**: 사용자가 "2.0으로 업그레이드하려면?"이라고 물으면 LLM이 `get_changelog`와 `get_migration_guide` 중 무엇을 부를지 모호했음. 단일 진입점으로 통합하면 분기 불필요.

**Alternatives considered**:

- `MIGRATION_STEPS`를 `changelog.json` 데이터로 직접 병합 (build-changelog.mjs 수정) → 기각. 수동 관리 데이터와 자동 생성 데이터의 경계를 유지하는 것이 더 안전. 현재 방식(`get-changelog.ts` 안에 하드코딩 상수)은 빌드 파이프라인 변경 없이 이행 가능.
- `get_migration_guide`를 유지하고 `get_changelog`에도 migrationSteps를 병렬 노출 → 기각. 두 도구가 같은 정보를 중복 제공, G3 위반 유지.

**Files changed**:

- `src/tools/get-migration-guide.ts` — 삭제
- `src/tools/get-changelog.ts` — `MIGRATION_STEPS` 상수 + `enrichWithMigration()` 매핑 + 응답 next_actions 확장
- `src/server.ts` — import/등록 제거, INSTRUCTIONS에서 get_migration_guide 안내 줄 제거·통합
- `src/tools/validate-project-setup.ts` — description/next_actions에서 `get_migration_guide` 참조 제거
- README.md / README.ko.md — `get_changelog` 설명 1행 갱신

**호환성**: 0.11.0 → **0.12.0** major bump. 외부에서 `get_migration_guide({ fromVersion, toVersion })` 호출하던 소비자는 `get_changelog({ from, to })`의 `versions[i].breaking` + `versions[i].migrationSteps`를 이용하도록 이주 필요.

---

## 2026-04-20 — check_vlossom_setup → validate_project_setup 병합 (v0.11.0 breaking)

**Merged**: `check_vlossom_setup` 도구를 제거하고, 그 기능을 `validate_project_setup`에 통합.

**New interface**:

```ts
validate_project_setup({
  packageJson?: string,   // 전체 분석 모드 (기존)
  version?: string,       // 버전-only 빠른 모드 (check_vlossom_setup에서 이관)
  framework?: "vite" | "webpack" | "nuxt"
})
```

둘 중 최소 하나는 제공 필요. `version`만 있을 때 npm 최신 조회 + 상태 판정을 수행하며, `packageJson`이 있을 때 의존성 충돌·Vue 버전·피어 의존성까지 검증한다.

**Why — G3 단일 책임**: 두 도구가 동일한 책임("Vlossom 설치 상태 진단")을 분할 소유하고 있었음. `validate_project_setup`이 이미 상위집합이며, `check_vlossom_setup`의 version-only 경로는 선택 파라미터로 흡수 가능. DECISIONS Round 2의 `suggest_components` → `search_components` 병합과 동일 패턴.

**Why — npm fetch 일원화**: 버전 최신성 판정 로직이 두 도구에 중복됨. 한 곳에 집중시켜 유지보수 단순화.

**Alternatives considered**:

- 두 도구를 그대로 유지 → 기각. LLM이 "어느 쪽을 호출해야 하나" 혼란을 겪음. CLAUDE.md H1 "트리거 문장" 기준을 세우기 애매함.
- `check_vlossom_setup`만 유지하고 `validate_project_setup`을 제거 → 기각. 실제 프로젝트 분석 기능(의존성 충돌·피어 누락 등)이 더 가치 높음.

**Files changed**:

- `src/tools/check-vlossom-setup.ts` — 삭제
- `src/tools/validate-project-setup.ts` — 확장 (version/framework 파라미터, npm fetch, 체크리스트)
- `src/server.ts` — 등록 제거 + INSTRUCTIONS `check_vlossom_setup` → `validate_project_setup`
- `src/tools/get-changelog.ts` — next_actions/description 참조 치환
- README.md / README.ko.md — 도구 표 1행 교체

**호환성**: 0.10.0 → **0.11.0** major bump. 외부에서 `check_vlossom_setup({ version })`를 호출하던 소비자는 `validate_project_setup({ version })`로 이주해야 함.

---

## 2026-04-20 — search_components 응답 경량화: `ComponentMeta[]` → `ComponentSummary[]` (v0.10.0 breaking)

**Changed**: `search_components`가 `components[]` / `results[]` 필드에 전체 메타(props/events/slots/methods/styleSet.raw)를 담아 반환하던 것을 **경량 `ComponentSummary`**(name, kebabName, description, availableVersion, propsCount, hasVModel, styleSetChildRefs)만 반환하도록 변경.

**Why — 토큰 중복 제거 (G3 단일 책임 관점)**: `search_components`의 기존 응답이 `get_component`의 반환값 대비 ~96% 중복. 실측 벤치마크(vs shadcn MCP, 2026-04-20)에서 search 한 번 호출에 ~25KB가 소비되는데, 대부분 LLM이 실제로 쓰지 않는 5~6개 후보 컴포넌트의 풀 메타였음. 결과적으로 `get_component` 후속 호출이 무의미해지고("이미 다 받았는데?"), G3(One tool, one responsibility) 원칙에 위배.

**실측 절감 (4 시나리오)**:

| Scenario            | BEFORE | AFTER | 절감율     |
| ------------------- | -----: | ----: | ---------- |
| Login Form (7)      | 24,450 | 4,033 | **-83.5%** |
| Profile Edit (8)    | 21,094 | 4,160 | **-80.3%** |
| Admin Dashboard (7) | 17,830 | 3,778 | **-78.8%** |
| Modal Dialog (8)    | 24,606 | 4,276 | **-82.6%** |

평균 **-81.3%**. LLM은 실제 필요한 2~3개에 대해서만 `get_component`를 호출해 풀 메타를 받으면 됨.

**Alternatives considered**:

- `detail: "summary" | "full"` 파라미터로 옵트인 (양립) → 기각. 두 모드 유지 비용이 크고, LLM이 매번 파라미터 선택을 고민해야 함. G3 관점에서도 두 책임이 한 도구에 남음.
- 전체 메타를 유지하되 `maxComponents` 상한을 두는 방식 → 기각. 근본 원인(풀 메타 덤프)을 해결하지 못함. 상한 5로 제한해도 여전히 ~15KB.
- 서버가 `get_component`를 자동 호출해 상위 3개만 depth-2로 돌려주는 옵션 → 기각. 결정 7("compare_components 제거 — LLM이 직접 호출하는 게 더 유연") 철학과 충돌.

**Interface**:

- useCase 경로: `{ components: ComponentSummary[], reasoning, total, tryNext, avoid, next_actions, _meta }`
- query 경로: `{ results: ComponentSummary[], total, expandedTerms?, avoid, next_actions, _meta }`
- `avoid` 배열에 새 항목 추가: _"Do not infer props/events/StyleSet from these summaries — call get_component for the ones you will actually use"_
- `next_actions`의 `get_component` reason을 **"REQUIRED — ..."**로 격상해 LLM이 반드시 후속 호출하도록 유도

**Files changed**: `src/types/meta.ts` (ComponentSummary 추가), `src/tools/search-components.ts` (toSummary + reasoning/avoid/next_actions 조정), tool description(H1) 재작성.

**호환성**: pre-1.0 (0.x) 규약에 따라 0.9.18 → **0.10.0** major bump. 외부 소비자가 `components[i].props` 등에 접근하고 있었다면 `get_component(name)`로 이주 필요.

---

## 2026-04-08 — Tool consolidation round 2: 22 → 18 tools + rules refinement

**Merged**:

- `suggest_components` → `search_components` (useCase optional param 추가)
- `draft_issue` → `report_issue` (draft: true 모드 추가)
- `get_component_relationships` → `get_component` (includeRelationships optional param 추가)

**Refined**: `generate_component_code` 코딩 규칙 24개 → 11개 (critical 6 + recommended 5)

**Why — suggest + search**: 동일 메타데이터 검색. LLM 도구 선택 혼란 제거. useCase param으로 분기.
**Why — draft + report**: 4단계 → 2단계 이슈 파이프라인. draft 모드를 report_issue에 통합.
**Why — relationships + get_component**: 부가 정보를 별도 도구로 분리할 필요 없음. includeRelationships param으로 통합.
**Why — 규칙 24 → 11**: 중복/유사 규칙 병합 (R03+R04, R10+R11, R13+R21, R16+R17, R22+R23, R14+R24). 너무 specific한 규칙(R19, R20) 제거. LLM 유연성 확보.

**Final tool count**: 18 tools (from original 24)

---

## 2026-04-08 — Tool consolidation round 1: 24 → 22 tools

**Removed**: `compare_components`, `adapt_type_to_component`
**Redesigned**: `clarify_intent` (next-action hub), `get_usage_examples` (Vlossom guide + selling points)

**Why — compare_components**: LLM이 `get_component`를 2회 호출한 뒤 직접 비교하는 것이 더 유연하고 맥락을 반영함. 전용 도구는 LLM의 자연스러운 판단을 제한.

**Why — adapt_type_to_component**: TypeScript 인터페이스 → 컴포넌트 데이터 매핑 패턴이 5개뿐. `get_component`에서 props 타입 정보를 제공하므로 LLM이 직접 추론 가능.

**Why — clarify_intent redesign**: 기존: "모호한 질문에 3개 고정 선택지를 서버가 생성하는 disambiguation gate". 이는 LLM의 고유 역할(맥락 파악, 질문)을 서버가 대신하는 안티패턴. 새 설계: "다른 도구가 next_actions로 가리킬 수 있는 도구 추천 허브". 선택지 1~5개로 유연화. vlossom-mcp 기능을 최대한 활용하도록 유도하는 본래 목적에 부합.

**Why — get_usage_examples redesign**: 기존: 3개의 specific 파이프라인 워크스루 (너무 좁고 긴 데이터). 새 설계: 설치 가이드 + createVlossom 설정 + Quick Start 예제 + Vlossom 셀링포인트 5가지 + MCP 파이프라인 안내. 범용적인 온보딩 도구로 전환.

**Alternatives considered**:

- clarify_intent 이름 변경 (suggest_next_action 등) → 기각. CLAUDE.md G4, H3, H7이 모두 이 이름을 참조. 변경 시 문서 전체 수정 필요.
- adapt_type_to_component를 generate_component_code에 파라미터로 통합 → 기각. 사용 빈도가 낮아 통합보다 제거가 적합.

**next_actions 변경**: compare_components 참조를 `generate_component_code`로 교체 (get-relationships.ts, search-components.ts). get_usage_examples의 next_actions를 get_changelog, list_components, get_vlossom_options로 교체.

---

## 2026-04-08 — Server-side stepper enhancement (v0.9.16)

**Changed**: Layer 2 stepper (tree structure, summaries, Resolution line)를 LLM 측 스킬/지침에서 MCP 서버의 `renderStepper()`로 이동. threshold를 `>= 2`에서 `>= 1`로 낮추고, verbatim 출력 지시문 프리픽스 추가.

**Why**: 기존 Layer 2는 `.claude/skills/vlossom` 스킬과 CLAUDE.md H4 scaffold에 의존하여 Claude Code + 스킬 설치 환경에서만 트리 구조가 렌더링됨. 외부 MCP 클라이언트(Cursor, Windsurf 등)에서는 스킬이 없으므로 stepper가 불완전하거나 누락됨. 서버가 완성된 포맷을 생성하면 모든 클라이언트에서 동일한 출력이 보장됨.

**Alternatives considered**:

- LLM 스킬만으로 유지 → 기각. 외부 클라이언트 호환 불가.
- `sendLoggingMessage` 활용 → 기각. 대부분의 MCP 클라이언트가 로깅 채널을 사용자에게 노출하지 않음.
- MCP server instructions만 추가 → 기각. instructions만으로는 포맷 일관성을 보장할 수 없음. content block + verbatim 지시문 조합이 더 높은 준수율 제공.

**Interface changes**:

- `StepInfo`: `summary?: string`, `parentStep?: number` 필드 추가
- `recordStep()`: 4번째 optional parameter `options?: { summary?, parentStep? }` 추가 (기존 호출부 100% 호환)
- `renderStepper()`: flat → tree-enhanced 렌더링 (initiator 자동 탐지, `├─/└─` 분기, `→` summary, Resolution line)
- `textResponse()`: threshold `>= 2` → `>= 1`, verbatim prefix 추가

**Enforcement layers**:

1. `server.instructions` — 세션 시작 시 "stepper 블록을 그대로 출력하라" 규칙 전달
2. 별도 content block — LLM 클라이언트가 추가 블록을 자연스럽게 포함하는 특성 활용
3. Verbatim prefix — `"[Output the block below verbatim...]"` 텍스트로 매 응답 리마인드

**Files changed**: `mcp-response.ts` (core), 24 tool handlers (summary 추가), `server.ts` (instructions), `CLAUDE.md` (H4 scaffold)

---

## 2026-04-06 — generate_component_code (v0.9.0)

**Added**: Vlossom 코딩 규칙 15개(R01~R15), SFC 스캐폴드, import 문, StyleSet 가이드, composable 패턴을 반환하는 코드 생성 안내 도구.

**Why**: LLM이 `<style>` 태그 금지, named import, 비즈니스 로직 분리 등 Vlossom 고유 규칙을 모르고 코드를 생성하는 문제를 해결. 도구 자체가 코드를 생성하는 것이 아니라, LLM이 올바른 코드를 생성할 수 있도록 규칙과 스캐폴드를 제공.

**Alternatives considered**:

- 완성된 코드를 서버에서 직접 생성 → 기각. LLM의 유연성을 제한하고 Element Plus MCP처럼 별도 LLM API 호출이 필요해짐. 현재 아키텍처(도구 = 데이터/규칙 제공, LLM = 실제 코드 작성)와 일치하지 않음.
- MCP Prompts로 구현 → 기각. 동일한 규칙이 이미 tool response로 전달 가능하므로 중복. (→ 0.9.5 MCP Prompts 제거 결정과 동일 맥락)

**Interface**: `{ description, components[], hasBusinessLogic? }` → `{ rules[], imports, skeleton, styleSetGuidance, composablePattern? }`

---

## 2026-04-06 — generate_style_set (v0.9.1)

**Added**: 컴포넌트명과 스타일 요구사항을 받아 Vlossom StyleSet 철학(variables / component CSSProperties / child refs)에 맞는 StyleSet 객체 코드와 분류 근거를 반환.

**Why**: LLM이 StyleSet을 구성할 때 어떤 속성을 `variables`에, 어떤 것을 `component`에 넣어야 하는지 판단하기 어려움. ComponentMeta의 `styleSet.variables`와 `childRefs`를 기반으로 올바른 분류 기준을 제공.

**Alternatives considered**:

- 스타일 코드를 완전히 자동 생성 → 기각. 요구사항이 자연어이므로 의미 해석은 LLM이 담당해야 함. 서버는 분류 기준과 구조만 제공.

**Interface**: `{ component, requirements }` → `{ styleSetCode, explanation, usageExample, styleSetInterface }`

---

## 2026-04-06 — adapt_type_to_component (v0.9.2)

**Added**: TypeScript 인터페이스를 Vlossom 컴포넌트별 데이터 구조(VsTable columns, VsSelect options 등)로 변환하는 가이드와 코드 예시 반환.

**Why**: 기존 TypeScript 타입이 있는 프로젝트에서 Vlossom 컴포넌트로 마이그레이션할 때 데이터 구조 변환 방법을 모르는 경우가 많음. VsTable, VsSelect, VsCheckboxSet, VsRadio, VsPagination에 대한 구체적 매핑 패턴을 제공.

**Alternatives considered**:

- TypeScript AST 파서(ts-morph)로 완전 자동 변환 → 기각. 복잡도 대비 효과 낮음. 단순 regex 타입명 추출 + static 변환 가이드로 충분. 실제 변환은 LLM이 수행.

**Interface**: `{ userType, targetComponent }` → `{ component, userTypeName, guide, outputShape, example, rules }`

---

## 2026-04-06 — validate_component_usage (v0.9.3)

**Added**: Vue SFC 코드 문자열을 정적 분석해 Vlossom 규칙(R01~R15) 위반을 감지하고 severity, 위반 내용, 수정 방법을 반환.

**Why**: LLM이 생성한 코드에 `<style>` 블록이나 default import 같은 Vlossom 위반이 자주 포함됨. generate_component_code가 규칙을 제공하고, validate_component_usage가 실제 코드에서 위반을 검출하는 역할로 분리.

**Alternatives considered**:

- ESLint 플러그인으로 구현 → 기각. npm 패키지 의존성 증가 불필요. regex 기반 정적 분석으로 충분하며 외부 파일 시스템 접근 불필요.

**Interface**: `{ code, strict? }` → `{ valid, issues: ValidationIssue[], summary }`

---

## 2026-04-06 — search_components semantic enhancement (v0.9.4)

**Added**: `search_components`에 SYNONYM_MAP과 expandQuery 함수를 추가. "chart" → ["table","grid"], "popup" → ["modal","drawer"] 등 자연어 동의어를 메타데이터 키워드로 자동 확장.

**Why**: "chart 같은 거 있어?"처럼 Vlossom 컴포넌트 명칭이 아닌 일반 UI 용어로 검색할 때 결과가 없던 문제 해소. 인터페이스 변경 없이 내부 검색 품질만 향상.

**Alternatives considered**:

- 외부 임베딩 API 사용 의미 검색 → 기각. stdio MCP 서버에서 런타임 API 호출 불필요. 46개 정적 동의어 맵으로 대부분 케이스 커버.

**Interface**: 변경 없음 (`query: string` → `ComponentMeta[]`). `expandedTerms` 선택적 디버그 필드만 추가.

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
    return order.map((heading) => `**${heading}**\n\n${contentMap.get(heading)}`).join('\n\n');
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
language: z.enum(['ko', 'en']).default('ko').describe("Use 'en' if the user writes in English, 'ko' if in Korean.");
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
'ALWAYS call draft_issue first and fill in all required sections with the user before calling this.';
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

| #   | 시도                                  | 결과                                                           |
| --- | ------------------------------------- | -------------------------------------------------------------- |
| 1   | 매 호출마다 전체 스텝 박스 반복 출력  | ❌ 이전 스텝이 계속 반복되어 로그 노이즈                       |
| 2   | 중간: 1줄씩 + 마지막에 요약 박스      | ❌ 박스 너비(╔══╝) Claude가 정확히 못 맞춤                     |
| 3   | Agent 서브에이전트에 위임 + 최종 박스 | ❌ 서브에이전트 컨텍스트 로딩 오버헤드 (~40-70s)로 오히려 느림 |
| 4   | **응답 이후 1회, open-ended header**  | ✅ 채택                                                        |

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

## 결정 21: \_meta 세션 누적 문제 → 시작 도구에서 resetSession()

**날짜**: 2026-04-02

**문제**: MCP 서버가 단일 프로세스로 동작하므로, 서브에이전트나 여러 워크플로우가 동일 세션에서 도구를 호출하면 `_meta.steps`가 수십 개로 누적됨. 스테퍼가 이 모든 스텝을 표시하면 의미 없는 반복.

| #   | 옵션                            | 검토 결과                                                  |
| --- | ------------------------------- | ---------------------------------------------------------- |
| 1   | 세션 타임아웃 단축 (60s → 10s)  | ❌ 빠른 연속 호출 시 여전히 누적                           |
| 2   | 요청별 연결 ID로 세션 분리      | ❌ stdio 전송에서 연결 ID가 `RequestHandlerExtra`에 미노출 |
| 3   | **시작 도구 호출 시 세션 리셋** | ✅ 채택                                                    |

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

| #   | 옵션                              | 내용                                  | 검토 결과                                          |
| --- | --------------------------------- | ------------------------------------- | -------------------------------------------------- |
| 1   | 규칙을 상단 섹션으로 이동         | 눈에 띄는 위치에 배치하여 강제성 유지 | 여전히 AI가 편집 전 줄 수를 능동적으로 확인해야 함 |
| 2   | **숫자 제한 제거, 원칙으로 대체** | "간결하게 유지"라는 원칙만 남김       | ✅ 채택                                            |

**결정**: 방법 2 — 숫자 제한 제거

**근거**: AI가 스스로 숫자 제한을 강제하기 어려운 구조적 한계. 숫자 제한의 목적(컨텍스트 과부하 방지)은 "간결하게 유지"라는 원칙으로 충분히 표현 가능.

**적용**: `CLAUDE.md` 파일 구조 항목 `(300줄 이하 유지)` → `(간결하게 유지)` 로 변경.

---

## 결정 17: 다국어 MD 파일 구성

**날짜**: 2026-04-02

**질문**: CLAUDE.md, PLAN.md, README.md를 어떻게 다국어로 제공할 것인가?

| #   | 옵션                                          | 내용                                         | 검토 결과                     |
| --- | --------------------------------------------- | -------------------------------------------- | ----------------------------- |
| 1   | 단일 파일에 한/영 병기                        | 각 섹션 아래 한국어/영어 순서로 병기         | ❌ 파일 길이 2배, 가독성 저하 |
| 2   | **메인(`.md`) = 영어, 한국어(`.ko.md`) 별도** | 표준 관행 따라 영어를 기본, 한국어 파일 추가 | ✅ 채택                       |

**결정**: 방법 2 — 영어 메인, `.ko.md` 한국어 버전

**파일 구성**:

| 파일           | 언어   | 비고                       |
| -------------- | ------ | -------------------------- |
| `CLAUDE.md`    | 영어   | 메인 규칙 파일             |
| `CLAUDE.ko.md` | 한국어 | 기존 파일 내용 유지        |
| `PLAN.md`      | 영어   | 메인 계획 파일             |
| `PLAN.ko.md`   | 한국어 | 기존 파일 내용 유지        |
| `README.md`    | 영어   | 기존 파일 유지 (이미 영어) |
| `README.ko.md` | 한국어 | 신규 생성                  |

**근거**: README.md는 이미 영어로 작성되어 있어 일관성을 위해 나머지 파일도 영어를 기본으로 통일.

---

## 결정 25: skill/SKILL.md를 npm 패키지에 번들링

**날짜**: 2026-04-02

**질문**: npm으로 설치한 사용자도 Claude Code 스킬(clarify_intent 워크플로 포함)을 사용할 수 있게 하려면?

**배경**: `.claude/skills/vlossom/SKILL.md`는 레포 클론 사용자에게만 적용됨. npm 설치 사용자는 MCP 서버는 갖지만 스킬 워크플로 가이드가 없어 clarify_intent 등 권장 흐름을 따르지 않을 수 있음.

| #   | 옵션                                    | 내용                                    | 검토 결과                                |
| --- | --------------------------------------- | --------------------------------------- | ---------------------------------------- |
| 1   | **npm 패키지에 `skill/` 디렉토리 포함** | `package.json` `files`에 `"skill"` 추가 | ✅ 채택                                  |
| 2   | postinstall 스크립트로 자동 복사        | `~/.claude/skills/`에 자동 설치         | ❌ 사용자 홈 디렉토리 수정은 부작용 우려 |

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

| #   | 옵션                                                | 내용                                 | 검토 결과                                    |
| --- | --------------------------------------------------- | ------------------------------------ | -------------------------------------------- |
| 1   | 규칙을 더 정교하게 보완                             | 예외 케이스를 추가로 열거            | ❌ 경직성 근본 해결 불가, 유지보수 비용 증가 |
| 2   | **INSTRUCTIONS 규칙 제거, 도구 description에 위임** | LLM이 description 기반으로 자체 판단 | ✅ 채택                                      |

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

| #   | 방법                                       | 신뢰도 | 이유                                                       |
| --- | ------------------------------------------ | ------ | ---------------------------------------------------------- |
| 1   | INSTRUCTIONS 텍스트 규칙만 사용            | 낮음   | AI가 문맥에 따라 무시할 수 있음                            |
| 2   | tool 응답 데이터에 `next_action` 필드 추가 | 중간   | 구체적 데이터 신호로 AI 행동을 유도                        |
| 3   | **INSTRUCTIONS + `next_action` 병행**      | 높음   | 텍스트 규칙과 데이터 신호가 일치하면 AI가 따를 수밖에 없음 |

**결정**: 방법 3 — INSTRUCTIONS에 Missing Component Rule 추가 + 모든 관련 tool 응답에 `next_action` 인코딩

**`next_action` 추가 기준 (두 가지 패턴)**

**패턴 A — 선행 조건 미충족 (실패 시)**: tool이 실행됐지만 필요한 전제가 없어 실패할 때, 무엇을 먼저 해야 하는지 알려줌

| Tool                   | 시나리오         | next_action          |
| ---------------------- | ---------------- | -------------------- |
| `report_issue`         | GitHub 토큰 없음 | `"set_github_token"` |
| `check_github_token`   | 토큰 미설정      | `"set_github_token"` |
| `get_component`        | 이름 못 찾음     | `"list_components"`  |
| `get_component_source` | 이름 못 찾음     | `"list_components"`  |
| `compare_components`   | 컴포넌트 못 찾음 | `"list_components"`  |
| `search_components`    | 결과 없음        | `"suggest_issue"`    |
| `suggest_components`   | 결과 없음        | `"suggest_issue"`    |

**패턴 B — 성공 후 다음 단계 (정상 흐름)**: tool이 성공했을 때 pipeline의 다음 노드를 명시

| Tool                          | 시나리오         | next_action       |
| ----------------------------- | ---------------- | ----------------- |
| `list_components`             | 목록 반환        | `"get_component"` |
| `check_github_token`          | 토큰 설정됨      | `"draft_issue"`   |
| `set_github_token`            | 토큰 저장 성공   | `"draft_issue"`   |
| `draft_issue`                 | 템플릿 생성 완료 | `"report_issue"`  |
| `search_components`           | 결과 있음        | `"get_component"` |
| `suggest_components`          | 결과 있음        | `"get_component"` |
| `get_component_relationships` | 관계 반환        | `"get_component"` |

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

| #   | 옵션                                       | 검토 결과                                          |
| --- | ------------------------------------------ | -------------------------------------------------- |
| 1   | 휴리스틱 개선 (임계값 조정, 가중치 부여)   | ❌ 근본적으로 스크립트가 언어 판단을 대행하는 구조 |
| 2   | **서버 사이드 판단 완전 제거, LLM에 위임** | ✅ 채택                                            |

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

| id                          | 시나리오                                     | 단계 수 |
| --------------------------- | -------------------------------------------- | ------- |
| `missing-component`         | 차트 컴포넌트 없음 → 이슈 제출까지 전체 흐름 | 7       |
| `build-login-form`          | 로그인 폼 제작 → 컴포넌트 조회 → 코드 생성   | 4       |
| `lookup-specific-component` | VsDrawer 상세 조회 + CSS 토큰 연결           | 3       |

**각 예제 구조**: `user_prompt` → `pipeline[]` (step마다 `tool`, `input`, `output_summary`, `why` 포함).

**핵심 설계 원칙**: `input`/`output_summary`를 명시하여 파이프라인 체인의 동작을 직관적으로 이해할 수 있게 함. `why` 필드로 각 단계의 인과관계를 설명.

**트리거**: INSTRUCTIONS flow guide에 "When user asks how to use vlossom-mcp: `get_usage_examples`" 추가.

---

## 결정 31: CLAUDE.md를 하네스/가드레일 분류 체계로 재구성

**날짜**: 2026-04-02

**배경**: 기존 CLAUDE.md는 도구 설계 원칙, 코드 스타일, 버전 관리, 에이전트 설정이 순서 없이 나열됨. 새 규칙이 추가될 때 어디에 넣을지 명확하지 않았고, 규칙의 성격(금지인지 안내인지)이 뒤섞여 있었음.

**분류 체계**:

| 개념                    | 정의                                                | 역할               |
| ----------------------- | --------------------------------------------------- | ------------------ |
| **가드레일(Guardrail)** | 절대 해서는 안 되는 것                              | 위반하면 버그      |
| **하네스(Harness)**     | 올바른 행동을 유도하는 구조적 틀                    | 따르면 일관성 보장 |
| **참고(Reference)**     | 도구 추가 절차, 데이터 파일, 코드 스타일, 버전 관리 | 지원 정보          |

**가드레일 4개**: G1(서버 사이드 LLM 판단 금지), G2(report_issue 명시 승인 필요), G3(단일 책임 원칙), G4(clarify_intent 재호출 금지).

**하네스 5개**: H1(도구 description 4문장 구조), H2(next_action 링크드리스트), H3(clarify_intent 선택 형식), H4(Stepper UX), H5(이슈 제출 흐름).

**SKILL.md도 동일 체계로 재구성**: 스킬 파일에도 가드레일/하네스 섹션을 적용하여 개발자와 LLM 모두가 동일한 분류 언어를 사용.

---

## 결정 32: 대화형 응답에 이모지 최소 적용

**날짜**: 2026-04-02

**배경**: 텍스트만으로는 중요한 대화 전환점(선택 요청, 인증 요청, 초안 준비)이 시각적으로 구분되지 않음.

**결정**: 사용자와 직접 대화가 발생하는 응답 메시지에만 이모지를 적용. 5개 이모지 고정 세트로 제한.

| 이모지 | 위치                                              | 의미                      |
| ------ | ------------------------------------------------- | ------------------------- |
| `💬`   | `clarify_intent` presentation_format              | 선택 요청 다이얼로그      |
| `🔗`   | `get_usage_examples` description                  | 파이프라인 체인 소개      |
| `💡`   | `suggest_components` 빈 결과 next_action_message  | 없는 기능 → 이슈 제안     |
| `🔑`   | `check_github_token` / `set_github_token` message | 인증 상태 변경            |
| `📝`   | `draft_issue` next_action_message                 | 초안 완성, 섹션 수집 요청 |

**제약**: 이 5개 이외의 이모지는 도구 응답에 추가하지 않음. LLM 내부 안내 전용 필드(`next_action_message` 대부분)에는 적용하지 않고 사용자에게 직접 보이는 텍스트에만 한정.

---

## 결정 33: get_usage_examples 스테퍼 파이프라인 시각화

**날짜**: 2026-04-02

**배경**: `get_usage_examples`는 단일 도구 호출이므로 `recordStep()`을 한 번만 호출하면 1-step 스테퍼가 렌더링됨. 이는 사용자에게 실제 파이프라인 구조를 전달하지 못하고 노이즈만 추가.

**결정**: `recordStep()` 대신 `EXAMPLES[0].pipeline`(missing-component, 7단계)의 스텝 정보로 직접 `McpResponseMeta`를 생성. 스테퍼가 실제 파이프라인 흐름을 반영.

| 옵션                                         | 검토 결과                                    |
| -------------------------------------------- | -------------------------------------------- |
| `recordStep()` 한 번 호출                    | ❌ 1-step 스테퍼 → 의미 없음                 |
| 모든 예제 파이프라인 합산                    | ❌ 3개 예제 합산 시 순서·맥락 불명확         |
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

| ID  | 분류     | 내용                                    |
| --- | -------- | --------------------------------------- |
| G1  | 가드레일 | 서버 사이드 LLM 판단 금지               |
| G2  | 가드레일 | report_issue 명시적 승인 필수           |
| G3  | 가드레일 | 도구 단일 책임                          |
| G4  | 가드레일 | clarify_intent 재호출 금지              |
| G5  | 가드레일 | 컴포넌트 환각 방지                      |
| H1  | 하네스   | 도구 설명 4문장 구조                    |
| H2  | 하네스   | next_action 링크드리스트                |
| H3  | 하네스   | clarify_intent 선택지 포맷              |
| H4  | 하네스   | 스테퍼 UX (steps ≥ 2)                   |
| H5  | 하네스   | 이슈 등록 흐름                          |
| H6  | 하네스   | 빈 결과 사용자 고지                     |
| H7  | 하네스   | 자연어 쿼리 시 clarify_intent 우선 호출 |

---

## 결정 38: suggest_components 한국어 입력 처리 — HEURISTIC_MAP 미사용

**날짜**: 2026-04-03

**배경**: `extractKeywords()`의 정규식 `/[^a-z0-9]/g`이 한글을 포함한 모든 비ASCII 문자를 제거했음. "로그인 폼" 입력 시 키워드가 `["", ""]`로 변환되어 아무 컴포넌트도 매칭되지 않는 버그 확인.

**시도 및 거부**:

| 옵션                                                           | 검토 결과                                                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 정규식 수정 + 한국어 HEURISTIC_MAP 추가 (`로그인` → VsForm 등) | ❌ 거부 — G1 위반. "로그인 폼" → VsForm,VsInput,VsButton 매핑은 의미론적 판단으로 LLM의 책임 |
| **정규식 수정만 적용** (`/[^a-z0-9\uAC00-\uD7A3]/g`)           | ✅ 채택 — 한글 문자를 보존하되, 컴포넌트 매핑은 LLM에 위임                                   |

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

| #   | 옵션                                                                 | 검토 결과                                     |
| --- | -------------------------------------------------------------------- | --------------------------------------------- |
| 1   | description에서 use-case 관련 표현 제거, 명확한 키워드 전용으로 명시 | ✅ 채택                                       |
| 2   | 별도 진입점 tool 추가                                                | ❌ G3 위반 가능성, 기존 clarify_intent로 충분 |

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

| #   | 옵션                                             | 검토 결과                       |
| --- | ------------------------------------------------ | ------------------------------- |
| 1   | `resetSession()` 전체 제거, 60초 타임아웃만 사용 | ✅ 채택                         |
| 2   | `is_continuation` 파라미터로 조건부 리셋         | ❌ LLM 판단 의존 → G1 위반 가능 |
| 3   | clarify_intent에서 세션 보존 플래그 설정         | ❌ tool 간 숨겨진 상태 의존성   |

**결정**: 3개 tool에서 `resetSession()` 호출 제거. 세션 경계는 60초 inactivity timeout으로만 관리.

**트레이드오프**: 60초 내 연속 쿼리 시 이전 쿼리의 step이 stepper에 누적될 수 있음. 그러나 일반적인 대화 흐름에서 한 쿼리의 tool 호출들은 수 초 내에 완료되고, 새 쿼리 전에는 사용자 입력 대기 시간이 발생하므로 실질적인 오염 가능성은 낮음.

**근거**: `"initiating tool"` 가정이 `clarify_intent` 연속 흐름에서 깨짐. 명시적 리셋보다 타임아웃 기반이 더 robust하며 코드가 단순해짐.

---

## 결정 44: `_meta._render` — stepper 렌더링 힌트를 응답에 포함

**날짜**: 2026-04-03

**배경**: Stepper 렌더링 지침(S4)이 `CLAUDE.md`에만 있어, vlossom 모노레포 외부 프로젝트에서 vlossom-mcp 사용 시 stepper가 출력되지 않는 문제 발생. `_meta`는 응답에 항상 포함되지만 LLM에게 렌더링 지침이 없으면 무시됨.

| #   | 옵션                                    | 검토 결과                                                          |
| --- | --------------------------------------- | ------------------------------------------------------------------ |
| 1   | 각 tool description에 렌더링 지침 추가  | ❌ 15개+ tool 수정 필요, description 과잉, steps < 2에도 항상 포함 |
| 2   | `_meta._render` 필드로 응답에 힌트 포함 | ✅ 채택                                                            |

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

| #   | 옵션                                          | 검토 결과                           |
| --- | --------------------------------------------- | ----------------------------------- |
| 1   | 누락 컴포넌트 수동 추가 + dist 복사 로직 추가 | ✅ 채택                             |
| 2   | 런타임에 동적으로 파일 생성                   | ❌ 배포된 패키지에서 소스 접근 불가 |

**결정**: `scripts/relationships.json`에 12개 컴포넌트 항목 추가. `generate-components.mjs` 마지막에 `relationships.json`을 `src/data/`와 `dist/data/` 양쪽으로 복사하는 로직 추가.

**근거**: 다른 데이터 파일(components-data, css-tokens 등)과 동일한 패턴으로 통일. 빌드 시점에 복사하므로 런타임 의존성 없음.

---

## 결정 47: get_changelog 재설계 — 런타임 fetch 제거, 빌드 타임 번들링으로 전환

**날짜**: 2026-04-03

**배경**: 기존 `get_changelog`는 런타임에 GitHub Releases API를 직접 fetch했음. 이는 네트워크 의존성, 지연, 방화벽 환경 실패 등 문제를 야기. 또한 vlossom 릴리즈 태그 형식이 `vlossom-v2.0.0-beta.1`으로 일반적인 `v1.2.3`과 달라 파싱 오류 발생.

| #   | 옵션                               | 검토 결과                          |
| --- | ---------------------------------- | ---------------------------------- |
| 1   | 런타임 fetch 유지, 에러 처리 강화  | ❌ 네트워크 의존성 근본 해결 안 됨 |
| 2   | 빌드 타임에 JSON 생성, 번들로 배포 | ✅ 채택                            |
| 3   | 캐싱 레이어 추가                   | ❌ 복잡도 증가, 오래된 데이터 위험 |

**결정**: `scripts/build-changelog.mjs` 스크립트 신규 작성. `npm run generate` 체인에 포함하여 빌드/배포 시 자동 실행. `changelog.json`을 `src/data/`와 `dist/data/`에 저장. `get-changelog.ts`를 `createRequire` 패턴으로 리팩터링하여 번들 파일을 읽도록 변경. 태그 파싱 정규식을 `/^(?:.*-)?v/`로 수정하여 `vlossom-v2.0.0-beta.1` 형식 처리. 현재 안정 릴리즈가 없을 경우 최신 프리릴리즈를 `latestStable`로 폴백.

**근거**: 다른 데이터 파일(components-meta, css-tokens 등)과 동일한 번들링 패턴으로 일관성 유지. 네트워크 없는 환경에서도 동작. 빌드 실패 시 `process.exit(0)`으로 non-fatal 처리하여 네트워크 없는 CI 환경도 지원.

---

## 결정 48: 입력 검증 오류 최소화 — 3가지 schema 개선

**날짜**: 2026-04-03

**배경**: 외부 프로젝트에서 vlossom-mcp 사용 시 세션 초반에 tool 호출이 한 번씩 validation error로 실패하는 패턴 발견. LLM이 재시도하여 성공하지만 불필요한 왕복이 발생.

**원인 분석**:

| 도구                          | 문제                                 | 증상                                        |
| ----------------------------- | ------------------------------------ | ------------------------------------------- |
| `clarify_intent`              | `candidates.length(3)` 엄격 제약     | LLM이 2개/4개 생성 시 ZodError              |
| `get_css_tokens`              | enum에 `"typography"`, `"size"` 포함 | 실제 데이터에 없는 카테고리 통과 후 빈 결과 |
| `draft_issue`, `report_issue` | `type` enum에 `"enhancement"` 없음   | LLM이 "enhancement" 사용 시 ZodError        |

| #   | 옵션                                | 검토 결과                            |
| --- | ----------------------------------- | ------------------------------------ |
| 1   | description만 수정하여 LLM 유도     | ❌ 근본 해결 안 됨, 여전히 가끔 실패 |
| 2   | schema를 유연하게 + 서버에서 정규화 | ✅ 채택                              |

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

| #   | 옵션                                                      | 검토 결과                                             |
| --- | --------------------------------------------------------- | ----------------------------------------------------- |
| 1   | `report_issue`에서 type → label 매핑을 서버에서 자동 처리 | ❌ G2 위반 가능성 (사용자 확인 없이 레이블 자동 설정) |
| 2   | `draft_issue` 응답에 `suggestedLabels` 포함, LLM이 전달   | ✅ 채택                                               |

**결정**: `IssueDraft` 타입에 `suggestedLabels: string[]` 추가. `buildDraft`의 모든 분기(bug/feature/question, ko/en)에서 type에 맞는 레이블 반환. `report_issue`의 `labels` description에 "draft_issue의 suggestedLabels를 전달하라"고 명시.

**근거**: LLM이 데이터를 직접 전달하므로 사용자가 확인 단계에서 레이블을 볼 수 있음. 자동 처리보다 투명성 유지.

---

## 결정 50: Phase 3 공유 유틸 추출 — naming / resolution / validators / data (v0.9.7)

**날짜**: 2026-04-06

**배경**: Phase 3 도구(generate_component_code, generate_style_set, adapt_type_to_component, validate_component_usage, search_components) 5개 파일에 265줄 정적 데이터와 50줄 중복 로직이 분산되어 있었음. 코드 리뷰에서 파일이 지나치게 길고 유지보수가 어렵다는 지적이 있었음.

**변경 내용**:

- `utils/naming.ts`: `toCamelCase`, `childRefToKey` 공통 함수
- `utils/component-resolution.ts`: `resolveComponent` not-found 패턴 통합
- `utils/regex-helpers.ts`: `findMatchLineNumbers` regex 루프 패턴
- `utils/code-validators.ts`: `validateCode` 85줄 → 규칙별 함수로 분해
- `data/coding-rules.ts`: `CODING_RULES` + `CodingRule` 인터페이스
- `data/adaptation-guides.ts`: `COMPONENT_ADAPTATION_GUIDES` + 인터페이스
- `data/search-synonyms.ts`: `SYNONYM_MAP` 46개 동의어

| #   | 옵션                                | 검토 결과                                |
| --- | ----------------------------------- | ---------------------------------------- |
| 1   | tool 파일에 정적 데이터 인라인 유지 | ❌ 파일 길이 200~400줄 초과, 가독성 저하 |
| 2   | data/ + utils/ 분리 추출            | ✅ 채택                                  |

**결정**: 정적 데이터는 `src/data/`로, 재사용 로직은 `src/utils/`로 분리. tool 파일은 조합 로직만 담당.

**근거**: 파일당 200–400줄 원칙(coding-style.md). 데이터와 로직을 분리하면 테스트와 리뷰가 각각 독립적으로 가능해짐.

---

## 결정 51: next_action(string) → next_actions 배열 전환 (v0.9.8)

**날짜**: 2026-04-06

**배경**: 기존 `next_action: string` + `next_action_message: string` 쌍은 단일 후속 동작만 표현할 수 있었음. HUB 성격의 도구(예: `get_component`)는 맥락에 따라 다음 단계가 달라지는데, 단일 문자열로는 LLM이 분기를 선택할 수 없었음. CLAUDE.md H2에서 이미 배열 형식이 규정됐으나 실제 구현이 문자열로 남아 있었음.

**변경 내용**:

- `src/types/next-action.ts`: `NextActionItem { tool, reason }` 타입 추가
- 19개 tool 파일 + `utils/component-resolution.ts` 전환
- PATH tool: 항목 1개 (단일 명확한 다음 단계)
- HUB tool: 항목 2–5개 (맥락에 따라 LLM이 선택)

| #   | 옵션                                                     | 검토 결과          |
| --- | -------------------------------------------------------- | ------------------ |
| 1   | `next_action` 문자열 유지, 별도 `alternatives` 배열 추가 | ❌ 중복 필드, 혼재 |
| 2   | `next_actions: [{tool, reason}]` 단일 배열로 통일        | ✅ 채택            |

**결정**: 모든 tool 응답의 `next_action` / `next_action_message`를 `next_actions` 배열로 교체. `reason`은 LLM이 현재 대화 맥락과 매칭하는 데 사용.

**근거**: LLM이 `reason` 문자열을 기준으로 가장 적합한 다음 단계를 선택할 수 있어 정적 문자열보다 유연함. G1(서버 사이드 LLM 판단 금지)을 지키면서 분기 표현 가능.

---

## 결정 52: Stepper UX 재설계 — 트리 형식 + on/off 환경변수 (v0.9.9)

**날짜**: 2026-04-06

**배경**: 기존 `_meta._render` 방식은 JSON에 중첩된 문자열 필드라 LLM이 놓치기 쉬웠고, stepper가 일관성 없이 렌더링됐음(결정 44). skill이 설치되지 않은 환경에서는 stepper가 전혀 표시되지 않는 문제도 있었음.

**변경 내용**:

- `mcp-response.ts`: `renderStepper()` 추가, `_stepper` 최상단 필드로 노출
- `src/index.ts`: `VLOSSOM_MCP_STEPPER` 환경변수 읽어 `setStepperEnabled()` 호출
- `server.ts INSTRUCTIONS`: stepper 섹션 전면 개정 (트리 형식 예제 포함)
- CLAUDE.md H4: 트리 형식(├─/└─, `selected-from #N`, Resolution 라인) 정의

| #   | 옵션                                     | 검토 결과                                |
| --- | ---------------------------------------- | ---------------------------------------- |
| 1   | `_meta._render` 유지, INSTRUCTIONS 강화  | ❌ JSON 중첩 필드는 LLM이 놓칠 확률 높음 |
| 2   | 서버 pre-render → `_stepper` 최상단 노출 | ✅ 채택                                  |
| 3   | stepper 제거                             | ❌ UX 퇴보                               |

**결정**: 서버가 stepper를 직접 pre-render하여 응답 최상단 `_stepper` 필드로 노출. LLM은 `_stepper`가 있으면 verbatim 출력. `VLOSSOM_MCP_STEPPER=off`로 비활성화 가능(기본: on). steps ≥ 2일 때만 출력.

**근거**: 최상단 필드는 LLM이 놓칠 확률이 낮음(결정 44 실패 원인 해소). 환경변수 on/off로 사용자가 stepper 노출 여부를 제어 가능.

---

## 결정 53: 스캐폴드(stepper/presentation_format)를 MCP content block으로 이동 (v0.9.11)

**날짜**: 2026-04-07

**배경**: `_stepper`와 `clarify_intent`의 `presentation_format`이 JSON payload 안에 있었음. skill이 설치되지 않은 환경에서는 LLM이 이 필드를 무시하거나 원문 그대로 노출하지 않아 UX 불일치가 발생했음.

**변경 내용**:

- `utils/mcp-response.ts`: `textResponse`에 `extra[]` 파라미터 추가 (추가 content block)
- stepper: 별도 content block으로 전달 (steps ≥ 2)
- `clarify_intent`: `presentation_format`을 JSON에서 꺼내 별도 content block으로 전달
- `awaiting_user_choice` → `_await_user_choice` (실제 tool이 아님을 명시)
- `server.ts INSTRUCTIONS`: stepper 섹션 2줄로 단순화, freehand 번호 메뉴 금지 추가

| #   | 옵션                              | 검토 결과                        |
| --- | --------------------------------- | -------------------------------- |
| 1   | JSON 필드 유지, INSTRUCTIONS 강화 | ❌ skill 미설치 시 여전히 불안정 |
| 2   | MCP content block으로 분리 전달   | ✅ 채택                          |

**결정**: stepper와 presentation_format을 MCP 프로토콜의 별도 content block으로 전달. LLM은 MCP content block을 항상 렌더링하므로 skill 없이도 일관성 보장.

**근거**: MCP content block은 JSON payload보다 우선순위가 높고 LLM이 항상 처리함. skill 의존성 제거로 배포 환경 독립성 확보.

---

## 결정 54: pre-release 버전 컨텍스트 노출 (v0.9.11)

**날짜**: 2026-04-07

**배경**: vlossom 2.0.0-beta.1은 아직 stable 릴리즈가 없는 pre-release 상태. 외부 사용자가 이 사실을 인지하지 못하고 설치 가이드나 버전 관련 질문을 할 때 LLM이 잘못된 안내를 할 수 있었음.

**변경 내용**:

- `scripts/build-changelog.mjs`: `currentVersion`(로컬 package.json), `latestPrerelease`, `latestVersion`, `latestStable`(stable 없을 때 null) 필드 추가
- `src/data/changelog.json`: regenerated (`currentVersion: 2.0.0-beta.1` 포함)
- `src/tools/get-changelog.ts`: `currentVersion`, `latestPrerelease`, `isPrerelease` 반환
- `server.ts INSTRUCTIONS`: Version Context 섹션 추가 (pre-release 경고, 버전/설치 질문 시 `get_changelog` 먼저 호출 지침)

| #   | 옵션                                  | 검토 결과                          |
| --- | ------------------------------------- | ---------------------------------- |
| 1   | INSTRUCTIONS에 하드코딩               | ❌ 버전 업데이트 시 수동 관리 필요 |
| 2   | changelog 빌드 시 버전 정보 자동 포함 | ✅ 채택                            |

**결정**: 빌드 타임에 `currentVersion`과 pre-release 여부를 changelog.json에 포함. `get_changelog` 도구가 이를 반환하고 LLM이 버전 질문 시 참조.

**근거**: 버전 정보를 코드에서 자동으로 읽어 관리 포인트를 단일화. INSTRUCTIONS의 Version Context 섹션으로 LLM이 pre-release 상태를 항상 인지하도록 강제.

## 결정 55: 세션 타임아웃 설정 가능 (v0.9.12)

**날짜**: 2026-04-07

**배경**: Figma + vlossom-mcp 복합 워크플로우에서 Figma 도구 분석에 60초 이상 소요되면 세션이 자동 리셋되어 stepper steps < 2 조건을 만족하지 못해 stepper가 노출되지 않는 문제 발생.

**변경 내용**:

- `src/utils/mcp-response.ts`: `SESSION_TIMEOUT_MS` 기본값 60초 → 30분으로 증가, `setSessionTimeoutMs()` 내보내기
- `src/index.ts`: `VLOSSOM_MCP_SESSION_TIMEOUT` 환경변수 읽어 타임아웃 설정 (분 단위, `0` = 타임아웃 없음)

| #   | 옵션                               | 검토 결과                                 |
| --- | ---------------------------------- | ----------------------------------------- |
| 1   | 기본값만 늘림 (환경변수 없음)      | ❌ 사용자 제어 불가                       |
| 2   | 환경변수로 설정 가능 + 기본값 30분 | ✅ 채택                                   |
| 3   | 타임아웃 완전 제거                 | ❌ 서로 다른 워크플로우 간 세션 누적 위험 |

**결정**: 기본값 30분 + `VLOSSOM_MCP_SESSION_TIMEOUT` 환경변수로 분 단위 설정. `0`이면 `Infinity`로 처리해 타임아웃 없이 명시적 `resetSession()` 호출에만 의존.

**근거**: Figma 분석처럼 외부 도구가 포함된 워크플로우는 60초를 쉽게 초과함. 기본값을 30분으로 늘려 대부분의 실사용 시나리오를 커버하면서, 환경변수로 사용자가 조정 가능하게 유지.

---

## 결정 56: record_external_step 도구 추가 — 외부 도구 추적 (v0.9.13)

**날짜**: 2026-04-07

**배경**: vlossom-mcp와 Figma MCP는 별개의 서버 프로세스라 서로의 도구 호출을 직접 인터셉트할 수 없음. Figma 도구 호출이 vlossom stepper에 포함되지 않아 pipeline trace가 불완전하게 노출됨.

**변경 내용**:

- `src/tools/record-external-step.ts`: 새 도구 추가. `tool`, `label`, `reset?` 파라미터 수용. `reset: true` 시 세션 초기화 후 기록.
- `src/server.ts`: `registerRecordExternalStep()` 등록, INSTRUCTIONS에 Figma + Vlossom 워크플로우 섹션 추가 (LLM이 Figma 도구 호출 직후 `record_external_step` 호출하도록 지침)

| #   | 옵션                                     | 검토 결과                             |
| --- | ---------------------------------------- | ------------------------------------- |
| 1   | MCP 미들웨어로 전체 도구 호출 인터셉트   | ❌ SDK가 cross-server 인터셉트 미지원 |
| 2   | 프록시 서버 구성                         | ❌ 아키텍처 복잡도 과도하게 증가      |
| 3   | LLM이 수동으로 record_external_step 호출 | ✅ 채택                               |

**결정**: `record_external_step` 도구를 추가하고 INSTRUCTIONS로 LLM이 Figma 도구 호출 직후 자동으로 호출하도록 지침. `reset: true` 파라미터로 새 워크플로우 시작 시 세션 초기화 가능.

**근거**: cross-server 인터셉트는 MCP 프로토콜상 불가능. LLM-driven 수동 기록이 현실적인 유일한 방법이며, INSTRUCTIONS 지침으로 일관성을 확보할 수 있음.

---

## 결정 57: generate_component_code 코딩 규칙 확장 R16–R24 (v0.9.15)

**날짜**: 2026-04-07

**배경**: 기존 R01–R15는 import·styling·structure·quality 기본 규칙을 다루지만, StyleSet 타입 안전성, 폼 상태 표시 패턴, color-scheme 전파, 반응형 너비 제어, Plugin API 사용 패턴, props/emit 타입 명시, v-model 단축 문법 등 실사용에서 자주 누락되는 규칙이 빠져 있었음.

**변경 내용**:

- `src/data/coding-rules.ts`: R16–R24 추가 (9개)
    - R16 (styling/recommended): StyleSet 객체에 타입 명시
    - R17 (styling/recommended): 재사용 StyleSet은 named preset으로
    - R18 (vlossom/critical): 폼 입력 피드백은 `:state` + `:state-message` prop
    - R19 (vlossom/recommended): `color-scheme` prop 자식으로 전파
    - R20 (vlossom/recommended): 단일 컴포넌트 너비는 `VsResponsive` / `:width` prop
    - R21 (vlossom/recommended): Plugin API는 composable 내에서 호출
    - R22 (structure/recommended): props는 named interface로 정의
    - R23 (structure/recommended): `defineEmits` call signature 타입 명시
    - R24 (quality/recommended): `v-model` 단축 문법 사용

| #   | 옵션              | 검토 결과                                                          |
| --- | ----------------- | ------------------------------------------------------------------ |
| 1   | 기존 R01–R15 유지 | ❌ StyleSet 타입, 상태 표시, color-scheme 전파 등 실사용 패턴 누락 |
| 2   | R16–R24 추가      | ✅ 채택                                                            |

**결정**: 9개 규칙 추가. critical 1개(R18), recommended 8개. `generate_component_code` 응답에 자동 포함됨.

**근거**: 코드 리뷰에서 반복적으로 지적되는 패턴을 규칙화해 LLM이 생성하는 코드 품질을 높임.

---

## 결정 58: typeMappingGuidance 추가 — TypeScript 타입 매핑 가이던스 (v0.9.17)

**날짜**: 2026-04-08

**배경**: `generate_component_code`가 Vlossom 컴포넌트 코드를 생성할 때 TypeScript 타입(ColorScheme, UIState, Size, StateMessage 등)의 import 경로와 사용 패턴이 누락되어 LLM이 잘못된 타입을 사용하거나 import를 빠뜨리는 경우가 있었음.

**변경 내용**:

- `src/tools/generate-component-code.ts`: 응답에 `typeMappingGuidance` 필드 추가. 주요 Vlossom 타입의 import 경로, 용도, 사용 예시를 포함.

**결정**: `typeMappingGuidance`를 `generate_component_code` 성공 응답에 포함.

**근거**: LLM이 타입 안전한 코드를 생성하려면 Vlossom 고유 타입의 정확한 import 경로와 사용 패턴이 필요함.

---

## 결정 59: 성공 응답에 report_issue next_action 추가 — Enhancement Suggestion (v0.9.18)

**날짜**: 2026-04-08

**배경**: 기존에는 도구 응답이 비었을 때(컴포넌트/composable/directive를 못 찾았을 때)만 `check_github_token` next_action이 제안되어 이슈 등록 파이프라인이 노출됨. 기존 기능에 대한 개선 요청이나, 찾았더라도 원하는 기능이 존재하지 않아 제안하고 싶은 경우에는 이슈 등록 경로가 없었음.

**변경 내용**:

- `src/tools/get-component.ts`: 성공 응답 next_actions에 `report_issue` 항목 추가
- `src/tools/get-composables.ts`: 개별 조회 성공 next_actions에 `report_issue` 항목 추가
- `src/tools/get-directive.ts`: 개별 조회 성공 next_actions에 `report_issue` 항목 추가
- `src/tools/search-components.ts`: useCase/query 성공 next_actions에 각각 `report_issue` 항목 추가
- `src/server.ts`: INSTRUCTIONS에 "Enhancement Suggestion Rule" 섹션 추가

| #   | 옵션                          | 검토 결과                                                               |
| --- | ----------------------------- | ----------------------------------------------------------------------- |
| 1   | `check_github_token`으로 연결 | ❌ 토큰 확인이라는 의도가 불명확, 불필요한 중간 단계                    |
| 2   | `report_issue`로 직접 연결    | ✅ 채택 — 의도 명확, 토큰 미설정 시 자체 처리 (`set_github_token` 안내) |

**결정**: 5개 성공 응답 경로에 `report_issue` next_action 추가. INSTRUCTIONS에 "Enhancement Suggestion Rule" 추가하여, 결과가 있을 때는 사용자의 명시적 요청이 있을 때만 이슈 경로를 따르도록 구분.

**근거**: `report_issue`가 이미 토큰 미설정을 처리하므로 `check_github_token` 중간 단계가 불필요. "못 찾았을 때"(Missing Component Rule: 적극 제안)와 "찾았을 때"(Enhancement Suggestion Rule: 사용자 요청 시만) 동작을 명확히 분리.

---
