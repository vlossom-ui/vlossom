> For English documentation, see [README.md](./README.md).

# useColorScheme

**Available Version**: 2.0.0+

컴포넌트 레벨 prop, 컴포넌트별 전역 설정, 전역 기본값을 해당 우선순위 순서대로 병합하여 컴포넌트의 활성 색상 스킴을 결정합니다.

## Feature

- 컴포넌트 `colorScheme` prop과 `useOptionsStore`의 전역 옵션을 병합합니다
- 컴포넌트별 전역 설정이 전역 기본값보다 우선합니다
- 반응형 `computedColorScheme` ref와 바로 사용할 수 있는 `colorSchemeClass` 문자열을 반환합니다
- 색상 스킴이 설정되지 않은 경우 `'default'`로 폴백합니다

## Basic Usage

```html
<template>
    <div :class="['vs-button', colorSchemeClass]">
        <slot />
    </div>
</template>

<script setup>
import { toRefs } from 'vue';
import { useColorScheme } from '@/composables';

const props = defineProps({
    colorScheme: String,
});

const { colorScheme } = toRefs(props);
const { computedColorScheme, colorSchemeClass } = useColorScheme('VsButton', colorScheme);
</script>
```

## Args

| 인자          | 타입                            | 기본값 | 필수 | 설명                                                            |
| ------------- | ------------------------------- | ------ | ---- | --------------------------------------------------------------- |
| `component`   | `VsComponent \| string`         | —      | Yes  | 컴포넌트별 전역 색상 스킴을 조회하는 데 사용되는 컴포넌트 이름. |
| `colorScheme` | `Ref<ColorScheme \| undefined>` | —      | Yes  | prop으로 전달된 색상 스킴을 담고 있는 반응형 ref.               |

## Types

```typescript
type ColorScheme = string; // 색상 스킴 식별자, 예: 'blue', 'red'
```

## Return Refs

| RefType               | 타입                                     | 설명                                                                      |
| --------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| `computedColorScheme` | `ComputedRef<ColorScheme \| undefined>`  | 결정된 색상 스킴: prop → 컴포넌트 전역 → 기본 전역 순으로 우선 적용.     |
| `colorSchemeClass`    | `ComputedRef<string>`                    | `vs-cs-{scheme}` 형식의 CSS 클래스 문자열 (예: `vs-cs-blue`).            |

## Return Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions
