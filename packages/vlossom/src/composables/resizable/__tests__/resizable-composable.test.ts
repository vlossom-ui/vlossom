import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import { useResizable, type ResizableOptions, type ResizeEdge } from './../resizable-composable';

describe('useResizable', () => {
    function mockRect(element: HTMLElement, rect: Partial<DOMRect>) {
        vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ width: 0, height: 0, ...rect } as DOMRect);
    }

    function createPointerEvent(init: { clientX?: number; clientY?: number; button?: number } = {}) {
        const handle = document.createElement('div');
        handle.setPointerCapture = vi.fn();
        return {
            button: 0,
            clientX: 0,
            clientY: 0,
            pointerId: 1,
            currentTarget: handle,
            preventDefault: vi.fn(),
            ...init,
        } as unknown as PointerEvent;
    }

    function setup(edge: ResizeEdge = 'right', options: Partial<ResizableOptions> = {}) {
        const target = document.createElement('div');
        mockRect(target, { width: 200, height: 200 });
        const onResize = vi.fn();
        const resizable = useResizable(ref(target), { edge: ref(edge), onResize, ...options });
        return { target, onResize, ...resizable };
    }

    it('드래그하는 가장자리 방향으로 포인터가 움직이면 크기가 커진다', () => {
        // given
        const right = setup('right');
        const left = setup('left');
        const bottom = setup('bottom');
        const top = setup('top');

        // when
        right.onResizeStart(createPointerEvent({ clientX: 200 }));
        right.onResizeMove(createPointerEvent({ clientX: 260 }));
        left.onResizeStart(createPointerEvent({ clientX: 800 }));
        left.onResizeMove(createPointerEvent({ clientX: 750 }));
        bottom.onResizeStart(createPointerEvent({ clientY: 200 }));
        bottom.onResizeMove(createPointerEvent({ clientY: 230 }));
        top.onResizeStart(createPointerEvent({ clientY: 600 }));
        top.onResizeMove(createPointerEvent({ clientY: 580 }));

        // then
        expect(right.resizedSize.value).toBe(260);
        expect(left.resizedSize.value).toBe(250);
        expect(bottom.resizedSize.value).toBe(230);
        expect(top.resizedSize.value).toBe(220);
    });

    it('크기가 바뀔 때만 onResize를 호출한다', () => {
        // given
        const { onResizeStart, onResizeMove, onResize } = setup();

        // when
        onResizeStart(createPointerEvent({ clientX: 200 }));
        onResizeMove(createPointerEvent({ clientX: 260 }));
        onResizeMove(createPointerEvent({ clientX: 260.2 }));

        // then
        expect(onResize.mock.calls).toEqual([[260]]);
    });

    it('minSize와 maxSize를 대상 요소 기준 실제 크기로 환산해 제한하고 inline style은 원래대로 돌려놓는다', () => {
        // given
        const target = document.createElement('div');
        target.style.width = '200px';
        vi.spyOn(target, 'getBoundingClientRect').mockImplementation(
            () => ({ width: target.style.width === '50%' ? 500 : parseFloat(target.style.width) }) as DOMRect,
        );
        const { onResizeStart, onResizeMove, resizedSize } = useResizable(ref(target), {
            edge: ref('right'),
            minSize: ref(120),
            maxSize: ref('50%'),
        });

        // when
        onResizeStart(createPointerEvent({ clientX: 200 }));
        onResizeMove(createPointerEvent({ clientX: 5000 }));
        const maxed = resizedSize.value;
        onResizeMove(createPointerEvent({ clientX: -5000 }));

        // then
        expect(maxed).toBe(500);
        expect(resizedSize.value).toBe(120);
        expect(target.style.width).toBe('200px');
    });

    it('maxSize가 없으면 boundaryRef 크기를, boundaryRef도 없으면 상한 없이 제한한다', () => {
        // given
        const boundary = document.createElement('div');
        mockRect(boundary, { width: 1000 });
        const bounded = setup('right', { boundaryRef: ref(boundary) });
        const unbounded = setup('right');

        // when
        bounded.onResizeStart(createPointerEvent({ clientX: 200 }));
        bounded.onResizeMove(createPointerEvent({ clientX: 5000 }));
        unbounded.onResizeStart(createPointerEvent({ clientX: 200 }));
        unbounded.onResizeMove(createPointerEvent({ clientX: 5000 }));

        // then
        expect(bounded.resizedSize.value).toBe(1000);
        expect(unbounded.resizedSize.value).toBe(5000);
    });

    it('주 버튼이 아니거나 대상 요소가 없으면 리사이즈를 시작하지 않는다', () => {
        // given
        const { onResizeStart, isResizing } = setup();
        const noTarget = useResizable(ref(null), { edge: ref('right') });

        // when
        onResizeStart(createPointerEvent({ button: 2 }));
        noTarget.onResizeStart(createPointerEvent());

        // then
        expect(isResizing.value).toBe(false);
        expect(noTarget.isResizing.value).toBe(false);
    });

    it('리사이즈를 시작하면 pointer capture를 잡고 끝나면 이후 이동을 무시한다', () => {
        // given
        const { onResizeStart, onResizeMove, onResizeEnd, isResizing, resizedSize } = setup();
        const startEvent = createPointerEvent({ clientX: 200 });

        // when
        onResizeStart(startEvent);
        const resizing = isResizing.value;
        onResizeEnd();
        onResizeMove(createPointerEvent({ clientX: 300 }));

        // then
        expect(resizing).toBe(true);
        expect((startEvent.currentTarget as HTMLElement).setPointerCapture).toHaveBeenCalledWith(1);
        expect(isResizing.value).toBe(false);
        expect(resizedSize.value).toBeNull();
    });

    it('resetSize를 호출하면 resizedSize가 null로 돌아간다', () => {
        // given
        const { onResizeStart, onResizeMove, resetSize, resizedSize } = setup();
        onResizeStart(createPointerEvent({ clientX: 200 }));
        onResizeMove(createPointerEvent({ clientX: 260 }));

        // when
        resetSize();

        // then
        expect(resizedSize.value).toBeNull();
    });
});
