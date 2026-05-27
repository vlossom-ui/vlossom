> For English documentation, see [README.md](./README.md).

# useSizeClass

**Available Version**: 2.0.0+

반응형 `Size` 값을 컴포넌트 크기 스타일링을 위한 해당 CSS 클래스 문자열로 변환합니다.

## Feature

- 반응형 `Size` ref로부터 `vs-{size}` 클래스 이름(예: `vs-md`, `vs-lg`)을 생성합니다
- size ref가 `undefined`일 때 빈 문자열을 반환하므로 class 바인딩에 안전하게 넣을 수 있습니다
- `VsButton`, `VsChip`, `VsAccordion` 등 여러 컴포넌트에서 공유되는 size-class 패턴을 한곳으로 모읍니다

## Basic Usage

```html
<template>
    <div :class="['vs-button', classObj]">
        <slot />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useSizeClass } from '@/composables';

const size = ref('md');
const { sizeClass } = useSizeClass(size);

const classObj = computed(() => ({
    [sizeClass.value]: !!sizeClass.value,
}));
</script>
```

## Args

| 인자   | 타입                     | 기본값 | 필수 | 설명                                       |
| ------ | ------------------------ | ------ | ---- | ------------------------------------------ |
| `size` | `Ref<Size \| undefined>` | —      | Yes  | 컴포넌트의 현재 크기를 담고 있는 반응형 ref. |

## Types

```typescript
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

## Return Refs

| RefType     | 타입                  | 설명                                                          |
| ----------- | --------------------- | ------------------------------------------------------------- |
| `sizeClass` | `ComputedRef<string>` | size가 주어지면 `vs-{size}`, 아니면 빈 문자열을 반환합니다.   |

## Return Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions
