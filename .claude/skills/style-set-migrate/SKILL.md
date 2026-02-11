---
name: style-set-migrate
description: 기존 컴포넌트를 새로운 Style-Set 시스템으로 마이그레이션
---

# Style-Set 마이그레이션 가이드

기존 컴포넌트의 StyleSet을 새로운 시스템으로 마이그레이션하는 전체 가이드.

## 작업 범위

### 코어 마이그레이션

1. **컴포넌트 구조 분석**: Vue 템플릿에서 요소 구조, 자식 컴포넌트, 스타일 적용 지점 파악
2. **types.ts**: 구조 분석 결과 기반으로 새로운 StyleSet 인터페이스 정의
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

## 1단계: 컴포넌트 구조 분석 (가장 중요)

**Vue 템플릿을 먼저 분석해서 StyleSet 구조를 설계**

### 분석 순서

1. **Vue 템플릿 구조 파악**: 어떤 요소들이 있는가?
2. **스타일 적용 지점 파악**: 각 요소에 어떤 스타일이 필요한가?
3. **자식 컴포넌트 파악**: 내부에서 사용하는 Vlossom 컴포넌트가 있는가?
4. **CSS 변수 필요 여부**: inline style로 적용 불가능한 경우만 variables 사용

### 컴포넌트 구조 분석 체크리스트

```
컴포넌트
├── 루트 요소 → component?: CSSProperties
├── 내부 요소들 → 각각 elementName?: CSSProperties
├── 자식 컴포넌트들 → childName?: ChildStyleSet
└── slot 영역들 → 필요시 CSSProperties
```

### 분석 예시: VsAccordion

```vue
<template>
  <vs-responsive class="vs-accordion" :style="styleSetVariables">
    <div class="vs-accordion-title" :style="componentStyleSet.title">
      <slot name="title" />
    </div>
    <vs-expandable :style-set="componentStyleSet.expand">
      <slot />
    </vs-expandable>
  </vs-responsive>
</template>
```

**구조 분석 결과:**

| 요소 | 타입 | StyleSet 키 |
|------|------|-------------|
| 루트 (.vs-accordion) | 루트 요소 | `variables` (CSS 변수 필요시) |
| .vs-accordion-title | 내부 요소 | `title?: CSSProperties` |
| vs-expandable | 자식 컴포넌트 | `expand?: VsExpandableStyleSet` |

**결과 StyleSet:**

```typescript
export interface VsAccordionStyleSet {
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

### 복잡도별 구조 패턴

| 복잡도 | 패턴 | 예시 컴포넌트 |
|--------|------|---------------|
| **단순** | `component` 만 | VsExpandable |
| **기본** | `variables` + `component` | VsAvatar, VsLoading |
| **중간** | `variables` + `component` + 내부요소들 | VsChip, VsInnerScroll |
| **복합** | 위 + 자식 컴포넌트 StyleSet | VsButton, VsAccordion, VsGroupedList |
| **고복잡** | 다중 자식 + 상태별 변수 | VsSelect |

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

// AFTER (신규) - 컴포넌트 구조 기반으로 설계
import type { CSSProperties } from 'vue';
import type { VsChildStyleSet } from '@/components/vs-child/types';

export interface VsNewStyleSet {
  variables?: {
    // CSS 변수가 필요한 경우만 (하위 요소, 상태별, 의사 요소 등)
  };
  component?: CSSProperties;       // 루트 요소 스타일링
  elementName?: CSSProperties;     // 내부 특정 요소 스타일링
  childName?: VsChildStyleSet;     // 자식 컴포넌트 StyleSet 전달
}
```

### StyleSet 키 결정 기준

StyleSet에 어떤 키를 포함할지 결정하는 기준.

#### 키 유형별 용도

| 키 유형 | 용도 | 예시 |
|---------|------|------|
| `variables` | CSS 변수가 필요한 경우 (하위 요소, 상태별 스타일, ::before/::after 등) | `variables?: { height?: string }` |
| `component` | 루트 요소에 자유로운 스타일링 제공 | `component?: CSSProperties` |
| `elementName` | 내부 특정 요소에 스타일 적용 | `title?: CSSProperties`, `icon?: CSSProperties` |
| `childName` | 자식 Vlossom 컴포넌트에 StyleSet 전달 | `loading?: VsLoadingStyleSet` |

#### 실제 컴포넌트 StyleSet 구조 (참고용)

| 컴포넌트 | StyleSet 구조 |
|----------|---------------|
| VsExpandable | `{ component }` |
| VsAvatar | `{ variables, component }` |
| VsLoading | `{ variables, component }` |
| VsChip | `{ variables, component, icon, closeButton }` |
| VsButton | `{ variables, component, loading }` |
| VsInnerScroll | `{ header, content, footer }` (variables 없음) |
| VsAccordion | `{ variables, title, expand }` |
| VsGroupedList | `{ variables, layout, group, item }` |
| VsSelect | `{ variables, component, chip, selectAllCheckbox, options, option }` |

