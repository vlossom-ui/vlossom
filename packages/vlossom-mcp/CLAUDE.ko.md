# vlossom-mcp 개발 규칙

`packages/vlossom-mcp`에만 적용합니다.

## 작업 원칙

새 규칙, 문서 섹션, 데이터 파일, 도구를 추가하기 전에 삭제, 통합, source-of-truth 재사용을 먼저 검토합니다. 필요 없어진 파일은 보존용 규칙을 덧대지 말고 삭제한 뒤 실제 의존만 정리합니다.

## Public Surface

기본 공개 도구는 아래 4개 facade tool로 제한합니다.

1. `search_vlossom`
2. `get_vlossom_reference`
3. `scaffold_vlossom_code`
4. `validate_vlossom_usage`

side-workflow tool은 surface에 포함하지 않습니다.

## Agent Policy

이 패키지는 Vlossom-first source-of-truth 하네스로 취급합니다. component 이름이나 API를 추측하지 말고 `search_vlossom`, `get_vlossom_reference`, resource, validation output에서 확인합니다.

가능하면 사용자의 설치된 Vlossom version을 함께 전달합니다. `packageJson` 또는 `version`을 넘겨 도구가 `versionContext`를 반환하고, `versionSupport`를 표시하며, 해당 project version에서 사용할 수 없는 API를 보고하도록 합니다.

이 MCP를 사용하는 동안 생성하거나 검토하는 UI는 기본적으로 Vlossom-first를 지켜야 합니다. native control이나 third-party UI는 명시적인 사용자 예외, migration 단계, coverage가 없는 요구사항일 때만 사용합니다.

component API에 의존하기 전에는 `get_vlossom_reference`를 호출합니다. 생성 또는 사용자 작성 Vlossom 코드를 최종화하기 전에는 `validate_vlossom_usage`로 검증합니다.

## Change Discipline

동작이 바뀌었을 때 해당 내용을 직접 소유한 문서만 갱신합니다.

- 사용자 설치/사용법: `README.md`, `README.ko.md`
- 런타임/모듈 지도: `ARCHITECTURE.md`
- 미션/정책: `PHILOSOPHY.md`
- 역사적 결정: `DECISIONS.md`
- agent 편집 규칙: `CLAUDE.md`, `CLAUDE.ko.md`

모든 문서를 기본으로 갱신하지 않습니다. `DECISIONS.md`는 historical log라 제거된 도구명이 남을 수 있습니다.

## Validation

변경 범위에 맞는 검사를 실행하고, release에 영향이 있으면 전체 package test를 실행합니다.

```bash
npm run build
npm run verify
npm test
npx tsc -p tsconfig.scripts.json
```
