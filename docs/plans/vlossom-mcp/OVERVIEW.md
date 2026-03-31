# Vlossom MCP — 프로젝트 개요

> 상세 기술 스펙: [`specs/2026-03-23-vlossom-mcp-design.md`](./specs/2026-03-23-vlossom-mcp-design.md)

이 문서는 설계 과정에서 나눈 논의와 결정들을 기록합니다. 스펙 문서가 *무엇을 만드는지*를 담는다면, 이 문서는 *왜 그렇게 결정했는지*를 담습니다.

---

## 왜 만드는가

Vlossom은 약 50개의 Vue 컴포넌트를 제공하는 UI 라이브러리입니다. 외부 개발자가 AI 어시스턴트(Claude 등)에게 Vlossom 관련 질문을 하거나 코드를 요청할 때, AI는 Vlossom의 props, StyleSet, 컴포넌트 조합 방식을 정확히 알지 못해 틀린 코드를 생성하거나 오래된 정보를 제공하는 문제가 있습니다.

**Vlossom MCP는 AI가 Vlossom을 정확히 알고 사용할 수 있게 하는 다리입니다.**

---

## 결정 1: 누구를 위한 MCP인가

**결정: 외부 개발자 (Vlossom을 사용하는 사람)**

세 가지 후보를 검토했습니다:
- A) Vlossom으로 프로젝트를 개발하는 외부 개발자
- B) Vlossom 라이브러리 자체를 개발하는 내부 팀
- C) 양쪽 모두

**A를 선택.** 외부 개발자가 AI 어시스턴트를 통해 Vlossom을 더 쉽고 정확하게 사용하는 것이 핵심 가치입니다. 내부 팀을 위한 도구는 별도의 프로젝트로 다룰 수 있습니다.

---

## 결정 2: MCP가 제공할 기능의 범위

**결정: 문서 조회 + 코드 생성 모두**

- A) 문서 조회만 (props, StyleSet 등 정보 제공)
- B) 코드 생성만 (요구사항 → 코드 생성)
- C) A + B 모두

**C를 선택.** 문서 조회를 기반으로 정확한 코드 생성까지 이어지는 것이 실제 개발 워크플로우에 맞습니다.

---

## 결정 3: 메타데이터 생성 방식

**결정: 정적 빌드 파이프라인 (자체 서버에서 서빙)**

세 가지 방식을 검토했습니다:

| 방식 | 설명 | 결과 |
|---|---|---|
| **A) 정적 빌드** | 릴리즈 시 파싱 → JSON 생성 | **채택** |
| B) 런타임 파싱 | 요청마다 소스 파일 직접 읽기 | 미채택 (소스 경로 의존성, 느림) |
| C) npm 패키지 번들 | 패키지 배포 시 메타데이터 포함 | 미채택 |

**A를 채택한 이유**: "정밀한 하네스 파이프라인"을 통해 고품질의 구조화된 메타데이터를 만들 수 있습니다.

**C를 채택하지 않은 이유**: 서버를 직접 운영할 예정이기 때문에 npm 패키지에 메타데이터를 포함시킬 필요가 없습니다. 서버가 직접 `components-meta.json`을 읽으면 충분합니다.

---

## 결정 4: 파이프라인이 추출할 데이터 범위

**결정: README + types.ts 모두 파싱하여 결합**

- A) README 위주 (서술형 설명, 예제, props 테이블)
- B) types.ts 위주 (TypeScript 인터페이스 정밀 추출)
- C) A + B 결합

**C를 선택.** README 단독으로는 타입 정밀도가 부족하고, `types.ts` 단독으로는 서술형 설명과 사용 예제가 없습니다. 두 소스를 결합해야 AI가 정확하면서도 풍부한 정보를 갖출 수 있습니다.

파이프라인은 두 소스의 일치 여부를 검증하여 문서와 실제 타입이 어긋날 경우 경고를 남깁니다.

---

## 결정 5: 파이프라인 실행 시점