#### component 포함 여부 결정

**핵심 원칙**: "루트 요소에 사용자가 자유롭게 스타일을 적용할 수 있게 할 것인가?"

- **포함**: 루트 요소에 inline style 적용이 필요한 경우
- **미포함**: 레이아웃 컴포넌트처럼 영역별 스타일만 제공하는 경우

```typescript
// component 포함 - 루트 요소 스타일링 지원
export interface VsChipStyleSet {
  variables?: { height?: string };
  component?: CSSProperties;  // 루트에 자유로운 스타일 적용
  icon?: CSSProperties;
  closeButton?: CSSProperties;
}

// component 미포함 - 영역별 스타일만 제공
export interface VsInnerScrollStyleSet {
  header?: CSSProperties;
  content?: CSSProperties;
  footer?: CSSProperties;
}
```

#### 자식 컴포넌트 StyleSet 전달 패턴

내부에서 다른 Vlossom 컴포넌트를 사용하면, 해당 컴포넌트의 StyleSet 타입을 키로 추가:

```typescript
// VsButton - VsLoading을 내부에서 사용
export interface VsButtonStyleSet {
  variables?: { padding?: string };
  component?: CSSProperties;
  loading?: VsLoadingStyleSet;  // 자식 컴포넌트 StyleSet
}

// VsGroupedList - VsInnerScroll을 내부에서 사용
export interface VsGroupedListStyleSet {
  variables?: { gap?: string; height?: string };
  layout?: VsInnerScrollStyleSet;  // 자식 컴포넌트 StyleSet
  group?: CSSProperties;
  item?: CSSProperties;
}
```

#### 결정 흐름

```
1. 컴포넌트 구조 분석
          ↓
2. 스타일 적용 지점 파악
          ↓
   ┌──────┼──────┬──────────┐
   ↓      ↓      ↓          ↓
 루트   내부    자식       CSS 변수
 요소   요소   컴포넌트     필요
   ↓      ↓      ↓          ↓
component  키   StyleSet   variables
         추가   타입 추가
```

---

### StyleSet 타입 패턴

#### Pattern A: component만 사용 (가장 단순)

CSS 변수가 불필요하고 루트 요소만 스타일링하는 경우.

```typescript
// VsExpandable - 단일 요소
export interface VsExpandableStyleSet {
  component?: CSSProperties;
}
```

#### Pattern B: variables + component (기본)

CSS 변수가 필요하면서 루트 요소 스타일링도 제공하는 경우.

```typescript
// VsAvatar, VsLoading
export interface VsAvatarStyleSet {
  variables?: {
    objectFit?: string;
  };
  component?: CSSProperties;
}
```

#### Pattern C: 내부 요소별 스타일 (레이아웃)

루트가 아닌 내부 영역별로 스타일을 제공하는 경우. `component` 대신 영역별 키 사용.

```typescript
// VsInnerScroll - 레이아웃 컴포넌트
export interface VsInnerScrollStyleSet {
  header?: CSSProperties;
  content?: CSSProperties;
  footer?: CSSProperties;
}
```

#### Pattern D: component + 내부 요소 (복합)

루트 스타일링과 내부 요소 스타일링 모두 제공하는 경우.

```typescript
// VsChip
export interface VsChipStyleSet {
  variables?: {
    height?: string;
  };
  component?: CSSProperties;
  icon?: CSSProperties;
  closeButton?: CSSProperties;
}
```

#### Pattern E: 자식 컴포넌트 StyleSet 전달 (중첩)

내부에서 다른 Vlossom 컴포넌트를 사용하는 경우.

```typescript
// VsButton - VsLoading 포함
export interface VsButtonStyleSet {
  variables?: {
    padding?: string;
  };
  component?: CSSProperties;
  loading?: VsLoadingStyleSet;
}

// VsAccordion - VsExpandable 포함
export interface VsAccordionStyleSet {
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

// VsGroupedList - VsInnerScroll 포함
export interface VsGroupedListStyleSet {
  variables?: {
    gap?: string;
    height?: string;
  };
  layout?: VsInnerScrollStyleSet;
  group?: CSSProperties;
  item?: CSSProperties;
}
```

#### Pattern F: 다중 자식 컴포넌트 (고복잡)

여러 자식 컴포넌트와 상태별 변수가 필요한 경우.

