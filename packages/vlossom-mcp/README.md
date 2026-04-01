# vlossom-mcp

Vlossom UI 컴포넌트 라이브러리를 AI 어시스턴트(Claude 등)가 정확하게 참조할 수 있도록 하는 MCP(Model Context Protocol) 서버입니다.

## 사전 요구사항

| 도구    | 버전      |
| ------- | --------- |
| Node.js | 18.0 이상 |

## 기술 스택

- Node.js / TypeScript
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) — MCP SDK
- stdio transport

## 제공 도구

| 도구                  | 설명                                                                              |
| --------------------- | --------------------------------------------------------------------------------- |
| `list_components`     | Vlossom 컴포넌트 전체 목록과 설명 반환                                            |
| `check_github_token`  | GitHub 토큰 설정 여부 확인                                                        |
| `set_github_token`    | GitHub PAT를 세션에 저장 (환경변수 없이 런타임에 토큰 입력 가능)                  |
| `draft_issue`         | bug / enhancement / question 이슈 초안 생성                                       |
| `report_issue`        | vlossom-ui/vlossom 레포에 GitHub 이슈 등록                                        |

## AI 어시스턴트 연결

### Claude Code / Claude Desktop

프로젝트 루트의 `.mcp.json` 또는 `claude_desktop_config.json`에 추가합니다.

```json
{
    "mcpServers": {
        "vlossom": {
            "command": "npx",
            "args": ["vlossom-mcp"]
        }
    }
}
```

> GitHub 이슈 등록 기능(`report_issue`)을 사용하려면 `issues:write` 권한이 있는 GitHub PAT가 필요합니다.
> 토큰은 환경변수로 미리 설정하거나, `set_github_token` 도구를 통해 런타임에 입력할 수 있습니다.

#### 환경변수로 토큰 미리 설정하는 경우

```json
{
    "mcpServers": {
        "vlossom": {
            "command": "npx",
            "args": ["vlossom-mcp"],
            "env": {
                "VLOSSOM_GITHUB_TOKEN": "ghp_your_token_here"
            }
        }
    }
}
```

### 로컬 개발 빌드로 연결 (모노레포 내부)

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

## GitHub 이슈 등록 흐름

```
1. check_github_token         → 토큰 설정 여부 확인
   isConfigured: false 이면 →  set_github_token(token) 으로 PAT 입력
2. draft_issue(summary, type) → 이슈 초안 및 필수 항목 반환
3. 사용자와 필수 항목을 하나씩 확인
4. 사용자 최종 승인
5. report_issue(title, body)  → GitHub 이슈 생성
```

> `set_github_token`으로 저장한 토큰은 메모리에만 유지되며, 프로세스 재시작 시 초기화됩니다.

## 환경변수

| 변수                      | 필수 | 설명                                                          |
| ------------------------- | ---- | ------------------------------------------------------------- |
| `VLOSSOM_GITHUB_TOKEN`    | 선택 | GitHub PAT (issues:write 권한). `report_issue` 사용 시 필요. `set_github_token` 도구로 대체 가능 |
| `VLOSSOM_COMPONENTS_PATH` | 선택 | 컴포넌트 디렉토리 절대경로. 미설정 시 모노레포 내 자동 탐색  |

## 개발

```bash
cd packages/vlossom-mcp

# 의존성 설치
npm install

# 빌드
npm run build

# 빌드 후 직접 실행
node dist/index.js
```

## 상세 계획

- [개요 및 설계 결정](../docs/plans/vlossom-mcp/OVERVIEW.md)
- [기술 스펙](../docs/plans/vlossom-mcp/specs/2026-03-23-design.md)
- [구현 계획](../docs/plans/vlossom-mcp/2026-03-23-implementation-plan.md)
