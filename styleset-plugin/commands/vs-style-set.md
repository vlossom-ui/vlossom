---
name: vs-style-set
description: Vlossom StyleSet 생성, 마이그레이션, 리뷰 도구
argument-hint: <action> <component>
allowed-tools: ["Read", "Write", "Edit", "Grep", "Glob", "Bash"]
---

# Vlossom StyleSet 도구

Vlossom 디자인 시스템의 StyleSet을 생성, 마이그레이션, 리뷰하는 통합 커맨드입니다.

## 사용법

```bash
/vs-style-set create VsButton       # 새 StyleSet 생성
/vs-style-set migrate VsCard        # 기존 컴포넌트 마이그레이션
/vs-style-set review VsInput        # StyleSet 리뷰
```

## 인자

- **action**: 작업 유형 (`create` | `migrate` | `review`)
- **component**: 컴포넌트 이름 (예: `VsButton`) 또는 경로 (예: `./src/components/vs-button`)

## 실행 프로세스

### 1단계: 인자 파싱

사용자가 제공한 인자를 파싱합니다:

- 첫 번째 인자(`$1`): action
- 두 번째 인자(`$2`): component

인자가 부족하면 사용법을 안내합니다.

### 2단계: 설정 로드

프로젝트 설정 파일 `.claude/vlossom-styleset.local.md`이 있는지 확인합니다.

있으면 설정을 로드하고, 없으면 기본값을 사용합니다:

**기본 설정**:
- `components_path`: `"./src/components"`
- `guidelines_path`: `"./STYLE_SET_GUIDELINES.md"`
- `strict_mode`: `true`

### 3단계: 컴포넌트 경로 확인

`component` 인자를 기반으로 실제 파일 경로를 찾습니다:

**컴포넌트 이름인 경우** (예: `VsButton`):
- `{components_path}/vs-button/` 디렉토리 탐색
- 필요한 파일 확인:
  - `types.ts`
  - `VsButton.vue`
  - `VsButton.css`

**경로인 경우** (예: `./src/components/vs-button`):
- 해당 경로에서 직접 파일 확인

파일을 찾지 못하면 오류 메시지를 표시합니다.

### 4단계: Action 실행

#### CREATE

**목적**: 새 컴포넌트의 StyleSet을 생성합니다.

**프로세스**:

1. **요구사항 분석**:
   - 컴포넌트 분석 질문 (이름, 기능, 구조, 하위 컴포넌트)
   - 스타일 분석 질문 (자주 변경되는 스타일, 상태별 스타일 등)

2. **Variables 설계**:
   - 4가지 기준으로 각 속성 평가 (빈도, 런타임, 재사용, 명확성)
   - Variables 구조 결정 (단순 변수 vs 그룹화 변수)

3. **타입 정의 작성**:
   - `types.ts` 파일 생성
   - `Vs[ComponentName]StyleSet` 인터페이스 정의
   - JSDoc 주석 추가

4. **컴포넌트 구현**:
   - `Vs[ComponentName].vue` 생성 또는 수정
   - `useStyleSet` composable 사용
   - Template에 스타일 바인딩

5. **CSS 작성**:
   - `Vs[ComponentName].css` 생성
   - CSS 변수 선언
   - 디자인 토큰 사용

6. **검증**:
   - 체크리스트로 검증 (타입 정의, 컴포넌트, CSS)

**참고**: `style-set-create` 스킬의 가이드를 따릅니다.

#### MIGRATE

**목적**: 기존 컴포넌트를 새로운 StyleSet 시스템으로 마이그레이션합니다.

**프로세스**:

1. **분석 (Analysis)**:
   - 현재 상태 파악 (types.ts, .vue, .css 파일 읽기)
   - 사용 패턴 조사 (프로젝트 전체에서 styleSet 사용 확인)
   - 문제점 파악 (Old System 체크리스트)

2. **설계 (Design)**:
   - Variables 재설계 (4가지 질문으로 필터링)
   - 새 인터페이스 설계 (variables + component 구조)
   - Breaking Changes 문서화

3. **구현 (Implementation)**:
   - 타입 정의 수정
   - 컴포넌트 코드 수정
   - CSS 리팩토링

4. **테스트 (Testing)**:
   - 단위 테스트 실행 (있는 경우)
   - 통합 테스트 확인
   - 시각적 회귀 테스트 권장

5. **문서화 (Documentation)**:
   - README 업데이트
   - CHANGELOG 작성
   - Breaking Changes 마이그레이션 가이드

