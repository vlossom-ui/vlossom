---
name: style-set-migrate
description: 기존 컴포넌트를 새로운 Style-Set 시스템으로 마이그레이션
---

# Style-Set 마이그레이션 가이드

기존 컴포넌트의 StyleSet을 새로운 시스템으로 마이그레이션하는 전체 가이드.

## 작업 범위

### 코어 마이그레이션

1. **CSS 분석**: CSS 파일에서 각 변수의 참조 위치 파악 → 유지/제거 결정
2. **types.ts**: CSS 분석 결과 기반으로 새로운 StyleSet 인터페이스 정의
3. **Vue**: 컴포넌트 로직 수정
4. **CSS**: 불필요한 CSS 변수 제거, 기본값 직접 설정

### 문서화

5. **README.md**: 기존 타입 정의 및 사용 예시를 새 구조로 수정
6. **Stories**: 기존 styleSet 스토리를 새 구조로 수정
7. **Tests**: 기존 테스트 수정 + 필수 우선순위 테스트 추가 (해당 시)

### 검증

8. **의존 컴포넌트 수정**: 마이그레이션한 컴포넌트를 사용하는 다른 파일들도 업데이트
9. **테스트 실행**: `npm test [component-name]` 실행하여 모든 테스트 통과 확인

**핵심 원칙: 새로 추가하지 않고 기존 파일만 수정**

---

## 핵심 원칙

### 기본 철학

- **최소한의 CSS 변수**: `variables`는 CSS에서 `var()`로 참조가 필요한 경우만 사용
- **최대한의 유연성**: `component?: CSSProperties`로 모든 CSS 속성 지원
- **명확한 역할 분리**: variables는 CSS 변수, component는 직접 스타일
- **실제 코드 파일에 주석 달지 않음**: types.ts, Vue, CSS 등 실제 코드에는 주석 불필요 (스킬 문서 내 예시는 학습용으로 예외)

### useStyleSet 동작 방식

```typescript
function useStyleSet<T>(
  component: VsComponent | string,
  styleSet: Ref<string | T | undefined>,
  baseStyleSet: Ref<Partial<T>> = ref({}), // 기본값 (가장 낮은 우선순위)
  additionalStyleSet: Ref<Partial<T>> = ref({}) // props에서 오는 값 (가장 높은 우선순위)
);
```

**병합 우선순위**: `baseStyleSet` < `styleSet` (prop) < `additionalStyleSet`

**반환값**:

- `componentStyleSet`: 병합된 전체 StyleSet 객체
- `styleSetVariables`: `variables` 객체가 CSS 변수로 변환된 결과

### CSS 변수 변환 규칙

```typescript
// 입력
styleSet: {
    variables: {
        width: '300px',
        focused: {
            border: '2px solid blue',
        }
    }
}

// styleSetVariables 출력
{
    '--vs-component-width': '300px',
    '--vs-component-focused-border': '2px solid blue',
}
```

---

## 1단계: CSS 분석 (가장 중요)

**CSS 파일을 먼저 분석해서 어떤 변수를 유지/제거할지 결정**

### CSS 변수별 분석 체크리스트

각 CSS 변수에 대해 다음을 확인:

1. **어디서 참조되는가?**

   - 루트 요소에서만? → **제거 가능** (component로 대체)
   - 하위 요소(.vs-component-child)에서? → **유지** (inline style 직접 적용 불가)
   - 여러 선택자에서? → **유지**

2. **상태별로 다르게 적용되는가?**

   - 특정 클래스(.vs-vertical, .vs-active 등)에서 다른 값? → **유지**
   - hover, focus 등 의사 클래스에서 참조? → **유지**

3. **media query / container query에서 참조되는가?** → **유지**

4. **::before, ::after에서 참조되는가?** → **유지**

### 분석 예시: VsImage

