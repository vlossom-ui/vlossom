---
name: style-set-migrate
description: 기존 컴포넌트를 새로운 Style-Set 시스템으로 마이그레이션
---

# Style-Set 마이그레이션 가이드

기존 컴포넌트를 새로운 "최소한의 변수, 최대한의 유연성" 철학에 맞게 마이그레이션합니다.

## 사용 시기

- 기존 컴포넌트를 새 Style-Set 시스템으로 업그레이드할 때
- 레거시 StyleSet 인터페이스를 개선할 때
- Breaking change를 동반한 리팩토링이 필요할 때

## 마이그레이션 프로세스

### Phase 1: 분석 (Analysis)

#### 1-1. 현재 상태 파악

다음 파일들을 읽고 분석:

```
📁 components/vs-[component]/
├── types.ts          # 기존 StyleSet 인터페이스
├── Vs[Component].vue # 컴포넌트 구현
├── Vs[Component].css # CSS 스타일
└── README.md         # 문서 (있다면)
```

#### 1-2. 사용 패턴 조사

```bash
# 프로젝트 전체에서 해당 컴포넌트의 styleSet 사용 확인
grep -r "styleSet.*Vs[Component]" --include="*.vue" --include="*.ts"
```

다음 질문에 답하기:
- [ ] 어떤 속성들이 실제로 사용되는가?
- [ ] 사용 빈도가 높은 속성은?
- [ ] 하위 컴포넌트를 사용하는가?
- [ ] baseStyleSet을 사용하는가?

#### 1-3. 문제점 파악

**Old System 체크리스트**:
- [ ] 모든 속성이 루트 레벨에 정의되어 있는가?
- [ ] `variables` 섹션이 없는가?
- [ ] BoxStyleSet 같은 공통 인터페이스를 extends 하는가?
- [ ] 불필요한 속성이 많은가?
- [ ] CSS에 사용되지 않는 변수가 있는가?

### Phase 2: 설계 (Design)

#### 2-1. Variables 재설계

**4가지 질문으로 필터링**:

기존 각 속성에 대해:

| 속성 | 자주 변경? | 런타임 제어? | 재사용? | 명확성? | 결정 |
|-----|----------|------------|--------|--------|------|
| width | ✅ | ✅ | ✅ | ✅ | variables |
| height | ❌ | ❌ | ❌ | ✅ | 제거 (또는 component) |
| padding | ✅ | ✅ | ✅ | ✅ | variables |
| backgroundColor | ❌ | ✅ | ❌ | ✅ | component (ColorScheme) |

#### 2-2. 새 인터페이스 설계

```typescript
// BEFORE (Old System)
interface VsOldStyleSet extends BoxStyleSet {
    width?: string;
    height?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: string;
    // ... 너무 많음
}

// AFTER (New System)
interface VsNewStyleSet {
    variables?: {
        // 필터링된 필수 속성만
        width?: string;
        padding?: string;
        // 그룹화가 필요하면
        focused?: {
            border?: string;
            backgroundColor?: string;
        };
    };
    component?: CSSProperties;
    elementName?: CSSProperties; // 필요시
}
```

#### 2-3. Breaking Changes 문서화

```markdown
## Breaking Changes

### 제거된 속성
- `height`: size prop으로 제어하거나 `component.height` 사용
- `backgroundColor`: ColorScheme 또는 `component.backgroundColor` 사용
- `borderRadius`: 디자인 시스템 일관성을 위해 제거

### 변경된 구조
- 루트 레벨 속성들이 `variables` 섹션으로 이동
- 자유로운 스타일링은 `component` 사용

### 마이그레이션 가이드
\`\`\`typescript
// Before
styleSet: {
    width: '300px',
    backgroundColor: 'red',
}

// After
styleSet: {
    variables: {
        width: '300px',
    },
    component: {
        backgroundColor: 'red',
    }
}
\`\`\`
```

### Phase 3: 구현 (Implementation)

#### 3-1. 타입 정의 수정