**결정: 릴리즈 트리거 (release/* 브랜치 또는 v* 태그)**

커밋마다 실행하는 방식도 검토했으나, 미완성 문서가 메타데이터에 포함될 수 있다는 문제가 있습니다. Vlossom이 릴리즈 브랜치를 명확하게 관리하고 있어(`release/2.0.0-beta.1` 등) 릴리즈 트리거 방식이 가장 자연스럽게 맞습니다.

---

## 결정 6: MCP 도구의 형태

**결정: 계층형 구조 (저수준 조회 + 고수준 생성), 이후 AI 호출 흐름 기반으로 재설계**

초기에는 저수준(조회) / 고수준(생성)으로 나누려 했습니다. 그러나 **"AI가 어떤 질문을 받았을 때 어떤 순서로 도구를 호출하는가"** 관점에서 재검토하자 더 명확한 구조가 나왔습니다.

```
"로그인 폼 만들어줘"
  → suggest_components → get_component_relationships
  → adapt_type_to_component → generate_component_code → validate_component_usage
```

이 흐름에서 자연스럽게 도출된 4개 그룹:
- **탐색 (Discovery)**: 뭘 써야 하지?
- **이해 (Understanding)**: 이게 어떻게 생겼지?
- **적응 (Adaptation)**: 내 코드를 어떻게 맞추지?
- **생성·검증 (Generation/Validation)**: 코드 만들고 맞는지 확인

---

## 결정 7: 도구 목록 확정 과정

초기 목록에서 다음과 같은 변경이 있었습니다:

**제거 / 통합**
- `generate_form_code` → `generate_component_code`에 흡수 (중복)

**명확히 분리**
- `search_components`: 키워드 기반 정확 매칭
- `suggest_components`: 자연어 사용 사례 기반 추천 (의도가 다름)

**새로 추가**
- `get_component_relationships`: 컴포넌트 조합 정보. AI가 "VsForm과 함께 쓰는 컴포넌트"를 알아야 조합 추천 품질이 높아짐
- `validate_component_usage`: "이 코드 맞아?" 질문에 대응. `@vue/compiler-dom`으로 정적 분석
- `get_version_info`: "이 prop 2.0에서 써도 돼?" 질문 대응

---

## 결정 8: `adapt_type_to_component` 추가

**결정: data 모드 + style 모드 + auto 모드 모두 지원**

설계 중 새롭게 제안된 도구입니다. 개발자가 이미 가지고 있는 타입을 Vlossom에 맞게 변환하는 것이 핵심입니다.

- **data 모드**: `interface User { id, name, email }` → VsTable `columns` 배열
- **style 모드**: `{ color: 'red', size: 'large', rounded: true }` → `VsButtonStyleSet`
- **auto 모드**: CSS 속성명이나 StyleSet 키가 포함되어 있으면 `style`, 아니면 `data`로 자동 판단

이 도구는 서버가 직접 타입 추론을 하지 않습니다. 서버는 해당 컴포넌트의 props 스키마와 StyleSet 구조를 컨텍스트로 전달하고, 실제 매핑은 AI가 수행합니다.

---

## 결정 9: 기술 스택 및 패키지 위치

**결정: Node.js TypeScript, 모노레포 내 packages/vlossom-mcp/ 패키지**

- A) Node.js TypeScript (Vlossom과 동일 생태계, ts-morph 활용 가능)
- B) Python (MCP SDK 풍부)
- C) Node.js, 모노레포 내 패키지로 통합

**C를 선택.** Vlossom 소스를 직접 참조해야 하는 빌드 파이프라인 특성상 같은 모노레포 안에 있는 것이 자연스럽고, TypeScript 생태계를 그대로 활용할 수 있습니다.

---

## 결정 10: 시맨틱 검색 확장 가능성

**결정: 접근 2(구조화 메타데이터)로 시작, 접근 3(시맨틱 검색) 확장점 포함**

세 가지 구현 방식을 검토했습니다:
- 접근 1: 파일 기반 단순 MCP (마크다운 원문 전달) — 미채택
- **접근 2: 구조화 메타데이터 MCP** — **채택**
- 접근 3: 임베딩 기반 시맨틱 검색 — 현재 오버엔지니어링, 향후 확장

**접근 2로 시작하되 처음부터 확장점을 설계에 포함.** `extension/semantic.ts`는 현재 stub이지만, `components-meta.json`의 `_meta.extension.embeddingReady` 플래그가 `true`가 되는 순간 자동으로 시맨틱 검색이 활성화됩니다. 도구 인터페이스 변경 없이 내부 구현만 교체됩니다.

---

## 결정 11: `report_issue` 도구 추가

스펙 리뷰 중 별도로 추가된 요구사항입니다. AI 어시스턴트에서 직접 GitHub 이슈를 생성할 수 있도록 합니다.

주요 고려사항:
- `VLOSSOM_GITHUB_TOKEN` 환경변수로 인증 (서버 시작 시 로드, 응답에 노출 금지)
- **사용자 확인 필수**: AI가 사용자 확인 없이 자동으로 이슈를 생성하는 것은 남용으로 간주

---

## 전체 동작 흐름

```
Vlossom 릴리즈 (release/* 브랜치 또는 v* 태그)
        ↓
GitHub Actions → build-meta.ts 실행
  Stage 1: component-map.ts에서 컴포넌트 목록 추출
  Stage 2: README 파서 (remark) — 병렬 실행
  Stage 3: TypeScript 파서 (ts-morph) — 병렬 실행
  Stage 4: 결합 + 검증 (불일치 시 경고)
  Stage 5: components-meta.json 출력
        ↓
자체 MCP 서버 재시작 (stdio 통신)
  → embeddingReady 확인 (시맨틱 검색 활성화 여부)
  → VLOSSOM_GITHUB_TOKEN 확인 (report_issue 활성화 여부)
        ↓
AI 어시스턴트(Claude 등)가 MCP 도구 호출
        ↓
외부 개발자가 정확한 Vlossom 코드를 받음
```

---

## 패키지 위치

```
packages/
├── vlossom/              ← 기존 UI 라이브러리
└── vlossom-mcp/          ← 이 프로젝트
    ├── scripts/
    │   ├── build-meta.ts ← 빌드 파이프라인
    │   └── relationships.ts ← 컴포넌트 조합 관계 (수동 관리)
    ├── src/
    │   ├── server.ts
    │   ├── tools/
    │   │   ├── discovery.ts     ← list, search, suggest, relationships
    │   │   ├── understanding.ts ← get_component, get_style_set, get_version_info
    │   │   ├── adaptation.ts    ← adapt_type_to_component
    │   │   ├── generation.ts    ← generate_component_code, validate_component_usage
    │   │   └── action.ts        ← report_issue
    │   └── extension/
    │       └── semantic.ts      ← 시맨틱 검색 확장점 (현재 stub)
    └── data/
        └── components-meta.json ← 파이프라인 산출물 (git 추적)
```
