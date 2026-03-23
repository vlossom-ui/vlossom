# vlossom-mcp

Vlossom 컴포넌트 라이브러리를 AI 어시스턴트가 정확하게 이해하고 활용할 수 있도록 하는 MCP(Model Context Protocol) 서버입니다.

---

## 목적

외부 개발자가 AI 어시스턴트(Claude 등)에게 Vlossom 관련 질문을 하거나 코드를 요청할 때, AI가 정확한 컴포넌트 API를 참조하여 올바른 코드를 생성할 수 있도록 합니다.

---

## 구조

```
vlossom 릴리즈
    ↓
빌드 파이프라인 (scripts/build-meta.ts)
README.md + types.ts 파싱 → components-meta.json
    ↓
MCP 서버 (src/server.ts)
    ↓
AI 어시스턴트
    ↓
외부 개발자
```

---

## 제공 도구

| 그룹 | 도구 |
|---|---|
| 탐색 | `list_components`, `search_components`, `suggest_components`, `get_component_relationships` |
| 이해 | `get_component`, `get_style_set`, `get_version_info` |
| 적응 | `adapt_type_to_component` |
| 생성·검증 | `generate_component_code`, `validate_component_usage` |
| 액션 | `report_issue` |

---

## 시작하기

### 1. 메타데이터 생성

```bash
pnpm --filter vlossom-mcp build:meta
```

Vlossom 소스의 README와 TypeScript 타입을 파싱하여 `data/components-meta.json`을 생성합니다.
이 파일은 릴리즈 CI에서 자동으로 생성됩니다.

### 2. 서버 실행

```bash
# 개발
pnpm --filter vlossom-mcp dev

# 프로덕션
pnpm --filter vlossom-mcp build
pnpm --filter vlossom-mcp start
```

### 3. AI 어시스턴트 연결

Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "vlossom": {
      "command": "node",
      "args": ["/path/to/packages/vlossom-mcp/dist/server.js"]
    }
  }
}
```

---

## 환경 변수

| 변수 | 필수 | 설명 |
|---|---|---|
| `VLOSSOM_GITHUB_TOKEN` | 선택 | `report_issue` 도구 사용 시 필요. `issues: write` 권한 필요. |

---

## 상세 문서

- 설계 배경 및 결정 사항: [`docs/superpowers/VLOSSOM_MCP_OVERVIEW.md`](../../docs/superpowers/VLOSSOM_MCP_OVERVIEW.md)
- 기술 스펙: [`docs/superpowers/specs/2026-03-23-vlossom-mcp-design.md`](../../docs/superpowers/specs/2026-03-23-vlossom-mcp-design.md)
- 구현 계획: [`docs/superpowers/plans/2026-03-23-vlossom-mcp.md`](../../docs/superpowers/plans/2026-03-23-vlossom-mcp.md)
