# Vlossom MCP — MVP 작업 완료 요약

**브랜치**: `chore/mcp-server-mvp`
**완료일**: 2026-04-01

---

## 작업 개요

Vlossom UI 라이브러리의 컴포넌트 정보를 AI 어시스턴트에게 제공하는 MCP(Model Context Protocol) 서버 MVP를 구현했습니다.

- **기술 스택**: .NET 9, Sprout.Hosting 0.0.43, ModelContextProtocol.AspNetCore 0.1.0-preview.11
- **Transport**: HTTP/SSE (`http://localhost:5100/mcp`)
- **인증**: Azure AD JWT Bearer (Development 환경에서는 생략)
- **구현 도구**: `list_components` 1개
- **버전**: 0.1.0

---

## 프로젝트 구조

```
packages/vlossom-mcp/
├── .gitignore                           # bin/, obj/, appsettings.Production.json 제외
├── README.md
└── VlossomMcp/
    ├── VlossomMcp.csproj                # 패키지 참조 및 버전(0.1.0) 정의
    ├── Program.cs                       # 웹 호스트, MCP, 인증, OAuth 엔드포인트 설정
    ├── appsettings.json                 # 포트 5100, 컴포넌트 경로, AzureAd 빈 값 (prod base)
    ├── appsettings.Development.json     # AzureAd TenantId/ClientId override만 포함
    ├── appsettings.Production.json      # gitignore — prod 자격증명 (서버에서 별도 생성)
    ├── Properties/
    │   └── launchSettings.json          # ASPNETCORE_ENVIRONMENT=Development 자동 설정
    ├── Services/
    │   └── ComponentRegistry.cs         # 컴포넌트 디렉토리 스캔 및 캐싱
    └── Tools/
        └── VlossomComponentTools.cs     # list_components MCP 도구
```

---

## MCP 도구

| 도구 | 설명 | 반환 타입 |
|---|---|---|
| `list_components` | Vlossom 컴포넌트 전체 목록과 설명 반환 | `ComponentInfo[]` |

`ComponentInfo`:
```csharp
record ComponentInfo(
    string Name,        // PascalCase (e.g., "VsButton")
    string KebabName,   // kebab-case (e.g., "vs-button")
    string Description  // README 첫 설명 줄
)
```

- 50개 컴포넌트 (`vs-accordion` ~ `vs-visible-render`) 지원
- `packages/vlossom/src/components/vs-*/` 디렉토리 스캔
- 각 컴포넌트 `README.md` 첫 설명 줄 파싱

---

## 인증 구성

### Azure AD JWT Bearer

```
Authority: https://login.microsoftonline.com/{TenantId}/v2.0
Audience:  {ClientId}
```

- **Development**: `AllowAnonymous()` — 인증 없이 `/mcp` 접근 가능
- **Production**: JWT Bearer 토큰 필수

### OAuth 엔드포인트 (MCP 클라이언트 지원)

| 엔드포인트 | 역할 |
|---|---|
| `GET /.well-known/oauth-authorization-server` | Sprout 기본값(localhost) → Azure AD 엔드포인트로 오버라이드 |
| `POST /register` | RFC 7591 Dynamic Client Registration — Azure AD ClientId 반환 |

### 환경별 설정 구조

```
appsettings.json              ← prod base (AzureAd 빈 값)
appsettings.Development.json  ← dev override (AzureAd 실 값만)
appsettings.Production.json   ← gitignore (prod 서버에서 별도 생성)
```

환경변수로도 주입 가능:
```bash
AzureAd__TenantId=<tenant-id>
AzureAd__ClientId=<client-id>
```

---

## 로깅

Serilog (`Serilog.AspNetCore 8.0.3`) 사용:

```
[HH:mm:ss INF] Now listening on: http://localhost:5100
[HH:mm:ss INF] HTTP POST /register responded 200 in 3.7ms
```

- `Microsoft.AspNetCore.Hosting`, `Routing`, `Http` 카테고리는 Warning 이상만 출력

---

## 서버 실행

```bash
cd packages/vlossom-mcp/VlossomMcp
dotnet run
# launchSettings.json에 의해 ASPNETCORE_ENVIRONMENT=Development 자동 적용
```

---

## AI 어시스턴트 연결

### Claude Code (`~/.claude.json`) — Production

```json
{
    "mcpServers": {
        "vlossom": {
            "type": "http",
            "url": "http://localhost:5100/mcp",
            "oauth": {
                "clientId": "<azure-ad-client-id>",
                "callbackPort": 8080
            }
        }
    }
}
```

> `callbackPort`를 고정하면 Azure AD 앱 등록에서 `http://localhost:8080/callback` 하나만 등록하면 됩니다.
> 또는 Azure AD에서 "Mobile and desktop applications" 플랫폼으로 `http://localhost` 등록 시 모든 포트 허용 (RFC 8252).

### Development 환경 (인증 없이 바로 연결)

```json
{
    "mcpServers": {
        "vlossom": {
            "type": "http",
            "url": "http://localhost:5100/mcp"
        }
    }
}
```

---

## 배포 계획

```
GitHub (vlossom-ui/vlossom)
  packages/vlossom-mcp/         ← MCP 서버 소스
        ↓ GitLab mirror (pull)
GitLab — 브랜치: gitlab/chore/mcp-server-mvp
  Jenkinsfile (repo root)        ← 허용 브랜치: chore/mcp-server-mvp
  Dockerfile  (repo root)        ← .NET 9 multi-stage build (arm64)
        ↓
jenkins-eks
  Docker 이미지 빌드
        ↓
flare.pubg.io — k8s 배포
```

**Jenkinsfile/Dockerfile 위치**: GitHub에 없는 GitLab 전용 브랜치에만 존재 — GitHub mirror sync 영향 없음.

**Slack 알림 채널**: `#platform_unit_dev2_tool_error_monitor`

---

## 부가 도구

| 위치 | 내용 |
|---|---|
| `.claude/skills/vlossom/SKILL.md` | `/vlossom list`, `/vlossom find <keyword>`, `/vlossom <ComponentName>` 슬래시 커맨드 |

---

## 향후 작업

전체 계획([2026-03-23-implementation-plan.md](./2026-03-23-implementation-plan.md))에 따라 추가 도구 구현 예정:
- `search_components` — 키워드 검색
- `get_component` — 컴포넌트 상세 정보 (props, StyleSet, events)
- `generate_component_code` — 코드 생성