```css
.vs-image {
  /* 루트에서만 사용 → 제거 가능 */
  opacity: var(--vs-image-opacity, 100%);
  background-color: var(--vs-image-backgroundColor, transparent);

  /* 루트 + .vs-image-tag 둘 다에서 사용 → 유지 */
  width: var(--vs-image-width, 100%);
  height: var(--vs-image-height, 100%);

  .vs-image-tag {
    /* 하위 요소에서 사용 → 유지 (inline style 불가) */
    border: var(--vs-image-border, none);
    border-radius: var(--vs-image-borderRadius, 0);
    width: var(--vs-image-width, 100%); /* 여러 곳 참조 */
    height: var(--vs-image-height, 100%); /* 여러 곳 참조 */
  }
}
```

**결론:**

- `backgroundColor`, `opacity` → **제거** (루트에서만 사용)
- `width`, `height` → **유지** (루트 + 하위 요소)
- `border`, `borderRadius`, `objectFit` → **유지** (하위 요소)

### 분석 명령어

```bash
# CSS에서 var() 참조 확인
grep -n "var(--vs-component" VsComponent.css

# 각 변수가 몇 번 참조되는지 확인
grep -c "var(--vs-image-width" VsImage.css  # 2번 이상이면 유지
```

### 의존성 파악

```bash
# 해당 컴포넌트를 사용하는 파일 검색
grep -rn "VsComponent" --include="*.vue" --include="*.ts"

# styleSet 사용 확인
grep -rn "style-set" --include="*.vue" --include="*.ts"
```

---

## 2단계: types.ts 수정

### ⚠️ 중요: 실제 types.ts에 주석 넣지 말 것

아래 예시의 주석은 학습용입니다. 실제 코드에는 주석을 포함하지 마세요.

### 변경 전/후 비교

```typescript
// BEFORE (기존)
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';

export interface VsOldStyleSet extends SizeStyleSet, BoxStyleSet {
  customProp?: string;
  anotherProp?: string;
}

// AFTER (신규)
import type { CSSProperties } from 'vue';

export interface VsNewStyleSet {
  variables?: {
    // CSS var()로 참조하는 것만
  };
  component?: CSSProperties;
  // 하위 컴포넌트 StyleSet (필요시)
  // 특정 요소 CSSProperties (필요시)
}
```

### StyleSet 타입 패턴

#### Pattern A: component만 사용 (가장 단순)

CSS 변수가 불필요한 경우.

```typescript
export interface VsBarStyleSet {
  component?: CSSProperties;
}
```

#### Pattern B: variables + component + 하위 컴포넌트

```typescript
export interface VsButtonStyleSet {
  variables?: {
    padding?: string;
  };
  component?: CSSProperties;
  loading?: VsLoadingStyleSet;
}
```

#### Pattern C-1: 중첩 variables (상태별 그룹화)

```typescript
export interface VsSelectStyleSet {
  variables?: {
    height?: string;
    selected: {
      backgroundColor?: string;
      fontWeight?: number;
    };
    focused: {
      border?: string;
    };
  };
  component?: CSSProperties;
}
```

#### Pattern C-2: 중첩 variables (영역별 그룹화)

동일한 접두사를 가진 속성들을 그룹화. CSS에서 특정 하위 요소에 적용되는 스타일들.

```typescript
// BEFORE - 평탄한 구조
export interface VsLabelValueStyleSet {
  variables?: {
    labelBackgroundColor?: string;
    labelFontColor?: string;
    labelFontSize?: string;
    valueBackgroundColor?: string;
    valueFontColor?: string;
    // ...
  };
}

// AFTER - 영역별 그룹화
interface LabelVariables {
  backgroundColor?: string;
  fontColor?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  verticalAlign?: string;
  width?: string;
}

interface ValueVariables {
  backgroundColor?: string;
  fontColor?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  verticalAlign?: string;
}

export interface VsLabelValueStyleSet {
  variables?: {
    border?: string;
    borderRadius?: string;
    label?: LabelVariables;
    value?: ValueVariables;
  };
  component?: CSSProperties;
}
```

**CSS 변수 변환:**

- `label: { backgroundColor: '#fff' }` → `--vs-label-value-label-backgroundColor: #fff`
- 하이픈(`-`)으로 중첩 구조가 연결됨

**사용 시점:**

