---
name: style-set-review
description: Style-Set 코드를 v2.0.0+ 컨벤션에 맞게 리뷰하고 개선 제안
---

# Style-Set 코드 리뷰

기존 컴포넌트의 StyleSet 구현이 **v2.0.0+ 컨벤션** ( `extends CSSProperties` + `$` prefix) 을 따르는지 검증하고 개선 방안을 제시합니다.

## 사용 시기

- StyleSet 코드 PR 리뷰 시
- 새 StyleSet 작성 후 검증
- 레거시 컴포넌트의 개선 포인트 파악

## 컨벤션 요약 (반드시 숙지)

`VsXxxStyleSet`은 `CSSProperties`를 상속하며 키는 `$` prefix 유무로 구분됩니다.

| 키 형태 | 처리 |
|---------|------|
| `width`, `padding`, ... (non-`$`) | 루트에 inline style → `componentInlineStyle` |
| `$X` (string/number) | CSS 변수 `--vs-{kebab-component}-X` → `styleSetVariables` |
| `$X` (object) | 슬롯/요소 또는 하위 StyleSet → `componentStyleSet.$X` |

```typescript
export interface VsButtonStyleSet extends CSSProperties {
    $padding?: string;
    $content?: CSSProperties;
    $loading?: VsLoadingStyleSet;
}
```

> 자세한 규칙: [STYLE_SET_GUIDELINES.md](../../../guidelines/STYLE_SET_GUIDELINES.md)

## 리뷰 프로세스

### 1단계: 파일 수집

- `types.ts` — StyleSet 인터페이스
- `[Component].vue` — `useStyleSet` 사용, template 바인딩
- `[Component].css` — CSS 변수 및 fallback
- `README.md` / `README.ko.md` — Types 섹션이 최신 인터페이스를 반영하는지

### 2단계: 체크리스트

#### ✅ 타입 정의 (`types.ts`)

**기본 구조**
- [ ] 인터페이스명이 `Vs[ComponentName]StyleSet`인가?
- [ ] `extends CSSProperties`로 선언되어 있는가?
- [ ] `component?: CSSProperties` 같은 **래퍼 키가 없는가**? (root는 `extends`로 이미 노출됨)
- [ ] 옛 `variables?: { ... }` 구조가 남아있지 않은가?
- [ ] 모든 슬롯/변수 키가 `$` prefix를 갖는가?

**`$X` 노출 기준 (4가지 모두 충족해야 함)**
- [ ] `.css`에서 실제로 사용되는가? (calc, 의사 요소, 상태 셀렉터)
- [ ] 사용자가 자주 커스터마이징하는가?
- [ ] 여러 곳에서 재사용되는 값인가?
- [ ] 명확한 의미와 용도가 있는가?

> 위 조건을 만족 못 하는 속성은 `$X`로 노출하지 말 것. 사용자는 root CSSProperties로 임의 스타일을 자유롭게 줄 수 있다.

**ColorScheme 충돌**
- [ ] 기본 테마 색상(`$backgroundColor`, `$fontColor`)을 `$X`로 노출하지 않았는가? (ColorScheme이 담당)

**네이밍**
- [ ] 상태 수식어가 **nested-state 패턴**인가? (`$step.$active` ✅, `$activeStep` ❌)
- [ ] 속성명이 **내용 기반**인가? (`$content` ✅, `$expand` ❌)
- [ ] 그룹명이 의미 있는가? (`$styles`, `$config` ❌)

**중첩 깊이**
- [ ] 2단계 이상 중첩이 없는가? (예외: `$X` (object) → 자식 StyleSet은 허용)

**하위 컴포넌트**
- [ ] 하위 Vlossom 컴포넌트 StyleSet 타입을 올바르게 import/참조하는가?
- [ ] form 계열이면 `$wrapper?: VsInputWrapperStyleSet`가 포함되었는가?

**타입 안전성**
- [ ] 제한된 CSS 값은 `CSSProperties['property'] & {}` 패턴인가?

#### ✅ 컴포넌트 구현 (`.vue`)

