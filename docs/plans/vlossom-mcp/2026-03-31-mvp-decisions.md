# Vlossom MCP MVP — 구현 결정 사항

> 이 문서는 2026-03-31 MVP 구현 세션에서 나눈 논의와 결정들을 기록합니다.
> 원본 설계 배경은 [OVERVIEW.md](./OVERVIEW.md)를, 기술 스펙은 [specs/2026-03-23-design.md](./specs/2026-03-23-design.md)를 참고하세요.

---

## 결정 1: MVP 범위

**결정: 컴포넌트 목록 조회(list_components) 도구 하나만 구현**

기존 계획([2026-03-23-implementation-plan.md](./2026-03-23-implementation-plan.md))에는 11개 도구(탐색·이해·적응·생성·검증·액션)가 포함되어 있었습니다.

MVP에서는 동작하는 최소 단위로 범위를 좁혔습니다:
- 기존 개발 계획은 `docs/plans/vlossom-mcp/`에 보존
- 구현은 `list_components` 단일 도구로 시작

---

## 결정 2: 기술 스택 — .NET + Sprout

**결정: Node.js 대신 .NET 9 + Sprout 프레임워크 사용**

원래 설계([결정 9](./OVERVIEW.md))는 Node.js TypeScript를 선택했습니다. 이번 세션에서 .NET + Sprout로 변경했습니다.

| 항목 | 원래 계획 | MVP 결정 |
|---|---|---|
| 런타임 | Node.js 20+ | .NET 9 |
| 프레임워크 | 없음 (직접 구성) | Sprout.Hosting 0.0.43 |
| MCP SDK | `@modelcontextprotocol/sdk` | `ModelContextProtocol.AspNetCore` |

**이유**: 팀 인프라가 Sprout 기반으로 통일되어 있어 운영/배포 일관성 확보.

---

## 결정 3: Transport — HTTP/SSE

**결정: stdio 대신 HTTP/SSE transport 사용**

두 가지 옵션을 검토했습니다:

| 옵션 | 설명 | 결과 |
|---|---|---|
| **stdio** | 콘솔 앱, `command/args`로 연결 | 미채택 |
| **HTTP/SSE** | 웹 서버, URL로 연결 | **채택** |

**채택 이유**:
- Sprout.Hosting은 ASP.NET Core 웹 서버 기반 — stdio와 구조적으로 맞지 않음
- 서버를 독립적으로 호스팅하는 배포 계획(k8s)에 HTTP가 자연스럽게 맞음

**미채택 이유 (stdio)**:
- stdio가 더 일반적인 MCP 옵션이긴 하나, Sprout 통합 및 배포 계획과 맞지 않음

**Claude Desktop 연결 설정**:
```json
{
  "mcpServers": {
    "vlossom": {
      "url": "http://localhost:5100/mcp"
    }
  }
}
```

---

## 결정 4: 배포 계획

**결정: GitHub → GitLab 미러 → Jenkins → k8s(flare.pubg.io)**

배포 파이프라인:

```
GitHub (vlossom-ui/vlossom)
  packages/vlossom-mcp/ ← Sprout MCP 서버 소스
        ↓ 미러 (jenqueens, pull 방식)
GitLab (packages/vlossom-mcp/)
  Jenkinsfile, Dockerfile 추가
        ↓
jenkins-eks
  Docker 이미지 빌드
        ↓
flare.pubg.io
  k8s 환경에 이미지 배포
```

**미결 사항**: jenqueens mirror가 pull 방식으로 자동 동작하는지 확인 필요 (설명은 자동이라고 되어 있음).

---

## 패키지 구조

```
packages/vlossom-mcp/
├── .gitignore
├── README.md
└── VlossomMcp/
    ├── VlossomMcp.csproj        # Sprout.Hosting + ModelContextProtocol.AspNetCore
    ├── Program.cs               # 웹 호스트 + MCP 설정
    ├── appsettings.json         # 포트 5100, 컴포넌트 경로
    ├── Services/
    │   └── ComponentRegistry.cs # 컴포넌트 디렉토리 스캔 및 캐싱
    └── Tools/
        └── VlossomComponentTools.cs  # list_components 도구
```
