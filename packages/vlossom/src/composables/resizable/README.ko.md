> For English documentation, see [README.md](./README.md).

# useResizable

**Available Version**: 2.4.0+

요소의 한쪽 가장자리를 포인터로 드래그해 크기를 조절하고, 최소/최대 크기 사이로 제한합니다.

## Feature

- pointer capture를 사용해 마우스, 터치, 펜 모두에서 동작하는 드래그 핸들러를 제공합니다
- `left` / `right` 가장자리는 너비를, `top` / `bottom` 가장자리는 높이를 조절합니다
- `minSize` / `maxSize`에 모든 CSS 길이(`120`, `'300px'`, `'40%'`, `'20rem'`)를 받고, 드래그를 시작할 때 대상 요소 기준으로 측정합니다
- `maxSize`가 없으면 `boundaryRef`의 크기를 상한으로 사용합니다
- 드래그한 크기는 `resetSize`를 호출할 때까지 `resizedSize`에 유지되므로, 적용 방식은 호출하는 쪽이 정합니다

## Basic Usage

```html
<template>
    <aside ref="panelRef" class="panel" :style="{ width: resizedSize === null ? '240px' : `${resizedSize}px` }">
        <div
            class="panel-handle"
            role="separator"
            aria-orientation="vertical"
            @pointerdown="onResizeStart"
            @pointermove="onResizeMove"
            @lostpointercapture="onResizeEnd"
        />
    </aside>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue';
import { useResizable } from '@/composables';

const panelRef = useTemplateRef('panelRef');

const { resizedSize, onResizeStart, onResizeMove, onResizeEnd } = useResizable(panelRef, {
    edge: ref('right'),
    minSize: ref(160),
    maxSize: ref('50%'),
});
</script>
```

## Args

| 인자        | 타입                                 | 기본값 | 필수 | 설명                        |
| ----------- | ------------------------------------ | ------ | ---- | --------------------------- |
| `targetRef` | `Readonly<Ref<HTMLElement \| null>>` | —      | Yes  | 크기를 측정하고 조절할 요소 |
| `options`   | `ResizableOptions`                   | —      | Yes  | 리사이즈 옵션               |

## Types

```typescript
type ResizeEdge = 'top' | 'right' | 'bottom' | 'left';

interface ResizableOptions {
    // 드래그할 대상 요소의 가장자리
    edge: Readonly<Ref<ResizeEdge>>;
    // 최소 크기. 기본값은 0
    minSize?: Readonly<Ref<string | number | undefined>>;
    // 최대 크기. 기본값은 boundaryRef의 크기
    maxSize?: Readonly<Ref<string | number | undefined>>;
    // maxSize가 없을 때 상한으로 쓸 요소
    boundaryRef?: Readonly<Ref<HTMLElement | null>>;
    // 드래그 중 크기가 바뀔 때마다 새 크기(px)로 호출
    onResize?: (size: number) => void;
}
```

## Return Refs

| RefType       | 타입                  | 설명                                                      |
| ------------- | --------------------- | --------------------------------------------------------- |
| `resizedSize` | `Ref<number \| null>` | 드래그로 정해진 크기(px). 처음 리사이즈하기 전에는 `null` |
| `isResizing`  | `Ref<boolean>`        | 드래그 중인지 여부                                        |

## Return Methods

| 메서드          | 파라미터              | 설명                                                                                  |
| --------------- | --------------------- | ------------------------------------------------------------------------------------- |
| `onResizeStart` | `event: PointerEvent` | 핸들의 `pointerdown`에 바인딩합니다. 주 버튼일 때만 드래그를 시작합니다               |
| `onResizeMove`  | `event: PointerEvent` | 핸들의 `pointermove`에 바인딩합니다. `resizedSize`를 갱신하고 `onResize`를 호출합니다 |
| `onResizeEnd`   | —                     | 핸들의 `lostpointercapture`에 바인딩합니다. 드래그를 끝냅니다                         |
| `resetSize`     | —                     | `resizedSize`를 `null`로 되돌립니다                                                   |

## Cautions

- `onResizeStart`는 핸들러가 바인딩된 요소에 `setPointerCapture`를 호출하므로, 세 핸들러를 모두 같은 핸들 요소에 바인딩하세요.
- `minSize`, `maxSize`, boundary는 드래그를 시작할 때 한 번만 측정합니다. 드래그 중 레이아웃이 바뀌어도 제한값은 바뀌지 않습니다.
- `minSize` / `maxSize`의 퍼센트 값은 대상 요소에 적용해 측정하므로, 대상 요소의 containing block을 기준으로 계산됩니다.
- 처음 크기는 `minSize` / `maxSize`로 제한하지 않습니다. 드래그의 첫 `pointermove`에서 제한됩니다.
