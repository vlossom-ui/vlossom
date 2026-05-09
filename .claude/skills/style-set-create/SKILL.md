---
name: style-set-create
description: 새로운 컴포넌트의 StyleSet을 철학에 맞게 생성
---

# Style-Set 생성 가이드

새로운 컴포넌트의 StyleSet을 "최소한의 변수, 최대한의 유연성" 철학에 맞게 설계하고 구현합니다.

## 사용 시기

- 새로운 컴포넌트를 만들 때
- StyleSet 설계 방향이 불확실할 때
- 철학에 맞는 구현을 처음부터 하고 싶을 때

## Style-Set 컨벤션 (v2.0.0+)

`VsXxxStyleSet`은 `CSSProperties`를 상속(extends)하며, 키는 `$` prefix 유무로 구분됩니다.

| 키 형태 | 의미 | 처리 |
|---------|------|------|
| `width`, `padding`, ... (non-`$`) | 표준 CSS — 컴포넌트 루트에 inline style로 적용 | `componentInlineStyle`로 자동 수집 |
| `$X` (string/number) | CSS 변수로 노출 | `--vs-{kebab-component}-X`로 emit (`styleSetVariables`) |
| `$X` (object) | 슬롯/요소 스타일 또는 하위 StyleSet | `componentStyleSet.$X`로 직접 접근 |

```typescript
import type { CSSProperties } from 'vue';

export interface VsButtonStyleSet extends CSSProperties {
    $padding?: string;            // CSS 변수: --vs-button-padding
    $content?: CSSProperties;     // 슬롯
    $loading?: VsLoadingStyleSet; // 하위 컴포넌트
}
```

> 💡 root에 `CSSProperties`가 있고 `$` prefix로 슬롯/변수가 분리되므로 키 충돌이 발생하지 않습니다.

## 생성 프로세스

### 1단계: 요구사항 분석

#### 컴포넌트 분석
1. **컴포넌트 이름**: `Vs[ComponentName]`
2. **주요 기능**: 이 컴포넌트는 무엇을 하는가?
3. **시각적 구조**: 어떤 주요 요소들로 구성되는가?
4. **하위 컴포넌트**: 다른 Vlossom 컴포넌트를 사용하는가?

#### 스타일 분석
1. **자주 변경되는 스타일**: 사용자가 자주 조정할 것 같은 속성은?
2. **고정 스타일**: 변하지 않아야 할 디자인 요소는?
3. **상태별 스타일**: hover, focus, disabled 등 상태가 있는가?
4. **테마 변형**: primary, outline 같은 변형이 필요한가?

### 2단계: 키 분류

각 스타일 속성에 대해 결정 트리를 적용:

```
이 속성을 외부에서 자주 커스터마이징하나?
├── No → CSS에 직접 하드코딩 (디자인 토큰: var(--vs-comp-bg) 등)
└── Yes → 어떻게 노출할지 결정
    ├── 임의의 CSS로 자유롭게 변경 가능 → root CSSProperties (extends로 노출됨)
    ├── CSS 변수로 .css 안에서 fallback과 함께 사용 → $X primitive
    ├── 특정 슬롯/요소만 스타일링 → $X: CSSProperties
    └── 하위 컴포넌트 전체 스타일 전파 → $X: VsXxxStyleSet
```

#### `$X` (CSS 변수) 사용 기준 (4가지 모두 Yes여야 함)

- [ ] **빈도**: 사용자가 자주 커스터마이징하는가?
- [ ] **CSS 활용**: `.css`에서 `calc()` 등으로 다른 속성과 연동되는가?
- [ ] **재사용**: 여러 곳에서 재사용되는 값인가?
- [ ] **명확성**: 명확한 의미와 용도가 있는가?

> 위 4가지를 만족하지 않는다면 root CSSProperties로 자유롭게 두는 편이 낫습니다 (예: `width`, `height`, `padding`은 root에서 직접 받는 게 일반적).