**참고**: `style-set-migrate` 스킬의 가이드를 따릅니다.

#### REVIEW

**목적**: StyleSet 코드를 리뷰하고 개선 제안을 제공합니다.

**프로세스**:

1. **파일 수집**:
   - `types.ts`, `.vue`, `.css` 파일 읽기

2. **철학 준수 검증**:
   - 타입 정의 체크리스트 (variables, component 구조)
   - 컴포넌트 구현 체크리스트 (useStyleSet, template 적용)
   - CSS 스타일 체크리스트 (변수명, fallback, 디자인 토큰)

3. **안티패턴 탐지**:
   - 과도한 변수 노출
   - 깊은 중첩 (3단계 이상)
   - 의미 없는 그룹핑
   - CSS에서 모든 것을 변수로

4. **개선 제안 생성**:
   - 각 문제점에 대해:
     - 현재 문제
     - 왜 문제인가
     - 개선 방안
     - 예상 효과

5. **리뷰 리포트 작성**:
   - 요약 (검증 항목, 통과/개선 필요)
   - 잘된 점
   - 개선이 필요한 부분
   - 개선 후 기대 효과

**참고**: `style-set-review` 스킬의 가이드를 따릅니다.

## 출력 형식

### CREATE
```
✅ VsButton StyleSet 생성 완료

생성된 파일:
- src/components/vs-button/types.ts
- src/components/vs-button/VsButton.vue
- src/components/vs-button/VsButton.css

다음 단계:
1. 생성된 코드를 검토하세요
2. 필요한 경우 추가 조정하세요
3. 테스트를 실행하세요
```

### MIGRATE
```
✅ VsCard 마이그레이션 완료

변경된 파일:
- src/components/vs-card/types.ts (수정)
- src/components/vs-card/VsCard.vue (수정)
- src/components/vs-card/VsCard.css (리팩토링)

Breaking Changes:
- height 속성 제거 → component.height 사용
- backgroundColor 제거 → component.backgroundColor 사용

다음 단계:
1. Breaking Changes를 확인하세요
2. 영향받는 코드를 업데이트하세요
3. 테스트를 실행하세요
```

### REVIEW
```
# Style-Set 리뷰: VsInput

## 📊 요약
- 검증 항목: 12개
- ✅ 통과: 8개
- ⚠️ 개선 필요: 4개

## ✅ 잘된 점
- variables 섹션이 명확하게 분리되어 있습니다
- CSS 변수명이 규칙을 따릅니다

## ⚠️ 개선이 필요한 부분

### 1. 과도한 변수 노출
**파일**: types.ts:10-20
**문제**: ...
**개선안**: ...
**효과**: ...
```

## 에러 처리

### 인자 부족
```
❌ 사용법: /vs-style-set <action> <component>

예시:
  /vs-style-set create VsButton
  /vs-style-set migrate VsCard
  /vs-style-set review VsInput
```

### 잘못된 action
```
❌ 잘못된 action: 'test'

사용 가능한 action:
  - create: 새 StyleSet 생성
  - migrate: 기존 컴포넌트 마이그레이션
  - review: StyleSet 리뷰
```

### 컴포넌트 찾을 수 없음
```
❌ 컴포넌트를 찾을 수 없습니다: VsButton

확인 사항:
  - 컴포넌트 이름이 올바른지 확인하세요
  - 컴포넌트 경로 설정을 확인하세요 (.claude/vlossom-styleset.local.md)
  - 현재 components_path: ./src/components
```

## 주의사항

1. **기존 파일 백업**: 마이그레이션 작업 전에 반드시 git commit 또는 백업을 수행하세요.

2. **Breaking Changes**: 마이그레이션은 Breaking Changes를 동반할 수 있습니다. 영향받는 코드를 확인하세요.

3. **테스트 필수**: 생성 또는 마이그레이션 후 반드시 테스트를 실행하세요.

4. **가이드라인 참고**: 더 자세한 내용은 `STYLE_SET_GUIDELINES.md`를 참조하세요.

## 관련 스킬

- `style-set-create`: 새 StyleSet 생성 가이드
- `style-set-migrate`: 마이그레이션 가이드
- `style-set-review`: 리뷰 가이드

## Tips

- **컴포넌트 이름 자동 추론**: 경로를 제공하면 컴포넌트 이름을 자동으로 추론합니다.
- **대화형 모드**: 정보가 부족하면 대화형으로 추가 정보를 요청합니다.
- **점진적 적용**: 한 번에 하나의 컴포넌트씩 작업하는 것을 권장합니다.
