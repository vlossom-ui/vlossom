> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useResizable

**Available Version**: 2.4.0+

Resizes an element by dragging one of its edges with a pointer, clamped between a minimum and maximum size.

## Feature

- Pointer-based drag handlers that work with mouse, touch, and pen through pointer capture
- Resizes width for `left` / `right` edges and height for `top` / `bottom` edges
- Accepts any CSS length (`120`, `'300px'`, `'40%'`, `'20rem'`) for `minSize` / `maxSize` and measures it against the target element when dragging starts
- Falls back to the size of `boundaryRef` as the upper limit when `maxSize` is not set
- Keeps the dragged size in `resizedSize` until `resetSize` is called, so the caller decides how to apply it

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

| Arg         | Type                                 | Default | Required | Description                                |
| ----------- | ------------------------------------ | ------- | -------- | ------------------------------------------ |
| `targetRef` | `Readonly<Ref<HTMLElement \| null>>` | —       | Yes      | Element whose size is measured and resized |
| `options`   | `ResizableOptions`                   | —       | Yes      | Resize options                             |

## Types

```typescript
type ResizeEdge = 'top' | 'right' | 'bottom' | 'left';

interface ResizableOptions {
    // Edge of the target element that is dragged
    edge: Readonly<Ref<ResizeEdge>>;
    // Minimum size. Defaults to 0
    minSize?: Readonly<Ref<string | number | undefined>>;
    // Maximum size. Defaults to the size of boundaryRef
    maxSize?: Readonly<Ref<string | number | undefined>>;
    // Element whose size is the upper limit when maxSize is not set
    boundaryRef?: Readonly<Ref<HTMLElement | null>>;
    // Called with the new size in pixels whenever it changes while dragging
    onResize?: (size: number) => void;
}
```

## Return Refs

| RefType       | Type                  | Description                                                   |
| ------------- | --------------------- | ------------------------------------------------------------- |
| `resizedSize` | `Ref<number \| null>` | Size in pixels set by dragging. `null` until the first resize |
| `isResizing`  | `Ref<boolean>`        | Whether a drag is in progress                                 |

## Return Methods

| Method          | Parameters            | Description                                                                     |
| --------------- | --------------------- | ------------------------------------------------------------------------------- |
| `onResizeStart` | `event: PointerEvent` | Bind to `pointerdown` on the handle. Starts a drag on the primary button only   |
| `onResizeMove`  | `event: PointerEvent` | Bind to `pointermove` on the handle. Updates `resizedSize` and calls `onResize` |
| `onResizeEnd`   | —                     | Bind to `lostpointercapture` on the handle. Ends the drag                       |
| `resetSize`     | —                     | Resets `resizedSize` to `null`                                                  |

## Cautions

- `onResizeStart` calls `setPointerCapture` on the element the handler is bound to, so bind all three handlers to the same handle element.
- `minSize`, `maxSize`, and the boundary are measured once when a drag starts. Layout changes during a drag do not change the limits.
- Percentages in `minSize` / `maxSize` resolve against the target element's containing block, because they are measured by applying them to the target element.
- The initial size is not clamped by `minSize` / `maxSize`. It is clamped on the first `pointermove` of a drag.
