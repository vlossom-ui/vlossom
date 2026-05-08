# vlossom-mcp

[![npm version](https://img.shields.io/npm/v/vlossom-mcp)](https://www.npmjs.com/package/vlossom-mcp)
[![license](https://img.shields.io/npm/l/vlossom-mcp)](./LICENSE)
[![node](https://img.shields.io/node/v/vlossom-mcp)](https://nodejs.org)

[Vlossom UI](https://github.com/vlossom-ui/vlossom)를 사용하는 AI agent를 위한 [MCP(Model Context Protocol)](https://modelcontextprotocol.io) 서버입니다.

`vlossom-mcp`는 Vlossom의 사실을 꺼내는 compact source-of-truth 하네스입니다. Agent가 component contract를 추측하지 않도록 돕습니다.

문서 챗봇이 아닙니다. 범용 Vue 생성기가 아닙니다. GitHub 이슈 봇이 아닙니다.

## 설치

직접 실행:

```bash
npx vlossom-mcp
```

Claude Code 등록:

```bash
claude mcp add vlossom -- npx -y vlossom-mcp@latest
```

MCP 설정 파일 예시:

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

## 공개 계약

기본 public MCP surface는 의도적으로 4개 도구만 노출합니다.

| 도구                     | 역할                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `search_vlossom`         | 기본적으로 compact component index를 검색하고, 명시 target으로 directive, composable, token, option, changelog, rule을 조회합니다.     |
| `get_vlossom_reference`  | API, example, GitHub-backed source와 changelog, relationship, setup option, token, rule을 source-of-truth 기준으로 조회합니다.         |
| `scaffold_vlossom_code`  | project setup, StyleSet, 명시 component usage 하네스를 만들고 요청 component id/version support를 확인합니다.                          |
| `validate_vlossom_usage` | SFC, snippet, StyleSet, project setup, 기본 Vlossom-first 사용, 감지된 version support를 GitHub-resolved metadata 기준으로 검증합니다. |

핵심 워크플로우:

```txt
Search -> Reference -> Scaffold -> Validate
```

1. `search_vlossom`으로 Vlossom coverage를 찾습니다.
2. `get_vlossom_reference`로 정확한 API와 rule을 확인합니다.
3. `scaffold_vlossom_code`로 Vlossom-native 시작점을 만듭니다.
4. `validate_vlossom_usage`로 최종화 전에 검증합니다.

## Vlossom-first 하네스 기본값

Agent가 이 MCP를 사용한다면 Vlossom-first가 기본값입니다. 감지된 Vlossom version에 coverage가 있는 UI는 registry-backed Vlossom component를 우선 사용하도록 guard합니다.

다만 범용 code-style reviewer는 아닙니다. MCP는 native control, third-party UI처럼 Vlossom coverage와 직접 연결되는 위반만 보고합니다. 명시적인 사용자 예외가 있을 때만 `context.vlossomFirst: "off"`를 사용합니다.

새 프로젝트:

```txt
scaffold_vlossom_code(kind: "project-setup")
  -> validate_vlossom_usage(kind: "project-setup")
  -> search_vlossom(intent: "build-ui")
```

마이그레이션:

```txt
validate_vlossom_usage(kind: "project-setup")
  -> search_vlossom(intent: "build-ui")
  -> get_vlossom_reference
  -> validate_vlossom_usage
```

기능 구현:

```txt
search_vlossom(intent: "build-ui")
  -> get_vlossom_reference(include: ["api"])
  -> scaffold_vlossom_code(components: ["VsButton"])
  -> validate_vlossom_usage
```

`validate_vlossom_usage`는 빈 코드를 `valid: true`로 처리하지 않습니다. 빈 입력은 `status: "skipped"`, `valid: false`입니다.

## 설치 버전 기준 안내

Vlossom metadata는 런타임에 사용자의 설치 version에 맞는 GitHub ref에서 조회합니다. 프로젝트 version이 제공되거나 감지되면 facade tool은 `versionContext`를 반환합니다.

사용자의 설치된 Vlossom version을 `version` 또는 `packageJson`으로 전달하세요.

```ts
search_vlossom({ query: 'button', target: 'component', packageJson });
get_vlossom_reference({ type: 'component', id: 'VsButton', version: '2.0.0-beta.1' });
scaffold_vlossom_code({ kind: 'component-usage', description: 'form', context: { packageJson } });
validate_vlossom_usage({ kind: 'sfc', code, packageJson });
```

런타임은 `vlossom-v{version}`, `v{version}`, `{version}`, `main` 순서로 ref를 확인합니다. `main`으로 fallback되면 version-specific guarantee가 약해졌다는 warning을 `versionContext.warnings`에 포함합니다.

component, directive, composable은 `versionSupport`를 포함합니다. scaffolding과 validation은 지원되지 않는 component를 보고하고, agent가 upgrade/대체/회피를 판단합니다.

## Runtime Data

component, directive, composable, token, source, release reference는 generated JSON data file로 묶지 않고 GitHub에서 요청 시점에 조회합니다. 정확한 version-specific 안내에는 `version` 또는 `packageJson`을 facade tool에 전달해야 합니다.

## 로컬 개발

```bash
cd packages/vlossom-mcp
npm install
npm run build
npm test
npm run verify
node dist/index.js
```

## 문서 지도

- [PHILOSOPHY.md](./PHILOSOPHY.md): mission, non-goals, Vlossom-first harness policy, validation policy, side-effect policy를 설명합니다.
- [ARCHITECTURE.md](./ARCHITECTURE.md): 현재 구현 surface와 internal module을 설명합니다.
- [FEATURES.md](./FEATURES.md): active feature를 한 문장 단위로 요약합니다.
- [DECISIONS.md](./DECISIONS.md): chronological decision log이며 historical tool name이 등장할 수 있습니다.

## 요구사항

- Node.js 18+
