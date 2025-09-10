import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, nextTick } from 'vue';
import * as stores from '@/stores';
import { OverlayCallbackStore } from '@/stores';
import { ANIMATION_DURATION, type OverlayCallbacks } from '@/declaration';
import { useOverlay } from './../overlay-composable';

describe('useOverlay', () => {
    let overlayCallbackStore: OverlayCallbackStore;

    beforeEach(() => {
        overlayCallbackStore = new OverlayCallbackStore();
        vi.spyOn(stores, 'useOverlayCallbackStore').mockReturnValue(overlayCallbackStore);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('초기 상태', () => {
        it('isOpen, closing이 false로 초기화되어야 한다', () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const escClose = ref(true);

            // when
            const { isOpen, closing } = useOverlay(id, callbacks, escClose);

            // then
            expect(isOpen.value).toBe(false);
            expect(closing.value).toBe(false);
        });

        it('id가 주어지면 overlayId가 해당 값이어야 한다', () => {
            // given
            const testId = 'custom-overlay-id';
            const id = ref(testId);
            const callbacks = ref<OverlayCallbacks>({});
            const escClose = ref(true);

            // when
            const { overlayId } = useOverlay(id, callbacks, escClose);

            // then
            expect(overlayId.value).toBe(testId);
        });
    });

    describe('open 함수', () => {
        it('open을 호출하면 isOpen이 true가 되어야 한다', () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const escClose = ref(true);
            const { isOpen, open } = useOverlay(id, callbacks, escClose);

            // when
            open();

            // then
            expect(isOpen.value).toBe(true);
        });

        it('open을 호출하면 store에 콜백이 push되어야 한다', async () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const escClose = ref(true);
            const { open } = useOverlay(id, callbacks, escClose);
            const pushSpy = vi.spyOn(overlayCallbackStore, 'push');

            // when
            open();
            await nextTick();

            // then
            expect(pushSpy).toHaveBeenCalledWith(id.value, expect.any(Object));
        });
    });

    describe('close 함수', () => {
        it('close를 호출하면 isOpen이 false가 되어야 한다', () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const escClose = ref(true);
            const { isOpen, open, close } = useOverlay(id, callbacks, escClose);
            open();

            // when
            close();

            // then
            expect(isOpen.value).toBe(false);
        });

        it('close를 호출하면 closing이 true가 되었다가 애니메이션 duration 후 false가 되어야 한다', async () => {
            // given
            vi.useFakeTimers();
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const escClose = ref(true);
            const { closing, open, close } = useOverlay(id, callbacks, escClose);
            open();
            await nextTick();

            // when
            close();
            await nextTick();

            // then
            expect(closing.value).toBe(true);

            // 애니메이션 시간이 지나면
            vi.advanceTimersByTime(ANIMATION_DURATION);
            expect(closing.value).toBe(false);

            vi.useRealTimers();
        });

        it('close를 호출하면 store에서 콜백이 remove되어야 한다', async () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const escClose = ref(true);
            const { open, close } = useOverlay(id, callbacks, escClose);
            const removeSpy = vi.spyOn(overlayCallbackStore, 'remove');

            open();
            await nextTick();

            // when
            close();
            await nextTick();

            // then
            expect(removeSpy).toHaveBeenCalledWith(id.value);
        });
    });

    describe('watch isOpen', () => {
        it('isOpen이 true로 변경되면 store에 push되어야 한다', async () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const escClose = ref(true);
            const { isOpen } = useOverlay(id, callbacks, escClose);
            const pushSpy = vi.spyOn(overlayCallbackStore, 'push');

            // when
            isOpen.value = true;
            await nextTick();

            // then
            expect(pushSpy).toHaveBeenCalledWith(id.value, expect.any(Object));
        });

        it('isOpen이 false로 변경되면 store에서 remove되어야 한다', async () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const escClose = ref(true);
            const { isOpen } = useOverlay(id, callbacks, escClose);
            const removeSpy = vi.spyOn(overlayCallbackStore, 'remove');

            // 먼저 열어두고
            isOpen.value = true;
            await nextTick();

            // when
            isOpen.value = false;
            await nextTick();

            // then
            expect(removeSpy).toHaveBeenCalledWith(id.value);
        });
    });

    describe('통합 테스트', () => {
        it('전체적인 라이프사이클이 올바르게 동작해야 한다', async () => {
            // given
            vi.useFakeTimers();
            const id = ref('lifecycle-test');
            const escapeCallback = vi.fn();
            const callbacks = ref<OverlayCallbacks>({
                'key-Escape': escapeCallback,
            });
            const escClose = ref(true);

            const { isOpen, closing, open, overlayId } = useOverlay(id, callbacks, escClose);
            const pushSpy = vi.spyOn(overlayCallbackStore, 'push');
            const removeSpy = vi.spyOn(overlayCallbackStore, 'remove');

            // 초기 상태 확인
            expect(isOpen.value).toBe(false);
            expect(closing.value).toBe(false);
            expect(overlayId.value).toBe('lifecycle-test');

            // when - open
            open();
            await nextTick();

            // then - 열린 상태
            expect(isOpen.value).toBe(true);
            expect(closing.value).toBe(false);
            expect(pushSpy).toHaveBeenCalledWith('lifecycle-test', expect.any(Object));

            // when - escape key 처리
            const pushedCallbacks = pushSpy.mock.calls[0][1];
            pushedCallbacks.value['key-Escape']();
            await nextTick();

            // then - 닫힌 상태
            expect(isOpen.value).toBe(false);
            expect(closing.value).toBe(true);
            expect(escapeCallback).toHaveBeenCalledTimes(1);
            expect(removeSpy).toHaveBeenCalledWith('lifecycle-test');

            // when - 애니메이션 완료
            vi.advanceTimersByTime(ANIMATION_DURATION);

            // then - closing false
            expect(closing.value).toBe(false);

            vi.useRealTimers();
        });
    });
});