- 동일한 접두사를 가진 속성이 3개 이상
- CSS에서 특정 하위 요소(`.vs-label`, `.vs-value`)에만 적용되는 스타일

#### Pattern D: 상위 컴포넌트 StyleSet 상속

```typescript
import type { VsBarStyleSet } from '@/components/vs-bar/types';

export interface VsHeaderStyleSet extends VsBarStyleSet {}
```

#### Pattern E: 특정 요소 스타일

```typescript
export interface VsBlockStyleSet {
  variables?: {
    padding?: string;
    border?: string;
  };
  component?: CSSProperties;
  title?: CSSProperties; // 특정 요소
}
```

### StyleSet에 넣으면 안 되는 것

**props로 받아서 additionalStyleSet에 매핑되는 값은 StyleSet 인터페이스에 넣지 않음**

```typescript
// VsSteps 예시
// gap, gapCount는 props로 받아서 내부적으로 CSS에 적용
// → StyleSet.variables에 넣으면 안 됨

// WRONG
export interface VsStepsStyleSet {
  variables?: {
    gap?: string; // ❌ props로 받음
    gapCount?: number; // ❌ props로 받음
  };
}

// CORRECT - gap, gapCount는 props로만 받음
export interface VsStepsStyleSet {
  variables?: {
    step?: StepVariables;
    activeStep?: StepVariables;
  };
}
```

**판단 기준**: "이 값을 사용자가 `:style-set`으로 설정하는가, 개별 prop으로 설정하는가?"

- `:style-set`으로 설정 → StyleSet 인터페이스에 포함
- 개별 prop으로 설정 → StyleSet 인터페이스에서 제외 (additionalStyleSet 내부 구현)

---

### variables 판단 기준

**variables에 넣어야 하는 경우:**

1. **하위 요소에서 사용**: 루트가 아닌 자식 요소에 적용되는 스타일

   ```css
   /* .vs-image-tag는 하위 요소 → inline style 직접 적용 불가 */
   .vs-image .vs-image-tag {
     border: var(--vs-image-border, none);
     border-radius: var(--vs-image-borderRadius, 0);
   }
   ```

2. **여러 곳에서 동일 변수 참조**: 루트 + 하위 요소, 또는 여러 선택자

   ```css
   /* width/height가 루트와 하위 요소 둘 다에서 사용 */
   .vs-image {
     width: var(--vs-image-width, 100%);
   }
   .vs-image .vs-image-tag {
     width: var(--vs-image-width, 100%);
   }
   ```

3. **상태별/선택자별 스타일**: CSS 클래스에 따라 다르게 적용

   ```css
   /* 예: VsDivider - horizontal vs vertical 상태 */
   .vs-divider {
     margin: var(--vs-divider-horizontal-margin);
   }
   .vs-divider.vs-vertical {
     margin: var(--vs-divider-vertical-margin);
   }
   ```

4. **container query / media query에서 참조**

   ```css
   @container (max-width: 768px) {
     .vs-divider.vs-vertical {
       margin: var(--vs-divider-horizontal-margin);
     }
   }
   ```

5. **::before, ::after 등 의사 요소**: JS로 직접 스타일 적용 불가

6. **CSS 계산식에 사용되는 경우**

**component에 넣어야 하는 경우 (variables 불필요):**

1. **루트 요소에서만 사용되는 단순 속성**

   ```css
   /* opacity, backgroundColor가 루트에서만 사용 → 제거 가능 */
   .vs-image {
     opacity: var(--vs-image-opacity); /* 루트에서만 → component로 */
     background-color: var(--vs-image-bg); /* 루트에서만 → component로 */
   }
   ```

2. **다른 선택자에서 참조되지 않는 스타일**

3. **일회성 커스터마이징**

**핵심 판단**: "이 속성이 루트 요소에서만 사용되는가?" → Yes면 component, No면 variables

---

## 3단계: Vue 컴포넌트 수정

### ⚠️ 중요: 실제 Vue 파일에 주석 넣지 말 것

아래 예시의 주석은 학습용입니다. 실제 코드에는 주석을 포함하지 마세요.

### 기본 템플릿

