import { computed, ref, type ComputedRef, type CSSProperties, type Ref } from 'vue';
import { numberUtil } from '@/utils';

interface DragState {
    pointerX: number;
    pointerY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    startX: number;
    startY: number;
}

export function useDraggable(targetRef: Ref<HTMLElement | null>, boundaryRef?: Ref<HTMLElement | null>) {
    const offset = ref({ x: 0, y: 0 });
    const isDragging = ref(false);
    let dragState: DragState | null = null;

    // transform은 대상 요소의 정렬이나 애니메이션이 쓰고 있을 수 있으므로 독립 속성인 translate로 이동시킨다
    const dragStyle: ComputedRef<CSSProperties> = computed(() => {
        const { x, y } = offset.value;
        return x || y ? { translate: `${x}px ${y}px` } : {};
    });

    function onDragStart(event: PointerEvent) {
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }
        const target = targetRef.value;
        const boundary = boundaryRef?.value;
        if (!target || boundary === null) {
            return;
        }
        event.preventDefault();

        const { x, y } = offset.value;
        let bounds = { minX: -Infinity, maxX: Infinity, minY: -Infinity, maxY: Infinity };
        if (boundary) {
            const boundaryRect = boundary.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            bounds = {
                minX: x + boundaryRect.left - targetRect.left,
                maxX: x + boundaryRect.right - targetRect.right,
                minY: y + boundaryRect.top - targetRect.top,
                maxY: y + boundaryRect.bottom - targetRect.bottom,
            };
        }
        dragState = { pointerX: event.clientX, pointerY: event.clientY, ...bounds, startX: x, startY: y };
        isDragging.value = true;

        const handle = event.currentTarget as HTMLElement | null;
        handle?.setPointerCapture?.(event.pointerId);
    }

    function onDragMove(event: PointerEvent) {
        if (!dragState) {
            return;
        }
        const { pointerX, pointerY, minX, maxX, minY, maxY, startX, startY } = dragState;
        offset.value = {
            x: numberUtil.clamp(startX + event.clientX - pointerX, minX, maxX),
            y: numberUtil.clamp(startY + event.clientY - pointerY, minY, maxY),
        };
    }

    function onDragEnd() {
        dragState = null;
        isDragging.value = false;
    }

    return { dragStyle, isDragging, onDragStart, onDragMove, onDragEnd };
}