**`useStyleSet` 사용**
- [ ] 세 가지 반환값을 모두 destructure했는가? — `componentStyleSet`, `styleSetVariables`, `componentInlineStyle`
- [ ] `baseStyleSet`이 고정값이면 `ref({...})`를, 다른 props에 반응해야 하면 `computed(() => ({...}))`를 사용했는가?
- [ ] `additionalStyleSet`은 props에서 파생된 동적 값에만 사용했는가? (불필요하게 사용자 styleSet을 덮어쓰지 않는가)

**Template 바인딩**
- [ ] 루트 요소 `:style="{ ...styleSetVariables, ...componentInlineStyle }"` 패턴인가?
- [ ] 슬롯/요소에 `componentStyleSet.$X`를 `:style`로 바인딩했는가?
- [ ] 하위 컴포넌트에 `componentStyleSet.$X`를 `:style-set`로 전달했는가?
- [ ] 상태 스타일은 `computed`로 base + 상태 스타일을 머지해 적용하는가?

**기타**
- [ ] 같은 모듈 import가 한 줄로 통합되어 있는가?
- [ ] 불필요한 주석이 없는가?

#### ✅ CSS (`.css`)

**변수 정의**
- [ ] 변수명이 `--vs-{component-kebab}-{property}` 형식인가?
- [ ] 인터페이스의 모든 `$X` primitive에 대응하는 변수가 선언되고 *실제로 사용*되는가?
- [ ] 인터페이스에 없는 잉여 CSS 변수가 남아있지 않은가?

**값 사용**
- [ ] 자주 변경되지 않는 값은 변수 없이 직접 사용했는가?
- [ ] CSS 변수에 적절한 fallback이 있는가?
- [ ] 디자인 토큰(`var(--vs-comp-bg)` 등)을 우선 사용하는가?
- [ ] rem 단위를 우선 사용했는가? (px 지양)

#### ✅ 문서

- [ ] `README.md`의 **Types** 섹션이 최신 인터페이스를 그대로 반영하는가?
- [ ] 예시가 새 컨벤션(`$X`, root CSSProperties)을 따르는가?

### 3단계: 안티패턴 탐지

**❌ 1. 옛 `variables?: {} / component?:` 구조**
```typescript
// BAD
export interface VsButtonStyleSet {
    variables?: { padding?: string };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}

// GOOD
export interface VsButtonStyleSet extends CSSProperties {
    $padding?: string;
    $content?: CSSProperties;
    $loading?: VsLoadingStyleSet;
}
```

**❌ 2. 래퍼 키 (root CSSProperties 중복 노출)**
```typescript
// BAD — extends CSSProperties와 중복
export interface VsBoxStyleSet extends CSSProperties {
    component?: CSSProperties;
}
```

**❌ 3. 과도한 `$X` 노출**
```typescript
// BAD — .css에서 변수로 쓰이지 않는데 노출
export interface VsButtonStyleSet extends CSSProperties {
    $width?: string;
    $height?: string;
    $margin?: string;
    $backgroundColor?: string;
    $boxShadow?: string;
}

// GOOD — root CSSProperties로 충분; 진짜 필요한 것만 $X
export interface VsButtonStyleSet extends CSSProperties {
    $content?: CSSProperties;
    $loading?: VsLoadingStyleSet;
}
```

**❌ 4. ColorScheme 영역 침범**
```typescript
// BAD — 테마 색상은 ColorScheme이 담당
$backgroundColor?: string;
$fontColor?: string;
```

**❌ 5. State 수식어 flatten**
```typescript
// BAD
$step?: CSSProperties;
$activeStep?: CSSProperties;
$stepActive?: CSSProperties;

// GOOD — nested-state
$step?: CSSProperties & {
    $active?: CSSProperties;
};
```

**❌ 6. 동작 기반 네이밍**
```typescript
// BAD — 무엇을 '하는지'
$expand?: CSSProperties;

// GOOD — 무엇'인지'
$content?: CSSProperties;
```

**❌ 7. CSS에서 모든 것을 변수로**
```css
/* BAD */
.vs-button {
    --vs-button-backgroundColor: initial;
    --vs-button-border: initial;
    --vs-button-borderRadius: initial;
    --vs-button-padding: initial;
    background-color: var(--vs-button-backgroundColor, var(--vs-comp-bg));
    border: var(--vs-button-border, 1px solid var(--vs-line-color));
}

/* GOOD */
.vs-button {
    --vs-button-padding: initial;
    background-color: var(--vs-comp-bg);
    border: 1px solid var(--vs-line-color);
    padding: var(--vs-button-padding, 0.75rem 1.5rem);
}
```