```vue
<template>
  <component
    :is="tag"
    :class="['vs-component', colorSchemeClass, classObj]"
    :style="{ ...styleSetVariables, ...componentStyleSet.component }"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { VsComponent } from '@/declaration';
import { objectUtil } from '@/utils';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsComponentStyleSet } from './types';

const componentName = VsComponent.VsComponentName;
export default defineComponent({
  name: componentName,
  props: {
    ...getColorSchemeProps(),
    ...getStyleSetProps<VsComponentStyleSet>(),
    // 컴포넌트별 props
  },
  setup(props) {
    const { colorScheme, styleSet } = toRefs(props);

    const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

    // baseStyleSet: 하위 컴포넌트 기본값 (필요시)
    const baseStyleSet: ComputedRef<Partial<VsComponentStyleSet>> = computed(
      () => ({})
    );

    // additionalStyleSet: props에서 오는 동적 값 (필요시)
    const additionalStyleSet: ComputedRef<Partial<VsComponentStyleSet>> =
      computed(() => {
        return objectUtil.shake({
          component: objectUtil.shake({
            // props 값 매핑
          }),
        });
      });

    const { componentStyleSet, styleSetVariables } =
      useStyleSet<VsComponentStyleSet>(
        componentName,
        styleSet,
        baseStyleSet,
        additionalStyleSet
      );

    return {
      colorSchemeClass,
      componentStyleSet,
      styleSetVariables,
    };
  },
});
</script>
```

### useStyleSet 인자 사용법

| 인자                 | 용도                            | 예시                                       |
| -------------------- | ------------------------------- | ------------------------------------------ |
| `styleSet`           | 사용자가 prop으로 전달한 값     | `:style-set="{ component: { ... } }"`      |
| `baseStyleSet`       | 하위 컴포넌트 기본값            | `loading: { component: { width: '30%' } }` |
| `additionalStyleSet` | props에서 오는 동적 값 (최우선) | `component: { position: position.value }`  |

**중요**: `additionalStyleSet`은 반드시 **4번째 인자**로 전달해야 함. 3번째에 넣으면 `baseStyleSet` 자리에 들어가서 우선순위가 낮아짐.

```typescript
// WRONG - additionalStyleSet이 baseStyleSet 자리에 들어감
const { componentStyleSet, styleSetVariables } = useStyleSet<T>(
  componentName,
  styleSet,
  additionalStyleSet // 3번째 = baseStyleSet 자리!
);

// CORRECT
const { componentStyleSet, styleSetVariables } = useStyleSet<T>(
  componentName,
  styleSet,
  baseStyleSet, // 3번째 = baseStyleSet
  additionalStyleSet // 4번째 = additionalStyleSet
);

// baseStyleSet 없이 additionalStyleSet만 사용하는 경우
const baseStyleSet: ComputedRef<Partial<T>> = computed(() => ({}));
const { componentStyleSet, styleSetVariables } = useStyleSet<T>(
  componentName,
  styleSet,
  baseStyleSet,
  additionalStyleSet
);
```

### 하위 컴포넌트가 있는 경우

```vue
<template>
  <div :style="{ ...styleSetVariables, ...componentStyleSet.component }">
    <vs-loading v-if="loading" :style-set="componentStyleSet.loading" />
    <slot />
  </div>
</template>

<script lang="ts">
setup(props) {
    const baseStyleSet: ComputedRef<Partial<VsButtonStyleSet>> = computed(() => ({
        loading: {
            component: {
                width: '30%',
                height: '60%',
            },
        },
    }));

    const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(
        componentName,
        styleSet,
        baseStyleSet,
    );
}
</script>
```

### 특정 요소 스타일 적용

```vue
<template>
  <div :style="{ ...styleSetVariables, ...componentStyleSet.component }">
    <div class="vs-block-title" :style="componentStyleSet.title">
      <slot name="title" />
    </div>
    <div class="vs-block-content">
      <slot />
    </div>
  </div>
</template>
```

---

## 4단계: CSS 수정

### ⚠️ 중요: 실제 CSS 파일에 주석 넣지 말 것

아래 예시의 주석은 학습용입니다. 실제 코드에는 주석을 포함하지 마세요.

