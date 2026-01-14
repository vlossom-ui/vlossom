# Changelog

All notable changes to the Vlossom StyleSet Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-14

### Added
- 초기 릴리스
- `/vs-style-set` 통합 커맨드 추가
  - `create`: 새 컴포넌트 StyleSet 생성
  - `migrate`: 기존 컴포넌트를 새 StyleSet 시스템으로 마이그레이션
  - `review`: StyleSet 코드 리뷰 및 개선 제안
- 3개의 스킬 추가
  - `style-set-create`: StyleSet 생성 가이드
  - `style-set-migrate`: 마이그레이션 가이드
  - `style-set-review`: 코드 리뷰 가이드
- 프로젝트별 설정 지원 (`.claude/vlossom-styleset.local.md`)
- 상세한 문서화 (README.md, example-settings.md)
- "최소한의 변수, 최대한의 유연성" 철학 기반 검증

### Documentation
- README.md: 설치, 사용법, 설정 가이드
- example-settings.md: 프로젝트별 설정 예제
- CHANGELOG.md: 버전 히스토리 추적

## [Unreleased]

### Planned
- Hooks 추가로 자동화 강화
- Agent 추가로 프로액티브 지원
- 테스트 예제 추가
- CI/CD 통합

---

[1.0.0]: https://github.com/your-org/vlossom-styleset-plugin/releases/tag/v1.0.0
