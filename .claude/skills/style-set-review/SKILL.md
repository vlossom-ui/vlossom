---
name: style-set-review
description: Style-Set 코드를 철학에 맞게 리뷰하고 개선 제안
---

# Style-Set 코드 리뷰

기존 컴포넌트의 StyleSet 구현을 새로운 철학에 맞게 검증하고 개선 방안을 제시합니다.

## 사용 시기

- 새로운 StyleSet을 작성한 후 검증이 필요할 때
- PR 리뷰 시 StyleSet 코드 품질 확인
- 기존 컴포넌트의 개선 포인트 파악
- Style-Set 철학 준수 여부 확인

## 리뷰 프로세스

### 1단계: 파일 수집

다음 파일들을 확인합니다:
- `types.ts`: StyleSet 인터페이스 정의
- `[Component].vue`: 컴포넌트 구현
- `[Component].css`: CSS 스타일 정의

### 2단계: 철학 준수 검증

#### ✅ 체크리스트 1: 타입 정의 (types.ts)

**"Only What Needs to Vary" 원칙**
- [ ] `variables`에 실제로 자주 변경되는 속성만 포함되었는가?
- [ ] 불필요한 CSS 변수가 노출되지 않았는가?
- [ ] 중첩은 최대 2단계까지만 사용되었는가?
- [ ] 각 변수가 명확한 용도를 가지는가?

**명확한 관심사 분리**
- [ ] `variables`는 CSS 변수로 노출할 것만 포함하는가?
- [ ] `component` / 요소별 CSSProperties가 적절히 분리되었는가?
- [ ] 하위 컴포넌트 StyleSet이 올바르게 참조되는가?

**API 품질**
- [ ] 타입명이 `Vs[ComponentName]StyleSet` 규칙을 따르는가?
- [ ] 모든 속성이 optional(`?`)로 정의되었는가?
- [ ] 타입 안전한 CSS 속성을 사용했는가? (`CSSProperties['objectFit'] & {}` 등)
- [ ] props로 받는 값이 StyleSet 인터페이스에 포함되지 않았는가? (additionalStyleSet 내부 구현으로 처리)
- [ ] form 컴포넌트에서 `wrapper?: VsInputWrapperStyleSet`이 포함되었는가?

**네이밍 규칙**
- [ ] 상태 수식어가 prefix 패턴인가? (`activeStep` ✅, `stepActive` ❌)
- [ ] 속성명이 내용을 반영하는가? (`content` ✅, `expand` ❌)

**관심사 분리**
- [ ] 기본 테마 색상(backgroundColor, fontColor)이 variables에 노출되지 않았는가?
- [ ] 상태별 색상(selected, focused 등)은 variables에 적절히 포함되었는가?

#### ✅ 체크리스트 2: 컴포넌트 구현 (.vue)

**useStyleSet 사용**
- [ ] `useStyleSet` 호출이 올바른가?
- [ ] `baseStyleSet`이 필요한 경우 적절히 사용되었는가?
- [ ] `additionalStyleSet`이 4번째 인자로 전달되는가? (3번째에 넣으면 base 자리!)
- [ ] 고정값 baseStyleSet에 `ref` 사용을 검토했는가? (`computed`도 허용)
- [ ] 같은 모듈에서 여러 import가 하나로 통합되었는가?
- [ ] 실제 코드 파일에 불필요한 주석이 없는가? (types.ts, Vue, CSS)
- [ ] README.md의 Types 섹션이 새 StyleSet 구조를 반영하는가?

**Template 적용**
- [ ] 루트 요소에 `styleSetVariables` + `componentStyleSet.component` 적용?
- [ ] 하위 컴포넌트에 `:style-set` prop으로 전파?
- [ ] 특정 요소에 `:style` 바인딩 사용?
- [ ] 스타일 객체 병합 순서가 올바른가? (`{ ...styleSetVariables, ...componentStyleSet.component }`)

#### ✅ 체크리스트 3: CSS 스타일 (.css)

**CSS 변수 정의**
- [ ] 변수명이 `--vs-[component]-[property]` 규칙을 따르는가?
- [ ] 중첩된 변수가 `--vs-[component]-[group]-[property]` 형식인가?
- [ ] 불필요한 CSS 변수가 제거되었는가?

