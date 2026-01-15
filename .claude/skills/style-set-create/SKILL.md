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

## 생성 프로세스

### 1단계: 요구사항 분석

다음 질문에 답하세요:

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

### 2단계: Variables 설계

#### 결정 기준 (4가지 모두 Yes여야 함)

각 속성에 대해 체크:

- [ ] **빈도**: 사용자가 자주 커스터마이징하는가?
- [ ] **런타임**: CSS 변수로 런타임에 변경할 필요가 있는가?
- [ ] **재사용**: 여러 곳에서 재사용되는 값인가?
- [ ] **명확성**: 명확한 의미와 용도가 있는가?

#### Variables 구조 결정

**단순 변수** (1단계)
```typescript
variables?: {
    width?: string;
    padding?: string;
}
```
- 독립적이고 단순한 속성
- 다른 속성과 논리적 관계 없음

**그룹화 변수** (2단계 중첩)
```typescript
variables?: {
    focused?: {
        border?: string;
        backgroundColor?: string;
    };
    disabled?: {
        opacity?: string;
        cursor?: string;
    };
}
```
- 상태별, 영역별로 논리적 그룹
- 2단계 이상 중첩 금지

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

export interface Vs[ComponentName]StyleSet {
    /**
     * CSS 변수로 노출될 커스터마이징 포인트
     * 자주 변경되는 속성만 포함
     */
    variables?: {
        // 단순 변수들
        propertyName?: string;

        // 그룹화된 변수들 (선택적)
        groupName?: {
            property1?: string;
            property2?: string;
        };
    };

    /**
     * 컴포넌트 루트 요소의 직접 스타일
     * 모든 CSSProperties 사용 가능
     */
    component?: CSSProperties;

    /**
     * 특정 요소의 스타일 (선택적)
     */
    elementName?: CSSProperties;

    /**
     * 하위 컴포넌트 스타일 전파 (선택적)
     */
    childComponent?: VsChildStyleSet;
}
```

### 4단계: 컴포넌트 구현

#### Setup 함수

**중요: Props를 StyleSet으로 주입하는 경우**

width, height 같은 props를 StyleSet으로 변환해야 하는 경우 `additionalStyleSet`을 사용합니다.

```typescript
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { objectUtil, stringUtil } from '@/utils';
import type { Vs[ComponentName]StyleSet } from './types';

const componentName = VsComponent.Vs[ComponentName];

export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<Vs[ComponentName]StyleSet>(),
        // Props로 제공되는 width, height
        width: { type: [String, Number, Object], default: undefined },
        height: { type: [String, Number, Object], default: undefined },
        // 기타 props
    },
    setup(props) {
        const { colorScheme, styleSet, width, height } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        // Props를 StyleSet으로 변환 (additionalStyleSet)
        // - width, height props가 있을 때
        // - 반응형 breakpoint 지원 필요할 때 (Object 타입)
        const additionalStyleSet: ComputedRef<Partial<Vs[ComponentName]StyleSet>> = computed(() => {
            return objectUtil.shake({
                width:
                    width.value === undefined || objectUtil.isObject(width.value)
                        ? undefined
                        : stringUtil.toStringSize(width.value as string | number),
                height:
                    height.value === undefined || objectUtil.isObject(height.value)
                        ? undefined
                        : stringUtil.toStringSize(height.value as string | number),
            });
        });

        // 하위 컴포넌트 기본값 설정 (baseStyleSet)
        // - 하위 컴포넌트의 기본 스타일을 제어할 때만
        const baseStyleSet: ComputedRef<Vs[ComponentName]StyleSet> = computed(() => {
            return {
                // 하위 컴포넌트 기본값
                childComponent: {
                    component: {
                        width: '100%',
                    },
                },
            };
        });

        // useStyleSet 호출 - 세 번째 인자는 상황에 따라:
        // - Props(width/height)가 있으면: additionalStyleSet
        // - 하위 컴포넌트 기본값 설정이 필요하면: baseStyleSet  
        // - 둘 다 없으면: 생략
        const { componentStyleSet, styleSetVariables } = useStyleSet<Vs[ComponentName]StyleSet>(
            componentName,
            styleSet,
            additionalStyleSet, // 위 조건에 따라 선택
        );

        return {
            colorSchemeClass,
            styleSetVariables,
            componentStyleSet,
        };
    },
});
```

#### Template

```vue
<template>
    <div
        :class="['vs-[component-name]', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
    >
        <!-- 특정 요소 -->
        <div
            class="vs-[component-name]-element"
            :style="componentStyleSet.elementName"
        >
            <slot name="element" />
        </div>

        <!-- 하위 컴포넌트 -->
        <vs-child-component
            :style-set="componentStyleSet.childComponent"
        />

        <slot />
    </div>
