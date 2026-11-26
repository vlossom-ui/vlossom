import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useDraggable } from './../draggable-composable';

function createElement(rect: { left: number; top: number; right: number; bottom: number }) {
    const element = document.createElement('div');
    element.getBoundingClientRect = () => ({ ...rect }) as DOMRect;
    return element;
}

function pointerEvent(clientX: number, clientY: number, init: Partial<PointerEvent> = {}) {
    return { clientX, clientY, pointerType: 'mouse', button: 0, preventDefault: () => {}, ...init } as PointerEvent;
}

describe('useDraggable', () => {
    it('드래그한 만큼 translate 스타일이 적용되어야 한다', () => {
        // given
        const target = ref(createElement({ left: 0, top: 0, right: 100, bottom: 100 }));
        const { dragStyle, isDragging, onDragStart, onDragMove, onDragEnd } = useDraggable(target);

        // when
        onDragStart(pointerEvent(10, 10));
        onDragMove(pointerEvent(60, 40));

        // then
        expect(isDragging.value).toBe(true);
        expect(dragStyle.value).toEqual({ translate: '50px 30px' });

        onDragEnd();
        expect(isDragging.value).toBe(false);
    });

    it('boundary가 주어지면 대상이 boundary 밖으로 나가지 않아야 한다', () => {
        // given
        const boundary = ref(createElement({ left: 0, top: 0, right: 300, bottom: 200 }));
        const target = ref(createElement({ left: 100, top: 50, right: 200, bottom: 150 }));
        const { dragStyle, onDragStart, onDragMove } = useDraggable(target, boundary);

        // when
        onDragStart(pointerEvent(0, 0));
        onDragMove(pointerEvent(1000, -1000));

        // then
        expect(dragStyle.value).toEqual({ translate: '100px -50px' });
    });

    it('드래그 종료 후 다시 드래그하면 이전 위치에서 이어서 이동해야 한다', () => {
        // given
        const target = ref(createElement({ left: 0, top: 0, right: 100, bottom: 100 }));
        const { dragStyle, onDragStart, onDragMove, onDragEnd } = useDraggable(target);
        onDragStart(pointerEvent(0, 0));
        onDragMove(pointerEvent(20, 20));
        onDragEnd();

        // when
        onDragStart(pointerEvent(0, 0));
        onDragMove(pointerEvent(10, 0));

        // then
        expect(dragStyle.value).toEqual({ translate: '30px 20px' });
    });

    it('마우스 주 버튼이 아니면 드래그가 시작되지 않아야 한다', () => {
        // given
        const target = ref(createElement({ left: 0, top: 0, right: 100, bottom: 100 }));
        const { dragStyle, isDragging, onDragStart, onDragMove } = useDraggable(target);

        // when
        onDragStart(pointerEvent(0, 0, { button: 2 }));
        onDragMove(pointerEvent(50, 50));

        // then
        expect(isDragging.value).toBe(false);
        expect(dragStyle.value).toEqual({});
    });

    it('boundary ref가 비어 있으면 드래그가 시작되지 않아야 한다', () => {
        // given
        const target = ref(createElement({ left: 0, top: 0, right: 100, bottom: 100 }));
        const { isDragging, onDragStart } = useDraggable(target, ref(null));

        // when
        onDragStart(pointerEvent(0, 0));

        // then
        expect(isDragging.value).toBe(false);
    });
});
