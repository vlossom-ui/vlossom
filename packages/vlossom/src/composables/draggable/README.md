> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useDraggable

**Available Version**: 2.4.0+

Moves an element by pointer drag, optionally keeping it inside a boundary element.

## Feature

- Works with mouse, touch, and pen through Pointer Events
- Moves the target with the CSS `translate` property, so the target's own `transform` (centering, animations) is left untouched
- Keeps the target inside an optional boundary element
- Captures the pointer on the handle, so dragging continues even when the pointer leaves the handle

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
                Drag me
            </div>
            <p>Card content</p>
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

| Arg           | Type                       | Default | Required | Description                                                                         |
| ------------- | -------------------------- | ------- | -------- | ----------------------------------------------------------------------------------- |
| `targetRef`   | `Ref<HTMLElement \| null>` | —       | Yes      | Element to move. Bind `dragStyle` to this element.                                  |
| `boundaryRef` | `Ref<HTMLElement \| null>` | —       | No       | Element that limits the movement. When omitted, the target can move without limits. |

## Types

No additional exported types.

## Return Refs

| RefType      | Type                         | Description                                                                           |
| ------------ | ---------------------------- | ------------------------------------------------------------------------------------- |
| `dragStyle`  | `ComputedRef<CSSProperties>` | `{ translate: 'Xpx Ypx' }` for the current offset, or an empty object when not moved. |
| `isDragging` | `Ref<boolean>`               | `true` while a drag is in progress.                                                   |

## Return Methods

| Method        | Parameters            | Description                                                                            |
| ------------- | --------------------- | -------------------------------------------------------------------------------------- |
| `onDragStart` | `event: PointerEvent` | Starts a drag. Bind to `pointerdown` on the handle. Ignores non-primary mouse buttons. |
| `onDragMove`  | `event: PointerEvent` | Updates the offset while dragging. Bind to `pointermove` on the same handle.           |
| `onDragEnd`   | —                     | Ends the drag. Bind to `pointerup` and `pointercancel` on the same handle.             |

## Cautions

- Bind all handlers to the same handle element. `onDragStart` captures the pointer on `event.currentTarget`, so move and end events keep arriving at that handle.
- The boundary is measured when a drag starts. If the boundary or target resizes during a drag, the limits are not updated until the next drag.
- If `boundaryRef` is passed but its value is `null`, dragging does not start.
- The offset is kept for the lifetime of the composable. Remount the component that calls it to reset the position.
- Add `touch-action: none` to the handle so touch dragging is not interrupted by page scrolling.
