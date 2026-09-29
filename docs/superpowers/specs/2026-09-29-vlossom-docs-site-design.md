# Vlossom 공식 문서 사이트 설계

- 작성일: 2026-09-29
- 브랜치: `feat/docs-site`
- 기준 커밋: `a392349` (vlossom 2.1.0)
- 상태: 초안 (검토 대기)

## 1. 목표

Vlossom을 위한 공식 문서 사이트를 구축하고 배포한다. 사이트 안에서 컴포넌트가 실제로 동작해서, 사용자가 코드를 복사해 실행해보지 않고도 기능을 이해할 수 있어야 한다.

이 작업으로 얻으려는 것:

| # | 기대 효과 | 측정 가능한 형태 |
| --- | --- | --- |
| 1 | 가이드용 공식 배포 사이트 확보 | 공개 URL에서 컴포넌트 문서 접근 가능 |
| 2 | README를 더 디테일하게 유지 | Storybook에만 있던 예제가 README로 이전됨 |
| 3 | 스펙 문서 이원화 해소 | Storybook 제거 후 컴포넌트 스펙의 단일 출처가 README 하나 |
| 4 | AI 에이전트 친화 | MCP/LLM이 읽는 문서 = 사람이 읽는 문서 |

4번이 이 설계의 중심축이다. 사람용 사이트를 만들다가 기계용 계약을 깨면 목표 자체가 무너진다.

## 2. 현황 조사 결과

### 2.1 리포 구조

| # | 항목 | 현황 |
| --- | --- | --- |
| 1 | 모노레포 | 루트 `package.json` 없음. 패키지마다 독립 `pnpm-lock.yaml` |
| 2 | 패키지 | `packages/vlossom` (2.1.0), `packages/vlossom-mcp` (0.14.0) |
| 3 | Node / pnpm | `.nvmrc` 24.12.0 / pnpm 10 |
| 4 | CI | `ci.yml` (lint·build·storybook·test·mcp-test), `release-please.yml` |
| 5 | 배포 인프라 | 없음. Pages·Vercel·CNAME 설정 전무 |

### 2.2 문서 자산

| # | 항목 | 수치 |
| --- | --- | --- |
| 1 | 컴포넌트 | 53개 (`src/components/vs-*`) |
| 2 | README 파일 | 161개 (유닛마다 `README.md` + `README.ko.md`) |
| 3 | README의 html 예제 펜스 | 237개 |
| 4 | 문서 템플릿 | 유형별 `*_README_TEMPLATE.md` + `src/.claude/README_CHECK_LIST.md` |

### 2.3 Storybook 현황

| # | 항목 | 수치 |
| --- | --- | --- |
| 1 | 스토리 파일 | 48개 |
| 2 | 스토리(export) | **403개** (최대 `vs-table` 23개) |
| 3 | `play` 인터랙션 테스트 | **0개** |
| 4 | 애드온 | `@storybook/addon-docs`, `@storybook/addon-a11y` |
| 5 | 공용 컨트롤 헬퍼 | `src/storybook/args.ts` (순수 데이터 객체) |

### 2.4 playground 현황

`packages/vlossom/playground` — 1,748줄, view 6개(Basic/Inputs/DataDisplay/Overlay/ColorPalette/ColorScheme) + Sandbox + FormExample. `VsLayout`/`VsHeader`/`VsTabs`/`VsIndexView`/`VsThemeButton`/`ColorSchemePanel`로 구성된, 이미 검증된 쇼케이스.

## 3. 핵심 제약: MCP README 계약

`vlossom-mcp`는 README를 GitHub raw로 가져와 파싱하는 것이 **유일한 source of truth**다 (`src/services/github-registry-service.ts`). 계약 범위는 아래가 전부다.

| # | 항목 | 파싱 규칙 | 근거 |
| --- | --- | --- | --- |
| 1 | `description` | 맨 처음 나오는, `>`나 `#`로 시작하지 않는 비어있지 않은 줄 | `parseReadmeMeta` |
| 2 | `availableVersion` | `**Available Version**: ...` 정규식 | `parseReadmeMeta` |
| 3 | `props` | `## Props` 뒤 첫 번째 표 (`###` 한 단계 허용, `## `에서 중단) | `findFirstPropsTable` |
| 4 | `events` / `slots` / `methods` | `## X` 뒤 첫 번째 표 | `findSectionTable` |
| 5 | `types` | **README 아님.** 같은 폴더의 `types.ts`를 직접 읽음 | `fetchComponentMetaDirect` |