```typescript
// VsSelect
export interface VsSelectStyleSet {
  variables?: {
    height?: string;
    selected?: {
      backgroundColor?: string;
      fontWeight?: number;
    };
    focused?: {
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

#### Pattern G: 상위 컴포넌트 StyleSet 상속

```typescript
import type { VsBarStyleSet } from '@/components/vs-bar/types';

export interface VsHeaderStyleSet extends VsBarStyleSet {}
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

**variables가 필요한 경우 (CSS 변수 사용):**

| 조건 | 이유 | 예시 |
|------|------|------|
| 하위 요소에서 사용 | inline style 직접 적용 불가 | `.vs-image-tag`의 border |
| 여러 곳에서 동일 값 참조 | 한 번 설정으로 여러 곳 적용 | width가 루트 + 하위에서 사용 |
| 상태별 스타일 | CSS 클래스에 따라 다른 값 | `.vs-active`, `.vs-vertical` |
| 의사 클래스 | hover, focus 등 | `:focus-within` |
| 의사 요소 | JS로 직접 접근 불가 | `::before`, `::after` |
| media/container query | 반응형 스타일 | `@container (max-width: ...)` |
| CSS 계산식 | calc() 등에서 참조 | `calc(100% - var(...))` |

**variables가 불필요한 경우 (component/다른 키 사용):**

| 조건 | 대안 | 예시 |
|------|------|------|
| 루트 요소에서만 사용 | `component` | backgroundColor, opacity |
| 특정 내부 요소 전용 | `elementName?: CSSProperties` | title, icon |
| 자식 컴포넌트 | `childName?: ChildStyleSet` | loading, expand |

**핵심 질문**: "이 스타일을 inline style로 직접 적용할 수 있는가?"
- **Yes** → `component` 또는 특정 요소 키
- **No** → `variables`

### 중첩 variables 패턴

상태별 또는 영역별로 그룹화가 필요한 경우:

```typescript
// 상태별 그룹화
variables?: {
  height?: string;
  selected?: {
    backgroundColor?: string;
    fontWeight?: number;
  };
  focused?: {
    border?: string;
  };
}

// 영역별 그룹화 (동일 접두사 속성 3개 이상)
variables?: {
  label?: {
    backgroundColor?: string;
    fontColor?: string;
    fontSize?: string;
  };
  value?: {
    backgroundColor?: string;
    fontColor?: string;
  };
}
```

**CSS 변수 변환:**
- `selected: { backgroundColor: '#fff' }` → `--vs-component-selected-backgroundColor: #fff`

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

types.ts의 `variables`에 정의된 것만 CSS 변수로 유지:

| 유지 | 제거 |
|------|------|
| 하위 요소에서 참조 | 루트 요소에서만 사용 |
| 상태별 스타일 (hover, focus, .vs-active 등) | component로 대체 가능 |
| ::before, ::after 의사 요소 | |
| media/container query에서 참조 | |
| calc() 등 CSS 계산식에서 참조 | |

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

#### 컴포넌트 구조 분석

- [ ] Vue 템플릿에서 요소 구조 파악
- [ ] 스타일 적용 지점 파악 (루트, 내부 요소, 자식 컴포넌트)
- [ ] CSS 변수가 필요한 경우 파악 (하위 요소, 상태별, 의사 요소 등)

#### types.ts

- [ ] 기존 `extends SizeStyleSet` 등 제거
- [ ] `variables?` 정의 (CSS 변수가 필요한 경우만)
- [ ] `component?: CSSProperties` 추가 (루트 요소 스타일링 필요시)
- [ ] 내부 요소 키 추가 (예: `title?: CSSProperties`)
- [ ] 자식 컴포넌트 StyleSet 타입 추가 (예: `loading?: VsLoadingStyleSet`)
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

1. **컴포넌트 구조 분석 먼저** - Vue 템플릿에서 요소 구조, 자식 컴포넌트, 스타일 적용 지점 파악
2. **StyleSet 키 결정**:
   - `variables`: CSS 변수가 필요한 경우 (하위 요소, 상태별, 의사 요소 등)
   - `component`: 루트 요소에 자유로운 스타일링 제공
   - `elementName`: 내부 특정 요소에 스타일 적용
   - `childName`: 자식 Vlossom 컴포넌트에 StyleSet 전달
3. **variables 판단**: "inline style로 직접 적용 가능?" → Yes면 불필요, No면 필요
4. **기존 파일만 수정** - 새로운 스토리/테스트 추가 불필요
5. **"복합 styleSet 조합" 테스트는 additionalStyleSet 사용 시에만 추가**
6. **의존성**: 해당 컴포넌트를 사용하는 다른 파일들도 수정
7. **테스트 실행 필수** - `npm test [component-name]`으로 검증, 모든 테스트 통과 확인
8. **실제 코드 파일에 주석 달지 않음** - types.ts, Vue, CSS 등
