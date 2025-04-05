import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import { OverlayCallbackStore } from '../overlay-callback-store';
import { VS_OVERLAY_CLOSE, VS_OVERLAY_OPEN } from '@/declaration';

describe('OverlayCallbackStore', () => {
    let store: OverlayCallbackStore;
    const mockCallback = vi.fn();
    const mockKeydownCallback = vi.fn();

    beforeEach(() => {
        store = new OverlayCallbackStore();
        vi.spyOn(document, 'addEventListener');
        vi.spyOn(document, 'removeEventListener');
    });

    afterEach(() => {
        store.destroy();
        vi.clearAllMocks();
    });

    describe('생성자', () => {
        it('빈 오버레이 배열로 초기화되어야 한다', () => {
            // given
            // when
            const result = store.overlays.value;

            // then
            expect(result).toEqual([]);
        });

        it('키다운 이벤트 리스너가 추가되어야 한다', () => {
            // given
            // when
            // then
            expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
        });
    });

    describe('overlays', () => {
        it('읽기 전용 오버레이 배열을 반환해야 한다', () => {
            // given
            const overlays = store.overlays;

            // when
            const attemptToModify = () => {
                (overlays as any).value = [];
            };

            // then
            expect(attemptToModify).toThrow();
        });
    });

    describe('getLastOverlayId', () => {
        it('오버레이가 없을 때 빈 문자열을 반환해야 한다', () => {
            // given
            // when
            const result = store.getLastOverlayId();

            // then
            expect(result).toBe('');
        });

        it('마지막 오버레이의 ID를 반환해야 한다', () => {
            // given
            store.push('test1', ref({}));
            store.push('test2', ref({}));

            // when
            const result = store.getLastOverlayId();

            // then
            expect(result).toBe('test2');
        });
    });

    describe('getOverlayCount', () => {
        it('오버레이가 없을 때 0을 반환해야 한다', () => {
            // given
            // when
            const result = store.getOverlayCount();

            // then
            expect(result).toBe(0);
        });

        it('오버레이의 개수를 정확히 반환해야 한다', () => {
            // given
            store.push('test1', ref({}));
            store.push('test2', ref({}));

            // when
            const result = store.getOverlayCount();

            // then
            expect(result).toBe(2);
        });
    });

    describe('hasOverlay', () => {
        it('오버레이가 존재하지 않을 때 false를 반환해야 한다', () => {
            // given
            // when
            const result = store.hasOverlay('test');

            // then
            expect(result).toBe(false);
        });

        it('오버레이가 존재할 때 true를 반환해야 한다', () => {
            // given
            store.push('test', ref({}));

            // when
            const result = store.hasOverlay('test');

            // then
            expect(result).toBe(true);
        });
    });

    describe('run', () => {
        it('오버레이가 존재하지 않을 때 콜백을 실행하지 않아야 한다', async () => {
            // given
            // when
            const result = await store.run('non-existent', 'test');

            // then
            expect(result).toBeUndefined();
        });

        it('이벤트가 존재하지 않을 때 콜백을 실행하지 않아야 한다', async () => {
            // given
            store.push('test', ref({}));

            // when
            const result = await store.run('test', 'non-existent');

            // then
            expect(result).toBeUndefined();
        });

        it('오버레이와 이벤트가 존재할 때 콜백을 실행해야 한다', async () => {
            // given
            store.push('test', ref({ test: mockCallback }));

            // when
            await store.run('test', 'test');

            // then
            expect(mockCallback).toHaveBeenCalled();
        });
    });

    describe('push', () => {
        it('오버레이를 스택에 추가해야 한다', () => {
            // given
            // when
            store.push('test', ref({}));

            // then
            expect(store.getOverlayCount()).toBe(1);
        });

        it('오픈 이벤트를 트리거해야 한다', async () => {
            // given
            const callbacks = ref({
                [VS_OVERLAY_OPEN]: mockCallback,
                open: mockCallback,
            });

            // when
            await store.push('test', callbacks);

            // then
            expect(mockCallback).toHaveBeenCalledTimes(2);
        });
    });

    describe('pop', () => {
        it('오버레이가 없을 때 에러를 발생시켜야 한다', () => {
            // given
            // when
            const attemptToPop = () => store.pop();

            // then
            expect(attemptToPop).toThrow('No overlays to pop');
        });

        it('마지막 오버레이를 제거하고 클로즈 이벤트를 트리거해야 한다', async () => {
            // given
            const callbacks = ref({
                [VS_OVERLAY_CLOSE]: mockCallback,
                close: mockCallback,
            });
            store.push('test1', ref({}));
            store.push('test2', callbacks);

            // when
            await store.pop();

            // then
            expect(mockCallback).toHaveBeenCalledTimes(2);
            expect(store.getOverlayCount()).toBe(1);
        });
    });

    describe('remove', () => {
        it('오버레이가 존재하지 않을 때 아무것도 하지 않아야 한다', () => {
            // given
            // when
            const attemptToRemove = () => store.remove('non-existent');

            // then
            expect(attemptToRemove).not.toThrow();
        });

        it('특정 오버레이를 제거하고 클로즈 이벤트를 트리거해야 한다', async () => {
            // given
            const callbacks = ref({
                [VS_OVERLAY_CLOSE]: mockCallback,
                close: mockCallback,
            });
            store.push('test1', ref({}));
            store.push('test2', callbacks);

            // when
            await store.remove('test2');

            // then
            expect(mockCallback).toHaveBeenCalledTimes(2);
            expect(store.getOverlayCount()).toBe(1);
        });
    });

    describe('clear', () => {
        it('모든 오버레이를 제거해야 한다', () => {
            // given
            store.push('test1', ref({}));
            store.push('test2', ref({}));

            // when
            store.clear();

            // then
            expect(store.getOverlayCount()).toBe(0);
        });
    });

    describe('destroy', () => {
        it('키다운 이벤트 리스너를 제거하고 오버레이를 모두 제거해야 한다', () => {
            // given
            store.push('test', ref({}));

            // when
            store.destroy();

            // then
            expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
            expect(store.getOverlayCount()).toBe(0);
        });
    });

    describe('키다운 이벤트 처리', () => {
        it('오버레이가 없을 때 콜백을 트리거하지 않아야 한다', () => {
            // given
            const event = new KeyboardEvent('keydown', { key: 'Enter' });

            // when
            document.dispatchEvent(event);

            // then
            expect(mockCallback).not.toHaveBeenCalled();
        });

        it('등록된 키 이벤트에 대해 콜백을 트리거해야 한다', () => {
            // given
            const callbacks = ref({
                'key-Enter': mockKeydownCallback,
            });
            store.push('test', callbacks);
            const event = new KeyboardEvent('keydown', { key: 'Enter' });

            // when
            document.dispatchEvent(event);

            // then
            expect(mockKeydownCallback).toHaveBeenCalled();
        });
    });
});
