# Vlossom Style-Set 시스템 개발 가이드라인

> 컴포넌트 스타일 커스터마이징을 위한 타입 안전한 인터페이스

**버전**: 2.0.0+

---

## 📖 목차

1. [Style-Set이란?](#style-set이란)
2. [핵심 개념](#핵심-개념)
3. [타입 정의 패턴](#타입-정의-패턴)
4. [구현 방법](#구현-방법)
5. [사용 가이드](#사용-가이드)
6. [설계 규칙](#설계-규칙)
7. [CSS 작성 규칙](#css-작성-규칙)
8. [FAQ](#faq)
9. [안티패턴](#안티패턴)
10. [참고 자료](#참고-자료)

---

## Style-Set이란?

Vlossom의 모든 컴포넌트는 `styleSet` prop을 통해 스타일을 커스터마이징할 수 있습니다.

```vue
<vs-button
    :style-set="{
        variables: { padding: '2rem' },
        component: { backgroundColor: 'red' },
        loading: { variables: { color: 'white' } }
    }"
>
    Click
</vs-button>
```

**철학**: Variables for Variability, Properties for Predictability

> 💡 **핵심 원칙**: Variables는 최소화하고, CSSProperties로 직접 제어

### 설계 방향 (v2.0.0+)

1. **Variables 최소화**

    - 런타임에 동적으로 변경되는 값만 `variables`로 노출
    - 한 번 설정하면 변경되지 않는 값은 제외

2. **CSSProperties 우선**
    - 대부분의 스타일은 `component`, `elementName` CSSProperties로 제어
    - 더 유연하고, 타입 안전하며, 직관적

---

## 핵심 개념

### 1. 3단계 병합 시스템 (v2.0.0에서 추가됨)

```
baseStyleSet < styleSet < additionalStyleSet
```

| 단계               | 역할              | 누가 설정 | 예시                    |
| ------------------ | ----------------- | --------- | ----------------------- |
| baseStyleSet       | 내부 기본값       | 컴포넌트  | 하위 컴포넌트 기본 크기 |
| styleSet           | 사용자 정의       | 사용자    | 디자인 시스템 적용      |
| additionalStyleSet | 런타임 오버라이드 | 컴포넌트  | props 기반 동적 스타일  |

**병합 규칙**:

- 뒤에 오는 것이 앞의 것을 덮어씁니다
- 빈 객체(`{}`)는 병합에서 제외됩니다 (`objectUtil.shake` 적용)
- Deep merge: 중첩 객체도 재귀적으로 병합

**useStyleSet 시그니처**:

```typescript
function useStyleSet<T>(
    component: VsComponent,
    styleSet: Ref<T | undefined>,
    baseStyleSet: Ref<Partial<T>> = ref({}),
    additionalStyleSet: Ref<Partial<T>> = ref({}),
);
```

**실제 사용 예시**:

```typescript
// VsButton.vue
const baseStyleSet = computed(() => ({
    loading: {
        component: { width: '30%', height: '60%' }, // 하위 컴포넌트 기본 크기
    },
}));

const additionalStyleSet = computed(() => {
    if (props.dense) {
        return { variables: { padding: '0.25rem 0.5rem' } }; // props 기반 동적 스타일
    }
    return {};
});

const { componentStyleSet, styleSetVariables } = useStyleSet(
    'vs-button',
    styleSet,
    baseStyleSet, // 내부 기본값
    additionalStyleSet, // 런타임 오버라이드
);
```

**병합 결과**:

```typescript
// 최종 componentStyleSet
{
    variables: { padding: '0.25rem 0.5rem' },  // additionalStyleSet (최우선)
    component: { ...사용자가 정의한 스타일... },  // styleSet
    loading: {
        component: { width: '30%', height: '60%', ...사용자 정의... }  // baseStyleSet + styleSet 병합
    }
}
```

### 2. 두 가지 스타일 제어 방식

#### variables (CSS 변수)

**`variables` 섹션만** CSS 커스텀 프로퍼티로 변환됩니다.

```typescript
variables?: {
    padding?: string;  // --vs-button-padding
    focused?: {
        border?: string;  // --vs-button-focused-border
    };
}
```

**변환 과정** (useStyleSet 내부):

```typescript
// styleSetVariables는 variables만 변환
const styleSetVariables = computed(() => {
    const variables = componentStyleSet.value.variables;
    if (!variables) return {};

    // variables의 내용만 CSS 변수로 변환
    return Object.entries(variables).reduce((acc, [key, value]) => {
        if (isObject(value)) {
            // focused.border → --vs-button-focused-border
            Object.entries(value).forEach(([subKey, subValue]) => {
                acc[`--vs-button-${key}-${subKey}`] = subValue;
            });
        } else {
            // padding → --vs-button-padding
            acc[`--vs-button-${key}`] = value;
        }
        return acc;
    }, {});
});
```

**사용 시기**:

- CSS pseudo-element (::before, ::after)로 접근 불가능한 요소
- CSS calc 등 동적 계산에 사용되는 값
- 상태 변화에 따라 자주 변경되는 속성
- 애니메이션과 연동되는 값

#### CSSProperties (직접 스타일)

**인라인 스타일**로 바로 적용됩니다. CSS 변수로 변환되지 않습니다.

```typescript
component?: CSSProperties;      // 컴포넌트 루트
elementName?: CSSProperties;    // 특정 요소
```

**적용 과정**:

```vue
<template>
    <button
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
    >
        <div :style="componentStyleSet.content">
            <slot />
        </div>
    </button>
</template>
```

**사용 시기**:

- 한 번 설정하면 변경되지 않는 스타일
- 전역 테마 토큰으로 충분한 속성
- 요소별로 독립적으로 제어 가능한 스타일
- 타입 안전성이 필요한 복잡한 스타일

### 3. 하위 컴포넌트 스타일 전파

```typescript
interface VsButtonStyleSet {
    variables?: { padding?: string };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet; // 하위 컴포넌트
}
```

하위 컴포넌트에 `:style-set` prop으로 전달됩니다.

---

## 타입 정의 패턴

### 기본 구조

```typescript
export interface Vs[ComponentName]StyleSet {
    variables?: {
        // 단순 속성
        propertyName?: string;

        // 그룹핑 (최대 2단계)
        groupName?: {
            property?: string;
        };
    };

    // 컴포넌트 루트
    component?: CSSProperties;

    // 특정 요소
    elementName?: CSSProperties;

    // 하위 컴포넌트
    childComponent?: ChildStyleSet;
}
```

### 패턴 1: Minimal Variables

반드시 필요한 variables만 노출.

```typescript
// VsButton
interface VsButtonStyleSet {
    variables?: {
        padding?: string;
    };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}
```

### 패턴 2: 상태별 분리

상태에 따라 완전히 다른 스타일을 적용.

```typescript
// VsSwitch
interface VsSwitchStyleSet {
    variables?: {
        handleColor?: string;
        handleSize?: string;
    };
    switchButton?: CSSProperties;
    checkedSwitchButton?: CSSProperties; // 체크된 상태
    component?: CSSProperties;
}
```

**네이밍**: `elementName` + `stateElementName`

### 패턴 3: 논리적 그룹핑

관련 속성을 의미있게 묶음 (최대 2단계).

```typescript
// VsProgress
interface VsProgressStyleSet {
    variables?: {
        bar?: {
            backgroundColor?: string;
            border?: string;
        };
        value?: {
            backgroundColor?: string;
        };
        label?: {
            fontColor?: string;
        };
    };
    component?: CSSProperties;
}
```

**그룹핑 기준**: 시각적 요소별, 상태별, 기능별

### 패턴 4: Omit (속성 필터링)

하위 컴포넌트를 재사용하되 특정 속성 제외.

```typescript
// VsPagination
interface VsPaginationStyleSet {
    component?: CSSProperties;
    pageButton?: Omit<VsButtonStyleSet, 'loading'>; // 로딩 불필요
    controlButton?: Omit<VsButtonStyleSet, 'loading'>;
}
```

**사용 이유**: 컨텍스트상 의미 없는 속성 제거

### 패턴 5: 복잡한 구조

다중 하위 컴포넌트 + 상태 + 그룹핑 조합.

```typescript
// VsSelect
interface VsSelectStyleSet {
    variables?: {
        height?: string;
        focused?: {
            border?: string;
            backgroundColor?: string;
        };
    };
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
    chip?: VsChipStyleSet;
    selectAllCheckbox?: VsCheckboxStyleSet;
    options?: VsGroupedListStyleSet;
    option?: CSSProperties;
    selectedOption?: CSSProperties;
}
```

### 패턴 6: variables 생략

CSSProperties와 하위 컴포넌트로 충분한 경우.

```typescript
// VsTextarea
interface VsTextareaStyleSet {
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

---

## 구현 방법

### TypeScript 타입 정의

```typescript
// types.ts
import type { CSSProperties } from 'vue';
import type { VsLoadingStyleSet } from '@/components/vs-loading/types';

export interface VsButtonStyleSet {
    variables?: {
        padding?: string;
    };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}
```

### 컴포넌트 Setup

```typescript
// VsButton.vue
import { computed, defineComponent, toRefs } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsButtonStyleSet } from './types';

export default defineComponent({
    name: 'VsButton',
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsButtonStyleSet>(),
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme('vs-button', colorScheme);

        // baseStyleSet: 하위 컴포넌트 기본값
        const baseStyleSet = computed(() => ({
            loading: {
                component: { width: '30%', height: '60%' },
            },
        }));

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(
            'vs-button',
            styleSet,
            baseStyleSet,
        );

        return {
            colorSchemeClass,
            styleSetVariables,
            componentStyleSet,
        };
    },
});
```

### Template 적용

```vue
<template>
    <button
        :class="['vs-button', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
    >
        <!-- 하위 컴포넌트: :style-set prop -->
        <vs-loading
            v-if="loading"
            :style-set="componentStyleSet.loading"
        />

        <!-- 특정 요소: :style -->
        <div class="vs-button-content" :style="componentStyleSet.content">
            <slot />
        </div>
    </button>
</template>
```

**적용 규칙**:

- 루트: `{ ...styleSetVariables, ...componentStyleSet.component }`
- 하위 컴포넌트: `:style-set="componentStyleSet.childName"`
- 특정 요소: `:style="componentStyleSet.elementName"`

### CSS 작성

```css
.vs-button {
    /* variables 선언 */
    --vs-button-padding: initial;

    /* 대부분은 직접 값 */
    border: 1px solid var(--vs-line-color);
    background-color: var(--vs-comp-bg);

    /* 필요한 것만 CSS 변수 */
    .vs-button-content {
        padding: var(--vs-button-padding, 0.75rem 1.5rem);
    }
}
```

**CSS 변수 명명 규칙**:

```
--[component-name]-[property]
--[component-name]-[group]-[property]
```

예시:

- `padding` → `--vs-button-padding`
- `focused.border` → `--vs-button-focused-border`
- `bar.backgroundColor` → `--vs-progress-bar-backgroundColor`

---

## 사용 가이드

```vue
<!-- 전역 스타일셋 -->
<vs-button style-set="primary">Click</vs-button>

<!-- variables 수정 -->
<vs-button :style-set="{ variables: { padding: '2rem' } }">Click</vs-button>

<!-- 요소별 스타일 -->
<vs-chip :style-set="{ icon: { color: 'red' }, closeButton: { opacity: 1 } }">Chip</vs-chip>

<!-- 하위 컴포넌트 -->
<vs-button :style-set="{ loading: { variables: { color: 'white' } } }">Click</vs-button>
```

---

## 설계 규칙

### variables 노출 기준

#### ✅ Variables로 노출

- CSS pseudo-element (::before, ::after)로 접근 불가
- CSS calc 등 동적 계산에 필요
- 상태 변화에 따라 자주 변경 (hover, focus, checked)
- 애니메이션과 연동

#### ❌ CSSProperties로 제어

- 한 번 설정하면 변경되지 않는 값
- 전역 테마 토큰으로 충분한 속성
- 요소별로 독립적으로 제어 가능

### 중첩 깊이 제한

최대 2단계까지만 중첩.

```typescript
// ✅ GOOD
variables?: {
    focused?: {
        border?: string;
    };
}

// ❌ BAD
variables?: {
    container?: {
        inner?: {
            padding?: string;  // 3단계
        };
    };
}
```

### 네이밍 규칙

| 타입          | 규칙                   | 예시                                                 |
| ------------- | ---------------------- | ---------------------------------------------------- |
| 기본 요소     | camelCase              | `component`, `content`, `header`                     |
| 상태별 요소   | state + ElementName    | `activeTab`, `checkedSwitchButton`, `selectedOption` |
| 하위 컴포넌트 | 컴포넌트명 (camelCase) | `loading`, `chip`, `wrapper`                         |
| 역할 명시     | 구체적 이름            | `selectAllCheckbox`, `closeButton`, `scrollButton`   |

### Omit 사용 기준

```typescript
// ✅ GOOD: 명확한 의도
pageButton?: Omit<VsButtonStyleSet, 'loading'>;

// ❌ BAD: 과도한 제외
button?: Omit<VsButtonStyleSet, 'loading' | 'component' | 'variables'>;
```

**원칙**: Omit이 많아지면 새로 정의하는 것이 나을 수 있습니다.

### variables 생략 가능

```typescript
// variables 없어도 됨
interface VsTextareaStyleSet {
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

불필요한 variables보다 생략이 낫습니다.

---

## CSS 작성 규칙

### Variables는 최소한만 CSS 변수로

```css
/* ✅ GOOD: 동적으로 필요한 것만 */
.vs-button {
    --vs-button-padding: initial;

    border: 1px solid var(--vs-line-color);
    background-color: var(--vs-comp-bg);
    padding: var(--vs-button-padding, 0.75rem 1.5rem);
}

/* ❌ BAD: 모든 것을 변수로 */
.vs-button {
    --vs-button-border: initial;
    --vs-button-backgroundColor: initial;
    --vs-button-padding: initial;

    border: var(--vs-button-border, ...);
    background-color: var(--vs-button-backgroundColor, ...);
    padding: var(--vs-button-padding, ...);
}
```

### CSS 변수 명명 규칙

```
--[component-name]-[property]
--[component-name]-[group]-[property]
```

예시:

- `padding` → `--vs-button-padding`
- `focused.border` → `--vs-button-focused-border`

### Fallback 값 제공

```css
padding: var(--vs-component-padding, 1rem);
color: var(--vs-component-color, var(--vs-comp-font));
```

---

## FAQ

### variables vs component 선택 기준은?

- **자주 변경**: `variables` (CSS 변수로 런타임 제어)
- **한 번만 설정**: `component` (직접 스타일 적용)

### baseStyleSet vs additionalStyleSet 차이는?

- **baseStyleSet**: 컴포넌트 내부 기본값 (하위 컴포넌트 스타일)
- **additionalStyleSet**: props 기반 동적 오버라이드

### 왜 2단계까지만 중첩하나요?

- CSS 변수명이 너무 길어짐
- useStyleSet이 2단계까지만 지원
- 실무에서 2단계면 충분

### Omit은 언제 사용하나요?

하위 컴포넌트 재사용 시 불필요한 속성 제외.

```typescript
pageButton?: Omit<VsButtonStyleSet, 'loading'>;
```

### variables를 언제 생략하나요?

- 커스터마이징 포인트가 불명확할 때
- CSSProperties로 충분할 때

---

## 안티패턴

### 1. Variables 남발

```typescript
// ❌ BAD
variables?: {
    width?: string;
    height?: string;
    backgroundColor?: string;
    border?: string;
    // ... 모든 속성을 variables로
}

// ✅ GOOD
variables?: {
    padding?: string; // 동적으로 필요한 것만
};
component?: CSSProperties;
```

### 2. 3단계 이상 중첩

```typescript
// ❌ BAD
variables?: {
    container?: {
        inner?: {
            padding?: string; // 3단계
        };
    };
}

// ✅ GOOD
variables?: {
    padding?: string;
}
```

---

## 참고 자료

### Core

- [useStyleSet Composable](../src/composables/style-set-composable.ts)
- [useStyleSet Tests](../src/composables/__tests__/style-set-composable.test.ts)

### 대표 구현 예제

- [VsButton](../src/components/vs-button/) - Minimal variables
- [VsSwitch](../src/components/vs-switch/) - 상태별 CSSProperties
- [VsSelect](../src/components/vs-select/) - 복잡한 구조
- [VsProgress](../src/components/vs-progress/) - 논리적 그룹핑
- [VsPagination](../src/components/vs-pagination/) - Omit 패턴
- [VsTextarea](../src/components/vs-textarea/) - variables 생략
- [VsDrawer](../src/components/vs-drawer/) - 영역별 분리
- [VsFileDrop](../src/components/vs-file-drop/) - 다중 하위 컴포넌트

---

**Questions?** 이슈를 생성하거나 팀에 문의하세요.

```

```
