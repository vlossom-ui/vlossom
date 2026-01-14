# Vlossom StyleSet Plugin

Vlossom 디자인 시스템의 StyleSet 작업을 지원하는 Claude Code 플러그인입니다.

"최소한의 변수, 최대한의 유연성" 철학에 맞춰 컴포넌트의 StyleSet을 생성, 마이그레이션, 리뷰합니다.

## 기능

- **Create**: 새 컴포넌트의 StyleSet 생성
- **Migrate**: 기존 컴포넌트를 새 StyleSet 시스템으로 마이그레이션
- **Review**: StyleSet 코드 리뷰 및 개선 제안

## 설치

```bash
# Claude Code에서
/plugin vlossom-styleset
```

또는 직접 설치:
```bash
cd ~/.claude/plugins
git clone [repository-url] vlossom-styleset
```

## 사용법

### 새 StyleSet 생성

```bash
/vs-style-set create VsButton
```

대화형으로 요구사항을 파악하고 StyleSet을 단계별로 생성합니다.

### 기존 컴포넌트 마이그레이션

```bash
/vs-style-set migrate VsCard
```

또는 경로로:
```bash
/vs-style-set migrate ./src/components/vs-card
```

### StyleSet 리뷰

```bash
/vs-style-set review VsButton
```

철학 준수 여부를 검증하고 개선 제안을 제공합니다.

## 설정

프로젝트 루트에 `.claude/vlossom-styleset.local.md` 파일을 생성하여 설정을 커스터마이즈할 수 있습니다:

```markdown
---
enabled: true
components_path: "./src/components"
guidelines_path: "./STYLE_SET_GUIDELINES.md"
strict_mode: true
---

# Vlossom StyleSet Plugin Configuration

프로젝트별 StyleSet 플러그인 설정입니다.
```

### 설정 필드

- `enabled`: 플러그인 활성화 여부 (기본값: `true`)
- `components_path`: 컴포넌트 디렉토리 경로 (기본값: `"./src/components"`)
- `guidelines_path`: StyleSet 가이드라인 문서 경로 (기본값: `"./STYLE_SET_GUIDELINES.md"`)
- `strict_mode`: 엄격한 검증 모드 (기본값: `true`)

### 설정 변경 시 주의사항

설정 파일을 수정한 후에는 Claude Code를 재시작해야 변경 사항이 적용됩니다.

**`.gitignore`에 추가**:
```gitignore
.claude/*.local.md
```

## 라이선스

MIT
