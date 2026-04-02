# Vlossom MCP — Next Phase Plan

**작성일**: 2026-04-02  
**현재 버전**: 0.2.0 (npm `vlossom-mcp`)  
**브랜치**: feat/mcp

---

## 예상 INPUT / OUTPUT 사례

전체 Phase가 완성됐을 때 사용자가 경험하게 될 흐름입니다.

---

### 사례 1 — 간단: 컴포넌트 목록 조회

**INPUT**

```
"vlossom에 어떤 컴포넌트들이 있어?"
```

**도구 호출**

```
✔ 1. 컴포넌트 목록 조회   list_components   38ms
```

**OUTPUT**

```
Vlossom에는 총 50개의 컴포넌트가 있습니다.

폼 입력: VsInput, VsTextarea, VsSelect, VsCheckbox, VsRadio, VsSwitch ...
레이아웃: VsLayout, VsHeader, VsFooter, VsDrawer, VsContainer ...
피드백: VsModal, VsToast, VsLoading, VsSkeleton ...

사용된 도구: list_components · 총 38ms
```

---

### 사례 2 — 중간: 컴포넌트 상세 조회

**INPUT**

```
"VsSelect props랑 StyleSet 알려줘"
```

**도구 호출**

```
✔ 1. 컴포넌트 상세 조회   get_component("VsSelect")               52ms
✔ 2. 조합 관계 확인       get_component_relationships("VsSelect")  31ms
```

**OUTPUT**

```
## VsSelect

### Props
| Prop        | Type    | Default | Description      |
|-------------|---------|---------|------------------|
| modelValue  | any     | -       | 선택된 값        |
| options     | array   | []      | 옵션 목록        |
| multiple    | boolean | false   | 다중 선택 여부   |
| searchable  | boolean | false   | 검색 기능 활성화 |

### StyleSet
variables:
  height?: string
  selected.backgroundColor?: string
  focused.border?: string
component?: CSSProperties
option?: CSSProperties

### 함께 쓰이는 컴포넌트
VsForm (상위), VsInputWrapper (내부), VsChip (multiple 모드)

사용된 도구: get_component · get_component_relationships · 총 83ms
```

---

### 사례 3 — 복잡: 코드 생성

**INPUT**

```
"이메일이랑 비밀번호 입력받는 로그인 폼 만들어줘. 유효성 검사도 있으면 좋겠어"
```

**도구 호출**

```
✔ 1. 관련 컴포넌트 탐색   suggest_components("로그인 폼, 유효성 검사")    89ms
✔ 2. VsForm 상세 조회     get_component("VsForm")                         44ms
✔ 3. VsInput 상세 조회    get_component("VsInput")                        41ms
✔ 4. VsButton 상세 조회   get_component("VsButton")                       39ms
✔ 5. 조합 관계 확인       get_component_relationships("VsForm")            33ms
✔ 6. 코드 생성            generate_component_code                         872ms
```

**OUTPUT**

````
```vue
<template>
    <vs-form ref="formRef">
        <vs-input
            v-model="email"
            label="이메일"
            :rules="[emailRule]"
            placeholder="example@email.com"
        />
        <vs-input
            v-model="password"
            label="비밀번호"
            type="password"
            :rules="[required]"
        />
        <vs-button @click="handleSubmit" :loading="isLoading">
            로그인
        </vs-button>
    </vs-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref()
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const emailRule = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || '올바른 이메일 형식이 아닙니다'
const required = (v: string) => !!v || '필수 입력 항목입니다'

async function handleSubmit() {
    const valid = await formRef.value?.validate()
    if (!valid) return
    // ...
}
</script>
```

사용된 도구: suggest_components · get_component ×3 · get_component_relationships · generate_component_code · 총 1.1s
````

---

## 현재 상태 요약

원래 계획(2026-03-23) 대비 구현 현황:

