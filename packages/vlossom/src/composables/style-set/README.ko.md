> For English documentation, see [README.md](./README.md).

# useStyleSet

**Available Version**: 2.0.0+

컴포넌트의 style-set을 해석/병합한 뒤 세 가지 파생 뷰를 제공합니다: 병합된 객체(`componentStyleSet`), CSS 커스텀 속성 맵(`styleSetVariables`), 그리고 inline `:style` 바인딩용 CSSProperties 객체(`componentInlineStyle`).

## Style-Set 컨벤션

`VsXxxStyleSet` 인터페이스는 `CSSProperties`를 상속(extends)합니다. 키는 prefix로 구분됩니다.

- **non-`$` 키** — 표준 CSS 속성으로, 컴포넌트 루트 요소에 inline style로 적용됩니다 (`componentInlineStyle` 통해).
- **`$X` (primitive)** — `--{component-kebab}-X` 형태의 CSS 변수로 emit됩니다 (`styleSetVariables` 통해).
- **`$X` (object)** — 슬롯/요소 단위 CSSProperties 혹은 하위 StyleSet으로, `componentStyleSet.$X`로 접근합니다.

```ts
import type { CSSProperties } from 'vue';

export interface VsButtonStyleSet extends CSSProperties {
    $content?: CSSProperties;        // 슬롯
    $loading?: VsLoadingStyleSet;    // 하위 컴포넌트
}
```

## Feature

- 문자열 `styleSet` prop을 `useOptionsStore`를 통해 등록된 전역 style-set으로 해석합니다
- 우선순위 순서로 세 레이어를 병합합니다: `baseStyleSet` < `styleSet` (prop) < `additionalStyleSet`
- 루트 레벨의 `$X` primitive 항목을 CSS 커스텀 속성(`--{component-kebab}-X`)으로 변환합니다
- 루트 레벨의 CSS 속성을 spread 가능한 `componentInlineStyle` 객체로 반환합니다
- `$X` 슬롯과 하위 컴포넌트 style-set 접근을 위해 `componentStyleSet`을 반환합니다

## Basic Usage

```html
<template>
    <button
        :class="['vs-button', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
    >
        <vs-loading v-if="loading" :style-set="componentStyleSet.$loading" />
        <div class="vs-button-content" :style="componentStyleSet.$content">
            <slot />
        </div>
    </button>
</template>

<script setup>
import { toRefs } from 'vue';
import { useStyleSet } from '@/composables';

const props = defineProps({ styleSet: [String, Object] });
const { styleSet } = toRefs(props);

const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet('VsButton', styleSet);
</script>
```

## Args

| 인자                 | 타입                            | 기본값    | 필수 | 설명                                                                  |
| -------------------- | ------------------------------- | --------- | ---- | --------------------------------------------------------------------- |
| `component`          | `VsComponent \| string`         | —         | Yes  | CSS 변수 접두사와 전역 style-set 조회에 사용되는 컴포넌트 이름.       |
| `styleSet`           | `Ref<string \| T \| undefined>` | —         | Yes  | `styleSet` prop 값. 문자열은 명명된 전역 style-set으로 해석됩니다.    |
| `baseStyleSet`       | `Ref<Partial<T>>`               | `ref({})` | No   | 사용자 prop 이전에 적용되는 기본 style-set (가장 낮은 우선순위).      |
| `additionalStyleSet` | `Ref<Partial<T>>`               | `ref({})` | No   | 다른 컴포넌트 prop에서 파생된 동적 오버라이드 (가장 높은 우선순위).   |

## Types

```typescript
// 제네릭 T는 { [key: string]: any }를 확장해야 합니다
// 일반적인 StyleSet 구조 (루트에서 CSSProperties 상속):
interface ExampleStyleSet extends CSSProperties {
    $primitiveVar?: string;         // --vs-example-primitiveVar로 변환
    $element?: CSSProperties;       // 슬롯/요소 스타일
    $childComponent?: ChildStyleSet; // 하위 컴포넌트 style-set
}
```

## Return Refs

| RefType                | 타입                                  | 설명                                                                                            |
| ---------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `componentStyleSet`    | `ComputedRef<Partial<T>>`             | 완전히 병합된 style-set 객체. `$X` 슬롯 키와 하위 style-set 접근에 사용합니다.                 |
| `styleSetVariables`    | `ComputedRef<Record<string, string>>` | 루트 레벨의 `$X` primitive 항목에서 파생된 CSS 커스텀 속성 맵.                                 |
| `componentInlineStyle` | `ComputedRef<CSSProperties>`          | 루트 레벨의 non-`$` 키에서 파생된 inline CSSProperties. 루트 요소의 `:style`에 spread하세요. |

## Return Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- **루트 레벨**의 `$X` primitive 키만 CSS 커스텀 속성으로 변환됩니다. `$X` object 값은 `componentStyleSet`을 통해 노출되며 직접 `:style` / `:style-set`로 바인딩해야 합니다.
- `componentInlineStyle`은 **루트 레벨**의 non-`$` 키만 모읍니다. 중첩된 CSSProperties (예: `componentStyleSet.$content`)는 해당 요소/슬롯에 직접 바인딩해야 합니다.
- `objectUtil.shake`는 병합 전 `baseStyleSet`과 `additionalStyleSet`에 적용되어 `undefined` 및 빈 값을 제거합니다.
- 이미 병합된 style-set을 자식 컴포넌트로 전달하는 경우(예: `VsSelectTrigger`가 `VsSelect`로부터 `componentStyleSet`을 받는 경우), 그 prop에 대해 `useStyleSet`을 다시 호출해 `componentInlineStyle`을 재추출하세요. 별도 헬퍼는 필요 없습니다.