</template>
```

### 5단계: CSS 작성

```css
.vs-[component-name] {
    /* CSS 변수 선언 (variables에 정의된 것만) */
    --vs-[component-name]-propertyName: initial;

    /* 중첩된 경우 */
    --vs-[component-name]-groupName-property1: initial;
    --vs-[component-name]-groupName-property2: initial;

    /* 레이아웃과 기본 스타일 (직접 값) */
    display: flex;
    flex-direction: column;

    /* CSS 변수 사용 (적절한 fallback 포함) */
    padding: var(--vs-[component-name]-padding, 1rem);

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

/* 그룹화된 변수 사용 */
.vs-[component-name]:focus-within {
    border: var(--vs-[component-name]-focused-border, 2px solid var(--vs-primary));
    background-color: var(--vs-[component-name]-focused-backgroundColor, transparent);
}
```

### 6단계: 검증 체크리스트

생성 완료 후 확인:

#### 타입 정의
- [ ] 인터페이스명이 `Vs[ComponentName]StyleSet`인가?
- [ ] `variables`에 자주 변경되는 속성만 있는가?
- [ ] 중첩이 2단계를 넘지 않는가?
- [ ] `component?: CSSProperties` 포함되었는가?
- [ ] 하위 컴포넌트 StyleSet이 올바르게 참조되는가?
- [ ] JSDoc 주석이 추가되었는가?

#### 컴포넌트
- [ ] `useStyleSet` 호출이 올바른가?
- [ ] Template에서 스타일 병합 순서가 올바른가?
- [ ] 하위 컴포넌트에 `:style-set` prop 전달하는가?

#### CSS
- [ ] 변수명이 `--vs-[component]-[property]` 규칙을 따르는가?
- [ ] 불필요한 CSS 변수가 없는가?
- [ ] fallback 값이 적절한가?
- [ ] 디자인 토큰을 우선 사용하는가?

## 실전 예제

### 요청: "VsCard 컴포넌트 StyleSet 생성"

#### 1단계: 분석

**컴포넌트 분석**:
- 이름: VsCard
- 기능: 콘텐츠를 카드 형태로 표시
- 구조: header, body, footer
- 하위 컴포넌트: 없음

**스타일 분석**:
- 자주 변경: width, padding, shadow
- 고정: border-radius 비율, 기본 배경색
- 상태: hover 시 elevation 증가
- 변형: primary, outlined

#### 2단계: Variables 설계

체크 결과:
- `width`: ✅✅✅✅ → variables
- `padding`: ✅✅✅✅ → variables
- `shadow`: ✅✅✅✅ → variables
- `backgroundColor`: ❌ (ColorScheme으로 제어) → component
- `borderRadius`: ❌ (디자인 시스템 일관성) → 직접 값

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

export interface VsCardStyleSet {
    /**
     * CSS 변수로 노출될 커스터마이징 포인트
     */
    variables?: {
        /** 카드 너비 */
        width?: string;
        /** 카드 내부 여백 */
        padding?: string;
        /** 카드 그림자 */
        shadow?: string;
    };

    /** 카드 루트 요소 스타일 */
    component?: CSSProperties;

    /** 헤더 영역 스타일 */
    header?: CSSProperties;

    /** 바디 영역 스타일 */
    body?: CSSProperties;

    /** 푸터 영역 스타일 */
    footer?: CSSProperties;
}
```

#### 4-5단계: 구현 (생략, 위 패턴 참고)

#### 6단계: 검증

✅ 모든 체크리스트 통과

## 주의사항

### 🚫 하지 말아야 할 것

1. **모든 CSS 속성을 variables로**
   - 필요한 것만 노출

2. **3단계 이상 중첩**
   - 최대 2단계까지

3. **의미 없는 그룹명**
   - `styles`, `config` 같은 모호한 이름

4. **BoxStyleSet 같은 공통 인터페이스 extends**
   - 명시적 정의 선호

### ✅ 해야 할 것

1. **사용자 관점에서 생각**
   - 어떤 속성을 자주 조정할까?

2. **명확한 네이밍**
   - 변수명만 봐도 용도를 알 수 있게

3. **적절한 fallback**
   - CSS 변수는 항상 fallback 제공

4. **문서화**
   - JSDoc으로 각 속성의 용도 설명

## 도움말

### Variables vs Component 결정이 어려울 때

**Variables로 만들기**:
- padding, spacing, gap
- width, height (컨테이너 크기)
- color 계열 (단, ColorScheme이 우선)
- 특정 요소의 크기 (arrow-size 등)

**Component로 만들기**:
- border, border-radius (디자인 시스템)
- background-color (ColorScheme)
- font-size, font-weight (Typography)
- 복잡한 속성 조합

### 하위 컴포넌트 스타일 전파 여부

**전파하는 경우**:
- 상위 컴포넌트가 하위의 스타일을 제어해야 함
- 일관된 디자인을 위해 일괄 적용 필요
- 예: Button의 Loading, Select의 Chip

**전파하지 않는 경우**:
- 하위 컴포넌트가 독립적으로 동작
- 사용자가 직접 제어해야 함
- slot으로 제공되는 콘텐츠

## 참고 문서

- [STYLE_SET_GUIDELINES.md](../../packages/vlossom/STYLE_SET_GUIDELINES.md)
- [useStyleSet Composable](../../packages/vlossom/src/composables/style-set-composable.ts)
- [기존 컴포넌트 예제](../../packages/vlossom/src/components/)

## 사용 방법

```
/style-set-create VsCard
```

대화형으로 요구사항을 파악하고 단계별로 생성합니다.