### 변경 전/후 비교

```css
/* BEFORE - 많은 CSS 변수 선언 */
.vs-component {
  --vs-component-width: initial;
  --vs-component-height: initial;
  --vs-component-backgroundColor: initial;
  --vs-component-padding: initial;

  width: var(--vs-component-width, 100%);
  height: var(--vs-component-height, auto);
  background-color: var(--vs-component-backgroundColor, var(--vs-comp-bg));
  padding: var(--vs-component-padding, 1rem);
}

/* AFTER - 필요한 것만 */
.vs-component {
  /* variables에 정의된 것만 선언 */
  --vs-component-padding: initial;

  /* 직접 값 사용 */
  width: 100%;
  height: auto;
  background-color: var(--vs-comp-bg);

  /* CSS 변수는 필요한 곳에만 */
  padding: var(--vs-component-padding, 1rem);
}
```

### CSS 변수 유지 기준

1. **유지**: CSS에서 `var()`로 참조 필요
2. **유지**: 상태별 스타일 (hover, focus 등)
3. **유지**: ::before, ::after 의사 요소
4. **제거**: 직접 인라인 스타일로 대체 가능

### 상태별 스타일 예시

```css
.vs-select {
  --vs-select-focused-border: initial;
  --vs-select-focused-backgroundColor: initial;
}

.vs-select:focus-within {
  border: var(--vs-select-focused-border, 2px solid var(--vs-primary));
  background-color: var(--vs-select-focused-backgroundColor, var(--vs-comp-bg));
}
```

---

## 5단계: README.md 수정

### Types 섹션 업데이트

```markdown
## Types

\\\`typescript
interface VsComponentStyleSet {
variables?: {
padding?: string;
border?: string;
};
component?: CSSProperties;
title?: CSSProperties;
child?: VsChildStyleSet;
}
\`\`\`
```

### StyleSet 사용 예시 수정

```markdown
### StyleSet 사용 예시

\`\`\`html
<template>
<vs-component
:style-set="{
variables: {
padding: '2rem',
border: '2px solid #333',
},
component: {
backgroundColor: '#f5f5f5',
borderRadius: '8px',
},
}"

>

    Content

  </vs-component>
</template>
\`\`\`
```

---

## 6단계: Stories 수정

**기존 스토리만 수정 - 새로운 스토리 추가 불필요**

### 기존 styleSet 스토리 수정 예시

```typescript
// BEFORE (기존 구조)
export const StyleSet: Story = {
  args: {
    styleSet: {
      width: '80%',
      margin: '1rem 0',
      border: '2px solid #e91e63',
    },
  },
};

// AFTER (새 구조로 변경)
export const StyleSet: Story = {
  args: {
    styleSet: {
      variables: {
        border: '2px solid #e91e63',
        horizontal: {
          width: '80%',
          margin: '1rem 0',
        },
      },
    },
  },
};
```

### Chromatic 스토리도 동일하게 수정

```typescript
// chromatic.stories.ts - 기존 styleSet만 새 구조로 변경
export const WithStyleSet: Story = {
  args: {
    styleSet: {
      component: {
        backgroundColor: '#e91e63',
      },
    },
  },
};
```

---

## 7단계: Tests 수정

### 기존 styleSet 테스트 수정

```typescript
// BEFORE
it('styleSet이 적용되어야 한다', () => {
  const wrapper = mount(VsComponent, {
    props: {
      styleSet: {
        width: '100px',
        height: '50px',
        backgroundColor: '#ff0000',
      },
    },
  });

  expect(wrapper.vm.styleSetVariables).toEqual({
    '--vs-component-width': '100px',
    '--vs-component-height': '50px',
    '--vs-component-backgroundColor': '#ff0000',
  });
});

// AFTER
it('styleSet이 적용되어야 한다', () => {
  const wrapper = mount(VsComponent, {
    props: {
      styleSet: {
        variables: {
          padding: '2rem',
        },
        component: {
          backgroundColor: '#ff0000',
          width: '100px',
        },
      },
    },
  });

  expect(wrapper.vm.styleSetVariables).toEqual({
    '--vs-component-padding': '2rem',
  });
  expect(wrapper.vm.componentStyleSet.component).toEqual({
    backgroundColor: '#ff0000',
    width: '100px',
  });
});
```