| 도구                          | 원래 계획        | 현재 상태                              |
| ----------------------------- | ---------------- | -------------------------------------- |
| `list_components`             | ✅ 계획          | ✅ 구현됨                              |
| `draft_issue`                 | ✅ 계획 (action) | ✅ 구현됨 (language 지원, 섹션 구조화) |
| `report_issue`                | ✅ 계획 (action) | ✅ 구현됨 (sectionContents 방식)       |
| `set_github_token`            | ✅ 계획          | ✅ 구현됨                              |
| `check_github_token`          | ✅ 계획          | ✅ 구현됨                              |
| `search_components`           | ✅ 계획          | ❌ 미구현                              |
| `suggest_components`          | ✅ 계획          | ❌ 미구현                              |
| `get_component`               | ✅ 계획          | ❌ 미구현                              |
| `get_style_set`               | ✅ 계획          | ❌ 미구현                              |
| `get_component_relationships` | ✅ 계획          | ❌ 미구현                              |
| `adapt_type_to_component`     | ✅ 계획          | ❌ 미구현                              |
| `generate_component_code`     | ✅ 계획          | ❌ 미구현                              |
| `validate_component_usage`    | ✅ 계획          | ❌ 미구현                              |
| `get_version_info`            | ✅ 계획          | ❌ 미구현                              |

### 현재 데이터 구조의 한계

`components-data.json`은 이름·kebab·설명만 포함하며 AI가 실제로 컴포넌트를 사용하기 위해 필요한 정보가 없습니다:

```json
{ "name": "VsButton", "kebabName": "vs-button", "description": "..." }
```

원래 계획의 `components-meta.json`은 props, StyleSet, events, slots, relationships까지 포함해야 합니다.

---

## 기술 스택 확정

원래 계획은 .NET → Node.js로 변경. 현재 Node.js TypeScript로 npm 패키지 배포 중.

| 항목            | 현재 확정                                        |
| --------------- | ------------------------------------------------ |
| 런타임          | Node.js 18+                                      |
| 언어            | TypeScript                                       |
| MCP SDK         | `@modelcontextprotocol/sdk`                      |
| 배포 방식       | `npx vlossom-mcp` (stdio transport)              |
| 메타데이터 파싱 | `remark` (Markdown), `ts-morph` (TypeScript AST) |

---

## Phase 1: 메타데이터 파이프라인 구축 ← **최우선**

현재 `list_components`는 이름과 설명만 반환합니다. `get_component`, `search_components`, `generate_component_code` 모두 풍부한 메타데이터가 필요하므로 **파이프라인이 모든 후속 도구의 선결 조건**입니다.

### 목표: `scripts/build-meta.mjs` 구현

README.md + types.ts를 파싱해서 `src/data/components-meta.json` 생성.

#### 파싱 대상 (README.md)

```
## Props      → prop 목록 (name, type, default, required, description)
## Types      → StyleSet 인터페이스 (TypeScript 코드 블록)
## Events     → 이벤트 목록 (name, payload, description)
## Slots      → 슬롯 목록 (name, description)
## Methods    → 메서드 목록 (name, params, description)
```

#### 파싱 대상 (types.ts) — ts-morph 사용

```
Vs{Name}StyleSet 인터페이스
  → variables?: { ... }     CSS 변수
  → component?: CSSProperties
  → 하위 컴포넌트 StyleSet 참조 (loading?: VsLoadingStyleSet)
```

#### 출력 스키마 (components-meta.json)

```typescript
interface ComponentMeta {
  name: string; // "VsButton"
  kebabName: string; // "vs-button"
  description: string;
  availableVersion: string; // "2.0.0+"
  props: PropMeta[];
  styleSet: StyleSetMeta;
  events: EventMeta[];
  slots: SlotMeta[];
  methods: MethodMeta[];
}

interface PropMeta {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
}

interface StyleSetMeta {
  variables: Record<string, string>; // property → type
  component: boolean; // CSSProperties 지원 여부
  childRefs: string[]; // ["VsLoadingStyleSet", ...]
  raw: string; // 원본 TypeScript 인터페이스 문자열
}
```

#### 파이프라인 실행 시점

- `npm run generate` — 로컬 개발 시 수동 실행
- `prepublishOnly` — 배포 전 자동 실행 (현재와 동일한 흐름)

---

## Phase 2: 핵심 조회 도구

파이프라인 완성 후 즉시 구현 가능한 도구들. 이 도구들이 MCP의 핵심 가치입니다.

### `get_component`

**우선순위**: 🔴 최고

컴포넌트 이름을 받아 props, StyleSet, events, slots 전체 정보를 반환합니다. AI가 정확한 코드를 생성하기 위한 핵심 도구입니다.

