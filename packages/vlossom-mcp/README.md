# vlossom-mcp

Vlossom UI 컴포넌트 라이브러리를 AI 어시스턴트(Claude 등)가 정확하게 참조할 수 있도록 하는 MCP(Model Context Protocol) 서버입니다.

## 기술 스택

- .NET 9
- [Sprout.Hosting](https://git.projectbro.com/PlatformDev/bitter) — 서버 인프라
- [ModelContextProtocol](https://github.com/modelcontextprotocol/csharp-sdk) — MCP SDK
- HTTP/SSE transport

## 제공 도구

| 도구 | 설명 |
|---|---|
| `list_components` | Vlossom 컴포넌트 전체 목록과 설명 반환 |

## 실행 방법

```bash
cd packages/vlossom-mcp/VlossomMcp
dotnet run
```

서버가 `http://localhost:5100`에서 시작됩니다.

## AI 어시스턴트 연결

Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "vlossom": {
      "url": "http://localhost:5100/mcp"
    }
  }
}
```

## 설정

`appsettings.json` 또는 환경변수로 설정:

| 키 | 기본값 | 설명 |
|---|---|---|
| `Ports:Http` | `5100` | HTTP 포트 |
| `VlossomMcp:ComponentsPath` | `../vlossom/src/components` | 컴포넌트 디렉토리 경로 |

## 상세 계획

- [개요 및 설계 결정](../docs/plans/vlossom-mcp/OVERVIEW.md)
- [기술 스펙](../docs/plans/vlossom-mcp/specs/2026-03-23-design.md)
- [구현 계획](../docs/plans/vlossom-mcp/2026-03-23-implementation-plan.md)