**값 사용 방식**
- [ ] 자주 변경되지 않는 값은 직접 하드코딩되었는가?
- [ ] CSS 변수는 적절한 fallback 값을 가지는가?
- [ ] 디자인 토큰(예: `var(--vs-comp-bg)`)을 우선 사용하는가?

**코드 품질**
- [ ] 중복된 스타일이 제거되었는가?
- [ ] 불필요한 `initial` 값이 정리되었는가?
- [ ] rem 단위를 우선 사용했는가? (px 대신)
- [ ] 하위 컴포넌트에서 참조하는 CSS 변수가 보존되었는가?
- [ ] default 값 설정이 불필요한 속성은 제거했는가? (`opacity: 1`, `height: auto` 등)

### 3단계: 안티패턴 탐지

다음 안티패턴이 있는지 확인:

**❌ 안티패턴 1: 과도한 변수 노출**
```typescript
// BAD
interface VsButtonStyleSet {
    variables?: {
        width?: string;
        height?: string;
        padding?: string;
        margin?: string;
        backgroundColor?: string;
        // ... 너무 많음
    };
}
```

**❌ 안티패턴 2: 깊은 중첩 (3단계 이상)**
```typescript
// BAD
interface VsInputStyleSet {
    variables?: {
        container?: {
            inner?: {
                wrapper?: { /* 너무 깊음! */ }
            }
        }
    }
}
```

**❌ 안티패턴 3: 의미 없는 그룹핑**
```typescript
// BAD
interface VsCardStyleSet {
    variables?: {
        styles?: { /* 의미 없는 이름 */ }
    }
}
```

**❌ 안티패턴 4: CSS에서 모든 것을 변수로**
```css
/* BAD */
.vs-button {
    background-color: var(--vs-button-backgroundColor, var(--vs-comp-bg));
    border: var(--vs-button-border, 1px solid var(--vs-line-color));
    /* 모든 것이 변수... */
}
```

**❌ 안티패턴 5: additionalStyleSet을 3번째 인자에 배치**
```typescript
// BAD - additionalStyleSet이 baseStyleSet 자리에 들어감 (우선순위 낮아짐)
useStyleSet(componentName, styleSet, additionalStyleSet);

// GOOD - 반드시 4번째 인자
useStyleSet(componentName, styleSet, baseStyleSet, additionalStyleSet);

// GOOD - additionalStyleSet만 필요할 때 빈 baseStyleSet 사용
const baseStyleSet: Ref<Vs[ComponentName]StyleSet> = ref({});
useStyleSet(componentName, styleSet, baseStyleSet, additionalStyleSet);
```

**❌ 안티패턴 6: 상태 수식어 suffix 패턴**
```typescript
// BAD - suffix 패턴 (코드베이스 비표준)
stepActive?: CSSProperties;
labelActive?: CSSProperties;

// GOOD - prefix 패턴 (코드베이스 표준)
activeStep?: CSSProperties;
activeLabel?: CSSProperties;
```

**❌ 안티패턴 7: px 단위 사용**
```css
/* BAD */
padding: 12px 16px;
font-size: 14px;

/* GOOD */
padding: 0.75rem 1rem;
font-size: var(--vs-size-font);
```

**❌ 안티패턴 8: 기본 테마 색상을 variables에 노출**
```typescript
// BAD - 기본 테마 색상 (ColorScheme이 자동 관리)
variables?: {
    backgroundColor?: string;  // var(--vs-comp-bg)로 자동 적용됨
    fontColor?: string;        // var(--vs-comp-font)으로 자동 적용됨
};

// GOOD - 컴포넌트 고유 속성만
variables?: {
    padding?: string;
    arrowSize?: string;
};

// OK - 상태별 색상은 variables에 포함 가능
variables?: {
    selected?: {
        backgroundColor?: string;  // 선택 상태의 특수 색상
    };
};
```