```typescript
입력: {
  name: string;
} // "VsButton" 또는 "vs-button"
출력: ComponentMeta; // props, styleSet, events, slots
```

### `search_components`

**우선순위**: 🔴 최고

키워드로 컴포넌트를 검색합니다. `list_components`와의 차이는 name/description/props 전체를 검색 대상으로 합니다.

```typescript
입력: { query: string }
출력: ComponentMeta[]           // 관련 컴포넌트 목록
```

### `suggest_components`

**우선순위**: 🟡 중간

자연어 사용 사례를 받아 관련 컴포넌트를 추천합니다. `search_components`가 키워드 매칭이라면 이것은 의도 기반 추천입니다.

```typescript
입력: { useCase: string }       // "로그인 폼 만들기", "파일 업로드 기능"
출력: { components: ComponentMeta[], reasoning: string }
```

> 서버가 직접 추론하지 않고 description + props 컨텍스트를 LLM에게 전달. 실제 추천은 LLM이 수행.

### `get_component_relationships`

**우선순위**: 🟡 중간

컴포넌트 조합 관계를 반환합니다. `scripts/relationships.json` (수동 관리) 파일 기반.

```typescript
입력: { name: string }
출력: {
    parent: string[];           // 이 컴포넌트를 감싸는 컴포넌트
    children: string[];         // 이 컴포넌트 내에서 사용하는 컴포넌트
    siblings: string[];         // 함께 자주 쓰이는 컴포넌트
}
```

**예시 relationships.json 엔트리:**

```json
{
  "VsForm": {
    "children": ["VsInput", "VsSelect", "VsCheckbox", "VsRadio", "VsTextarea"],
    "siblings": ["VsButton"]
  },
  "VsLayout": {
    "children": ["VsHeader", "VsFooter", "VsDrawer", "VsContainer"]
  }
}
```

### `compare_components`

**우선순위**: 🟡 중간 | **영감 출처**: PrimeVue

두 컴포넌트를 나란히 비교하여 props, 용도, 차이점을 반환합니다.

```typescript
입력: { a: string; b: string }   // "VsModal", "VsDrawer"
출력: {
    a: ComponentMeta;
    b: ComponentMeta;
    differences: string[];        // 핵심 차이점 요약
    recommendation: string;       // 어떤 상황에 어떤 컴포넌트를 쓸지
}
```

> 사용 예: "VsModal vs VsDrawer 언제 뭘 써야 해?" / "VsInput vs VsSearchInput 차이는?"

### `get_component_source`

**우선순위**: 🟡 중간 | **영감 출처**: shadcn/v0 Registry

컴포넌트의 Vue 소스 파일을 직접 반환합니다. AI가 실제 구현을 보고 정확한 활용 코드를 생성할 수 있습니다.

```typescript
입력: {
  name: string;
}
출력: {
  source: string; // Vs{Name}.vue 소스 코드
  path: string; // 파일 경로
}
```

> `get_component`가 파싱된 메타데이터를 제공한다면, `get_component_source`는 원본 소스를 그대로 전달하여 파서가 놓친 케이스까지 커버합니다.

### `get_directive`

**우선순위**: 🟡 중간 | **영감 출처**: Vuetify

Vlossom 디렉티브(`v-vs-scroll-shadow` 등)의 사용법과 옵션을 반환합니다.

```typescript
입력: { name?: string }          // 생략 시 전체 디렉티브 목록
출력: {
    name: string;                 // "v-vs-scroll-shadow"
    description: string;
    options: DirectiveOption[];
    example: string;
}
```

### `get_composables`

**우선순위**: 🟢 낮음 | **관련 이슈**: #381

`useColorScheme`, `useStyleSet` 등 공개 컴포저블과 유틸리티 함수의 사용법을 반환합니다.

```typescript
입력: { name?: string }          // 생략 시 전체 목록
출력: {
    name: string;                 // "useColorScheme"
    isPublic: boolean;            // 외부 사용 가능 여부
    signature: string;            // TypeScript 시그니처
    description: string;
    example: string;
}
```

---

## Phase 2-B: 스타일 시스템 도구

### `get_css_tokens`

**우선순위**: 🟠 높음 | **영감 출처**: Ant Design `antd_token`