```typescript
// types.ts
import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsComponent from './VsComponent.vue';

// 하위 컴포넌트 StyleSet import (필요시)
import type { VsChildStyleSet } from '@/components/vs-child/types';

declare module 'vue' {
    interface GlobalComponents {
        VsComponent: typeof VsComponent;
    }
}

export type { VsComponent };

export interface VsComponentRef extends ComponentPublicInstance<typeof VsComponent> {}

/**
 * VsComponent의 StyleSet
 * @since 2.0.0 - 새로운 Style-Set 시스템으로 마이그레이션
 */
export interface VsComponentStyleSet {
    variables?: {
        /** 컴포넌트 너비 */
        width?: string;
        /** 내부 여백 */
        padding?: string;

        // 그룹화된 속성 (필요시)
        focused?: {
            border?: string;
            backgroundColor?: string;
        };
    };

    /** 루트 요소 직접 스타일 */
    component?: CSSProperties;

    /** 특정 요소 스타일 (필요시) */
    element?: CSSProperties;

    /** 하위 컴포넌트 스타일 (필요시) */
    child?: VsChildStyleSet;
}

// 레거시 지원이 필요하면 (선택적)
/**
 * @deprecated Use VsComponentStyleSet instead
 */
export type VsComponentStyleSetLegacy = Omit<VsComponentStyleSet, 'variables' | 'component'> & {
    width?: string;
    padding?: string;
    // ... 기존 속성들
};
```

#### 3-2. 컴포넌트 수정

**중요: `useStyleSet`의 세 번째 인자 이해하기**

`useStyleSet`은 세 번째 인자로 `baseStyleSet` 또는 `additionalStyleSet`을 받을 수 있습니다:

- **`baseStyleSet`**: 하위 컴포넌트의 기본값을 설정할 때 사용 (예: VsButton의 VsLoading 기본 스타일)
- **`additionalStyleSet`**: Props를 StyleSet으로 변환해 주입할 때 사용 (예: width, height props → CSS 변수)

```vue
<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { objectUtil, stringUtil } from '@/utils';
import type { VsComponentStyleSet } from './types';

const componentName = VsComponent.VsComponent;

export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsComponentStyleSet>(),
        width: { type: [String, Number, Object], default: undefined },
        height: { type: [String, Number, Object], default: undefined },
        // ... 기타 props
    },
    setup(props) {
        const { colorScheme, styleSet, width, height } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        // ⚠️ CRITICAL: additionalStyleSet을 사용해야 하는 경우
        // - width, height 같은 props를 StyleSet으로 변환해야 할 때
        // - 반응형 breakpoint를 고려해야 할 때 (Object 타입 체크)
        const additionalStyleSet: ComputedRef<Partial<VsComponentStyleSet>> = computed(() => {
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

        // baseStyleSet을 사용하는 경우 (하위 컴포넌트 기본값)
        const baseStyleSet: ComputedRef<VsComponentStyleSet> = computed(() => {
            return {
                // 하위 컴포넌트 기본값 등
                childComponent: {
                    component: { width: '100%' },
                },
            };
        });

        // 둘 다 필요하면 additionalStyleSet을 우선 사용
        const { componentStyleSet, styleSetVariables } = useStyleSet<VsComponentStyleSet>(
            componentName,
            styleSet,
            additionalStyleSet, // 또는 baseStyleSet
        );

        return {
            colorSchemeClass,
            styleSetVariables,
            componentStyleSet,
        };
    },
});
</script>

<template>
    <div
        :class="['vs-component', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
    >
        <!-- 특정 요소 -->
        <div
            class="vs-component-element"
            :style="componentStyleSet.element"
        >
            <slot name="element" />
        </div>

        <!-- 하위 컴포넌트 -->
        <vs-child
            v-if="hasChild"
            :style-set="componentStyleSet.child"
        />

        <slot />
    </div>
</template>
```

#### 3-3. CSS 리팩토링

```css
/* BEFORE */
.vs-component {
    --vs-component-width: initial;
    --vs-component-height: initial;
    --vs-component-backgroundColor: initial;
    --vs-component-border: initial;
    --vs-component-borderRadius: initial;
    --vs-component-padding: initial;
    --vs-component-opacity: initial;
    /* ... 너무 많은 변수 */

    width: var(--vs-component-width, 100%);
    height: var(--vs-component-height, auto);
    background-color: var(--vs-component-backgroundColor, var(--vs-comp-bg));
    border: var(--vs-component-border, 1px solid var(--vs-line-color));
    /* ... */
}

/* AFTER */
.vs-component {
    /* 필터링된 변수만 */
    --vs-component-width: initial;
    --vs-component-padding: initial;

    /* 그룹화된 변수 */
    --vs-component-focused-border: initial;
    --vs-component-focused-backgroundColor: initial;

    /* 직접 값 사용 */
    background-color: var(--vs-comp-bg);
    border: 1px solid var(--vs-line-color);
    border-radius: calc(var(--vs-radius-ratio) * var(--vs-radius-md));

    /* 변수 사용 (필터링된 것만) */
    width: var(--vs-component-width, 100%);
    padding: var(--vs-component-padding, 1rem);
}

.vs-component:focus-within {
    border: var(--vs-component-focused-border, 2px solid var(--vs-primary));
    background-color: var(--vs-component-focused-backgroundColor, transparent);
}

/* 불필요한 변수 제거로 코드 간소화 */
```

