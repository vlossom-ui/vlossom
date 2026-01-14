# Vlossom StyleSet Plugin 설정 예제

이 파일은 플러그인 설정의 예제입니다. 실제 프로젝트에서 사용하려면 이 파일을 프로젝트 루트의 `.claude/vlossom-styleset.local.md`로 복사하세요.

## 설정 파일 생성 방법

**1단계**: 프로젝트 루트에 `.claude` 디렉토리가 있는지 확인
```bash
mkdir -p .claude
```

**2단계**: 이 예제를 복사
```bash
cp example-settings.md .claude/vlossom-styleset.local.md
```

**3단계**: 필요에 맞게 설정 수정

**4단계**: Claude Code 재시작

## 예제 설정

프로젝트 루트의 `.claude/vlossom-styleset.local.md` 파일:

```markdown
---
enabled: true
components_path: "./src/components"
guidelines_path: "./STYLE_SET_GUIDELINES.md"
strict_mode: true
---

# Vlossom StyleSet Plugin Configuration

이 프로젝트의 Vlossom StyleSet 플러그인 설정입니다.

## 설정 설명

- **enabled**: 플러그인 활성화 여부
- **components_path**: 컴포넌트가 위치한 디렉토리 경로
- **guidelines_path**: StyleSet 가이드라인 문서 경로
- **strict_mode**: 엄격한 검증 모드 (true일 때 모든 규칙 강제 적용)

## 커스터마이징

프로젝트 구조에 맞게 경로를 수정하세요:

- 컴포넌트가 `packages/ui/src/components`에 있다면:
  ```yaml
  components_path: "./packages/ui/src/components"
  ```

- 가이드라인 문서가 다른 위치에 있다면:
  ```yaml
  guidelines_path: "./docs/STYLE_SET.md"
  ```

- 검증을 느슨하게 하려면:
  ```yaml
  strict_mode: false
  ```
```

## 설정 필드 상세 설명

### enabled
- **타입**: `boolean`
- **기본값**: `true`
- **설명**: 플러그인을 활성화/비활성화합니다. `false`로 설정하면 플러그인이 동작하지 않습니다.

### components_path
- **타입**: `string`
- **기본값**: `"./src/components"`
- **설명**: 컴포넌트 디렉토리의 상대 경로입니다.
- **예시**:
  - `"./src/components"`
  - `"./packages/vlossom/src/components"`
  - `"./libs/ui/components"`

### guidelines_path
- **타입**: `string`
- **기본값**: `"./STYLE_SET_GUIDELINES.md"`
- **설명**: StyleSet 가이드라인 문서의 상대 경로입니다.
- **예시**:
  - `"./STYLE_SET_GUIDELINES.md"`
  - `"./docs/design-system/STYLESET.md"`
  - `"./DESIGN_GUIDELINES.md"`

### strict_mode
- **타입**: `boolean`
- **기본값**: `true`
- **설명**:
  - `true`: 모든 검증 규칙을 엄격하게 적용합니다. 권장 사항을 따르지 않으면 경고를 표시합니다.
  - `false`: 느슨한 검증 모드입니다. 중요한 규칙만 검사하고 권장 사항은 무시합니다.

## 여러 프로젝트 설정 예시

### 예시 1: 모노레포 프로젝트
```markdown
---
enabled: true
components_path: "./packages/design-system/src/components"
guidelines_path: "./docs/styleset-guide.md"
strict_mode: true
---

# Monorepo StyleSet Configuration

모노레포 환경에서 design-system 패키지의 컴포넌트를 대상으로 합니다.
```

### 예시 2: 기존 프로젝트 마이그레이션 중
```markdown
---
enabled: true
components_path: "./src/components"
guidelines_path: "./STYLE_SET_GUIDELINES.md"
strict_mode: false
---

# Migration in Progress

기존 컴포넌트를 마이그레이션하는 중이므로 strict_mode를 false로 설정했습니다.
마이그레이션 완료 후 true로 변경할 예정입니다.
```

### 예시 3: 플러그인 비활성화
```markdown
---
enabled: false
components_path: "./src/components"
guidelines_path: "./STYLE_SET_GUIDELINES.md"
strict_mode: true
---

# Temporarily Disabled

현재 대규모 리팩토링 작업 중이므로 플러그인을 일시적으로 비활성화했습니다.
```

## .gitignore 설정

프로젝트의 `.gitignore`에 다음을 추가하여 개인 설정 파일이 커밋되지 않도록 하세요:

```gitignore
# Claude Code local settings
.claude/*.local.md
.claude/*.local.json
```

## 주의사항

1. **재시작 필요**: 설정 파일을 수정한 후에는 Claude Code를 재시작해야 변경 사항이 적용됩니다.

2. **경로는 상대 경로**: 모든 경로는 프로젝트 루트를 기준으로 한 상대 경로여야 합니다.

3. **YAML 문법**: Frontmatter는 YAML 형식이므로 문법을 정확히 지켜야 합니다.
   - 문자열에 특수문자가 있으면 따옴표로 감싸세요: `"./path/with spaces"`
   - 불린 값은 따옴표 없이: `true`, `false`

4. **개인 설정**: 이 파일은 개인 설정이므로 git에 커밋하지 마세요.

## 문제 해결

### 설정이 적용되지 않아요
- Claude Code를 재시작했는지 확인하세요
- 파일 경로가 `.claude/vlossom-styleset.local.md`인지 확인하세요
- YAML frontmatter 문법이 올바른지 확인하세요

### 경로를 찾을 수 없다는 오류가 나요
- `components_path`가 프로젝트 루트 기준 상대 경로인지 확인하세요
- 해당 경로에 실제로 컴포넌트 디렉토리가 있는지 확인하세요

### 플러그인이 동작하지 않아요
- `enabled: true`로 설정되어 있는지 확인하세요
- 플러그인이 올바르게 설치되었는지 확인하세요: `claude --plugins`
