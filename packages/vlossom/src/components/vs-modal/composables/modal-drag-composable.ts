import { computed, ref, type ComputedRef, type CSSProperties, type Ref } from 'vue';

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

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function useModalDrag(areaRef: Ref<HTMLElement | null>, targetRef: Ref<HTMLElement | null>) {
    const offset = ref({ x: 0, y: 0 });
    const isDragging = ref(false);
    let dragState: DragState | null = null;

    // transform은 가운데 정렬과 열림/닫힘 애니메이션이 쓰고 있으므로 독립 속성인 translate로 이동시킨다
    const dragStyle: ComputedRef<CSSProperties> = computed(() => {
        const { x, y } = offset.value;
        return x || y ? { translate: `${x}px ${y}px` } : {};
    });

    function onDragStart(event: PointerEvent) {
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }
        const area = areaRef.value;
        const target = targetRef.value;
        if (!area || !target) {
            return;
        }
        event.preventDefault();

        const areaRect = area.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const { x, y } = offset.value;
        dragState = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            minX: x + areaRect.left - targetRect.left,
            maxX: x + areaRect.right - targetRect.right,
            minY: y + areaRect.top - targetRect.top,
            maxY: y + areaRect.bottom - targetRect.bottom,
            startX: x,
            startY: y,
        };
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
            x: clamp(startX + event.clientX - pointerX, minX, maxX),
            y: clamp(startY + event.clientY - pointerY, minY, maxY),
        };
    }

    function onDragEnd() {
        dragState = null;
        isDragging.value = false;
    }

    return { dragStyle, isDragging, onDragStart, onDragMove, onDragEnd };
}