그 외 README의 모든 내용(산문, 추가 섹션, 코드펜스, HTML)은 파서에게 보이지 않는다.

### 3.1 유일하게 깨지는 것: frontmatter

README 최상단에 VitePress frontmatter(`---`)를 넣으면 `---`가 `>`도 `#`도 아니므로 **`description`이 `"---"`로 잡힌다.**

따라서 설계 제약은 "README를 건드리지 마라"가 아니라 **"README에 frontmatter를 넣지 마라"** 하나로 축소된다.

## 4. 결정 사항

| # | 항목 | 결정 | 근거 |
| --- | --- | --- | --- |
| 1 | 프레임워크 | VitePress | Vue 팀 표준. 컴포넌트 라이브러리 라이브 렌더 생태계가 여기 몰려 있음. VuePress 탈락 |
| 2 | VitePress 버전 | `2.0.0-alpha.20` **고정**(캐럿 없음) | 아래 4.1 |
| 3 | 패키지 배치 | `packages/docs` 신설 (독립 `pnpm-lock.yaml`) | 리포의 패키지별 독립 락파일 규칙을 따름 |
| 4 | README 노출 | `rewrites` — README 파일 자체가 라우트 | 복사본 0. 이원화가 구조적으로 불가능 |
| 5 | 라이브 데모 | `html live` 펜스 마커 opt-in | GitHub·MCP 양쪽에 투명 |
| 6 | 컨트롤 패널 | 컴포넌트당 Playground 블록 1개 | `src/storybook/args.ts` 재활용 |
| 7 | 데모 배치 | playground 배치 문법을 `<Demo>` 래퍼로 추출 | 검증된 자산 재사용 |
| 8 | 배포 | GitHub Pages (`base: '/vlossom/'`) | 비용 0, 외부 계정 불필요, 리포 내 완결 |
| 9 | Storybook | 이번 라운드에서 **제거하지 않음** | 사이트가 실제 서비스된 뒤 제거 |
| 10 | 한국어 문서 | 이번 라운드 **제외**, 라우팅만 확장 가능하게 설계 | 슬라이스 범위 관리 |

### 4.1 VitePress 2 alpha를 고르는 이유

| # | 패키지 | VitePress 1.6.4 (stable) | VitePress 2.0.0-alpha.20 | vlossom 2.1.0 |
| --- | --- | --- | --- | --- |
| 1 | `vite` | ^5.4.14 | **^8.2.1** | ^8.2.2 |
| 2 | `@vitejs/plugin-vue` | ^5.2.1 | **^6.0.8** | ^6.0.8 |
| 3 | `@vueuse/core` | ^12.4.0 | **^14.4.0** | ^14.4.0 |
| 4 | `vue` | ^3.5.13 | **^3.5.41** | ^3.5.42 |

안정 버전은 vlossom과 Vite 3 메이저 차이가 난다. alpha는 스택이 정확히 일치해서 vlossom을 **소스에서 직접 import**할 수 있다. 그러면 문서가 항상 HEAD를 반영하고 빌드 선행 단계가 사라진다.

부수 근거: 이 리포는 이미 Vite 8 / TypeScript 6 / ESLint 10 / Vitest 4 / Storybook 10으로 전부 최신을 달린다. alpha가 이례적인 선택이 아니다. 그리고 alpha의 고통은 프로토타입에서 겪는 게 가장 싸다.

위험 완화: 캐럿 없이 정확한 버전으로 고정한다. 슬라이스 규모가 작아 재작업 비용이 낮다.

## 5. 아키텍처

### 5.1 패키지 배치

```txt
packages/docs/
├── package.json           # vitepress 고정, vlossom을 link:../vlossom
├── pnpm-lock.yaml
├── .vitepress/
│   ├── config.ts          # root/srcDir/rewrites/base/transformPageData
│   ├── theme/
│   │   ├── index.ts       # createVlossom 등록, 다크모드 ↔ useVlossom().theme
│   │   ├── Demo.vue       # 라이브 데모 래퍼 (playground 배치 문법 추출)
│   │   └── Playground.vue # 프롭 컨트롤 블록
│   └── plugins/
│       ├── live-demo.ts     # html live 펜스 → 가상 모듈 SFC 컴파일
│       ├── link-rewrite.ts  # 상대 링크 재작성
│       └── readme-clean.ts  # ko 링크 줄 제거, 빈 표 숨김
└── pages/
    └── index.md           # 랜딩
```

