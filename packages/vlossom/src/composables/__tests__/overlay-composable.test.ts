import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, nextTick } from 'vue';
import * as stores from '@/stores';
import { OverlayCallbackStore } from '@/stores';
import { ANIMATION_DURATION, type OverlayCallbacks } from '@/declaration';
import { useOverlayCallback } from '../overlay-callback-composable';

describe('useOverlayCallback', () => {
    let overlayCallbackStore: OverlayCallbackStore;

    beforeEach(() => {
        overlayCallbackStore = new OverlayCallbackStore();
        vi.spyOn(stores, 'useOverlayCallbackStore').mockReturnValue(overlayCallbackStore);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('초기 상태', () => {
        it('isMounted, isUnmounting이 false로 초기화되어야 한다', () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});

            // when
            const { isMounted, isUnmounting } = useOverlayCallback(id, callbacks);

            // then
            expect(isMounted.value).toBe(false);
            expect(isUnmounting.value).toBe(false);
        });

        it('id가 주어지면 overlayId가 해당 값이어야 한다', () => {
            // given
            const testId = 'custom-overlay-id';
            const id = ref(testId);
            const callbacks = ref<OverlayCallbacks>({});

            // when
            const { overlayId } = useOverlayCallback(id, callbacks);

            // then
            expect(overlayId.value).toBe(testId);
        });

        it('id가 빈 문자열이면 자동 생성된 innerId를 사용해야 한다', () => {
            // given
            const id = ref('');
            const callbacks = ref<OverlayCallbacks>({});

            // when
            const { overlayId } = useOverlayCallback(id, callbacks);

            // then
            expect(overlayId.value).toBeTruthy();
            expect(overlayId.value).not.toBe('');
        });
    });

    describe('mountOverlay 함수', () => {
        it('mountOverlay를 호출하면 isMounted가 true가 되어야 한다', () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const { isMounted, mountOverlay } = useOverlayCallback(id, callbacks);

            // when
            mountOverlay();

            // then
            expect(isMounted.value).toBe(true);
        });

        it('mountOverlay를 호출하면 store에 콜백이 push되어야 한다', async () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const { mountOverlay, overlayId } = useOverlayCallback(id, callbacks);
            const pushSpy = vi.spyOn(overlayCallbackStore, 'push');

            // when
            mountOverlay();
            await nextTick();

            // then
            expect(pushSpy).toHaveBeenCalledWith(overlayId.value, callbacks);
        });
    });

    describe('unmountOverlay 함수', () => {
        it('unmountOverlay를 호출하면 isMounted가 false가 되어야 한다', () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const { isMounted, mountOverlay, unmountOverlay } = useOverlayCallback(id, callbacks);
            mountOverlay();

            // when
            unmountOverlay();

            // then
            expect(isMounted.value).toBe(false);
        });

        it('unmountOverlay를 호출하면 isUnmounting이 true가 되었다가 애니메이션 duration 후 false가 되어야 한다', async () => {
            // given
            vi.useFakeTimers();
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const { isUnmounting, mountOverlay, unmountOverlay } = useOverlayCallback(id, callbacks);
            mountOverlay();
            await nextTick();

            // when
            unmountOverlay();
            await nextTick();

            // then
            expect(isUnmounting.value).toBe(true);

            // 애니메이션 시간이 지나면
            vi.advanceTimersByTime(ANIMATION_DURATION);
            expect(isUnmounting.value).toBe(false);

            vi.useRealTimers();
        });

        it('unmountOverlay를 호출하면 store에서 콜백이 remove되어야 한다', async () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const { mountOverlay, unmountOverlay, overlayId } = useOverlayCallback(id, callbacks);
            const removeSpy = vi.spyOn(overlayCallbackStore, 'remove');

            mountOverlay();
            await nextTick();

            // when
            unmountOverlay();
            await nextTick();

            // then
            expect(removeSpy).toHaveBeenCalledWith(overlayId.value);
        });
    });

    describe('watch isMounted', () => {
        it('isMounted가 true로 변경되면 store에 push되어야 한다', async () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const { isMounted, overlayId } = useOverlayCallback(id, callbacks);
            const pushSpy = vi.spyOn(overlayCallbackStore, 'push');

            // when
            isMounted.value = true;
            await nextTick();

            // then
            expect(pushSpy).toHaveBeenCalledWith(overlayId.value, callbacks);
        });

        it('isMounted가 false로 변경되면 store에서 remove되어야 한다', async () => {
            // given
            const id = ref('test-id');
            const callbacks = ref<OverlayCallbacks>({});
            const { isMounted, overlayId } = useOverlayCallback(id, callbacks);
            const removeSpy = vi.spyOn(overlayCallbackStore, 'remove');

            // 먼저 마운트하고
            isMounted.value = true;
            await nextTick();

            // when
            isMounted.value = false;
            await nextTick();

            // then
            expect(removeSpy).toHaveBeenCalledWith(overlayId.value);
        });
    });

    describe('통합 테스트', () => {
        it('전체적인 라이프사이클이 올바르게 동작해야 한다', async () => {
            // given
            vi.useFakeTimers();
            const id = ref('lifecycle-test');
            const callbacks = ref<OverlayCallbacks>({});

            const { isMounted, isUnmounting, mountOverlay, unmountOverlay, overlayId } = useOverlayCallback(
                id,
                callbacks,
            );
            const pushSpy = vi.spyOn(overlayCallbackStore, 'push');
            const removeSpy = vi.spyOn(overlayCallbackStore, 'remove');

            // 초기 상태 확인
            expect(isMounted.value).toBe(false);
            expect(isUnmounting.value).toBe(false);
            expect(overlayId.value).toBe('lifecycle-test');

            // when - mount
            mountOverlay();
            await nextTick();

            // then - 마운트된 상태
            expect(isMounted.value).toBe(true);
            expect(isUnmounting.value).toBe(false);
            expect(pushSpy).toHaveBeenCalledWith('lifecycle-test', callbacks);

            // when - unmount
            unmountOverlay();
            await nextTick();

            // then - 언마운트 중 상태
            expect(isMounted.value).toBe(false);
            expect(isUnmounting.value).toBe(true);
            expect(removeSpy).toHaveBeenCalledWith('lifecycle-test');

            // when - 애니메이션 완료
            vi.advanceTimersByTime(ANIMATION_DURATION);

            // then - 언마운트 완료
            expect(isUnmounting.value).toBe(false);

            vi.useRealTimers();
        });
    });
});