### 조건부 테스트: props 우선순위 검증

**additionalStyleSet이 있는 컴포넌트만 추가!**

- `additionalStyleSet` **사용** → 테스트 추가 (props가 styleSet보다 우선하는지 검증)
- `additionalStyleSet` **미사용** → **테스트 추가하지 않음** (충돌할 props가 없으므로 의미 없음)

**판단 기준**: Vue 컴포넌트에서 `additionalStyleSet`을 정의하고 `useStyleSet`에 전달하는가?

```typescript
// additionalStyleSet이 있는 컴포넌트만
describe('복합 styleSet 조합', () => {
  it('styleSet과 props가 동시에 주어지면 props가 우선되어야 한다', () => {
    const wrapper = mount(VsComponent, {
      props: {
        height: '500px', // props로 전달된 값 (additionalStyleSet에 매핑됨)
        styleSet: {
          component: {
            height: '300px', // props와 충돌
            backgroundColor: '#ff0000', // 충돌 없음
          },
        },
      },
    });

    // props(additionalStyleSet)가 styleSet보다 우선되므로 height는 '500px'
    expect(wrapper.vm.componentStyleSet.component?.height).toBe('500px');
    // styleSet의 다른 값은 그대로 유지
    expect(wrapper.vm.componentStyleSet.component?.backgroundColor).toBe(
      '#ff0000'
    );
  });
});
```

---

## 8단계: 의존 컴포넌트 수정

마이그레이션한 컴포넌트를 사용하는 다른 파일들도 업데이트 필요.

### 검색 방법

```bash
# styleSet 사용 검색
grep -rn "style-set.*VsComponent\|VsComponent.*style-set" --include="*.vue" --include="*.ts"

# playground에서 사용 확인
grep -rn "VsComponent" packages/vlossom/playground/
```

### 수정 대상

1. **다른 컴포넌트에서 사용**: 해당 컴포넌트의 styleSet 전달 부분 수정
2. **playground**: 예시 코드 수정
3. **stories**: 다른 컴포넌트 스토리에서 사용되는 경우

### 예시

```vue
<!-- BEFORE -->
<vs-component
  :style-set="{
    width: '100px',
    backgroundColor: '#fff',
  }"
/>

<!-- AFTER -->
<vs-component
  :style-set="{
    component: {
      width: '100px',
      backgroundColor: '#fff',
    },
  }"
/>
```

---

## 9단계: 테스트 실행 및 통과 확인

마이그레이션이 올바르게 되었는지 검증하기 위해 테스트를 실행합니다.

### 테스트 실행 방법

```bash
# 컴포넌트 단위 테스트 실행
npm test [component-name]

# 예시
npm test vs-text-wrap
```

### 테스트 결과 확인

1. **모든 테스트 통과 확인**

   - `Test Files: X passed` 확인
   - `Tests: X passed` 확인
   - 실패한 테스트가 없어야 함

2. **실패 시 대응**
   - 에러 메시지 확인
   - 관련 테스트 코드 수정
   - 재실행하여 통과 확인

### 일반적인 테스트 실패 원인

1. **additionalStyleSet의 빈 값 포함**

   ```typescript
   // 문제: width prop이 없을 때 빈 문자열이 포함됨
   expect(wrapper.vm.componentStyleSet.component).toEqual({
     backgroundColor: '#f5f5f5',
     // width: '', // 이 값이 포함되어 테스트 실패
   });

   // 해결: 실제 값 포함하여 테스트
   expect(wrapper.vm.componentStyleSet.component).toEqual({
     backgroundColor: '#f5f5f5',
     width: '', // additionalStyleSet에서 오는 빈 값 포함
   });
   ```

2. **styleSetVariables 형식 불일치**

   - CSS 변수명이 올바른지 확인
   - 중첩 구조가 올바르게 변환되는지 확인

