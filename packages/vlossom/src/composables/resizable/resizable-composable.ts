import { computed, ref, type Ref } from 'vue';
import { stringUtil } from '@/utils';

export type ResizeEdge = 'top' | 'right' | 'bottom' | 'left';

export interface ResizableOptions {
    edge: Readonly<Ref<ResizeEdge>>;
    minSize?: Readonly<Ref<string | number | undefined>>;
    maxSize?: Readonly<Ref<string | number | undefined>>;
    boundaryRef?: Readonly<Ref<HTMLElement | null>>;
    onResize?: (size: number) => void;
}

export function useResizable(targetRef: Readonly<Ref<HTMLElement | null>>, options: ResizableOptions) {
    const { edge, minSize, maxSize, boundaryRef, onResize } = options;

    const resizedSize: Ref<number | null> = ref(null);
    const isResizing = ref(false);
    const sizeProperty = computed(() => (edge.value === 'left' || edge.value === 'right' ? 'width' : 'height'));
    let resizeStart = { pointer: 0, size: 0, min: 0, max: Infinity };

    function getPointer(event: PointerEvent) {
        return sizeProperty.value === 'width' ? event.clientX : event.clientY;
    }

    function measureSize(element: HTMLElement, value: string | number) {
        const property = sizeProperty.value;
        const previous = element.style[property];
        element.style[property] = stringUtil.toStringSize(value);
        const measured = element.getBoundingClientRect()[property];
        element.style[property] = previous;
        return measured;
    }

    function onResizeStart(event: PointerEvent) {
        const target = targetRef.value;
        if (event.button !== 0 || !target) {
            return;
        }

        event.preventDefault();
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

        const property = sizeProperty.value;
        resizeStart = {
            pointer: getPointer(event),
            size: target.getBoundingClientRect()[property],
            min: minSize?.value ? measureSize(target, minSize.value) : 0,
            max: maxSize?.value
                ? measureSize(target, maxSize.value)
                : (boundaryRef?.value?.getBoundingClientRect()[property] ?? Infinity),
        };
        isResizing.value = true;
    }

    function onResizeMove(event: PointerEvent) {
        if (!isResizing.value) {
            return;
        }

        const direction = edge.value === 'right' || edge.value === 'bottom' ? 1 : -1;
        const nextSize = resizeStart.size + (getPointer(event) - resizeStart.pointer) * direction;
        const clampedSize = Math.round(Math.min(Math.max(nextSize, resizeStart.min), resizeStart.max));

        if (clampedSize === resizedSize.value) {
            return;
        }
        resizedSize.value = clampedSize;
        onResize?.(clampedSize);
    }

    function onResizeEnd() {
        isResizing.value = false;
    }

    function resetSize() {
        resizedSize.value = null;
    }

    return { resizedSize, isResizing, onResizeStart, onResizeMove, onResizeEnd, resetSize };
}