vlossom 참조는 `link:../vlossom` + Vite alias로 `src/index.ts`를 직접 가리킨다.

### 5.2 README → 라우트 매핑

VitePress `root`를 `packages/docs`, `srcDir`을 `..`(= `packages/`)로 둔다.

| # | 원본 | 라우트 |
| --- | --- | --- |
| 1 | `packages/docs/pages/index.md` | `/` |
| 2 | `packages/vlossom/src/components/vs-button/README.md` | `/components/vs-button` |
| 3 | `packages/vlossom/src/components/vs-input/README.md` | `/components/vs-input` |
| 4 | `packages/vlossom/src/components/vs-table/README.md` | `/components/vs-table` |

랜딩·가이드 페이지는 `packages/docs/pages/`에 두어 라이브러리 소스를 오염시키지 않는다. `srcExclude`로 슬라이스 밖 README, `README.ko.md`, `CHANGELOG.md`, `dist/`, `storybook-static/`, `vlossom-mcp/**`를 잘라낸다.

**frontmatter는 README에 넣지 않는다.** 제목·레이아웃·설명은 `transformPageData` 훅에서 주입한다. 이것이 MCP `description` 추출을 지키는 방법이다.

한국어 라우팅은 이번에 구현하지 않지만, `rewrites`가 나중에 `/ko/components/:name`을 받을 수 있는 형태로 작성한다.

### 5.3 markdown transform 3종

| # | transform | 하는 일 | 이유 |
| --- | --- | --- | --- |
| 1 | `link-rewrite` | `../vs-loading/README.md` → `/components/vs-loading` | README의 상대 링크는 GitHub 기준이라 사이트에서 깨짐 |
| 2 | `readme-clean` (ko 링크) | 첫 줄 `> 한국어 문서는 …` 제거 | 모든 페이지 상단에 blockquote로 노출됨 |
| 3 | `readme-clean` (빈 표) | 헤더만 있는 표 숨김 | `vs-button`의 `## Events`/`## Methods`가 빈 표라 깨져 보임 |

### 5.4 라이브 데모 파이프라인

README 코드펜스의 info string 첫 토큰 뒤에 `live` 마커를 붙여 opt-in 한다.

````markdown
```html live
<template>
    <vs-button primary>Primary</vs-button>
</template>
```
````

| # | 소비자 | 결과 |
| --- | --- | --- |
| 1 | GitHub | 첫 토큰이 `html`이므로 렌더가 **지금과 완전히 동일** |
| 2 | vlossom-mcp | 코드펜스를 읽지 않으므로 **투명** |
| 3 | 문서 사이트 | markdown-it이 `live`를 읽어 라이브 데모 렌더 |

동작: markdown-it 펜스 렌더러가 `live` 마커를 감지 → Vite 가상 모듈로 SFC 컴파일 → `<Demo>` 래퍼가 **코드 블록 위에 실제 컴포넌트를 렌더**.

**opt-in이어야 하는 이유**: 전체 자동 렌더는 실제로 깨진다. `vs-button/README.md`에는 정의되지 않은 `await doSomething()`이 들어있다. 실행 가능한 예제만 켠다.

### 5.5 Playground 블록 (컨트롤 패널)

각 컴포넌트 문서 페이지 상단에 프롭을 조작하는 블록을 하나 둔다. Storybook `argTypes`의 대체다.

컨트롤 정의는 `packages/vlossom/src/storybook/args.ts`를 재활용한다. 이 파일은 Storybook 타입에 의존하지 않는 순수 데이터 객체(`colorScheme`, `inputPropsArgTypes`, `styleArgTypes` 등)라서 그대로 쓸 수 있다.

> Storybook 제거 시 이 파일은 `src/storybook/`에서 중립적인 위치로 옮기고 이름을 바꾼다. 이번 라운드에서는 위치를 옮기지 않고 import만 한다.

### 5.6 Demo 래퍼

`playground/views/Basic.vue`의 배치 문법을 추출한다.

- 변형 라벨 (`h4` + muted 텍스트)
- `vs-grid` / `vs-responsive` 반응형 배치
- `vs-divider`로 섹션 구분

새로 디자인하지 않고 검증된 배치를 그대로 쓴다.