`--vs-*` CSS 변수 전체 목록과 기본값, 라이트/다크 분기를 반환합니다. AI가 하드코딩 대신 항상 올바른 토큰을 사용하는 코드를 생성하게 합니다.

```typescript
입력: { category?: "color" | "size" | "radius" | "shadow" | "all" }
출력: Array<{
    name: string;                 // "--vs-comp-bg"
    defaultValue: string;
    darkValue?: string;
    category: string;
    description: string;
}>
```

> 사용 예: "다크모드에서 배경색 변수가 뭐야?" / "Vlossom에서 쓸 수 있는 컬러 토큰 목록"

### `get_vlossom_options`

**우선순위**: 🟠 높음

`createVlossom()` 플러그인 등록 시 사용할 수 있는 옵션(글로벌 StyleSet, 기본 colorScheme 등)을 반환합니다.

```typescript
입력: {}
출력: {
    options: VlossomOption[];     // name, type, default, description
    example: string;              // createVlossom({ ... }) 사용 예시
}
```

> 사용 예: "모든 버튼 기본 padding 바꾸고 싶어" / "앱 전체 colorScheme을 'blue'로 설정하려면?"

---

## Phase 3: 코드 생성 도구

### `generate_component_code`

**우선순위**: 🟠 높음

요구사항을 받아 Vlossom 컴포넌트를 사용한 Vue 코드를 생성합니다.

```typescript
입력: {
    description: string;         // "이메일, 비밀번호 로그인 폼"
    components?: string[];        // 사용할 컴포넌트 힌트 (선택)
    stylePreference?: string;     // 스타일 설명 (선택)
}
출력: {
    code: string;                 // 완성된 Vue SFC 코드
    usedComponents: string[];     // 사용된 컴포넌트 목록
    explanation: string;
}
```

> 서버는 관련 컴포넌트들의 props + StyleSet + 사용 예제를 컨텍스트로 조합해서 LLM에게 전달. 실제 코드 생성은 LLM이 수행.

### `adapt_type_to_component`

**우선순위**: 🟠 높음

개발자가 이미 가진 TypeScript 타입을 Vlossom 컴포넌트에 맞게 변환합니다.

```typescript
입력: {
  userType: string; // "interface User { id: string; name: string; email: string }"
  targetComponent: string; // "VsTable"
  mode: "data" | "style" | "auto";
}
출력: {
  converted: string; // 변환된 코드 (columns 배열 등)
  explanation: string;
}
```

### `generate_style_set`

**우선순위**: 🟠 높음

StyleSet 철학(`variables` vs `component` vs child ref)을 자동 적용하여 올바른 StyleSet 코드를 생성합니다. 잘못된 위치에 속성을 넣는 흔한 실수를 방지합니다.

```typescript
입력: {
  component: string; // "VsButton"
  requirements: string; // "배경색 빨간색, padding 넓게, loading 스피너 작게"
}
출력: {
  styleSet: string; // 완성된 StyleSet 객체 코드
  explanation: string; // variables/component/child 분류 이유
}
```

### `get_form_recipe`

**우선순위**: 🟡 중간

일반적인 폼 패턴의 완성 코드를 제공합니다. `VsForm` + rules 조합 방식을 자연스럽게 보여줍니다.

```typescript
입력: {
    type: "login" | "signup" | "search" | "file-upload" | "contact"
    language?: "ko" | "en"
}
출력: {
    code: string;                 // 완성된 Vue SFC 코드
    components: string[];         // 사용된 컴포넌트 목록
    notes: string;                // 커스터마이징 포인트 안내
}
```

### `validate_component_usage`

**우선순위**: 🟢 낮음 (Phase 3 후반)

작성된 코드가 Vlossom 컴포넌트를 올바르게 사용하는지 검증합니다.

```typescript
입력: {
  code: string;
}
출력: {
  valid: boolean;
  issues: {
    component: string;
    issue: string;
    suggestion: string;
  }
  [];
}
```

---

## Phase 3-B: 진단 도구

### `diagnose_issue`

**우선순위**: 🟡 중간 | **관련 이슈**: #390, #385

증상을 설명하면 알려진 GitHub 이슈와 매칭하고 해결책을 제안합니다. 현재 오픈 이슈 데이터를 메타데이터로 번들하여 활용합니다.

