import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ScrollLockStore } from './../scroll-lock-store';

describe('scroll-lock-store', () => {
    let store: ScrollLockStore;
    let element: HTMLElement;

    beforeEach(() => {
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            cb(0);
            return 0;
        });
        store = new ScrollLockStore();
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        element.remove();
    });

    it('lock 시 element의 스크롤을 잠그고, 마지막 unlock 시 원래 상태로 복원해야 한다', () => {
        // given
        element.style.overflow = 'auto';

        // when
        store.lock('owner-1', element);

        // then
        expect(element.style.overflow).toBe('hidden');

        // when
        store.unlock('owner-1', element);

        // then
        expect(element.style.overflow).toBe('auto');
    });

    it('같은 element를 여러 owner가 잠그면, 모든 owner가 unlock 할 때까지 잠금이 유지되어야 한다', () => {
        // given
        store.lock('owner-1', element);
        store.lock('owner-2', element);
        expect(element.style.overflow).toBe('hidden');

        // when - 먼저 잠근 owner가 먼저 unlock
        store.unlock('owner-1', element);

        // then - 아직 owner-2가 잠그고 있으므로 유지
        expect(element.style.overflow).toBe('hidden');

        // when - 마지막 owner unlock
        store.unlock('owner-2', element);

        // then
        expect(element.style.overflow).toBe('');
    });

    it('원본 상태는 첫 lock 시점에만 캡처되어 stacking 시에도 오염되지 않아야 한다', () => {
        // given
        element.style.overflow = 'scroll';

        // when
        store.lock('owner-1', element);
        store.lock('owner-2', element);
        store.unlock('owner-2', element);
        store.unlock('owner-1', element);

        // then
        expect(element.style.overflow).toBe('scroll');
    });

    it('동일 owner가 중복 lock/unlock 해도 일관되게 동작해야 한다', () => {
        // given
        store.lock('owner-1', element);
        store.lock('owner-1', element);

        // when
        store.unlock('owner-1', element);

        // then
        expect(element.style.overflow).toBe('');
    });

    it('서로 다른 element는 독립적으로 잠금/복원되어야 한다', () => {
        // given
        const other = document.createElement('div');
        document.body.appendChild(other);

        // when
        store.lock('owner-1', element);

        // then
        expect(element.style.overflow).toBe('hidden');
        expect(other.style.overflow).toBe('');

        other.remove();
    });
});
