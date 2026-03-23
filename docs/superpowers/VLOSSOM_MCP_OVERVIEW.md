# Vlossom MCP — 프로젝트 개요

> 상세 기술 스펙: [`specs/2026-03-23-vlossom-mcp-design.md`](./specs/2026-03-23-vlossom-mcp-design.md)

---

## 왜 만드는가

Vlossom은 약 50개의 Vue 컴포넌트를 제공하는 UI 라이브러리입니다. 외부 개발자가 AI 어시스턴트(Claude 등)에게 Vlossom 관련 질문을 하거나 코드를 요청할 때, AI는 Vlossom의 props, StyleSet, 컴포넌트 조합 방식을 정확히 알지 못해 틀린 코드를 생성하거나 오래된 정보를 제공하는 문제가 있습니다.

**Vlossom MCP는 AI가 Vlossom을 정확히 알고 사용할 수 있게 하는 다리입니다.**

---

## 무엇을 하는가

Vlossom MCP는 두 가지로 구성됩니다.

### 1. 빌드 파이프라인
릴리즈 시점에 각 컴포넌트의 `README.md`와 `types.ts`를 파싱하여 구조화된 메타데이터(`components-meta.json`)를 생성합니다. 이 파일 하나에 50개 컴포넌트의 props, events, slots, StyleSet 타입, 사용 예제가 모두 담깁니다.

### 2. MCP 서버
메타데이터를 기반으로 AI에게 다음 도구들을 제공합니다:

| 그룹 | 도구 | 한 줄 설명 |
|---|---|---|
| **탐색** | `list_components` | 전체 컴포넌트 목록 |
| | `search_components` | 키워드 검색 |
| | `suggest_components` | 사용 사례 기반 추천 |
| | `get_component_relationships` | 함께 쓰이는 컴포넌트 조합 |
| **이해** | `get_component` | props/events/slots/예제 전체 조회 |
| | `get_style_set` | StyleSet 타입 구조 조회 |
| | `get_version_info` | 지원 버전 확인 |
| **적응** | `adapt_type_to_component` | 사용자 타입 → Vlossom props/StyleSet 변환 |
| **생성·검증** | `generate_component_code` | Vue 템플릿 코드 생성 |
| | `validate_component_usage` | 작성된 코드의 props/slot 오류 검증 |
| **액션** | `report_issue` | GitHub 이슈 직접 생성 |

---

## 누구를 위한 것인가

**Vlossom을 사용해 프로젝트를 개발하는 외부 개발자.**

AI 어시스턴트에게 "VsTable에 페이지네이션 붙여줘" 또는 "내 User 타입을 VsTable에 맞게 써줘" 라고 물었을 때, AI가 정확한 컴포넌트 API를 참조하여 올바른 코드를 생성할 수 있도록 합니다.

---

## 어떻게 동작하는가

```
Vlossom 릴리즈 (release/* 브랜치 또는 v* 태그)
        ↓
GitHub Actions → build-meta.ts 실행
README.md + types.ts 파싱
        ↓
components-meta.json 생성 & 커밋
        ↓
MCP 서버 재시작
        ↓
AI 어시스턴트가 MCP 도구 호출
        ↓
외부 개발자가 정확한 Vlossom 코드를 받음
```

---

## 어디에 있는가

모노레포 내 독립 패키지로 관리됩니다:

```
packages/
├── vlossom/          ← 기존 UI 라이브러리
└── vlossom-mcp/      ← 이 프로젝트
    ├── scripts/      ← 빌드 파이프라인
    ├── src/
    │   ├── tools/    ← MCP 도구 구현
    │   └── extension/← 시맨틱 검색 확장점 (향후)
    └── data/
        └── components-meta.json
```

---

## 향후 확장 방향

현재는 키워드 기반 컴포넌트 검색을 사용하지만, 향후 `components-meta.json`을 벡터로 임베딩하여 **"드래그 앤 드롭으로 파일 업로드하는 컴포넌트 있어?"** 같은 자연어 의미 검색으로 확장할 수 있습니다. 이를 위한 확장점(`extension/semantic.ts`)이 처음부터 설계에 포함되어 있습니다.
