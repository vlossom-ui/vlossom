import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, type Ref } from 'vue';
import { OverlayCallbackStore } from '../overlay-callback-store';
import { OVERLAY_OPEN, OVERLAY_CLOSE } from '@/declaration';
import type { OverlayCallbacks } from '@/declaration';

describe('OverlayCallbackStore', () => {
    let store: OverlayCallbackStore;

    beforeEach(() => {
        store = new OverlayCallbackStore();
    });

    describe('초기 상태', () => {
        it('overlays가 빈 배열로 초기화되어야 한다', () => {
            // then
            expect(store.overlays.value).toEqual([]);
        });

        it('getLastOverlayId가 빈 문자열을 반환해야 한다', () => {
            // when
            const result = store.getLastOverlayId();

            // then
            expect(result).toBe('');
        });
    });

    describe('push', () => {
        it('overlay를 추가하고 open 콜백을 실행해야 한다', async () => {
            // given
            const overlayId = 'test-overlay-1';
            const openCallback = vi.fn();
            const vlossomOpenCallback = vi.fn();
            const callbacks: Ref<OverlayCallbacks> = ref({
                open: openCallback,
                [OVERLAY_OPEN]: vlossomOpenCallback,
            });

            // when
            await store.push(overlayId, callbacks);

            // then
            expect(store.overlays.value).toHaveLength(1);
            expect(store.overlays.value[0][0]).toBe(overlayId);
            expect(store.overlays.value[0][1]).toBe(callbacks);
            expect(vlossomOpenCallback).toHaveBeenCalledTimes(1);
            expect(openCallback).toHaveBeenCalledTimes(1);
        });

        it('여러 overlay를 순서대로 추가할 수 있어야 한다', async () => {
            // given
            const overlay1 = 'overlay-1';
            const overlay2 = 'overlay-2';
            const callbacks1: Ref<OverlayCallbacks> = ref({ open: vi.fn() });
            const callbacks2: Ref<OverlayCallbacks> = ref({ open: vi.fn() });

            // when
            await store.push(overlay1, callbacks1);
            await store.push(overlay2, callbacks2);

            // then
            expect(store.overlays.value).toHaveLength(2);
            expect(store.overlays.value[0][0]).toBe(overlay1);
            expect(store.overlays.value[1][0]).toBe(overlay2);
        });

        it('open 콜백이 없어도 정상 작동해야 한다', async () => {
            // given
            const overlayId = 'test-overlay';
            const callbacks: Ref<OverlayCallbacks> = ref({});

            // when & then
            expect(async () => {
                await store.push(overlayId, callbacks);
            }).not.toThrow();
            expect(store.overlays.value).toHaveLength(1);
        });
    });

    describe('getLastOverlayId', () => {
        it('마지막에 추가된 overlay의 ID를 반환해야 한다', async () => {
            // given
            const overlay1 = 'overlay-1';
            const overlay2 = 'overlay-2';
            const callbacks: Ref<OverlayCallbacks> = ref({});

            // when
            await store.push(overlay1, callbacks);
            await store.push(overlay2, callbacks);

            // then
            expect(store.getLastOverlayId()).toBe(overlay2);
        });

        it('overlay가 없을 때 빈 문자열을 반환해야 한다', () => {
            // when
            const result = store.getLastOverlayId();

            // then
            expect(result).toBe('');
        });
    });

    describe('pop', () => {
        it('마지막 overlay를 제거하고 close 콜백을 실행해야 한다', async () => {
            // given
            const overlayId = 'test-overlay';
            const closeCallback = vi.fn();
            const vlossomCloseCallback = vi.fn();
            const callbacks: Ref<OverlayCallbacks> = ref({
                close: closeCallback,
                [OVERLAY_CLOSE]: vlossomCloseCallback,
            });
            await store.push(overlayId, callbacks);

            // when
            await store.pop();

            // then
            expect(store.overlays.value).toHaveLength(0);
            expect(vlossomCloseCallback).toHaveBeenCalledTimes(1);
            expect(closeCallback).toHaveBeenCalledTimes(1);
        });

        it('인자를 콜백에 전달해야 한다', async () => {
            // given
            const overlayId = 'test-overlay';
            const closeCallback = vi.fn();
            const callbacks: Ref<OverlayCallbacks> = ref({ close: closeCallback });
            await store.push(overlayId, callbacks);
            const args = ['arg1', 'arg2'];

            // when
            await store.pop(...args);

            // then
            expect(closeCallback).toHaveBeenCalledWith(...args);
        });

        it('close 콜백이 없어도 정상 작동해야 한다', async () => {
            // given
            const overlayId = 'test-overlay';
            const callbacks: Ref<OverlayCallbacks> = ref({});
            await store.push(overlayId, callbacks);

            // when & then
            expect(async () => {
                await store.pop();
            }).not.toThrow();
            expect(store.overlays.value).toHaveLength(0);
        });
    });

    describe('remove', () => {
        it('지정된 ID의 overlay를 제거하고 close 콜백을 실행해야 한다', async () => {
            // given
            const overlay1 = 'overlay-1';
            const overlay2 = 'overlay-2';
            const closeCallback1 = vi.fn();
            const closeCallback2 = vi.fn();
            const callbacks1: Ref<OverlayCallbacks> = ref({ close: closeCallback1 });
            const callbacks2: Ref<OverlayCallbacks> = ref({ close: closeCallback2 });

            await store.push(overlay1, callbacks1);
            await store.push(overlay2, callbacks2);

            // when
            await store.remove(overlay1);

            // then
            expect(store.overlays.value).toHaveLength(1);
            expect(store.overlays.value[0][0]).toBe(overlay2);
            expect(closeCallback1).toHaveBeenCalledTimes(1);
            expect(closeCallback2).not.toHaveBeenCalled();
        });

        it('존재하지 않는 ID로 제거를 시도해도 정상 작동해야 한다', async () => {
            // given
            const overlayId = 'existing-overlay';
            const callbacks: Ref<OverlayCallbacks> = ref({});
            await store.push(overlayId, callbacks);

            // when & then
            expect(async () => {
                await store.remove('non-existing-overlay');
            }).not.toThrow();
            expect(store.overlays.value).toHaveLength(1);
        });

        it('인자를 콜백에 전달해야 한다', async () => {
            // given
            const overlayId = 'test-overlay';
            const closeCallback = vi.fn();
            const callbacks: Ref<OverlayCallbacks> = ref({ close: closeCallback });
            await store.push(overlayId, callbacks);
            const args = ['arg1', 'arg2'];

            // when
            await store.remove(overlayId, ...args);

            // then
            expect(closeCallback).toHaveBeenCalledWith(...args);
        });
    });

    describe('clear', () => {
        it('모든 overlay를 제거해야 한다', async () => {
            // given
            const overlay1 = 'overlay-1';
            const overlay2 = 'overlay-2';
            const overlay3 = 'overlay-3';
            const closeCallback1 = vi.fn();
            const closeCallback2 = vi.fn();
            const closeCallback3 = vi.fn();
            const callbacks1: Ref<OverlayCallbacks> = ref({ close: closeCallback1 });
            const callbacks2: Ref<OverlayCallbacks> = ref({ close: closeCallback2 });
            const callbacks3: Ref<OverlayCallbacks> = ref({ close: closeCallback3 });

            await store.push(overlay1, callbacks1);
            await store.push(overlay2, callbacks2);
            await store.push(overlay3, callbacks3);

            // when
            await store.clear();

            // then
            expect(store.overlays.value).toHaveLength(0);
            expect(closeCallback1).toHaveBeenCalledTimes(1);
            expect(closeCallback2).toHaveBeenCalledTimes(1);
            expect(closeCallback3).toHaveBeenCalledTimes(1);
        });

        it('LIFO 순서로 overlay를 제거해야 한다', async () => {
            // given
            const callOrder: string[] = [];
            const overlay1 = 'overlay-1';
            const overlay2 = 'overlay-2';
            const closeCallback1 = vi.fn(() => {
                callOrder.push('close-1');
            });
            const closeCallback2 = vi.fn(() => {
                callOrder.push('close-2');
            });
            const callbacks1: Ref<OverlayCallbacks> = ref({ close: closeCallback1 });
            const callbacks2: Ref<OverlayCallbacks> = ref({ close: closeCallback2 });

            await store.push(overlay1, callbacks1);
            await store.push(overlay2, callbacks2);

            // when
            await store.clear();

            // then
            expect(callOrder).toEqual(['close-2', 'close-1']);
        });

        it('overlay가 없을 때도 정상 작동해야 한다', async () => {
            // when & then
            expect(async () => {
                await store.clear();
            }).not.toThrow();
        });

        it('인자를 모든 콜백에 전달해야 한다', async () => {
            // given
            const overlay1 = 'overlay-1';
            const overlay2 = 'overlay-2';
            const closeCallback1 = vi.fn();
            const closeCallback2 = vi.fn();
            const callbacks1: Ref<OverlayCallbacks> = ref({ close: closeCallback1 });
            const callbacks2: Ref<OverlayCallbacks> = ref({ close: closeCallback2 });

            await store.push(overlay1, callbacks1);
            await store.push(overlay2, callbacks2);
            const args = ['arg1', 'arg2'];

            // when
            await store.clear(...args);

            // then
            expect(closeCallback1).toHaveBeenCalledWith(...args);
            expect(closeCallback2).toHaveBeenCalledWith(...args);
        });
    });

    describe('통합 테스트', () => {
        it('복합 시나리오에서 올바르게 동작해야 한다', async () => {
            // given
            const overlay1 = 'overlay-1';
            const overlay2 = 'overlay-2';
            const overlay3 = 'overlay-3';
            const callbacks1: Ref<OverlayCallbacks> = ref({
                open: vi.fn(),
                close: vi.fn(),
            });
            const callbacks2: Ref<OverlayCallbacks> = ref({
                open: vi.fn(),
                close: vi.fn(),
            });
            const callbacks3: Ref<OverlayCallbacks> = ref({
                open: vi.fn(),
                close: vi.fn(),
            });

            // when & then
            // 3개 추가
            await store.push(overlay1, callbacks1);
            await store.push(overlay2, callbacks2);
            await store.push(overlay3, callbacks3);
            expect(store.overlays.value).toHaveLength(3);
            expect(store.getLastOverlayId()).toBe(overlay3);

            // 중간 제거
            await store.remove(overlay2);
            expect(store.overlays.value).toHaveLength(2);
            expect(store.overlays.value.map(([id]) => id)).toEqual([overlay1, overlay3]);

            // 마지막 pop
            await store.pop();
            expect(store.overlays.value).toHaveLength(1);
            expect(store.getLastOverlayId()).toBe(overlay1);

            // 모두 clear
            await store.clear();
            expect(store.overlays.value).toHaveLength(0);
            expect(store.getLastOverlayId()).toBe('');
        });
    });
});
