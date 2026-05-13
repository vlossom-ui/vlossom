---
name: style-set-create
description: 새 컴포넌트의 StyleSet을 v2.0.0+ 컨벤션에 맞게 생성
---

# Style-Set 생성 가이드

새로운 컴포넌트의 StyleSet을 v2.0.0+ 컨벤션 (`extends CSSProperties` + `$` prefix) 으로 설계하고 구현합니다.

## 사용 시기

- 새 컴포넌트를 만들 때
- StyleSet 설계 방향이 불확실할 때
- 처음부터 컨벤션을 지키고 싶을 때

## Style-Set 컨벤션

`VsXxxStyleSet`은 `CSSProperties`를 상속하며, 키는 `$` prefix 유무로 구분됩니다.

| 키 형태 | 의미 | 처리 |
|---------|------|------|
| `width`, `padding`, ... (non-`$`) | 표준 CSS — 컴포넌트 루트에 inline style로 적용 | `componentInlineStyle`로 자동 수집 |
| `$X` (string/number) | CSS 변수로 노출 | `--vs-{kebab-component}-X` 로 emit (`styleSetVariables`) |
| `$X` (object) | 슬롯/요소 스타일 또는 하위 StyleSet | `componentStyleSet.$X`로 직접 접근 |

```typescript
import type { CSSProperties } from 'vue';

export interface VsButtonStyleSet extends CSSProperties {
    $padding?: string;            // CSS 변수: --vs-button-padding
    $content?: CSSProperties;     // 슬롯
    $loading?: VsLoadingStyleSet; // 하위 컴포넌트
}
```

> 💡 root는 `extends CSSProperties`로 이미 노출되므로 `component?: CSSProperties` 같은 래퍼 키는 만들지 않습니다.

## 생성 프로세스

### 1단계: 요구사항 분석

#### 컴포넌트 분석
1. **이름**: `Vs[ComponentName]`
2. **기능**: 무엇을 하는가?
3. **시각적 구조**: 어떤 주요 요소들로 구성되는가?
4. **하위 컴포넌트**: 다른 Vlossom 컴포넌트를 사용하는가?

#### 스타일 분석
1. **자주 변경되는 스타일**: 사용자가 자주 조정할 속성은?
2. **고정 스타일**: 변하지 않아야 할 디자인 요소는?
3. **상태별 스타일**: hover, focus, disabled, active, selected 등?
4. **테마 변형**: primary, outline → ColorScheme에서 처리

### 2단계: 키 분류 결정 트리

```
이 속성을 외부에서 자주 커스터마이징하나?
├── No → CSS에 하드코딩 (디자인 토큰 우선: var(--vs-comp-bg) 등)
└── Yes → 어떻게 노출할지 결정
    ├── 임의 CSS로 자유롭게 변경되어도 OK → root CSSProperties (extends 덕분에 자동)
    ├── .css에서 calc/의사 요소/상태 셀렉터에 쓰임 → $X primitive
    ├── 특정 슬롯/요소 스타일링 → $X: CSSProperties
    └── 하위 Vlossom 컴포넌트 전체 스타일 전파 → $X: VsXxxStyleSet
```

#### `$X` primitive (CSS 변수) 사용 기준 — **4가지 모두 Yes일 때만**

- [ ] **CSS 활용**: `.css`에서 `calc()`, 의사 요소(`::after`), 상태 셀렉터에서 실제 사용?
- [ ] **빈도**: 사용자가 자주 커스터마이징하는가?
- [ ] **재사용**: 여러 declaration/요소에서 재사용되는 값?
- [ ] **명확성**: 한 가지 의미와 용도로 명확한가?

> 위 조건에 해당하지 않으면 root CSSProperties로 충분합니다. `width`, `height`, `padding`, `margin`, `boxShadow`, `backgroundColor` 등은 일반적으로 root에서 받는 것이 자연스럽습니다.

#### ColorScheme이 담당하는 영역은 노출하지 말 것