### Phase 4: 테스트 (Testing)

#### 4-1. 단위 테스트

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import VsComponent from './VsComponent.vue';

describe('VsComponent StyleSet Migration', () => {
    it('variables가 CSS 변수로 변환되어야 한다', () => {
        const wrapper = mount(VsComponent, {
            props: {
                styleSet: {
                    variables: {
                        width: '300px',
                        padding: '2rem',
                    },
                },
            },
        });

        const style = wrapper.attributes('style');
        expect(style).toContain('--vs-component-width: 300px');
        expect(style).toContain('--vs-component-padding: 2rem');
    });

    it('component 스타일이 직접 적용되어야 한다', () => {
        const wrapper = mount(VsComponent, {
            props: {
                styleSet: {
                    component: {
                        backgroundColor: 'red',
                        fontSize: '16px',
                    },
                },
            },
        });

        const style = wrapper.attributes('style');
        expect(style).toContain('background-color: red');
        expect(style).toContain('font-size: 16px');
    });

    it('중첩된 variables가 플랫하게 변환되어야 한다', () => {
        const wrapper = mount(VsComponent, {
            props: {
                styleSet: {
                    variables: {
                        focused: {
                            border: '2px solid blue',
                            backgroundColor: 'white',
                        },
                    },
                },
            },
        });

        const style = wrapper.attributes('style');
        expect(style).toContain('--vs-component-focused-border: 2px solid blue');
        expect(style).toContain('--vs-component-focused-backgroundColor: white');
    });

    it('하위 컴포넌트에 스타일이 전파되어야 한다', () => {
        const wrapper = mount(VsComponent, {
            props: {
                hasChild: true,
                styleSet: {
                    child: {
                        component: { width: '50%' },
                    },
                },
            },
        });

        const child = wrapper.findComponent({ name: 'VsChild' });
        expect(child.props('styleSet')).toEqual({
            component: { width: '50%' },
        });
    });
});
```

#### 4-2. 통합 테스트

```typescript
describe('VsComponent Integration Tests', () => {
    it('기본 렌더링이 변경되지 않아야 한다', () => {
        const wrapper = mount(VsComponent);
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('기존 사용 패턴과 호환되어야 한다', () => {
        // component를 통한 유연한 스타일링
        const wrapper = mount(VsComponent, {
            props: {
                styleSet: {
                    component: {
                        // 기존에 variables로 제공되던 것들도 여기서 가능
                        height: '200px',
                        backgroundColor: 'red',
                        border: '2px solid blue',
                    },
                },
            },
        });

        const style = wrapper.attributes('style');
        expect(style).toContain('height: 200px');
        expect(style).toContain('background-color: red');
    });
});
```

#### 4-3. 시각적 회귀 테스트

```typescript
// Playwright 또는 Cypress
describe('Visual Regression', () => {
    it('마이그레이션 후 기본 스타일이 유지되어야 한다', async () => {
        await page.goto('/components/vs-component');
        await expect(page).toHaveScreenshot('vs-component-default.png', {
            threshold: 0.01, // 1% 허용 오차
        });
    });

    it('primary 변형이 올바르게 표시되어야 한다', async () => {
        await page.goto('/components/vs-component?primary=true');
        await expect(page).toHaveScreenshot('vs-component-primary.png');
    });
});
```

### Phase 5: 문서화 (Documentation)

#### 5-1. README 업데이트

````markdown
# VsComponent

<!-- 기본 설명 -->

**Available Version**: 2.0.0+

## ⚠️ Breaking Changes (v2.0.0)

v2.0.0에서 새로운 Style-Set 시스템으로 마이그레이션되었습니다.

### 변경 사항

#### 제거된 속성
- `height` → `component.height` 또는 size prop 사용
- `backgroundColor` → `component.backgroundColor` 사용
- `borderRadius` → 디자인 시스템 일관성을 위해 제거

#### 구조 변경
루트 레벨 속성들이 `variables` 섹션으로 이동:

```typescript
// Before (v1.x)
styleSet: {
    width: '300px',
    padding: '1rem',
    backgroundColor: 'red',
}

// After (v2.x)
styleSet: {
    variables: {
        width: '300px',
        padding: '1rem',
    },
    component: {
        backgroundColor: 'red',
    }
}
```

### 마이그레이션 가이드

**1단계**: `variables`로 이동
- 자주 변경하는 속성들을 `variables`로 이동

**2단계**: `component` 사용
- 제거된 속성이나 자유로운 스타일링은 `component` 사용

**3단계**: 테스트
- 시각적 변화가 없는지 확인

## StyleSet

```typescript
interface VsComponentStyleSet {
    variables?: {
        width?: string;
        padding?: string;
    };
    component?: CSSProperties;
}
```

### 사용 예제

```vue
<template>
    <vs-component
        :style-set="{
            variables: {
                width: '400px',
                padding: '2rem',
            },
            component: {
                backgroundColor: '#f0f0f0',
                border: '2px solid #333',
            }
        }"
    >
        Content
    </vs-component>
</template>
```
````

#### 5-2. CHANGELOG 작성

```markdown
# Changelog

## [2.0.0] - 2026-01-14

### Breaking Changes
- 새로운 Style-Set 시스템으로 마이그레이션
- `VsComponentStyleSet` 인터페이스 변경
  - `variables` 섹션 추가
  - `component` CSSProperties 추가
  - 불필요한 속성 제거 (height, backgroundColor 등)

### Migration
- [마이그레이션 가이드](./MIGRATION.md) 참고

### Improvements
- API 표면적 60% 감소
- CSS 변수 10개 → 4개 감소
- 타입 안정성 향상
- 유연성 증가 (CSSProperties 지원)

## [1.9.0] - 2025-12-01
...
```

### Phase 6: 배포 (Deployment)

#### 6-1. 배포 전 체크리스트

- [ ] 모든 테스트 통과
- [ ] 타입 체크 통과 (`npm run type-check`)
- [ ] 린트 통과 (`npm run lint`)
- [ ] 시각적 회귀 테스트 통과
- [ ] README 업데이트 완료
- [ ] CHANGELOG 작성 완료
- [ ] Breaking Changes 문서화 완료
- [ ] Playground 예제 업데이트

#### 6-2. 버전 전략

```json
// package.json
{
    "version": "2.0.0" // Major version up (Breaking Changes)
}
```

#### 6-3. 릴리스 노트

```markdown
# Release v2.0.0

## 🎉 새로운 Style-Set 시스템

"최소한의 변수, 최대한의 유연성" 철학을 바탕으로 한 새로운 Style-Set 시스템 도입

### ✨ 주요 개선사항
- API 표면적 60% 감소
- CSS 변수 최적화 (10개 → 4개)
- 타입 안정성 향상
- CSSProperties로 무한 유연성

### ⚠️ Breaking Changes
자세한 내용은 [마이그레이션 가이드](./docs/MIGRATION.md) 참고

### 🔗 관련 문서
- [Style-Set 가이드라인](./STYLE_SET_GUIDELINES.md)
- [VsComponent README](./src/components/vs-component/README.md)
```

## ⚠️ 흔한 실수와 해결 방법

### 실수 1: additionalStyleSet 제거 (P1 - Critical)

**증상**:
- width, height props가 동작하지 않음
- 반응형 breakpoint가 적용되지 않음

**잘못된 코드**:
```typescript
// ❌ BAD: additionalStyleSet을 제거함
const { componentStyleSet, styleSetVariables } = useStyleSet<VsFileDropStyleSet>(
    componentName,
    styleSet
);
```

**올바른 코드**:
```typescript
// ✅ GOOD: additionalStyleSet으로 props를 StyleSet으로 변환
const additionalStyleSet = computed(() => {
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

const { componentStyleSet, styleSetVariables } = useStyleSet<VsFileDropStyleSet>(
    componentName,
    styleSet,
    additionalStyleSet  // 반드시 포함!
);
```

**체크 방법**:
```bash
# 마이그레이션 전 파일에서 additionalStyleSet 확인
git show <commit>~1:path/to/Component.vue | grep -A10 "additionalStyleSet"

# 마이그레이션 후에도 필요하면 반드시 유지
```

### 실수 2: CSS 변수와 속성 중복 (P3 - Minor)

**증상**:
- CSS에 사용되지 않는 변수가 남아있음
- 속성 위치가 변경되어 정리 가능한 코드가 남음

**예시**:
```css
/* 마이그레이션 전 */
.vs-file-drop {
    --vs-file-drop-width: initial;
    --vs-file-drop-height: initial;
    
    width: var(--vs-file-drop-width, 100%);
    height: var(--vs-file-drop-height, auto);
    padding: 1rem;  /* 하드코딩됨 */
}

/* 마이그레이션 후 - padding도 variables로 이동했다면 */
.vs-file-drop {
    --vs-file-drop-width: initial;
    --vs-file-drop-height: initial;
    --vs-file-drop-padding: initial;  /* 새로 추가 */
    
    width: var(--vs-file-drop-width, 100%);
    height: var(--vs-file-drop-height, auto);
    padding: var(--vs-file-drop-padding, 1rem);  /* 변수로 변경 */
}

/* ⚠️ 이 경우 변수들을 그룹화하거나 정리할 수 있음 */
```

**개선 방향** (P3이므로 선택적):
- 위치 변경과 함께 관련 CSS도 정리
- 불필요한 변수 제거
- 그룹화 가능한 속성은 그룹화

### 실수 3: baseStyleSet과 additionalStyleSet 혼동

**차이점 이해**:

| | baseStyleSet | additionalStyleSet |
|---|---|---|
| **용도** | 하위 컴포넌트 기본값 설정 | Props를 StyleSet으로 변환 |
| **예시** | VsButton의 VsLoading 스타일 | width, height props |
| **병합 방식** | StyleSet과 deep merge | StyleSet과 shallow merge |
| **반응성** | 보통 정적 | 보통 반응형 (computed) |

**예시**:
```typescript
// baseStyleSet - 하위 컴포넌트 스타일 제어
const baseStyleSet = computed(() => ({
    loading: {  // 하위 VsLoading 컴포넌트
        component: { width: '1rem', height: '1rem' },
    },
}));

// additionalStyleSet - Props를 StyleSet으로
const additionalStyleSet = computed(() => ({
    width: stringUtil.toStringSize(width.value),
    height: stringUtil.toStringSize(height.value),
}));
```

### 실수 4: 반응형 Breakpoint 처리 누락

**잘못된 코드**:
```typescript
// ❌ BAD: Object 타입(breakpoint) 체크 없음
const additionalStyleSet = computed(() => ({
    width: stringUtil.toStringSize(width.value),
}));
// width가 { sm: '100%', md: '50%' } 형태일 때 에러!
```

**올바른 코드**:
```typescript
// ✅ GOOD: Object 타입 체크로 breakpoint 지원
const additionalStyleSet = computed(() => ({
    width:
        width.value === undefined || objectUtil.isObject(width.value)
            ? undefined  // breakpoint 객체는 다른 곳에서 처리
            : stringUtil.toStringSize(width.value),
}));
```

## 마이그레이션 체크리스트

마이그레이션 완료 후 반드시 확인:

### 기능 체크
- [ ] 기존 width, height props가 정상 동작하는가?
- [ ] 반응형 breakpoint가 적용되는가?
- [ ] 하위 컴포넌트 스타일이 유지되는가?
- [ ] additionalStyleSet이 필요한데 제거하지 않았는가?
- [ ] baseStyleSet이 필요한데 제거하지 않았는가?

### 코드 품질 체크
- [ ] 불필요한 CSS 변수가 제거되었는가?
- [ ] TypeScript 타입 에러가 없는가?
- [ ] ESLint 경고가 없는가?
- [ ] 중복된 스타일이 정리되었는가?

### 테스트 체크
- [ ] 기존 테스트가 통과하는가?
- [ ] 시각적 변화가 없는가?
- [ ] Props 전달이 정상적인가?

## 마이그레이션 우선순위

### High Priority (먼저)
- Core 컴포넌트: VsButton, VsInput
- 자주 사용되는 컴포넌트
- 하위 컴포넌트를 많이 사용하는 것

### Medium Priority
- Layout 컴포넌트: VsAccordion, VsCard
- Form 컴포넌트: VsSelect, VsCheckbox

### Low Priority (나중에)
- 덜 사용되는 컴포넌트
- 독립적인 컴포넌트

## 마이그레이션 메트릭

각 컴포넌트 마이그레이션 후 측정:

```markdown
## 마이그레이션 메트릭: VsComponent

### Before
- CSS 변수: 12개
- 타입 속성: 15개
- CSS 코드: 180 lines
- 복잡도: High

### After
- CSS 변수: 4개 (-67%)
- 타입 속성: 3개 + CSSProperties (-80%)
- CSS 코드: 120 lines (-33%)
- 복잡도: Low

### 개선 효과
- ✅ API 표면적 80% 감소
- ✅ 코드 가독성 향상
- ✅ 유지보수성 개선
- ✅ 유연성 증가
```

## 참고 문서

- [STYLE_SET_GUIDELINES.md](../../packages/vlossom/STYLE_SET_GUIDELINES.md)
- [useStyleSet Composable](../../packages/vlossom/src/composables/style-set-composable.ts)
- [마이그레이션 예제](../../packages/vlossom/src/components/vs-button/)

## 사용 방법

```
/style-set-migrate VsButton
```

또는 파일 경로:

```
/style-set-migrate packages/vlossom/src/components/vs-button
```