3. **componentStyleSet 접근 방식**
   - `.component?.property` 형식으로 접근하는지 확인
   - optional chaining 사용 여부 확인

---

## 체크리스트

**전체 원칙: 실제 코드 파일에 주석 달지 않음**

### 코어 마이그레이션

#### CSS 분석

- [ ] 각 CSS 변수의 참조 위치 확인
- [ ] 유지/제거 대상 결정

#### types.ts

- [ ] 기존 `extends SizeStyleSet` 등 제거
- [ ] `variables?` 정의 (CSS var() 참조 필요한 것만)
- [ ] `component?: CSSProperties` 추가
- [ ] 하위 컴포넌트 StyleSet 타입 추가 (필요시)
- [ ] 특정 요소 CSSProperties 추가 (필요시)
- [ ] **props로 받는 값은 StyleSet에서 제외** (additionalStyleSet 내부 구현)

#### Vue 컴포넌트

- [ ] `baseStyleSet` computed 선언 (빈 객체 또는 기본값)
- [ ] `additionalStyleSet` computed 선언 (props 매핑, 필요시)
- [ ] `useStyleSet` 4개 인자로 호출
- [ ] template `:style` 바인딩 수정

#### CSS

- [ ] 불필요한 CSS 변수 선언 제거
- [ ] `variables`에 정의된 것만 CSS 변수로 유지
- [ ] 기본값 직접 설정

### 문서화

#### README.md

- [ ] Types 섹션의 StyleSet 인터페이스를 새 구조로 수정
- [ ] **중첩 타입은 풀어서 명시** (별도 interface로 분리되어 있어도 인라인으로 풀어서 작성)
- [ ] 기존 StyleSet 사용 예시를 새 구조로 수정

#### Stories

- [ ] 기존 styleSet 스토리를 새 구조로 수정
- [ ] Chromatic 스토리도 새 구조로 수정
- [ ] **새 스토리 추가 불필요**

#### Tests

- [ ] 기존 styleSet 관련 테스트를 새 구조로 수정
- [ ] **additionalStyleSet 사용 시만**: "복합 styleSet 조합" 테스트 추가
- [ ] **additionalStyleSet 미사용 시**: 해당 테스트 **추가하지 않음**
- [ ] componentStyleSet 접근 방식 확인 (`.component?.property`)
- [ ] styleSetVariables 검증 로직 업데이트

### 검증

#### 의존 컴포넌트

- [ ] playground에서 사용 확인 및 수정
- [ ] 다른 컴포넌트에서 styleSet 전달 방식 수정
- [ ] stories에서 사용되는 경우 수정

#### 테스트 실행

- [ ] `npm test [component-name]` 실행
- [ ] 모든 테스트 통과 확인 (실패 시 수정 후 재실행)
- [ ] 테스트 결과 검토 및 최종 검증

---

## 스타일 우선순위 (CSS Specificity)

`variables`와 `component`가 동일 속성을 가질 경우:

```typescript
styleSet: {
    variables: { width: '100px' },  // → --vs-component-width: 100px
    component: { width: '200px' },  // → style="width: 200px"
}
```

**결과**: `component`가 우선 (inline style > CSS 변수)

- `styleSetVariables`는 CSS 변수로 변환 → 스타일시트에서 `var()` 참조
- `componentStyleSet.component`는 inline style로 직접 적용
- CSS specificity 규칙에 따라 inline style이 더 높은 우선순위

---

## 핵심 요약

1. **CSS 분석 먼저** - 각 변수의 참조 위치 파악 → 유지/제거 결정
2. **핵심 판단**: "루트에서만 사용?" → Yes면 component, No면 variables
3. **기존 파일만 수정** - 새로운 스토리/테스트 추가 불필요
4. **"복합 styleSet 조합" 테스트는 additionalStyleSet 사용 시에만 추가**
5. **의존성**: 해당 컴포넌트를 사용하는 다른 파일들도 수정
6. **테스트 실행 필수** - `npm test [component-name]`으로 검증, 모든 테스트 통과 확인
7. **실제 코드 파일에 주석 달지 않음** - types.ts, Vue, CSS 등