`--vs-comp-bg`, `--vs-comp-font` 등 기본 테마 색상은 ColorScheme이 자동 처리합니다. `$backgroundColor`, `$fontColor`로 별도 노출하지 마세요. 사용자가 일회성으로 바꿔야 한다면 root CSSProperties (`backgroundColor`) 로 직접 줄 수 있습니다.

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
    /** CSS 변수: --vs-[component-kebab]-arrowSize */
    $arrowSize?: string;

    /** 슬롯/요소 스타일 */
    $element?: CSSProperties;

    /** 하위 컴포넌트 StyleSet */
    $childComponent?: VsChildStyleSet;
}
```

> `extends CSSProperties`로 root CSS가 자동 노출되므로 `component?: CSSProperties` 같은 래퍼 키는 만들지 않습니다.

### 4단계: 컴포넌트 구현

#### Setup

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
                width: '100%', // 자식의 root CSSProperties
            },
        });

        // props에서 동적 값이 오면 root에 직접 (extends CSSProperties 덕분에 평탄)
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
                additionalStyleSet, // 4번째: props 동적 값 (가장 높은 우선순위, 사용자 styleSet도 덮음)
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

#### `useStyleSet` 인자 규칙

| 인자                       | 용도                              | 반응성                                                    |
| -------------------------- | --------------------------------- | --------------------------------------------------------- |
| `baseStyleSet` (3번째)     | 하위 컴포넌트 기본값, 고정 스타일 | `ref({})` 권장 (고정값), `computed` 허용 (반응성 필요시) |
| `additionalStyleSet` (4번째) | props에서 오는 동적 값 (사용자 styleSet보다 우선) | `computed` (항상) |

> ⚠️ `additionalStyleSet`은 사용자 `styleSet`을 덮어쓰므로 신중히 사용하세요. props가 styleSet을 *침범*하지 않는 게 일반적입니다.

#### Template

```vue
<template>
    <div
        :class="['vs-[component-kebab]', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
    >
        <!-- 슬롯/요소 -->
        <div
            class="vs-[component-kebab]-element"
            :style="componentStyleSet.$element"
        >
            <slot name="element" />
        </div>

        <!-- 하위 컴포넌트 -->
        <vs-child-component :style-set="componentStyleSet.$childComponent" />

        <slot />
    </div>
</template>
```

핵심 포인트:
1. **루트 요소**: `{ ...styleSetVariables, ...componentInlineStyle }` 두 가지를 spread
2. **슬롯/요소**: `componentStyleSet.$X` (CSSProperties) → `:style`
3. **하위 컴포넌트**: `componentStyleSet.$X` (StyleSet) → `:style-set`

#### 상태 스타일 적용 (nested-state)

```typescript
$step?: CSSProperties & { $active?: CSSProperties };
```

`computed`로 base + 상태 스타일을 머지:

```ts
const stepStyle = computed<CSSProperties>(() => ({
    ...componentStyleSet.value.$step,
    ...(isActive.value ? componentStyleSet.value.$step?.$active : {}),
}));
```

### 5단계: CSS 작성

```css
.vs-[component-kebab] {
    /* CSS 변수 선언 — 인터페이스의 $X primitive에 대응하며 .css에서 실제 사용하는 것만 */
    --vs-[component-kebab]-arrowSize: initial;

    /* 레이아웃과 기본 스타일은 직접 값 */
    display: flex;
    flex-direction: column;

    /* CSS 변수 사용 (fallback 필수) */
    padding-right: var(--vs-[component-kebab]-arrowSize, 1rem);

    /* 디자인 토큰 우선 */
    background-color: var(--vs-comp-bg);
    color: var(--vs-comp-font);
    border-radius: calc(var(--vs-radius-ratio) * var(--vs-radius-md));
}