```typescript
입력: {
    symptom: string;              // "VsTable에서 loading prop 줬는데 no data가 나와"
    component?: string;           // 관련 컴포넌트 힌트 (선택)
}
출력: {
    matchedIssues: Array<{
        number: number;
        title: string;
        url: string;
        status: "open" | "closed";
        resolution?: string;      // 해결된 경우 해결 방법
    }>;
    suggestion: string;           // AI 기반 해결 제안
}
```

---

## 추가 인사이트 및 제안

### 1. Tool Description 최적화

현재 tool description이 기능 중심으로 작성되어 있습니다. LLM은 "어떤 상황에서 이 도구를 호출해야 하는지" 기준으로 도구를 선택합니다. 각 도구의 description에 트리거 조건을 명시하는 것을 권장합니다.

```typescript
// 현재
"List all Vlossom components with their descriptions."

// 제안
"Call this FIRST when the user asks about available components,
 or when you need to find which component to use for a given UI element.
 Returns all component names and one-line descriptions."
```

### 2. 도구 호출 흐름 가이드

`server.ts`의 server instructions(시스템 프롬프트)에 AI가 따라야 할 호출 흐름을 명시합니다:

```
"컴포넌트 코드 작성 요청"
  → suggest_components (어떤 컴포넌트가 필요한가?)
  → get_component (각 컴포넌트의 props/StyleSet 확인)
  → get_component_relationships (조합 구조 확인)
  → generate_component_code (코드 생성)
```

### 3. StyleSet 변경 사항 반영

PR #303 이후 StyleSet 구조가 대폭 변경됨 (`SizeStyleSet`, `BoxStyleSet` 상속 제거 → `variables`, `component`, child refs 구조).

파이프라인이 **새 StyleSet 패턴을 올바르게 파싱**하도록 설계해야 합니다. 특히 `raw` 필드(원본 인터페이스 문자열)를 함께 저장하면, 파서가 놓친 케이스도 LLM이 직접 읽어서 처리할 수 있습니다.

### 4. `get_component` 캐싱 전략

50개 컴포넌트 전체 메타데이터를 서버 시작 시 메모리에 로드. `list_components`는 현재 이미 캐싱 중이므로 같은 패턴 유지.

### 5. 시맨틱 검색 확장점 (장기)

원래 계획대로 `extension/semantic.ts` stub을 유지합니다. `search_components`가 단순 문자열 매칭으로 시작하더라도, 나중에 임베딩 기반으로 교체할 때 도구 인터페이스 변경 없이 내부 구현만 스왑 가능하도록 설계합니다.

---

## Phase 4: 인터랙티브 프롬프팅 UX

### 배경

`draft_issue → 사용자와 대화 → report_issue` 흐름처럼, vlossom-mcp의 도구들은 이미 AI 어시스턴트를 통해 자연스럽게 대화형으로 동작합니다. 별도 CLI 모드가 필요한 것이 아니라, **이 인터랙티브한 흐름 위에서 사용자 경험을 향상**시키는 것이 목표입니다.

두 가지를 개선합니다:

1. 여러 도구가 순차 호출될 때 **각 단계를 AI가 시각적으로 표현**할 수 있도록 MCP 응답에 단계 정보 포함
2. 최종 결과와 함께 **어떤 도구들이 사용됐는지 brief** 표시

---

### 4-1. Stepper 정보 MCP 응답에 포함

여러 도구가 순차 호출되는 작업에서, 각 도구가 응답 시 `_steps` 필드로 지금까지의 진행 단계를 포함합니다. AI 어시스턴트가 이 정보를 받아 대화 중에 자연스럽게 단계 진행 상황을 표현합니다.

```typescript
// mcp-response.ts 확장
export interface McpResponseMeta {
  steps: StepInfo[];
  toolsUsed: string[];
  totalDurationMs: number;
}

export interface StepInfo {
  step: number;
  label: string; // "VsInput 상세 조회"
  tool: string; // "get_component"
  durationMs: number;
}
```

AI 어시스턴트가 `_meta.steps`를 받으면 아래처럼 표현할 수 있습니다:

