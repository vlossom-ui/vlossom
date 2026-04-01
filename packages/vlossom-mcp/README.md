# vlossom-mcp

Vlossom UI 컴포넌트 라이브러리를 AI 어시스턴트(Claude 등)가 정확하게 참조할 수 있도록 하는 MCP(Model Context Protocol) 서버입니다.

## 사전 요구사항

| 도구        | 버전     |
| ----------- | -------- |
| Node.js     | 18.0 이상 |

## 기술 스택

- Node.js / TypeScript
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) — MCP SDK
- stdio transport (인증 없음)

## 제공 도구

| 도구                  | 설명                                           |
| --------------------- | ---------------------------------------------- |
| `list_components`     | Vlossom 컴포넌트 전체 목록과 설명 반환         |
| `check_github_token`  | GitHub 토큰 설정 여부 확인                     |
| `draft_issue`         | bug / enhancement / question 이슈 초안 생성    |
| `report_issue`        | vlossom-ui/vlossom 레포에 GitHub 이슈 등록     |

## AI 어시스턴트 연결

### Claude Code / Claude Desktop

`claude.json` (또는 `claude_desktop_config.json`):

```json
{
    "mcpServers": {
        "vlossom": {
            "command": "npx",
            "args": ["-y", "@vlossom/mcp"],
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

## 환경변수

| 변수                        | 필수 | 설명                                                    |
| --------------------------- | ---- | ------------------------------------------------------- |
| `VLOSSOM_GITHUB_TOKEN`      | 선택 | GitHub PAT (issues:write 권한). `report_issue` 사용 시 필요 |
| `VLOSSOM_COMPONENTS_PATH`   | 선택 | 컴포넌트 디렉토리 절대경로. 미설정 시 모노레포 내 자동 탐색 |

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
