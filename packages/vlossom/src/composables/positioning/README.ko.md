> For English documentation, see [README.md](./README.md).

# usePositioning

**Available Version**: 2.0.0+

CSS 선택자로 식별된 대상 요소를 기준으로 첨부 요소의 절대 픽셀 위치를 계산하고 유지하며, 뷰포트 오버플로 자동 수정, 스크롤/리사이즈 추적, ResizeObserver 지원을 제공합니다.

## Feature

- `top`, `right`, `bottom`, `left`, `middle` 배치와 `start`, `center`, `end` 정렬을 사용하여 `target` 요소를 기준으로 `attachment` 요소를 위치시킵니다
- 뷰포트에 공간이 부족할 때 자동으로 배치를 전환합니다
- 스크롤 및 리사이즈 이벤트에서 위치 재계산을 스로틀링합니다(30ms 간격)
- 두 요소 중 하나의 크기가 변경될 때 재위치를 위해 `ResizeObserver`(가용한 경우)를 사용합니다
- 페이지 스크롤 오프셋(`window.scrollX` / `window.scrollY`)을 고려합니다
- `followWidth`를 통해 선택적으로 첨부 너비를 대상 너비에 맞춥니다

## Basic Usage

```html
<template>
    <button id="trigger" @click="toggleDropdown">열기</button>
    <div v-if="isVisible" ref="dropdownRef" class="dropdown">
        드롭다운 내용
    </div>
</template>

<script setup>
import { useTemplateRef } from 'vue';
import { usePositioning } from '@/composables';

const dropdownRef = useTemplateRef('dropdownRef');
const { isVisible, appear, disappear } = usePositioning('#trigger', dropdownRef);

function toggleDropdown() {
    isVisible.value ? disappear() : appear({ placement: 'bottom', align: 'start' });
}
</script>
```

## Args

| 인자         | 타입                       | 기본값 | 필수 | 설명                                                                 |
| ------------ | -------------------------- | ------ | ---- | -------------------------------------------------------------------- |
| `target`     | `string`                   | —      | Yes  | 위치를 기준으로 할 대상 요소를 식별하는 CSS 선택자 문자열.           |
| `attachment` | `TemplateRef<HTMLElement>` | —      | Yes  | 위치시킬 요소의 템플릿 ref.                                          |

## Types

```typescript
interface AttachInfo {
    placement?: Placement;  // 'top' | 'right' | 'bottom' | 'left' | 'middle'
    align?: Alignment;      // 'start' | 'center' | 'end'
    margin?: number;        // 대상과 첨부 사이의 픽셀 간격
    followWidth?: boolean;  // true이면 첨부 너비가 대상 너비와 일치
}

type Placement = 'top' | 'right' | 'bottom' | 'left' | 'middle';
type Alignment = 'start' | 'center' | 'end';
```

## Return Refs

| RefType             | 타입                     | 설명                                                         |
| ------------------- | ------------------------ | ------------------------------------------------------------ |
| `isVisible`         | `Ref<boolean>`           | 현재 첨부가 표시되고 있는지 여부.                             |
| `computedPlacement` | `Ref<Placement \| null>` | 뷰포트 오버플로 수정 후 실제로 사용된 배치.                   |

## Return Methods

| 메서드      | 파라미터                | 설명                                                                                        |
| ----------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| `appear`    | `attachInfo?: AttachInfo` | 첨부를 표시하고 위치를 유지하기 위해 스크롤/리사이즈 추적을 시작합니다.                  |
| `disappear` | —                       | 첨부를 숨기고 모든 스크롤/리사이즈/ResizeObserver 리스너를 중지합니다.                     |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- `computePosition`이 `nextTick`으로 측정하려면 `attachment` 요소가 DOM에 렌더링되어 있어야 합니다(즉, `isVisible`이 `true`여야 합니다).
- `target`이 DOM 요소와 일치하지 않으면 위치 계산은 조용히 건너뜁니다.