### 5.7 MCP 계약 보호 (회귀 테스트)

README가 사람용 페이지가 되면 "문서를 다듬다가 파서를 깬다"가 현실적 위험이 된다.

`packages/vlossom-mcp`에 로컬 README 파싱 회귀 테스트를 추가한다. 검증 항목:

| # | 검증 | 실패 조건 예시 |
| --- | --- | --- |
| 1 | `description`이 실제 설명 문장인가 | frontmatter 추가 시 `"---"`가 잡힘 |
| 2 | `**Available Version**` 존재 | 라인 삭제 |
| 3 | `## Props` 뒤 첫 표 파싱 성공 | 표 앞에 `## ` 헤딩 삽입 |
| 4 | `## Events`/`## Slots`/`## Methods` 동일 | 상동 |

CI에 물린다. `ci.yml`의 `vlossom-mcp-test` 잡에 포함시킨다.

### 5.8 배포

`.github/workflows/docs.yml` 신규 추가.

| # | 트리거 | 동작 |
| --- | --- | --- |
| 1 | `main` push | 빌드 후 GitHub Pages 배포 |
| 2 | PR | 빌드만 (깨짐 감지) |

- `base: '/vlossom/'`
- URL: `https://vlossom-ui.github.io/vlossom/`
- **수동 선행 작업**: 리포 Settings → Pages를 **GitHub Actions 모드로 활성화**. 이것은 코드로 할 수 없으며 리포 관리자가 직접 해야 한다.

기존 `ci.yml`은 손대지 않는다. `vlossom-storybook` 잡도 그대로 둔다.

## 6. 이번 슬라이스 범위

### 6.1 포함

| # | 항목 |
| --- | --- |
| 1 | `packages/docs` 패키지 신설 |
| 2 | VsButton / VsInput / VsTable 3종 문서 페이지 |
| 3 | 라이브 데모 (대상 3종의 html 펜스 24개: button 6 / input 7 / table 11) |
| 4 | 컴포넌트당 Playground 컨트롤 블록 |
| 5 | Demo 래퍼 (playground 배치 문법 추출) |
| 6 | markdown transform 3종 |
| 7 | MCP 계약 회귀 테스트 |
| 8 | GitHub Pages 배포 + 공개 URL |

### 6.2 제외 (다음 라운드)

| # | 항목 | 이유 |
| --- | --- | --- |
| 1 | 나머지 50개 컴포넌트 | 슬라이스 검증 후 같은 틀로 반복 |
| 2 | Storybook 제거 (스토리 403개) | 사이트가 실제 서비스된 뒤 |
| 3 | Storybook 전용 예제 약 170개 이전 | 아래 7절 참조 |
| 4 | 한국어 i18n (`README.ko.md`) | 라우팅 확장 여지만 남김 |
| 5 | `/playground` 페이지 탑재 | Tailwind 의존 추가 비용 |
| 6 | a11y 검사 CI 이전 | 별도 작업 |

## 7. Storybook 대체 가능성 분석

Storybook이 실제로 쓰고 있는 기능 대비 문서 사이트의 대응.

| # | Storybook 기능 | 사용 현황 | 문서 사이트 대응 | 판정 |
| --- | --- | --- | --- | --- |
| 1 | 스토리 예제 | 403개 | 라이브 펜스로 이전 | 가능 |
| 2 | autodocs 프롭 표 | 전 컴포넌트 | README `## Props` 표가 대체. MCP와 단일화됨 | 가능 (개선) |
| 3 | `backgrounds` → 테마 | `useVlossom().theme` 연결 | VitePress 다크모드를 같은 훅에 연결 | 가능 |
| 4 | `viewport` | mobile/tablet/desktop | 데모 컨테이너 리사이즈 | 가능 |
| 5 | 한국어 스토리 설명 | 스토리마다 | `README.ko.md`로 흡수 | 가능 |
| 6 | `play` 인터랙션 테스트 | **0개** | 대응 불필요 | 해당 없음 |
| 7 | `argTypes` 컨트롤 패널 | 전면적 | Playground 블록 (5.5) | 대응 설계됨 |
| 8 | `addon-a11y` (axe) | 전역 활성 | **사이트로 안 옴** | **갭** |

### 7.1 a11y 갭

`addon-a11y`는 브라우저에서 axe를 돌린다. 문서 사이트에는 이 기능이 없다.

