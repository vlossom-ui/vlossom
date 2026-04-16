> For English documentation, see [README.md](./README.md).

# useIndexSelector

**Available Version**: 2.0.0+

선택적 항목별 또는 전역 비활성화 지원, 키보드 탐색, 경계 감지 기능이 있는 항목 목록에 대한 인덱스 기반 선택을 관리합니다.

## Feature

- 반응형 목록에서 단일 `selectedIndex`를 추적합니다
- `disabled` 인자로 boolean 또는 항목별 함수를 지원합니다
- `findActiveIndexForwardFrom` / `findActiveIndexBackwardFrom`으로 앞/뒤로 이동할 때 비활성화된 항목을 건너뜁니다
- 수평 및 수직 방향 모두를 위한 키보드 탐색(화살표 키, Home, End)을 처리합니다
- 경계 감지를 위한 `isFirstEdge`와 `isLastEdge` 계산 ref를 노출합니다

## Basic Usage

```html
<template>
    <div @keydown="(e) => handleKeydown(e, true)">
        <div
            v-for="(step, i) in steps"
            :key="i"
            :class="{ selected: isSelected(i), disabled: isDisabled(i) }"
            @click="selectIndex(i)"
        >
            {{ step }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useIndexSelector } from '@/composables';

const steps = ref(['1단계', '2단계', '3단계']);
const disabled = ref(false);

const { selectedIndex, isSelected, isDisabled, selectIndex, handleKeydown } = useIndexSelector(steps, disabled);
</script>
```

## Args

| 인자       | 타입                                                                     | 기본값      | 필수 | 설명                                                                      |
| ---------- | ------------------------------------------------------------------------ | ----------- | ---- | ------------------------------------------------------------------------- |
| `list`     | `Ref<any[]>`                                                             | —           | Yes  | 선택할 항목의 반응형 배열.                                                 |
| `disabled` | `Ref<boolean \| ((item: any, index: number) => boolean) \| undefined>`   | `undefined` | No   | 전역 boolean 또는 항목별 함수. 함수일 경우 `(item, index)`를 받습니다.    |

## Types

추가로 내보내는 타입이 없습니다. 선택되지 않은 상태에 `NOT_SELECTED` 상수(`-1`)를 사용합니다.

## Return Refs

| RefType         | 타입                   | 설명                                                                   |
| --------------- | ---------------------- | ---------------------------------------------------------------------- |
| `selectedIndex` | `Ref<number>`          | 현재 선택된 인덱스. 아무것도 선택되지 않으면 `NOT_SELECTED`(`-1`).     |
| `isFirstEdge`   | `ComputedRef<boolean>` | 선택된 인덱스가 첫 번째 활성(비비활성화) 항목일 때 `true`.             |
| `isLastEdge`    | `ComputedRef<boolean>` | 선택된 인덱스가 마지막 활성(비비활성화) 항목일 때 `true`.              |

## Return Methods

| 메서드                        | 파라미터                                  | 설명                                                                                   |
| ----------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `isSelected`                  | `index: number`                           | `selectedIndex`가 `index`와 같으면 `true`를 반환합니다.                                |
| `isDisabled`                  | `index: number`                           | `index`의 항목이 비활성화되어 있으면 `true`를 반환합니다.                              |
| `isPrevious`                  | `index: number`                           | `index`가 `selectedIndex`보다 앞에 있으면 `true`를 반환합니다.                         |
| `findActiveIndexForwardFrom`  | `targetIndex: number`                     | `targetIndex`부터 앞쪽으로 첫 번째 비비활성화 인덱스를 찾습니다.                       |
| `findActiveIndexBackwardFrom` | `targetIndex: number`                     | `targetIndex`부터 뒤쪽으로 첫 번째 비비활성화 인덱스를 찾습니다.                       |
| `selectIndex`                 | `index: number`                           | `index`가 유효하고 비활성화되지 않은 경우 `selectedIndex`를 설정합니다; 아니면 `NOT_SELECTED`. |
| `handleKeydown`               | `e: KeyboardEvent, isVertical: boolean`   | 화살표, Home, End 키를 처리합니다. `isVertical`에 따라 수직/수평 키 매핑을 사용합니다. |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- `selectedIndex`는 `NOT_SELECTED`가 아닌 `0`(첫 번째 항목)에서 시작합니다. 마운트 시 첫 번째 항목이 선택 가능한지 확인하거나, 필요한 경우 수동으로 초기화하세요.
- 모든 항목이 비활성화된 경우 `selectIndex`는 항상 `NOT_SELECTED`를 설정합니다.
