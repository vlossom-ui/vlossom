# Vlossom 문서 사이트 프로토타입

- 작성일: 2026-09-29
- 브랜치: `feat/docs-site`
- 기준: `a392349` (vlossom 2.1.0)
- 성격: **가능성 검증용 프로토타입.** 완성품 아님

## 증명하려는 것 하나

> README 파일 하나를 그대로 소스로 두고, 그것이 곧 문서 페이지가 되고, 그 안에서 컴포넌트가 실제로 동작하고, 배포된다.

이게 되면 나머지는 반복 작업이다. 안 되면 방향을 바꾼다.

## 만드는 것

| # | 항목 | 내용 |
| --- | --- | --- |
| 1 | `packages/docs` | VitePress 패키지 신설 |
| 2 | README = 페이지 | `rewrites`로 README 파일을 라우트에 직접 매핑. 복사본 없음 |
| 3 | 라이브 데모 | 코드펜스에 `live` 마커를 붙인 예제가 실제 컴포넌트로 렌더 |
| 4 | 배포 | GitHub Pages, `https://vlossom-ui.github.io/vlossom/` |

라이브 데모는 **전 컴포넌트 51개**에 단다. 실행 불가능한 예제 2개만 정적으로 남긴다.

데모가 필요로 하는 변수는 두 곳에서 온다.

| # | 출처 | 내용 |
| --- | --- | --- |
| 1 | README 예제의 `<script setup>` | 페이지 스코프로 끌어올린다. 과일 배열·테이블 컬럼 등 문서가 이미 적어둔 데이터를 그대로 쓴다 |
| 2 | `demo-scope.ts` | README가 선언하지 않는 것(`handleClick`, `isOpen` 등) 16개 컴포넌트분. 같은 이름이면 이쪽이 이긴다 |

## 2차 확장

리뷰 후 아래를 추가했다.

| # | 항목 | 내용 |
| --- | --- | --- |
| 1 | **다크 테마 연동** | VitePress `html.dark` ↔ vlossom `html.vs-dark`. 이게 없으면 문서만 어두워지고 컴포넌트는 밝은 채로 남는다 |
| 2 | **컬러 스킴 스위처** | 컴포넌트 페이지 상단 19색 바. 고르면 그 페이지의 모든 데모에 `colorScheme` 적용 |
| 3 | **컬러 팔레트 페이지** | `/palette`. 19색 × 11스텝 × 3토큰. playground의 ColorPalette를 옮겨왔다 |
| 4 | **컴포넌트 외 유닛** | composables 21 / directives 2 / plugins 5 / utils 1 |
| 5 | **한국어 i18n** | `README.ko.md`를 `/ko` 아래로. 언어 스위처 포함 |

결과: **164페이지 / 데모 470개 / JS 에러 0건**

### 연동에서 걸린 것 2가지

1. **`createVlossom()`은 인스턴스가 아니라 `{ install }`을 돌려준다.** 반환값에 `.theme`이나 `.colorScheme`을 써도 아무 일도 일어나지 않는다. 실제 인스턴스는 `useVlossom()`이 주며, inject가 아니라 모듈 싱글턴이라 setup 밖에서도 부를 수 있다.
2. **VitePress 2의 `useData()`에는 `isDark`가 없다.** 1.x에서 바뀌었다. `html` 클래스를 MutationObserver로 관찰하면 버전에 의존하지 않는다.

> `README.ko.md`는 MCP 계약 밖이다. 파서는 `README.md`만 읽는다. ko 문서는 섹션 헤딩도 한국어(`## 이벤트` 등)라 영문 계약과 형태가 다르다.

## 안 만드는 것

프로토타입이므로 아래는 전부 뺀다. 가능성 증명에 필요 없고, 하나씩이 별도의 설계 거리다.

| # | 제외 | 이유 |
| --- | --- | --- |
| 1 | Playground 컨트롤 패널 | 그 자체로 하위 시스템. 가능성 증명과 무관 |
| 2 | MCP 계약 회귀 테스트 | 장기 유지보수용 안전망. 지금은 계약을 "지키기만" 하면 됨 |
| 3 | 빈 표 숨김 | 보기 다듬기. `vs-button`의 `## Events`/`## Methods`가 헤더만 있는 채로 노출된다 |
| 4 | VsTable 라이브 데모 | 예제가 검색·페이징·서버모드까지 물려 있어 무거움 |
| 5 | Storybook 제거 | 사이트가 실제로 서비스된 뒤에 할 일 |
| 6 | 한국어 i18n | 다음 라운드 |
| 7 | 모노레포 배선 (`link:`, Vite alias) | 아래 참조 |

## 기술 결정 3개

### 1. vlossom을 npm에서 받는다

`packages/docs`는 `vlossom@2.1.0`을 **npm에서 그냥 설치**한다. `link:../vlossom`도, Vite alias도, 빌드 순서 의존도 없다.

이유: 워크스페이스 링크는 Vue 중복 인스턴스·sass/tailwind 파이프라인·빌드 선행 같은 문제를 한꺼번에 끌고 온다. 프로토타입에서 그걸 디버깅할 이유가 없다. 게다가 npm 패키지를 쓰는 것이 실제 사용자 경험과 같다.

대가: 문서가 HEAD가 아니라 릴리스된 2.1.0을 반영한다. 지금은 main이 곧 2.1.0이라 차이가 없다.

### 2. VitePress는 `2.0.0-alpha.20` 고정

vlossom의 peer 요구(`@vueuse/core ^14`, `vue ^3.5`)와 정확히 맞는다. 안정판 1.6.4는 `@vueuse/core ^12`라 중복 설치가 생긴다.

### 3. README에 frontmatter를 넣지 않는다

`vlossom-mcp`는 README를 파싱해 컴포넌트 메타를 만든다. `description`을 **"맨 처음 나오는, `>`나 `#`로 시작하지 않는 줄"** 로 잡기 때문에, 최상단에 `---`를 넣으면 description이 `"---"`가 된다.

제목·레이아웃은 `transformPageData` 훅으로 주입한다.

MCP 계약에서 건드리면 안 되는 것은 이게 전부다:

| # | 항목 | 규칙 |
| --- | --- | --- |
| 1 | `description` | 첫 번째 비-`>`, 비-`#`, 비어있지 않은 줄 |
| 2 | `availableVersion` | `**Available Version**:` 라인 |
| 3 | `props` | `## Props` 뒤 첫 표 |
| 4 | `events`/`slots`/`methods` | `## X` 뒤 첫 표 |

섹션 추가, 산문, 코드펜스는 파서에 보이지 않는다.

## 라이브 데모가 동작하는 방식

코드펜스 info string에 `live`를 붙인다. 첫 토큰은 `html` 그대로라서 **GitHub 렌더는 지금과 동일**하고, MCP는 코드펜스를 읽지 않으므로 **영향 없다**.

````markdown
```html live
<template>
    <vs-button primary>Primary</vs-button>
</template>
```
````

VitePress는 마크다운 페이지를 Vue SFC 템플릿으로 컴파일한다. 이 성질을 이용해, `live` 펜스의 `<template>` 내용을 **HTML로 그대로 흘려보내면** Vue가 알아서 실제 컴포넌트로 컴파일한다. 가상 모듈도, SFC 런타임 컴파일도 필요 없다.

데모가 필요로 하는 변수(`text`, `email` 등)는 README가 아니라 docs 패키지의 작은 스코프 파일에 모아두고, 페이지 상단에 `<script setup>`으로 주입한다. README는 손대지 않는다.

## 검증 결과

| # | 확인 | 결과 |
| --- | --- | --- |
| 1 | `rewrites`로 README가 라우트로 잡히는가 | 통과. 컴포넌트 52개 + 랜딩 = 53페이지 생성 |
| 2 | frontmatter 없이 제목·사이드바가 나오는가 | 통과. VitePress가 첫 `#` 헤딩에서 제목을 뽑아 `transformPageData`도 불필요했다 |
| 3 | vlossom 컴포넌트가 스타일까지 렌더되는가 | 통과. 단 클라이언트 등록 필요 (아래 참조) |
| 4 | `live` 펜스가 동작하는 데모가 되는가 | 통과. 51개 페이지에 데모 **235개**, JS 에러 0건 |
| 5 | MCP 계약이 유지되는가 | 통과. README 변경은 펜스 마커 **223줄**이 전부. 51개 전수 검사 통과 |
| 6 | GitHub Pages 배포 | 워크플로 작성 완료. Pages 활성화 대기 |

### 전 컴포넌트 확장에서 걸린 것 5가지

| # | 문제 | 대응 |
| --- | --- | --- |
| 1 | 예제의 이미지 경로(`/profile.png`)를 Vite가 에셋 import로 바꾸려다 빌드 실패 | 데모 렌더에서만 인라인 SVG 플레이스홀더로 치환. `broken.png`는 폴백 예제라 그대로 |
| 2 | `vs-layout` 예제의 맨몸 `<slot />`이 SSR에서 `renderSlot(null)`로 터짐 | 슬롯 아웃렛을 자리 표시 요소로 치환 |
| 3 | `vs-render` 예제가 없는 파일(`./Greeting.vue`)을 import | 상대 경로 import는 버리고 `demo-scope`가 `h()`로 대체 컴포넌트 공급 |
| 4 | 모달·드로어처럼 열기 전엔 아무것도 안 그리는 예제가 빈 상자로 남음 | `.vs-demo:empty { display: none }` — 코드 블록만 보여준다 |
| 5 | `vs-table`의 `item.user.id` 예제는 데이터에 `user`가 없어 런타임 에러 | 해당 펜스만 `live` 해제 |

### 구현하며 드러난 것 3가지

1. **중첩 `<template>`** — 슬롯(`<template #prepend>`)이 들어간 예제는 non-greedy 정규식으로 자르면 깨진다. 마지막 닫는 태그 기준으로 잘라야 한다.
2. **상대 링크는 선택이 아니라 필수** — README의 `../vs-xxx/README.md` 링크 28개가 VitePress 빌드를 실패시킨다(dead link 검사). 앵커(`#types`)까지 포함해 재작성해야 한다. "나중에 다듬기"로 미룰 수 없는 항목이었다.
3. **vlossom은 import 시점에 `document`를 건드린다** — 오버레이 키 이벤트 리스너 때문에 SSR 렌더 단계에서 터진다. 테마에서 정적 import 대신 `enhanceApp` 안의 동적 import로 미루고, 데모는 `<ClientOnly>`로 감싼다.

## 사람이 해야 하는 일

리포 Settings → Pages를 **GitHub Actions 모드로 활성화**. 코드로 할 수 없다.