**❌ 안티패턴 9: props로 받는 값을 StyleSet 인터페이스에 포함**
```typescript
// BAD - height는 props로 받아서 additionalStyleSet으로 처리됨
export interface VsBarStyleSet {
    variables?: {
        height?: string;  // props.height로 이미 받고 있음
    };
}

// GOOD - props 값은 additionalStyleSet 내부 구현으로만 처리
export interface VsBarStyleSet {
    component?: CSSProperties;
}
```

### 4단계: 개선 제안 생성

각 문제점에 대해:
1. **현재 문제**: 무엇이 철학에 어긋나는가?
2. **왜 문제인가**: 어떤 원칙을 위반했는가?
3. **개선 방안**: 구체적인 코드 수정 제안
4. **예상 효과**: 개선 후 얻을 이점

### 5단계: 리뷰 리포트 작성

다음 형식으로 리포트 작성:

```markdown
# Style-Set 리뷰: [ComponentName]

## 📊 요약
- 검증 항목: X개
- ✅ 통과: Y개
- ⚠️ 개선 필요: Z개

## ✅ 잘된 점
- [구체적인 칭찬]

## ⚠️ 개선이 필요한 부분

### 1. [문제 제목]
**파일**: `path/to/file.ts:line`
**문제**:
[현재 코드]

**이유**:
[어떤 원칙을 위반했는지]

**개선안**:
[수정된 코드]

**효과**:
[개선 후 이점]

## 📈 개선 후 기대 효과
- API 표면적 X% 감소
- CSS 변수 Y개 감소
- 코드 가독성 향상
```

## 예제

### 입력
```typescript
// types.ts
interface VsCardStyleSet {
    width?: string;
    height?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    title?: {
        backgroundColor?: string;
        fontColor?: string;
        height?: string;
        padding?: string;
    };
}
```

### 출력 리포트

```markdown
# Style-Set 리뷰: VsCard

## 📊 요약
- 검증 항목: 12개
- ✅ 통과: 4개
- ⚠️ 개선 필요: 8개

## ⚠️ 개선이 필요한 부분

### 1. variables 섹션 누락
**파일**: `types.ts:1-12`
**문제**:
모든 속성이 루트 레벨에 정의되어 있어 CSS 변수와 직접 스타일의 구분이 없습니다.

**이유**:
"명확한 관심사 분리" 원칙 위반. CSS 변수로 노출할 것과 CSSProperties로 제공할 것을 구분해야 합니다.

**개선안**:
\`\`\`typescript
interface VsCardStyleSet {
    variables?: {
        width?: string;
        border?: string;
    };
    component?: CSSProperties;
    title?: CSSProperties;
}
\`\`\`

**효과**:
- 명확한 커스터마이징 포인트
- 불필요한 변수 노출 방지 (10개 → 2개)
- API 표면적 80% 감소

### 2. 과도한 속성 노출
**파일**: `types.ts:2-7`
**문제**:
`width`, `height`, `backgroundColor`, `border`, `borderRadius`, `padding` 모두 개별 속성으로 노출

**이유**:
"Only What Needs to Vary" 원칙 위반. 실제로 자주 커스터마이징되는 속성만 노출해야 합니다.

**개선안**:
대부분의 속성은 `component?: CSSProperties`로 제공하고, 자주 변경되는 `width`, `border`만 variables로 노출

**효과**:
- 인지 부하 감소
- 타입 안정성 향상
- 유연성은 유지 (CSSProperties로 모든 스타일 가능)
```

## 리뷰 원칙

1. **건설적 비판**: 문제점만이 아니라 개선 방안까지 제시
2. **구체적 예시**: 추상적 조언이 아닌 실제 코드 제공
3. **우선순위**: 중요한 문제부터 다룸
4. **칭찬도 포함**: 잘된 부분도 언급하여 동기부여
5. **교육적**: 왜 그것이 문제인지 철학과 연결하여 설명

## 참고 문서

- [STYLE_SET_GUIDELINES.md](../../../packages/vlossom/STYLE_SET_GUIDELINES.md)
- [useStyleSet Composable](../../../packages/vlossom/src/composables/style-set-composable.ts)
- [VsButton 예제](../../../packages/vlossom/src/components/vs-button/)

## 사용 방법

```
/style-set-review path/to/component
```

또는 컴포넌트 이름만:

```
/style-set-review VsButton
```