권장: 사이트에 복원하지 말고 **CI로 옮긴다**. vitest + axe-core 단위 테스트로 가면 "사람이 Storybook을 열어봤을 때만 도는" 현재보다 회귀 방지가 강해진다. 별도 작업으로 분리한다.

### 7.2 콘텐츠 이전 비용

| # | 항목 | 수치 |
| --- | --- | --- |
| 1 | Storybook 스토리 | 403개 |
| 2 | README의 html 예제 펜스 | 237개 |
| 3 | 차이 | **약 170개 예제를 새로 작성해야 함** |

`vs-button`만 봐도 스토리 12개 중 **Circle / Disabled / ColorScheme / PreDefinedStyleSet / Responsive 5개가 README에 예제로 없다** (Props 표에만 존재).

"README를 더 디테일하게 유지"는 다듬기가 아니라 **콘텐츠 이전 작업**이다. 이것이 Storybook 제거의 실제 가격이다.

슬라이스에서 이 작업의 건당 소요를 측정해 전체 견적의 근거로 삼는다.

## 8. 검증 순서와 후퇴 경로

위험이 큰 것부터 배치한다. 1·2단계가 이 설계의 생사를 가른다.

| # | 단계 | 통과 기준 | 실패 시 후퇴 |
| --- | --- | --- | --- |
| 1 | `srcDir`/`rewrites`로 README가 라우트로 잡히는가 | `/components/vs-button` 접근 가능 | `@include` 래퍼 방식 |
| 2 | `transformPageData`로 frontmatter 없이 제목·레이아웃 주입 | 제목·사이드바 정상 | `@include` 래퍼 방식 |
| 3 | vlossom을 소스에서 import해 렌더 | VsButton이 스타일까지 정상 | 빌드된 `dist/` 소비 + CI 빌드 선행 |
| 4 | 라이브 펜스 → 데모 렌더 | 버튼 클릭 동작 | 마커 방식 재설계 |
| 5 | Playground 컨트롤 블록 | 프롭 조작이 데모에 반영 | 정적 예제로 축소 |
| 6 | MCP 계약 회귀 테스트 | 통과 | (통과해야 함) |
| 7 | VsInput / VsTable 확장 | 3종 모두 정상 | 범위 축소 |
| 8 | GitHub Pages 배포 | 공개 URL 접속 | — |

`@include` 후퇴 방식: `packages/docs/pages/components/vs-button.md`가 frontmatter를 소유하고 VitePress include 지시자로 README를 포함한다. README는 완전히 무결하지만 라이브 데모를 예제 바로 옆이 아니라 페이지 위/아래에 몰아야 한다.

## 9. 위험

| # | 위험 | 영향 | 대응 |
| --- | --- | --- | --- |
| 1 | VitePress 2 alpha API 변경 | 재작업 | 정확한 버전 고정. 슬라이스 규모가 작아 재작업 비용 낮음 |
| 2 | `srcDir`이 root의 상위여서 VitePress가 거부 | 설계 전제 붕괴 | 8절 1단계에서 최우선 검증. `@include`로 후퇴 |
| 3 | 소스 직접 import 시 sass/tailwind 처리 누락 | 스타일 깨짐 | 8절 3단계. `dist/` 소비로 후퇴 |
| 4 | README 예제가 실행 불가 | 데모 런타임 에러 | 마커 opt-in으로 실행 가능한 것만 선택 |
| 5 | 문서 개선 중 MCP 파서 파손 | LLM이 잘못된 스펙을 학습 | 5.7 회귀 테스트를 CI에 물림 |
| 6 | Pages 수동 활성화 누락 | 배포 실패 | 구현 계획에 명시적 단계로 포함. 리포 관리자 작업 |

## 10. 가정과 열린 항목

| # | 항목 | 상태 |
| --- | --- | --- |
| 1 | 한국어 문서는 이번 라운드 제외 | **가정.** 명시적 반대 없었음. 라우팅 확장 여지는 남김 |
| 2 | `vs-input/README.md`에 `README.ko.md` 링크 줄 누락 | **미결.** `vs-button`·`vs-table`에는 있음. 프로젝트 자체 체크리스트 위반. 이번에 고칠지 미정 |
| 3 | 스펙 문서 위치가 루트 `docs/`라 `packages/docs`와 혼동 소지 | 감수. `superpowers/` 하위로 네임스페이스 분리됨 |
