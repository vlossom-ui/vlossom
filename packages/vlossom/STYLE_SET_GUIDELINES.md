# Style-Set 시스템 개발 가이드라인

> 새로운 Style-Set 시스템의 철학과 구현 패턴에 대한 공식 개발 지침

**버전**: 2.0.0+
**마지막 업데이트**: 2026-01-14

---

## 📖 목차

1. [핵심 철학](#-핵심-철학)
2. [타입 정의 가이드](#-타입-정의-가이드)
3. [컴포넌트 구현 패턴](#-컴포넌트-구현-패턴)
4. [CSS 작성 가이드](#-css-작성-가이드)
5. [마이그레이션 체크리스트](#-마이그레이션-체크리스트)
6. [테스트 전략](#-테스트-전략)
7. [FAQ](#-faq)

---

## 🎯 핵심 철학

### "최소한의 변수, 최대한의 유연성"
> Variables for Variability, Properties for Predictability

새로운 Style-Set 시스템은 다음 원칙을 따릅니다:

#### 1. **명확한 관심사 분리**
- `variables`: CSS 변수로 노출할 커스터마이징 포인트
- `component` / 구체적 요소: CSSProperties로 직접 스타일 제어
- 하위 컴포넌트: 중첩된 StyleSet으로 전파

#### 2. **"Only What Needs to Vary" 원칙**
- 실제로 커스터마이징이 필요한 것만 `variables`로 노출
- 대부분의 스타일은 CSS에 직접 하드코딩
- 불필요한 CSS 변수 남발 금지

#### 3. **3단계 병합 시스템**
```
baseStyleSet < styleSet < additionalStyleSet
```
- **baseStyleSet**: 컴포넌트 기본 동작 (내부 로직)
- **styleSet**: 사용자 정의 (디자인 시스템)
- **additionalStyleSet**: 런타임 오버라이드 (특수 케이스)

#### 4. **타입 안정성 강화**
- 불필요한 커스터마이징 포인트 제거
- API 표면적 최소화
- 명확한 타입으로 잘못된 사용 방지

---

## 📐 타입 정의 가이드

### 기본 구조

```typescript
export interface Vs[ComponentName]StyleSet {
    variables?: {
        // 1단계: 단순 CSS 변수
        propertyName?: string;

        // 2단계: 논리적 그룹핑 (중첩 1단계까지만)
        groupName?: {
            property1?: string;
            property2?: string;
        };
    };

    // 직접 스타일 적용
    component?: CSSProperties;

    // 특정 요소별 스타일
    elementName?: CSSProperties;

    // 하위 컴포넌트 스타일 전파
    childComponent?: ChildComponentStyleSet;
}
```

### ✅ Good Examples

#### 예제 1: VsButton (단순 + 중첩)

```typescript
interface VsButtonStyleSet {
    variables?: {
        padding?: string;  // 자주 변경되는 값만 노출
    };
    component?: CSSProperties;  // 컴포넌트 루트
    loading?: VsLoadingStyleSet;  // 하위 컴포넌트 전파
}
```

**이유**:
- `width`, `height` 제거: 버튼 크기는 size prop으로 제어
- `padding`만 variables로 노출: 가장 자주 커스터마이징되는 속성
- `loading` 중첩: 로딩 스피너 스타일 일괄 제어

#### 예제 2: VsAccordion (논리적 그룹핑)

```typescript
interface VsAccordionStyleSet {
    variables?: {
        arrowColor?: string;
        arrowSize?: string;
        arrowSpacing?: string;
        border?: string;
        width?: string;
    };
    title?: CSSProperties;
    expand?: VsExpandableStyleSet;
}
```

**이유**:
- arrow 관련 속성을 개별 변수로 노출 (커스터마이징 빈도 높음)
- `title`은 CSSProperties: 자유로운 스타일링 가능
- `expand`는 하위 컴포넌트 스타일 전파

#### 예제 3: VsSelect (복잡한 중첩)

```typescript
interface VsSelectStyleSet {
    variables?: {
        height?: string;
        selected: {
            backgroundColor?: string;
            fontWeight?: number;
        };
        focused: {
            border?: string;
            borderRadius?: string;
            backgroundColor?: string;
        };
    };
    component?: CSSProperties;
    chip?: VsChipStyleSet;
    selectAllCheckbox?: VsCheckboxStyleSet;
    options?: VsGroupedListStyleSet;
    option?: CSSProperties;
}
```

**이유**:
- `selected`, `focused` 상태별로 그룹핑 (의미론적 명확성)
- 여러 하위 컴포넌트 스타일 일괄 제어
- `option`은 CSSProperties로 자유도 제공

### ❌ Bad Examples

#### 안티패턴 1: 모든 것을 변수로

```typescript
// ❌ BAD: 불필요한 변수 남발
interface VsButtonStyleSet {
    variables?: {
        width?: string;
        height?: string;
        padding?: string;
        margin?: string;
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        opacity?: string;
        fontColor?: string;
        fontSize?: string;
        fontWeight?: string;
        // ... 끝없는 속성들
    };
}

// ✅ GOOD: 필요한 것만
interface VsButtonStyleSet {
    variables?: {
        padding?: string;  // 자주 변경됨
    };
    component?: CSSProperties;  // 나머지는 자유롭게
}
```

#### 안티패턴 2: 깊은 중첩

```typescript
// ❌ BAD: 3단계 이상 중첩
interface VsInputStyleSet {
    variables?: {
        container?: {
            inner?: {
                wrapper?: {
                    padding?: string;  // 너무 깊음!
                };
            };
        };
    };
}

// ✅ GOOD: 최대 2단계
interface VsInputStyleSet {
    variables?: {
        padding?: string;
        append?: {
            width?: string;
            padding?: string;
        };
    };
}
```

#### 안티패턴 3: 의미 없는 분리

```typescript
// ❌ BAD: 논리적 관계 없는 그룹핑
interface VsCardStyleSet {
    variables?: {
        styles?: {  // 의미 없는 그룹명
            color?: string;
            width?: string;
        };
    };
}

// ✅ GOOD: 의미 있는 그룹핑
interface VsCardStyleSet {
    variables?: {
        width?: string;
        header?: {
            backgroundColor?: string;
            padding?: string;
        };
    };
}
```

### 변수 노출 결정 기준

다음 질문에 **모두 Yes**일 때만 `variables`로 노출:

1. ✅ 사용자가 자주 커스터마이징하는가?
2. ✅ CSS 변수로 런타임에 변경할 필요가 있는가?
3. ✅ 여러 곳에서 재사용되는 값인가?
4. ✅ 명확한 의미와 용도가 있는가?

**하나라도 No라면**: `component` 또는 요소별 CSSProperties로 제공

---

## 🔧 컴포넌트 구현 패턴

### 1. 기본 Setup 패턴

```typescript
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsButtonStyleSet } from './types';

const componentName = VsComponent.VsButton;

export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsButtonStyleSet>(),
        // ... 기타 props
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(
            componentName,
            styleSet,
        );

        return {
            colorSchemeClass,
            styleSetVariables,
            componentStyleSet,
        };
    },
});
```

### 2. baseStyleSet 사용 패턴

하위 컴포넌트의 기본 스타일을 설정할 때:

```typescript
const baseStyleSet: ComputedRef<VsButtonStyleSet> = computed(() => {
    return {
        loading: {
            component: {
                width: '30%',
                height: '60%',
            },
        },
    };
});

const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(
    componentName,
    styleSet,
    baseStyleSet,  // 기본값 전달
);
```

**사용 시기**:
- 하위 컴포넌트 기본 스타일 설정
- props에 따라 동적으로 변경되는 기본값
- 컴포넌트 내부 로직에 의한 스타일

### 3. additionalStyleSet 사용 패턴

런타임에 동적으로 스타일을 추가할 때:

```typescript
const additionalStyleSet: ComputedRef<VsButtonStyleSet> = computed(() => {
    if (props.dense) {
        return {
            variables: {
                padding: '0.25rem 0.5rem',
            },
        };
    }
    return {};
});

const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(
    componentName,
    styleSet,
    baseStyleSet,
    additionalStyleSet,  // 런타임 오버라이드
);
```

**사용 시기**:
- props 조합에 따른 스타일 조정
- 특수한 상태의 스타일 오버라이드
- 조건부 스타일 적용

### 4. Template 적용 패턴

```vue
<template>
    <button
        :class="['vs-button', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
    >
        <!-- styleSetVariables: CSS 변수들 -->
        <!-- componentStyleSet.component: 직접 스타일 -->

        <div v-if="loading" class="vs-button-loading">
            <!-- 하위 컴포넌트에 스타일 전파 -->
            <vs-loading :style-set="componentStyleSet.loading" />
        </div>

        <div class="vs-button-content" :style="componentStyleSet.content">
            <!-- 특정 요소 스타일 -->
            <slot />
        </div>
    </button>
</template>
```

**핵심 포인트**:
1. **루트 요소**: `styleSetVariables` + `componentStyleSet.component`
2. **하위 컴포넌트**: `:style-set="componentStyleSet.childName"`
3. **특정 요소**: `:style="componentStyleSet.elementName"`

---

## 🎨 CSS 작성 가이드

### 1. CSS 변수 명명 규칙

```css
.vs-component {
    /* 패턴: --[component-name]-[property] */
    --vs-button-padding: initial;

    /* 중첩된 경우: --[component-name]-[group]-[property] */
    --vs-select-focused-border: initial;
    --vs-select-focused-backgroundColor: initial;
}
```

**규칙**:
- 컴포넌트명은 kebab-case (자동 변환됨)
- 속성명은 camelCase 유지 (TypeScript와 일관성)
- 그룹명이 있으면 중간에 삽입

### 2. 변수 사용 vs 직접 값

```css
.vs-button {
    /* ❌ BAD: 모든 것을 변수로 */
    --vs-button-backgroundColor: initial;
    --vs-button-border: initial;
    --vs-button-borderRadius: initial;
    --vs-button-padding: initial;

    background-color: var(--vs-button-backgroundColor, var(--vs-comp-bg));
    border: var(--vs-button-border, 1px solid var(--vs-line-color));
    border-radius: var(--vs-button-borderRadius, calc(var(--vs-radius-ratio) * var(--vs-radius-md)));
    padding: var(--vs-button-padding, 0.75rem 1.5rem);
}

/* ✅ GOOD: 필요한 것만 변수로 */
.vs-button {
    --vs-button-padding: initial;

    background-color: var(--vs-comp-bg);  /* 직접 값 */
    border: 1px solid var(--vs-line-color);  /* 직접 값 */
    border-radius: calc(var(--vs-radius-ratio) * var(--vs-radius-md));  /* 직접 값 */
    padding: var(--vs-button-padding, 0.75rem 1.5rem);  /* 변수 */
}
```

### 3. fallback 값 설정

```css
/* 항상 적절한 fallback 제공 */
.vs-component {
    /* 디자인 토큰 사용 */
    color: var(--vs-component-color, var(--vs-comp-font));

    /* 구체적 값 */
    padding: var(--vs-component-padding, 1rem);

    /* 계산된 값 */
    border-radius: var(--vs-component-borderRadius, calc(var(--vs-radius-ratio) * var(--vs-radius-md)));
}
```

### 4. 중첩된 변수 처리

```css
.vs-select {
    /* 중첩된 그룹의 변수들 */
    --vs-select-focused-border: initial;
    --vs-select-focused-borderRadius: initial;
    --vs-select-focused-backgroundColor: initial;
}

.vs-select:focus-within {
    /* 상태별로 적용 */
    border: var(--vs-select-focused-border, 2px solid var(--vs-primary));
    border-radius: var(--vs-select-focused-borderRadius, 0.25rem);
    background-color: var(--vs-select-focused-backgroundColor, transparent);
}
```

### 5. 리팩토링 전후 비교

#### Before (Old System)
```css
.vs-accordion {
    --vs-accordion-backgroundColor: initial;
    --vs-accordion-border: initial;
    --vs-accordion-borderRadius: initial;
    --vs-accordion-padding: initial;
    --vs-accordion-opacity: initial;
    --vs-accordion-width: initial;
    --vs-accordion-arrowColor: initial;
    --vs-accordion-title-backgroundColor: initial;
    --vs-accordion-title-fontColor: initial;
    --vs-accordion-title-height: initial;
    --vs-accordion-title-padding: initial;

    opacity: var(--vs-accordion-opacity, 1);
    border: var(--vs-accordion-border, 1px solid var(--vs-line-color));
    /* ... 모든 속성이 변수로 */
}
```

#### After (New System)
```css
.vs-accordion {
    --vs-accordion-arrowColor: initial;
    --vs-accordion-arrowSize: initial;
    --vs-accordion-arrowSpacing: initial;
    --vs-accordion-border: initial;
    --vs-accordion-width: initial;

    /* 대부분 직접 값 사용 */
    border: 1px solid var(--vs-line-color);
    border-radius: calc(var(--vs-radius-ratio) * var(--vs-radius-md));
    width: var(--vs-accordion-width, 100%);
}

.vs-accordion-title {
    /* 변수 없이 직접 스타일링 */
    background-color: var(--vs-comp-bg);
    padding: 0.75rem 1rem;
    height: auto;
    color: var(--vs-comp-font);
}
```

**개선 효과**:
- 11개 변수 → 5개 변수 (55% 감소)
- CSS 코드량 30% 감소
- 명확한 커스터마이징 포인트

---

## ✅ 마이그레이션 체크리스트

### 단계 1: 분석 (Analysis)

- [ ] 기존 StyleSet 인터페이스 확인
- [ ] 실제 사용되는 변수 파악 (Grep으로 검색)
- [ ] 사용자 커스터마이징 패턴 조사
- [ ] 하위 컴포넌트 의존성 파악

### 단계 2: 타입 정의 (Type Definition)

- [ ] `variables` 섹션 설계
  - [ ] 자주 변경되는 속성만 포함
  - [ ] 논리적 그룹핑 (최대 2단계)
  - [ ] 명확한 이름 사용
- [ ] `component` CSSProperties 추가
- [ ] 특정 요소별 CSSProperties 정의
- [ ] 하위 컴포넌트 StyleSet 참조
- [ ] 불필요한 속성 제거
- [ ] JSDoc 주석 추가

### 단계 3: 컴포넌트 수정 (Component Implementation)

- [ ] `useStyleSet` 호출 확인
- [ ] `baseStyleSet` 필요 여부 결정
- [ ] `additionalStyleSet` 필요 여부 결정
- [ ] Template에 스타일 적용
  - [ ] 루트: `styleSetVariables` + `componentStyleSet.component`
  - [ ] 하위 컴포넌트: `:style-set` prop 전달
  - [ ] 특정 요소: `:style` 바인딩
- [ ] 기존 props와 충돌 확인

### 단계 4: CSS 리팩토링 (CSS Refactoring)

- [ ] 불필요한 CSS 변수 제거
- [ ] 직접 값으로 하드코딩
- [ ] 변수명 규칙 준수
- [ ] fallback 값 설정
- [ ] 중첩된 변수 플랫하게 변환
- [ ] 코드 중복 제거

### 단계 5: 테스트 (Testing)

- [ ] 기본 렌더링 테스트
- [ ] styleSet prop 테스트
  - [ ] 문자열 (전역 스타일셋)
  - [ ] 객체 (직접 전달)
- [ ] variables 변환 테스트
- [ ] 하위 컴포넌트 스타일 전파 테스트
- [ ] 기존 사용 사례 호환성 확인
- [ ] 시각적 회귀 테스트

### 단계 6: 문서화 (Documentation)

- [ ] README 업데이트
  - [ ] StyleSet 인터페이스 문서화
  - [ ] 사용 예제 추가
  - [ ] 마이그레이션 가이드 (breaking changes)
- [ ] 타입 주석 개선
- [ ] Playground 예제 추가

---

## 🧪 테스트 전략

### 1. 기본 테스트 케이스

```typescript
describe('VsComponent StyleSet', () => {
    describe('componentStyleSet', () => {
        it('styleSet이 undefined이면 빈 객체를 반환해야 한다', () => {
            const styleSet = ref(undefined);
            const { componentStyleSet } = useStyleSet(VsComponent.VsButton, styleSet);
            expect(componentStyleSet.value).toEqual({});
        });

        it('문자열 styleSet이 주어지면 전역 스타일셋을 가져와야 한다', () => {
            const styleSet = ref('primary');
            // ... 테스트 로직
        });

        it('객체 styleSet이 주어지면 그대로 사용해야 한다', () => {
            const styleSet = ref({ variables: { padding: '1rem' } });
            // ... 테스트 로직
        });
    });

    describe('styleSetVariables', () => {
        it('variables를 CSS 변수로 변환해야 한다', () => {
            const styleSet = ref({
                variables: { padding: '1rem', color: 'red' }
            });
            const { styleSetVariables } = useStyleSet('vs-button', styleSet);
            expect(styleSetVariables.value).toEqual({
                '--vs-button-padding': '1rem',
                '--vs-button-color': 'red',
            });
        });

        it('중첩된 variables를 플랫하게 변환해야 한다', () => {
            const styleSet = ref({
                variables: {
                    focused: {
                        border: '2px solid blue',
                        backgroundColor: 'white',
                    }
                }
            });
            const { styleSetVariables } = useStyleSet('vs-input', styleSet);
            expect(styleSetVariables.value).toEqual({
                '--vs-input-focused-border': '2px solid blue',
                '--vs-input-focused-backgroundColor': 'white',
            });
        });
    });
});
```

### 2. 통합 테스트

```typescript
describe('VsButton Integration', () => {
    it('styleSet variables가 CSS 변수로 적용되어야 한다', () => {
        const wrapper = mount(VsButton, {
            props: {
                styleSet: {
                    variables: { padding: '2rem' }
                }
            }
        });

        const button = wrapper.find('button');
        expect(button.attributes('style')).toContain('--vs-button-padding: 2rem');
    });

    it('component 스타일이 직접 적용되어야 한다', () => {
        const wrapper = mount(VsButton, {
            props: {
                styleSet: {
                    component: { backgroundColor: 'red' }
                }
            }
        });

        const button = wrapper.find('button');
        expect(button.attributes('style')).toContain('background-color: red');
    });

    it('하위 컴포넌트에 스타일이 전파되어야 한다', () => {
        const wrapper = mount(VsButton, {
            props: {
                loading: true,
                styleSet: {
                    loading: {
                        component: { width: '50%' }
                    }
                }
            }
        });

        const loading = wrapper.findComponent(VsLoading);
        expect(loading.props('styleSet')).toEqual({
            component: { width: '50%' }
        });
    });
});
```

### 3. 시각적 회귀 테스트

```typescript
// Playwright 또는 Cypress를 사용한 시각적 테스트
describe('Visual Regression', () => {
    it('기본 렌더링이 변경되지 않아야 한다', async () => {
        await page.goto('/components/vs-button');
        await expect(page).toHaveScreenshot('vs-button-default.png');
    });

    it('커스텀 styleSet이 올바르게 적용되어야 한다', async () => {
        await page.goto('/components/vs-button?styleSet=custom');
        await expect(page).toHaveScreenshot('vs-button-custom.png');
    });
});
```

---

## ❓ FAQ

### Q1: 언제 `variables`를 사용하고 언제 `component`를 사용해야 하나요?

**A**: 다음 기준을 따르세요:

| 사용 케이스 | 추천 방법 | 이유 |
|------------|----------|------|
| 자주 변경되는 속성 (padding, spacing) | `variables` | CSS 변수로 런타임 제어 |
| 특정 상황에서만 변경 | `component` | 직접 스타일 적용 |
| 다양한 스타일 조합 필요 | `component` | CSSProperties 유연성 |
| 논리적으로 그룹화된 속성 | `variables` (중첩) | 명확한 의미론 |

### Q2: `baseStyleSet`은 언제 사용하나요?

**A**: 다음 경우에 사용하세요:
- 하위 컴포넌트의 기본 스타일 설정
- props에 따라 동적으로 변경되는 기본값
- 컴포넌트 내부 로직에 의한 스타일

```typescript
// 예: 버튼의 로딩 스피너 기본 크기
const baseStyleSet = computed(() => ({
    loading: {
        component: { width: '30%', height: '60%' }
    }
}));
```

### Q3: 기존 컴포넌트를 마이그레이션할 때 breaking change가 발생하나요?

**A**: 타입 정의가 변경되므로 TypeScript 사용자에게는 breaking change입니다. 하지만:
- 런타임 동작은 대부분 호환됩니다
- `component` CSSProperties로 모든 속성 지원
- 마이그레이션 가이드 제공 필수

### Q4: CSS 변수 네이밍이 길어지는데 괜찮나요?

**A**: 명확성을 위해 의도적으로 길게 작성합니다:
- `--vs-select-focused-border`: 의미 명확
- `--vs-sel-foc-bor`: 의미 불명확

자동 완성과 타입 안정성으로 실제 작성은 쉽습니다.

### Q5: 왜 3단계 이상 중첩을 금지하나요?

**A**:
- 복잡도 증가로 유지보수 어려움
- CSS 변수명이 너무 길어짐
- useStyleSet의 변환 로직이 2단계까지만 지원
- 실무에서 2단계면 충분함

### Q6: 모든 컴포넌트를 한번에 마이그레이션해야 하나요?

**A**: 아니요. 점진적 마이그레이션을 권장합니다:
1. Core 컴포넌트 (Button, Input)
2. Layout 컴포넌트 (Accordion, Expandable)
3. Form 컴포넌트 (Select, Chip)
4. 나머지 컴포넌트

각 컴포넌트는 독립적으로 업그레이드 가능합니다.

### Q7: 하위 컴포넌트가 여러 개인 경우 어떻게 하나요?

**A**: 각각 명확한 이름으로 정의하세요:

```typescript
interface VsSelectStyleSet {
    variables?: { /* ... */ };
    component?: CSSProperties;
    chip?: VsChipStyleSet;
    selectAllCheckbox?: VsCheckboxStyleSet;
    options?: VsGroupedListStyleSet;
    option?: CSSProperties;
}
```

### Q8: 기존 BoxStyleSet 같은 공통 인터페이스는 어떻게 되나요?

**A**: 새 시스템에서는 extends 대신 명시적 정의를 선호합니다:
- 명확한 API 계약
- 불필요한 속성 상속 방지
- 각 컴포넌트의 독립성 보장

---

## 📚 참고 자료

- [useStyleSet Composable](../src/composables/style-set-composable.ts)
- [useStyleSet Tests](../src/composables/__tests__/style-set-composable.test.ts)
- [VsButton 예제](../src/components/vs-button/)
- [VsAccordion 예제](../src/components/vs-accordion/)
- [VsSelect 예제](../src/components/vs-select/)

---

## 📝 변경 이력

| 버전 | 날짜 | 변경 내용 |
|-----|------|----------|
| 2.0.0 | 2026-01-14 | 새로운 Style-Set 시스템 도입 |

---

**Questions?** 이슈를 생성하거나 팀에 문의하세요.