### 3단계: 타입 정의 작성

```typescript
import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type Vs[ComponentName] from './Vs[ComponentName].vue';

// 하위 컴포넌트가 있다면 import
import type { VsChildStyleSet } from '@/components/vs-child/types';

declare module 'vue' {
    interface GlobalComponents {
        Vs[ComponentName]: typeof Vs[ComponentName];
    }
}

export type { Vs[ComponentName] };

export interface Vs[ComponentName]Ref extends ComponentPublicInstance<typeof Vs[ComponentName]> {}

export interface Vs[ComponentName]StyleSet extends CSSProperties {
    /** CSS 변수: --vs-[component]-arrowSize */
    $arrowSize?: string;

    /** 슬롯/요소 스타일 */
    $element?: CSSProperties;

    /** 하위 컴포넌트 StyleSet */
    $childComponent?: VsChildStyleSet;
}
```

> `extends CSSProperties`로 root에 표준 CSS가 자동으로 노출되므로, 별도의 `component?: CSSProperties` 키는 필요 없습니다.

### 4단계: 컴포넌트 구현

#### Setup 함수

```typescript
import { computed, defineComponent, ref, toRefs, type ComputedRef, type Ref } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { objectUtil } from '@/utils';
import type { Vs[ComponentName]StyleSet } from './types';

const componentName = VsComponent.Vs[ComponentName];

export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<Vs[ComponentName]StyleSet>(),
        // 기타 props
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        // 하위 컴포넌트 기본값 (고정값이면 ref 권장, 반응성 필요시 computed)
        const baseStyleSet: Ref<Vs[ComponentName]StyleSet> = ref({
            $childComponent: {
                width: '100%',  // 자식의 root CSSProperties
            },
        });

        // props에서 동적 값이 오면 root에 직접 (CSSProperties extends 덕분에 평탄)
        const additionalStyleSet = computed<Vs[ComponentName]StyleSet>(() => {
            return objectUtil.shake({
                height: props.height || undefined,
            });
        });

        const { componentStyleSet, styleSetVariables, componentInlineStyle } =
            useStyleSet<Vs[ComponentName]StyleSet>(
                componentName,
                styleSet,
                baseStyleSet,       // 3번째: 기본값 (가장 낮은 우선순위)
                additionalStyleSet, // 4번째: props 동적 값 (가장 높은 우선순위)
            );

        return {
            colorSchemeClass,
            styleSetVariables,
            componentInlineStyle,
            componentStyleSet,
        };
    },
});
```

#### useStyleSet 인자 규칙

| 인자                       | 용도                              | 반응성                                                   |
| -------------------------- | --------------------------------- | -------------------------------------------------------- |
| `baseStyleSet` (3번째)     | 하위 컴포넌트 기본값, 고정 스타일 | `ref({})` 권장 (고정값), `computed` 허용 (반응성 필요시) |
| `additionalStyleSet` (4번째) | props에서 오는 동적 값 (최우선)  | `computed` (항상 반응성 필요)                            |

> **성능 팁**: 고정값은 `ref({...})`가 `computed(() => ({...}))`보다 효율적이지만, 둘 다 허용됩니다.

#### Template

```vue
<template>
    <div
        :class="['vs-[component-name]', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
    >
        <!-- 슬롯/요소 -->
        <div
            class="vs-[component-name]-element"
            :style="componentStyleSet.$element"
        >
            <slot name="element" />
        </div>

        <!-- 하위 컴포넌트 -->
        <vs-child-component
            :style-set="componentStyleSet.$childComponent"
        />

        <slot />
    </div>
</template>
```

핵심 포인트:
1. **루트 요소**: `{ ...styleSetVariables, ...componentInlineStyle }` 두 가지를 spread
2. **슬롯/요소**: `componentStyleSet.$X` (CSSProperties)
3. **하위 컴포넌트**: `componentStyleSet.$X` (StyleSet)

### 5단계: CSS 작성

```css
.vs-[component-name] {
    /* CSS 변수 선언 ($X primitive로 정의된 것만) */
    --vs-[component-name]-arrowSize: initial;

    /* 레이아웃과 기본 스타일 (직접 값) */
    display: flex;
    flex-direction: column;

    /* CSS 변수 사용 (적절한 fallback 포함) */
    padding-right: var(--vs-[component-name]-arrowSize, 1rem);

    /* 디자인 토큰 사용 */
    background-color: var(--vs-comp-bg);
    color: var(--vs-comp-font);
    border-radius: calc(var(--vs-radius-ratio) * var(--vs-radius-md));
}

.vs-[component-name]-element {
    /* 직접 스타일 (변수 없이) */
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* 상태별 스타일 */
.vs-[component-name]:hover {
    opacity: 0.9;
}

.vs-[component-name].vs-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

### 6단계: 검증 체크리스트

생성 완료 후 확인:

#### 타입 정의
- [ ] 인터페이스명이 `Vs[ComponentName]StyleSet`인가?
- [ ] `extends CSSProperties`로 선언되어 있는가?
- [ ] `$component?: CSSProperties` 같은 root 래퍼 키가 없는가? (`extends CSSProperties`로 대체됨)
- [ ] `$X` primitive는 정말 CSS 변수로 노출이 필요한 속성만 있는가?
- [ ] `$X` object 키 이름이 명확한가?
- [ ] 하위 컴포넌트 StyleSet이 올바르게 참조되는가?
- [ ] `$wrapper?: VsInputWrapperStyleSet` 포함되었는가? (form 컴포넌트에서 VsInputWrapper 사용 시)
- [ ] 타입 안전한 CSS 속성 타입을 사용했는가? (`CSSProperties['objectFit'] & {}` 등)

#### 네이밍
- [ ] 상태 수식어가 prefix 패턴인가? (`$activeStep` ✅, `$stepActive` ❌)
- [ ] 속성명이 내용을 반영하는가? (`$content` ✅, `$expand` ❌ — 동작이 아닌 내용 기반)
- [ ] import가 같은 모듈에서 통합되었는가?

#### 컴포넌트
- [ ] `useStyleSet`에서 `componentInlineStyle`을 destructure했는가?
- [ ] root `:style`에 `{ ...styleSetVariables, ...componentInlineStyle }`을 spread했는가?
- [ ] `baseStyleSet`이 고정값이면 `ref` 사용을 검토했는가? (`computed`도 허용, `ref` 권장)
- [ ] 하위 컴포넌트에 `:style-set="componentStyleSet.$X"`로 전달하는가?
- [ ] README.md의 Types 섹션이 새 StyleSet 구조(extends CSSProperties)를 반영하는가?

#### CSS
- [ ] 변수명이 `--vs-[component]-[property]` 규칙을 따르는가?
- [ ] 불필요한 CSS 변수가 없는가?
- [ ] fallback 값이 적절한가? (디자인 토큰 우선: `var(--vs-comp-bg)`)
- [ ] rem 단위를 우선 사용했는가? (px 대신 rem)
- [ ] 기존 CSS 변수가 하위 컴포넌트에서 참조되면 보존했는가?

## 실전 예제

### 요청: "VsCard 컴포넌트 StyleSet 생성"

#### 1단계: 분석

**컴포넌트 분석**:
- 이름: VsCard
- 기능: 콘텐츠를 카드 형태로 표시
- 구조: header, body, footer
- 하위 컴포넌트: 없음

**스타일 분석**:
- 자주 변경: width, padding, shadow → root CSSProperties로 충분
- 고정: border-radius 비율, 기본 배경색 → CSS 직접
- 상태: hover 시 elevation 증가 → CSS만으로 처리
- 변형: primary, outlined → ColorScheme

#### 2단계: 키 분류

- `width`, `height`, `padding`, `boxShadow` → root CSSProperties (extends 덕분에 자동)
- `backgroundColor` → ColorScheme이 처리 (별도 노출 X)
- `borderRadius` → 디자인 시스템 일관성을 위해 CSS 하드코딩
- header/body/footer → 슬롯이므로 `$header`, `$body`, `$footer`

#### 3단계: 타입 정의

```typescript
import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsCard from './VsCard.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsCard: typeof VsCard;
    }
}

export type { VsCard };

export interface VsCardRef extends ComponentPublicInstance<typeof VsCard> {}

export interface VsCardStyleSet extends CSSProperties {
    /** 헤더 영역 스타일 */
    $header?: CSSProperties;

    /** 바디 영역 스타일 */
    $body?: CSSProperties;

    /** 푸터 영역 스타일 */
    $footer?: CSSProperties;
}
```

#### 사용 예시

```vue
<vs-card
    :style-set="{
        width: '320px',
        padding: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        $header: { fontWeight: 600 },
        $footer: { borderTop: '1px solid #eee' },
    }"
/>
```

## 주의사항

### 🚫 하지 말아야 할 것

1. **`$component?: CSSProperties` 같은 래퍼 키 추가**
   - `extends CSSProperties`로 root에 자동 노출됨

2. **모든 속성을 `$X` (CSS 변수)로**
   - `.css`에서 변수가 정말 필요한 경우(`calc()` 연동 등)에만 노출
   - 단순 자유 스타일링은 root CSSProperties로 충분

3. **3단계 이상 중첩**
   - `$X: { $Y: { ... } }`는 자식 StyleSet 자체일 때만 허용

4. **의미 없는 그룹명**
   - `$styles`, `$config` 같은 모호한 이름

### ✅ 해야 할 것

1. **사용자 관점에서 생각** — 어떤 속성을 자주 조정할까?
2. **명확한 네이밍** — 변수명만 봐도 용도를 알 수 있게
3. **적절한 fallback** — CSS 변수는 항상 fallback 제공
4. **문서화** — JSDoc으로 각 속성의 용도 설명

## 도움말

### root CSSProperties vs `$X` 결정이 어려울 때

**root CSSProperties로 (extends에서 자동)**:
- width, height, padding, margin
- 임의의 CSS로 자유롭게 변경되어도 무방한 속성
- 컨테이너 크기·여백 등 일반 스타일

**`$X` primitive (CSS 변수)로**:
- 다른 CSS 속성과 `calc()` 등으로 연동되어야 함
- 특정 요소의 크기 (arrow-size 등)
- 자식 의사 요소(`::after`)에서 참조 필요

**`$X` object (CSSProperties)로**:
- 컴포넌트 내부의 특정 요소/슬롯 스타일
- 사용자가 자유롭게 CSS를 적용할 슬롯

**`$X` (자식 StyleSet)로**:
- 하위 Vlossom 컴포넌트의 스타일을 일괄 제어
- 예: Button의 $loading, Select의 $chip

### 하위 컴포넌트 스타일 전파 여부

**전파하는 경우**:
- 상위 컴포넌트가 하위의 스타일을 제어해야 함
- 일관된 디자인을 위해 일괄 적용 필요
- 예: `$loading` (Button), `$chip` (Select)

**전파하지 않는 경우**:
- 하위 컴포넌트가 독립적으로 동작
- 사용자가 직접 제어해야 함
- slot으로 제공되는 콘텐츠

## 코딩 규칙 (Rules 기반)

### 네이밍 규칙

**상태 수식어는 prefix 패턴 사용:**

```typescript
// ✅ CORRECT: prefix 패턴
$step?: CSSProperties;
$activeStep?: CSSProperties;
$label?: CSSProperties;
$activeLabel?: CSSProperties;

