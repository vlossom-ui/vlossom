> For English documentation, see [README.md](./README.md).

# useDraggable

**Available Version**: 2.4.0+

포인터 드래그로 요소를 이동시키며, 선택적으로 경계 요소 안에 머물도록 제한합니다.

## Feature

- Pointer Events를 사용해 마우스, 터치, 펜 입력을 모두 지원합니다
- CSS `translate` 속성으로 대상을 이동시키므로, 대상이 이미 사용 중인 `transform`(가운데 정렬, 애니메이션 등)에 영향을 주지 않습니다
- 선택적인 경계 요소 안에서만 대상이 움직이도록 제한합니다
- 핸들에 포인터를 캡처하므로, 포인터가 핸들 밖으로 벗어나도 드래그가 이어집니다

## Basic Usage

```html
<template>
    <div ref="boundaryRef" class="area">
        <div ref="targetRef" class="card" :style="dragStyle">
            <div
                :class="['handle', { dragging: isDragging }]"
                @pointerdown="onDragStart"
                @pointermove="onDragMove"
                @pointerup="onDragEnd"
                @pointercancel="onDragEnd"
            >
                드래그하세요
            </div>
            <p>카드 내용</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDraggable } from '@/composables';

const boundaryRef = ref(null);
const targetRef = ref(null);

const { dragStyle, isDragging, onDragStart, onDragMove, onDragEnd } = useDraggable(targetRef, boundaryRef);
</script>
```

## Args

| 인자          | 타입                       | 기본값 | 필수 | 설명                                                      |
| ------------- | -------------------------- | ------ | ---- | --------------------------------------------------------- |
| `targetRef`   | `Ref<HTMLElement \| null>` | —      | Yes  | 이동시킬 요소. 이 요소에 `dragStyle`을 바인딩합니다.      |
| `boundaryRef` | `Ref<HTMLElement \| null>` | —      | No   | 이동 범위를 제한하는 요소. 생략하면 제한 없이 이동합니다. |

## Types

추가로 내보내는 타입이 없습니다.

## Return Refs

| RefType      | 타입                         | 설명                                                                            |
| ------------ | ---------------------------- | ------------------------------------------------------------------------------- |
| `dragStyle`  | `ComputedRef<CSSProperties>` | 현재 이동량에 대한 `{ translate: 'Xpx Ypx' }`. 이동하지 않았으면 빈 객체입니다. |
| `isDragging` | `Ref<boolean>`               | 드래그 중이면 `true`입니다.                                                     |

## Return Methods

| 메서드        | 파라미터              | 설명                                                                                          |
| ------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| `onDragStart` | `event: PointerEvent` | 드래그를 시작합니다. 핸들의 `pointerdown`에 바인딩합니다. 마우스 주 버튼이 아니면 무시합니다. |
| `onDragMove`  | `event: PointerEvent` | 드래그 중 이동량을 갱신합니다. 같은 핸들의 `pointermove`에 바인딩합니다.                      |
| `onDragEnd`   | —                     | 드래그를 종료합니다. 같은 핸들의 `pointerup`과 `pointercancel`에 바인딩합니다.                |

## Cautions

- 모든 핸들러는 같은 핸들 요소에 바인딩하세요. `onDragStart`가 `event.currentTarget`에 포인터를 캡처하므로 이후 move/end 이벤트가 그 핸들로 전달됩니다.
- 경계는 드래그를 시작할 때 측정됩니다. 드래그 도중 경계나 대상의 크기가 바뀌면 다음 드래그부터 반영됩니다.
- `boundaryRef`를 전달했지만 값이 `null`이면 드래그가 시작되지 않습니다.
- 이동량은 composable이 살아 있는 동안 유지됩니다. 위치를 초기화하려면 이를 호출한 컴포넌트를 다시 마운트하세요.
- 터치 드래그가 페이지 스크롤에 방해받지 않도록 핸들에 `touch-action: none`을 지정하세요.