.vs-[component-kebab]-element {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* 상태별 스타일 */
.vs-[component-kebab]:hover {
    opacity: 0.9;
}

.vs-[component-kebab].vs-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

규칙 요약:
- 변수명: `--vs-{component-kebab}-{property}` (property는 camelCase 유지)
- 인터페이스의 모든 `$X` primitive ↔ CSS 변수가 1:1로 매칭되고 *실제 사용*되어야 함
- 사용하지 않을 변수는 만들지 말 것
- 단위는 rem 우선 (px 지양)
- 기본 색상은 디자인 토큰 (`var(--vs-comp-bg)` 등) 직접 사용

### 6단계: 검증 체크리스트

#### 타입 정의
- [ ] 인터페이스명이 `Vs[ComponentName]StyleSet`인가?
- [ ] `extends CSSProperties`로 선언되어 있는가?
- [ ] `component?: CSSProperties` 같은 래퍼 키가 없는가?
- [ ] 옛 `variables?: { ... }` 패턴이 남아있지 않은가?
- [ ] `$X` primitive는 4가지 기준을 모두 만족하는가?
- [ ] 기본 테마 색상(`$backgroundColor`, `$fontColor`)을 노출하지 않았는가? (ColorScheme 담당)
- [ ] 상태 수식어가 nested-state 패턴인가? (`$step.$active` ✅)
- [ ] 속성명이 내용 기반인가? (`$content` ✅, `$expand` ❌)
- [ ] 하위 컴포넌트 StyleSet 타입을 올바르게 참조했는가?
- [ ] form 계열이면 `$wrapper?: VsInputWrapperStyleSet`가 포함되었는가?
- [ ] 타입 안전 CSS 값을 사용했는가? (`CSSProperties['objectFit'] & {}`)

#### 컴포넌트
- [ ] `useStyleSet`에서 `componentStyleSet`, `styleSetVariables`, `componentInlineStyle` 세 가지 모두 destructure했는가?
- [ ] root `:style`에 `{ ...styleSetVariables, ...componentInlineStyle }`을 spread했는가?
- [ ] `baseStyleSet`이 고정값이면 `ref` 사용을 검토했는가?
- [ ] 슬롯/요소에 `componentStyleSet.$X`를 `:style`로 바인딩했는가?
- [ ] 하위 컴포넌트에 `componentStyleSet.$X`를 `:style-set`으로 전달했는가?

#### CSS
- [ ] 변수명이 `--vs-{component-kebab}-{property}` 규칙을 따르는가?
- [ ] 선언된 모든 CSS 변수가 실제로 사용되는가?
- [ ] 인터페이스의 `$X` primitive와 CSS 변수가 1:1 매칭되는가?
- [ ] fallback 값이 적절한가? (디자인 토큰 우선)
- [ ] rem 단위를 우선 사용했는가?

#### 문서
- [ ] `README.md`의 Types 섹션이 새 인터페이스를 그대로 반영하는가?
- [ ] 예시 코드가 새 컨벤션(`$X`, root CSSProperties)을 따르는가?

## 실전 예제

### 요청: "VsCard 컴포넌트 StyleSet 생성"

#### 1단계: 분석
- 이름: VsCard, 콘텐츠를 카드로 표시
- 구조: header / body / footer
- 하위 컴포넌트: 없음
- 자주 변경: width, padding, boxShadow → root CSSProperties로 충분
- 고정: border-radius 비율, 기본 배경/글자색 → CSS 하드코딩 (디자인 토큰)
- 변형: primary, outlined → ColorScheme

#### 2단계: 키 분류
- `width`, `padding`, `boxShadow`, `backgroundColor` → root CSSProperties (extends로 자동)
- header/body/footer → `$header`, `$body`, `$footer` (object)
- `$X` primitive로 노출할 만한 속성 없음 (.css에서 calc/의사 요소가 없음)

#### 3단계: 타입

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
    /** 헤더 영역 */
    $header?: CSSProperties;

    /** 바디 영역 */
    $body?: CSSProperties;

    /** 푸터 영역 */
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

1. **`component?: CSSProperties` 같은 래퍼 키 추가** — `extends CSSProperties`로 이미 노출됨
2. **옛 `variables?: { ... }` 구조 사용** — v2.0.0+ 컨벤션 아님
3. **모든 속성을 `$X` (CSS 변수)로** — `.css`에서 실제 변수로 쓰이는 것만 노출
4. **3단계 이상 중첩** — `$X: { $Y: { ... } }`는 자식 StyleSet이 자체적으로 깊이를 가질 때만 허용
5. **의미 없는 그룹명** — `$styles`, `$config`, `$inner` 등 모호한 이름
6. **ColorScheme 영역 침범** — `$backgroundColor`, `$fontColor` 등
7. **동작 기반 네이밍** — `$expand` 대신 `$content`처럼 내용 기반으로

### ✅ 해야 할 것

1. **사용자 관점에서 생각** — 어떤 속성을 자주 조정할까?
2. **명확한 네이밍** — 변수명만 봐도 용도를 알 수 있게
3. **적절한 fallback** — CSS 변수는 항상 fallback 제공
4. **JSDoc 문서화** — 각 속성의 용도 설명

## 도움말: 어디에 두지?

**root CSSProperties (extends로 자동)**:
- width, height, padding, margin, boxShadow, backgroundColor 등
- 임의 CSS로 자유롭게 변경되어도 무방한 속성

**`$X` primitive (CSS 변수)**:
- `.css`에서 `calc()`나 의사 요소(`::after`)에서 참조해야 함
- 특정 요소 크기 (arrow-size 등)
- 상태 셀렉터에서 동적으로 값이 바뀌어야 함

**`$X` object (CSSProperties)**:
- 컴포넌트 내부의 특정 요소/슬롯 스타일

**`$X` (자식 StyleSet)**:
- 하위 Vlossom 컴포넌트의 스타일을 일괄 제어 (예: `$loading`, `$chip`, `$wrapper`)

## 참고 문서

- [STYLE_SET_GUIDELINES.md](../../../guidelines/STYLE_SET_GUIDELINES.md)
- [useStyleSet](../../../packages/vlossom/src/composables/style-set/README.md)
- 모범 예: [VsButton](../../../packages/vlossom/src/components/vs-button/), [VsSelect](../../../packages/vlossom/src/components/vs-select/), [VsAccordion](../../../packages/vlossom/src/components/vs-accordion/), [VsSteps](../../../packages/vlossom/src/components/vs-steps/)
- [프로젝트 규칙](../../rules/)

## 사용 방법

```
/style-set-create VsCard
```

대화형으로 요구사항을 파악하고 단계별로 생성합니다.
