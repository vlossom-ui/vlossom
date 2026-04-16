> For English documentation, see [README.md](./README.md).

# useStateClass

**Available Version**: 2.0.0+

반응형 `UIState` 값을 컴포넌트 상태 스타일링을 위한 해당 CSS 클래스 객체로 변환합니다.

## Feature

- `isStated` 계산 ref를 통해 비유휴 상태(`info`, `success`, `error`, `warning`)를 감지합니다
- 컴포넌트 수준 상태 스타일링을 위해 `vs-stated`와 `vs-state-{state}`가 있는 `stateClasses`를 반환합니다
- 래퍼/박스 수준 상태 스타일링을 위해 추가 `vs-state-box` 클래스가 있는 `stateBoxClasses`를 반환합니다
- 상태가 `'idle'`일 때 두 클래스 객체 모두 비어 있습니다

## Basic Usage

```html
<template>
    <div :class="['vs-input', stateClasses]">
        <input v-model="value" />
    </div>
    <div :class="['vs-input-box', stateBoxClasses]">
        <!-- 상태 박스 스타일링이 있는 래퍼 -->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStateClass } from '@/composables';

const state = ref('error');
const { isStated, stateClasses, stateBoxClasses } = useStateClass(state);
</script>
```

## Args

| 인자    | 타입           | 기본값 | 필수 | 설명                                                    |
| ------- | -------------- | ------ | ---- | ------------------------------------------------------- |
| `state` | `Ref<UIState>` | —      | Yes  | 컴포넌트의 현재 UI 상태를 담고 있는 반응형 ref.          |

## Types

```typescript
type UIState = 'idle' | 'info' | 'success' | 'warning' | 'error';
```

## Return Refs

| RefType           | 타입                                   | 설명                                                                                |
| ----------------- | -------------------------------------- | ----------------------------------------------------------------------------------- |
| `isStated`        | `ComputedRef<boolean>`                 | 상태가 `info`, `success`, `error`, `warning` 중 하나일 때 `true`.                  |
| `stateClasses`    | `ComputedRef<Record<string, boolean>>` | 상태가 있을 때 `vs-stated`와 `vs-state-{state}`가 있는 클래스 객체, 아니면 비어 있음. |
| `stateBoxClasses` | `ComputedRef<Record<string, boolean>>` | `vs-state-box`가 추가된 `stateClasses`의 확장. 상태가 `'idle'`일 때 비어 있음.     |

## Return Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions
