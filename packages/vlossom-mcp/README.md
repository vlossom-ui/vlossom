# vlossom-mcp

Vlossom UI 컴포넌트 라이브러리를 AI 어시스턴트(Claude 등)가 정확하게 참조할 수 있도록 하는 MCP(Model Context Protocol) 서버입니다.

## 사전 요구사항

| 도구                                              | 버전     | 설치                         |
| ------------------------------------------------- | -------- | ---------------------------- |
| [.NET SDK](https://dotnet.microsoft.com/download) | 9.0 이상 | `dotnet --version` 으로 확인 |
| Azure AD 앱 등록                                  | -        | TenantId, ClientId 필요      |

## 기술 스택

- .NET 9
- [Sprout.Hosting](https://git.projectbro.com/PlatformDev/bitter) — 서버 인프라
- [ModelContextProtocol](https://github.com/modelcontextprotocol/csharp-sdk) — MCP SDK
- HTTP/SSE transport (JWT Bearer 인증)

## 제공 도구

| 도구              | 설명                                   |
| ----------------- | -------------------------------------- |
| `list_components` | Vlossom 컴포넌트 전체 목록과 설명 반환 |

## 실행 방법

```bash
cd packages/vlossom-mcp/VlossomMcp
dotnet run
```

서버가 `http://localhost:5100`에서 시작됩니다.

## AI 어시스턴트 연결

Claude Code / Claude Desktop `claude.json`:

```json
{
    "mcpServers": {
        "vlossom": {
            "type": "sse",
            "url": "http://localhost:5100/mcp"
        }
    }
}
```

> Azure AD OAuth를 통해 자동으로 인증됩니다.

## 설정

### 환경별 구성

ASP.NET Core의 환경별 설정 파일을 사용합니다.

| 파일                              | 용도        | Git 관리 |
| --------------------------------- | ----------- | -------- |
| `appsettings.json`                | 공통 기본값 | O        |
| `appsettings.Development.json`    | 로컬 개발   | O        |
| `appsettings.Production.json`     | 프로덕션    | X        |

`ASPNETCORE_ENVIRONMENT` 환경변수로 환경을 선택합니다 (기본값: `Production`).

**로컬 개발 실행:**

```bash
ASPNETCORE_ENVIRONMENT=Development dotnet run
# 또는 Windows:
set ASPNETCORE_ENVIRONMENT=Development && dotnet run
```

### 설정 키

| 키                          | 기본값                          | 설명                      |
| --------------------------- | ------------------------------- | ------------------------- |
| `Ports:Http`                | `5100`                          | HTTP 포트                 |
| `VlossomMcp:ComponentsPath` | `components` (ContentRoot 기준) | 로컬 개발은 `appsettings.Development.json`에서 `../../vlossom/src/components` |
| `AzureAd:TenantId`          | —                               | Azure AD 테넌트 ID        |
| `AzureAd:ClientId`          | —                               | Azure AD 앱 클라이언트 ID |

### 프로덕션 배포

`appsettings.Production.json` 파일 생성 (git 제외):

```json
{
    "AzureAd": {
        "TenantId": "<prod-tenant-id>",
        "ClientId": "<prod-client-id>"
    }
}
```

또는 환경변수 사용:

```bash
export AzureAd__TenantId=<prod-tenant-id>
export AzureAd__ClientId=<prod-client-id>
```

## 상세 계획

- [개요 및 설계 결정](../docs/plans/vlossom-mcp/OVERVIEW.md)
- [기술 스펙](../docs/plans/vlossom-mcp/specs/2026-03-23-design.md)
- [구현 계획](../docs/plans/vlossom-mcp/2026-03-23-implementation-plan.md)