// ❌ WRONG: suffix 패턴
$stepActive?: CSSProperties;
$labelActive?: CSSProperties;
```

**속성명은 내용 기반 (동작이 아닌):**

```typescript
// ✅ CORRECT: 내용을 반영
$content?: CSSProperties; // 무엇이 들어있는지
$title?: CSSProperties;

// ❌ WRONG: 동작을 반영
$expand?: CSSProperties; // 무엇을 하는지
```

### 타입 안전성

**CSSProperties 인덱싱으로 타입 안전한 CSS 값:**

```typescript
// ✅ CORRECT: 타입 안전 (& {}는 자동완성 지원 트릭)
$objectFit?: CSSProperties['objectFit'] & {};

// ❌ WRONG: 범용 string
$objectFit?: string; // 아무 값이나 가능
```

### 성능: computed vs ref

```typescript
// ✅ PREFERRED: 고정값은 ref 사용 (반응성 오버헤드 없음)
const baseStyleSet: Ref<VsButtonStyleSet> = ref({
    $loading: { width: '30%' },
});

// ✅ OK: computed도 허용 (기존 코드에서 광범위 사용)
const baseStyleSet = computed<VsButtonStyleSet>(() => ({
    $loading: { width: '30%' },
}));

// ✅ BEST: baseStyleSet/additionalStyleSet 모두 불필요하면 생략
const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet(componentName, styleSet);
```

### CSS 단위 규칙

```css
/* ✅ CORRECT: rem 단위 우선 */
padding: var(--vs-component-padding, 0.75rem 1rem);
font-size: var(--vs-size-font);
width: 2rem;

/* ❌ WRONG: px 단위 사용 */
padding: 12px 16px;
font-size: 14px;
width: 32px;
```

### ColorScheme과 styleSet의 관계

기본 테마 색상(`--vs-comp-bg`, `--vs-comp-font`)은 별도 노출하지 않음 → ColorScheme이 자동 적용.

```typescript
// ✅ CORRECT: 컴포넌트 고유 속성만 $X로 노출
$arrowSize?: string;

// ❌ WRONG: 기본 테마 색상을 $X로 노출
$backgroundColor?: string; // ColorScheme이 처리해야 함
$fontColor?: string;
```

> 사용자가 임시로 배경색을 바꾸고 싶으면 root CSSProperties(`backgroundColor`)로 직접 넣을 수 있으므로, `$backgroundColor`로 별도 노출할 필요 없습니다.

### 에러 처리: spread 안전성

`useStyleSet`의 반환값은 항상 안전한 객체를 보장하므로, 루트 요소의 기본 패턴은 안전합니다:

```vue
<!-- ✅ SAFE: useStyleSet이 반환한 값은 항상 객체 -->
<div :style="{ ...styleSetVariables, ...componentInlineStyle }">
```

자식 컴포넌트의 StyleSet을 전달할 때는 optional chaining 불필요 (undefined는 `:style-set` prop에서 무시됨):

```vue
<!-- ✅ CORRECT: undefined면 자식 컴포넌트가 기본 동작 -->
<vs-loading :style-set="componentStyleSet.$loading" />
```

### 머지된 styleSet을 자식에 전달하는 패턴

`VsSelect`처럼 부모가 머지한 `componentStyleSet`을 자식(`VsSelectTrigger`)에 그대로 넘기고, 자식에서 inline style만 추출하고 싶을 때는 자식에서 다시 `useStyleSet`을 호출합니다:

```typescript
// VsSelectTrigger.vue
const { componentInlineStyle } = useStyleSet<VsSelectStyleSet>(VsComponent.VsSelect, styleSet);
```

## 참고 문서

- [useStyleSet Composable](../../../packages/vlossom/src/composables/style-set/README.md)
- [기존 컴포넌트 예제](../../../packages/vlossom/src/components/)
- [프로젝트 규칙](../../rules/) — architecture, naming, type-safety 등

## 사용 방법

```
/style-set-create VsCard
```

대화형으로 요구사항을 파악하고 단계별로 생성합니다.