**❌ 8. 인터페이스와 CSS 변수 불일치**
- 인터페이스에 `$arrowSize` 있지만 CSS에 `--vs-x-arrowSize`가 없거나, 반대로 CSS에는 있지만 인터페이스에 없는 경우.

**❌ 9. 루트 inline style spread 누락**
```vue
<!-- BAD — componentInlineStyle 누락 → 사용자가 root CSS를 넣어도 안 먹음 -->
<div :style="styleSetVariables">

<!-- GOOD -->
<div :style="{ ...styleSetVariables, ...componentInlineStyle }">
```

**❌ 10. px 단위 남용**
```css
/* BAD */
padding: 12px 16px;
font-size: 14px;

/* GOOD */
padding: 0.75rem 1rem;
font-size: var(--vs-size-font);
```

### 4단계: 개선 제안 작성

각 문제마다:
1. **현재 문제** — 어디가 컨벤션에 어긋나는지 (file:line)
2. **이유** — 어떤 규칙/원칙 위반인지
3. **개선안** — 구체적 수정 코드
4. **효과** — 개선 후 이점

### 5단계: 리포트 형식

```markdown
# Style-Set 리뷰: [ComponentName]

## 📊 요약
- 검증 항목: X개
- ✅ 통과: Y개
- ⚠️ 개선 필요: Z개

## ✅ 잘된 점
- ...

## ⚠️ 개선이 필요한 부분

### 1. [문제 제목]
**파일**: `path/to/file.ts:line`
**문제**: [현재 코드]
**이유**: [어떤 원칙 위반]
**개선안**: [수정된 코드]
**효과**: [이점]

## 📈 개선 후 기대 효과
- API 표면적 X% 감소 등
```

## 예제

### 입력 (옛 컨벤션)
```typescript
export interface VsCardStyleSet {
    variables?: {
        width?: string;
        backgroundColor?: string;
        padding?: string;
    };
    component?: CSSProperties;
    title?: { backgroundColor?: string; padding?: string };
}
```

### 출력 (요약)

```markdown
## ⚠️ 개선이 필요한 부분

### 1. 옛 `variables / component` 구조 사용
**파일**: `types.ts:1-9`
**문제**: v2.0.0+ 컨벤션은 `extends CSSProperties` + `$` prefix.
**개선안**:
\`\`\`typescript
export interface VsCardStyleSet extends CSSProperties {
    $title?: CSSProperties;
}
\`\`\`
- `width`, `padding` 등은 root CSSProperties로 자동 노출됨.
- `backgroundColor`는 ColorScheme이 담당 (제거).
- `$title.backgroundColor`도 사용자가 직접 줄 수 있으니 `$title: CSSProperties`로 단순화.

**효과**:
- API 표면적 70% 감소
- ColorScheme과 일관성
- 사용자가 root CSS를 자유롭게 전달 가능
```

## 리뷰 원칙

1. **건설적**: 문제만이 아니라 구체적 개선 코드를 제공
2. **근거 기반**: 어떤 규칙·원칙을 위반했는지 명시
3. **우선순위**: 컨벤션 위반 > 안티패턴 > 사소한 개선
4. **칭찬도 포함**: 잘된 부분도 짚어주기
5. **교육적**: 왜 이게 문제인지 철학과 연결해 설명

## 참고 문서

- [STYLE_SET_GUIDELINES.md](../../../guidelines/STYLE_SET_GUIDELINES.md)
- [useStyleSet](../../../packages/vlossom/src/composables/style-set/README.md)
- 모범 예: [VsButton](../../../packages/vlossom/src/components/vs-button/), [VsSelect](../../../packages/vlossom/src/components/vs-select/), [VsAccordion](../../../packages/vlossom/src/components/vs-accordion/)

## 사용 방법

```
/style-set-review VsButton
/style-set-review packages/vlossom/src/components/vs-card
```