```
✔ 1. 컴포넌트 탐색       search_components       127ms
✔ 2. VsInput 상세 조회   get_component            43ms
✔ 3. VsButton 상세 조회  get_component            41ms
✔ 4. 조합 관계 확인      get_component_relationships  38ms
✔ 5. 코드 생성           generate_component_code  951ms
```

---

### 4-2. Tool Attribution (결과 브리프)

모든 도구 응답 하단에 `_meta.toolsUsed`를 포함해서, AI 어시스턴트가 결과와 함께 어떤 도구들이 사용됐는지 brief로 표시합니다.

```
사용된 도구: search_components · get_component ×2 · get_component_relationships · generate_component_code
소요 시간: 총 1.2s
```

---

### 4-3. 파일 변경 (Phase 4)

```
src/utils/
└── mcp-response.ts   ← McpResponseMeta, StepInfo 타입 추가 및 헬퍼 확장
```

---

## 구현 순서 요약

```
[완료] 0.1.x — list_components, issue tools
[완료] 0.2.0 — JSON 데이터 전환, issue 하네스 개선, i18n

[다음] 0.3.0 — build-meta 파이프라인 + get_component + search_components
[이후] 0.4.0 — suggest_components + get_component_relationships + compare_components
[이후] 0.5.0 — get_component_source + get_directive + get_composables
[이후] 0.6.0 — get_css_tokens + get_vlossom_options
[이후] 0.7.0 — generate_component_code + generate_style_set + adapt_type_to_component
[이후] 0.8.0 — get_form_recipe + diagnose_issue
[이후] 0.9.0 — Stepper 정보 MCP 응답 포함 + Tool Attribution
[장기] 1.0.0 — validate_component_usage + 시맨틱 검색 + MCP Prompts
```

---

## 파일 구조 목표 (1.0.0)

```
packages/vlossom-mcp/
├── scripts/
│   ├── generate-components.mjs     ← 현재 (단순 목록)
│   ├── build-meta.mjs              ← 신규: README + types.ts 파서
│   ├── build-tokens.mjs            ← 신규: CSS 변수 추출 스크립트
│   └── relationships.json          ← 신규: 컴포넌트 조합 관계 (수동 관리)
├── src/
│   ├── data/
│   │   ├── components-data.json    ← 현재 (단순 목록, 폴백용 유지)
│   │   ├── components-meta.json    ← 신규: 풍부한 메타데이터
│   │   ├── css-tokens.json         ← 신규: --vs-* 변수 전체 목록
│   │   └── known-issues.json       ← 신규: diagnose_issue용 이슈 데이터
│   ├── services/
│   │   ├── component-registry.ts   ← 현재
│   │   └── meta-registry.ts        ← 신규: components-meta.json 로더
│   ├── tools/
│   │   ├── list-components.ts      ← 현재
│   │   ├── get-component.ts        ← 신규 (Phase 2)
│   │   ├── get-component-source.ts ← 신규 (Phase 2)
│   │   ├── search-components.ts    ← 신규 (Phase 2)
│   │   ├── suggest-components.ts   ← 신규 (Phase 2)
│   │   ├── compare-components.ts   ← 신규 (Phase 2)
│   │   ├── get-relationships.ts    ← 신규 (Phase 2)
│   │   ├── get-directive.ts        ← 신규 (Phase 2)
│   │   ├── get-composables.ts      ← 신규 (Phase 2)
│   │   ├── get-css-tokens.ts       ← 신규 (Phase 2-B)
│   │   ├── get-vlossom-options.ts  ← 신규 (Phase 2-B)
│   │   ├── generate-code.ts        ← 신규 (Phase 3)
│   │   ├── generate-style-set.ts   ← 신규 (Phase 3)
│   │   ├── get-form-recipe.ts      ← 신규 (Phase 3)
│   │   ├── adapt-type.ts           ← 신규 (Phase 3)
│   │   ├── diagnose-issue.ts       ← 신규 (Phase 3-B)
│   │   ├── draft-issue.ts          ← 현재
│   │   ├── report-issue.ts         ← 현재
│   │   ├── set-github-token.ts     ← 현재
│   │   └── check-github-token.ts   ← 현재
│   └── types/
│       ├── issue.ts                ← 현재
│       └── meta.ts                 ← 신규: ComponentMeta 스키마
```
