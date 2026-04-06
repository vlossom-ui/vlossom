# vlossom-mcp

[![npm version](https://img.shields.io/npm/v/vlossom-mcp)](https://www.npmjs.com/package/vlossom-mcp)
[![license](https://img.shields.io/npm/l/vlossom-mcp)](./LICENSE)
[![node](https://img.shields.io/node/v/vlossom-mcp)](https://nodejs.org)

Claude와 같은 AI 어시스턴트가 [Vlossom UI](https://github.com/vlossom-ui/vlossom) 컴포넌트 라이브러리를 정확히 참조하고, 대화 중에 GitHub 이슈를 직접 등록할 수 있게 해주는 [MCP (Model Context Protocol)](https://modelcontextprotocol.io) 서버입니다.

---

## 설치

별도 설치 없이 `npx`로 바로 실행할 수 있습니다:

```bash
npx vlossom-mcp
```

---

## 설정

**방법 1 — Claude Code CLI:**

```bash
claude mcp add vlossom -- npx -y vlossom-mcp@latest
```

**방법 2 — 설정 파일** (Claude Code: `.mcp.json`, Claude Desktop: `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "vlossom": {
      "command": "npx",
      "args": ["-y", "vlossom-mcp@latest"]
    }
  }
}
```

---

## 도구 목록

### 컴포넌트

| 도구                          | 설명                                                                        |
| ----------------------------- | --------------------------------------------------------------------------- |
| `clarify_intent`              | 자유형 또는 모호한 쿼리를 명확화합니다. 의도가 불분명할 때 검색 전에 호출합니다 |
| `list_components`             | 모든 Vlossom 컴포넌트의 이름과 설명을 반환합니다                            |
| `search_components`           | 이름, 설명, props 전체를 대상으로 키워드 검색합니다                         |
| `suggest_components`          | 자연어 사용 사례를 기반으로 컴포넌트를 추천합니다                           |
| `get_component`               | 컴포넌트의 props, StyleSet, 이벤트, 슬롯, 메서드를 반환합니다               |
| `compare_components`          | 두 컴포넌트를 나란히 비교하고 차이점과 추천을 제공합니다                    |
| `get_component_relationships` | 컴포넌트의 부모/자식/형제 관계를 반환합니다                                 |
| `get_component_source`        | 컴포넌트의 Vue 소스 파일을 그대로 반환합니다                                |

### API 레퍼런스

| 도구              | 설명                                                                      |
| ----------------- | ------------------------------------------------------------------------- |
| `get_directive`   | Vlossom 디렉티브(예: `v-scroll-shadow`)의 사용법과 옵션을 반환합니다     |
| `get_composables` | `useColorScheme` 등 공개 컴포저블의 사용법을 반환합니다                   |

### 스타일 & 설정

| 도구                  | 설명                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------- |
| `get_css_tokens`      | 모든 `--vs-*` CSS 변수의 기본값과 다크 모드 변형을 카테고리별로 반환합니다             |
| `get_vlossom_options` | `createVlossom()` 플러그인의 사용 가능한 옵션과 명령형 API(`$vsModal` 등)를 반환합니다 |

### 설치 & 버전

| 도구                  | 설명                                                                         |
| --------------------- | ---------------------------------------------------------------------------- |
| `check_vlossom_setup` | 설치된 버전이 최신인지 확인하고 설정 체크리스트를 반환합니다                 |
| `get_changelog`       | 번들된 Vlossom 버전 히스토리를 반환합니다. 브레이킹 체인지와 기능을 포함합니다 |

### GitHub 이슈

| 도구                 | 설명                                                                |
| -------------------- | ------------------------------------------------------------------- |
| `check_github_token` | 이슈 등록을 위한 GitHub 토큰이 설정됐는지 확인합니다                |
| `set_github_token`   | 현재 세션의 메모리에 GitHub PAT를 저장합니다                        |
| `draft_issue`        | 버그/기능/질문 유형의 구조화된 이슈 템플릿을 생성합니다 (i18n 지원) |
| `report_issue`       | vlossom-ui/vlossom 저장소에 GitHub 이슈를 생성합니다                |

### 코드 생성

| 도구                       | 설명                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `generate_component_code`  | Vlossom 코딩 규칙, import 문, SFC 스캐폴드를 반환해 코드 생성을 안내합니다          |

### 예정

| 도구                       | 설명                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `generate_style_set`       | variables/component/child-ref 철학을 적용한 올바른 StyleSet을 생성합니다             |
| `adapt_type_to_component`  | 기존 TypeScript 타입을 Vlossom 컴포넌트 props에 맞게 변환합니다                     |
| `validate_component_usage` | 코드에서 컴포넌트가 Vlossom 규칙에 맞게 사용됐는지 검증합니다                       |

> `get_usage_examples` — 도구를 연결하는 방법을 보여주는 엔드투엔드 파이프라인 예제를 언제든 호출할 수 있습니다.

---

## 로드맵

| 버전       | 도구                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------- |
| ✅ 0.2.0   | `list_components`, 이슈 도구 (draft, report, token)                                            |
| ✅ 0.3.0   | `get_component`, `search_components` + build-meta 파이프라인                                   |
| ✅ 0.4.0   | `suggest_components`, `get_component_relationships`, `compare_components`                      |
| ✅ 0.5.0   | 스테퍼 UX (`_meta`), 세션 격리, 스테퍼 포맷 개선                                              |
| ✅ 0.6.0   | `clarify_intent` 의도 명확화 게이트                                                            |
| ✅ 0.7.0   | `get_component_source`, `get_directive`, `get_composables`                                     |
| ✅ 0.8.0   | `get_css_tokens`, `get_vlossom_options`, `get_changelog`, `check_vlossom_setup`                |
| ✅ 0.8.x   | `get_usage_examples`, `next_action` 링크드리스트, 보안 강화, CLAUDE.md 규칙 준수              |
| ✅ 0.9.0   | `generate_component_code` (StyleSet-first, 코딩 규칙)                                         |
| 0.9.1      | `generate_style_set` (variables / component / child-ref 철학)                                  |
| 0.9.2      | `adapt_type_to_component` (TypeScript 타입 → Vlossom 컴포넌트 데이터)                          |
| 0.9.3      | `validate_component_usage` (규칙 기반 SFC 린터)                                                |
| 0.9.4      | `search_components` 시맨틱 강화 (동의어 맵)                                                    |

---

## 로컬 개발 (모노레포 내부)

```bash
cd packages/vlossom-mcp

# 의존성 설치
npm install

# 컴포넌트 데이터 생성
npm run generate

# 빌드
npm run build

# 직접 실행
node dist/index.js
```

로컬 빌드에 연결할 MCP 설정:

```json
{
  "mcpServers": {
    "vlossom": {
      "command": "node",
      "args": ["packages/vlossom-mcp/dist/index.js"]
    }
  }
}
```

---

## 요구 사항

- Node.js 18+

## 라이선스

MIT
