> For English documentation, see [README.md](./README.md).

# useStyleSet

**Available Version**: 2.0.0+

컴포넌트의 style-set을 타입이 있는 `componentStyleSet` 객체와 평탄화된 `styleSetVariables` CSS 커스텀 속성 맵으로 해석, 병합, 변환합니다.

## Feature

- 문자열 `styleSet` prop을 `useOptionsStore`를 통해 등록된 전역 style-set으로 해석합니다
- 우선순위 순서로 세 레이어를 병합합니다: `baseStyleSet` < `styleSet` (prop) < `additionalStyleSet`
- `variables` 항목을 `:style` 바인딩에 사용할 CSS 커스텀 속성 이름(`--{component-kebab}-{key}`)으로 변환합니다
- 중첩 변수 객체 한 레벨(`variables.group.property`)을 지원합니다 — `--{component}-{group}-{property}`를 생성합니다
- 요소의 직접 CSSProperties 바인딩과 하위 컴포넌트 `:style-set` prop을 위해 `componentStyleSet`을 반환합니다

## Basic Usage

```html
<template>
    <button
        :class="['vs-button', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
    >
        <vs-loading v-if="loading" :style-set="componentStyleSet.loading" />
        <slot />
    </button>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { useStyleSet } from '@/composables';

const props = defineProps({ styleSet: [String, Object] });
const { styleSet } = toRefs(props);

const { componentStyleSet, styleSetVariables } = useStyleSet('VsButton', styleSet);
</script>
```

## Args

| 인자                 | 타입                            | 기본값     | 필수 | 설명                                                                              |
| -------------------- | ------------------------------- | ---------- | ---- | --------------------------------------------------------------------------------- |
| `component`          | `VsComponent \| string`         | —          | Yes  | CSS 변수 접두사와 전역 style-set 조회에 사용되는 컴포넌트 이름.                   |
| `styleSet`           | `Ref<string \| T \| undefined>` | —          | Yes  | `styleSet` prop 값. 문자열은 명명된 전역 style-set으로 해석됩니다.               |
| `baseStyleSet`       | `Ref<Partial<T>>`               | `ref({})` | No   | 사용자 prop 이전에 적용되는 기본 style-set (가장 낮은 우선순위).                 |
| `additionalStyleSet` | `Ref<Partial<T>>`               | `ref({})` | No   | 다른 컴포넌트 prop에서 파생된 동적 오버라이드 (가장 높은 우선순위).              |

## Types

```typescript
// 제네릭 T는 { [key: string]: any }를 확장해야 합니다
// 일반적인 StyleSet 구조:
interface ExampleStyleSet {
    variables?: {
        propertyName?: string;
        groupName?: {
            nestedProperty?: string;
        };
    };
    component?: CSSProperties;
    childComponent?: ChildStyleSet;
}
```

## Return Refs

| RefType              | 타입                                  | 설명                                                                               |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `componentStyleSet`  | `ComputedRef<Partial<T>>`             | 병합된 style-set 객체. `.component`, `.variables` 또는 하위 컴포넌트 키에 접근하세요. |
| `styleSetVariables`  | `ComputedRef<Record<string, string>>` | `componentStyleSet.value.variables`에서 파생된 CSS 커스텀 속성의 평탄화된 맵.     |

## Return Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- style-set의 `variables` 키만 CSS 커스텀 속성으로 변환됩니다. 다른 키(예: `component`, `loading`)는 `:style` / `:style-set`에 직접 spread하거나 전달해야 합니다.
- 두 레벨 이상의 깊이 중첩된 `variables` 객체는 CSS 속성으로 변환되지 않습니다.
- `objectUtil.shake`는 병합 전 `baseStyleSet`과 `additionalStyleSet`에 적용되어 `undefined` 및 빈 값을 제거합니다.
