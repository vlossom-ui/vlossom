import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import { MODAL_BACK, type OverlayCallbacks } from '@/declaration';
import { ModalHistoryStore } from './../modal-history-store';
import { OverlayCallbackStore } from './../overlay-callback-store';

describe('ModalHistoryStore', () => {
    const overlayCallbackStore = new OverlayCallbackStore();
    const store = new ModalHistoryStore(overlayCallbackStore);

    function openOverlay(id: string, onBack?: () => boolean) {
        const callbacks: OverlayCallbacks = onBack ? { [MODAL_BACK]: onBack } : {};
        overlayCallbackStore.push(id, ref(callbacks));
    }

    async function pressBack() {
        window.dispatchEvent(new PopStateEvent('popstate'));
        await new Promise((resolve) => setTimeout(resolve));
    }

    let pushState: ReturnType<typeof vi.spyOn>;
    let go: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        store.clear();
        overlayCallbackStore.clear();
        pushState = vi.spyOn(window.history, 'pushState').mockImplementation(() => undefined);
        go = vi.spyOn(window.history, 'go').mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('뒤로가기 시 history entry를 가진 최상단 overlay의 back 콜백만 실행한다', async () => {
        // given
        const onBottomBack = vi.fn(() => true);
        const onTopBack = vi.fn(() => true);
        openOverlay('bottom', onBottomBack);
        store.push('bottom');
        openOverlay('top', onTopBack);
        store.push('top');

        // when
        await pressBack();
        store.release('top');

        // then
        expect(onTopBack).toHaveBeenCalledTimes(1);
        expect(onBottomBack).not.toHaveBeenCalled();
        expect(pushState).toHaveBeenCalledTimes(2);
        expect(go).not.toHaveBeenCalled();
    });

    it('back 콜백이 닫기를 거부하면 history entry를 복구한다', async () => {
        // given
        openOverlay('modal', () => false);
        store.push('modal');

        // when
        await pressBack();

        // then
        expect(pushState).toHaveBeenCalledTimes(2);
    });

    it('back 콜백이 없는 overlay가 위에 있어도 그 아래 entry의 back 콜백을 실행한다', async () => {
        // given
        const onBack = vi.fn(() => true);
        openOverlay('modal', onBack);
        store.push('modal');
        openOverlay('select-dropdown');

        // when
        await pressBack();

        // then
        expect(onBack).toHaveBeenCalledTimes(1);
        expect(pushState).toHaveBeenCalledTimes(1);
    });

    it('history entry가 없는 back 콜백 overlay가 위에 있으면 아래 back 콜백을 실행하지 않고 history entry를 복구한다', async () => {
        // given
        const onBottomBack = vi.fn(() => true);
        const onTopBack = vi.fn(() => true);
        openOverlay('back-close-modal', onBottomBack);
        store.push('back-close-modal');
        openOverlay('modal-without-back-close', onTopBack);

        // when
        await pressBack();

        // then
        expect(onBottomBack).not.toHaveBeenCalled();
        expect(onTopBack).not.toHaveBeenCalled();
        expect(pushState).toHaveBeenCalledTimes(2);
    });

    it('아래 entry가 먼저 닫히면 최상단 entry가 닫힐 때 함께 되감는다', () => {
        // given
        store.push('bottom');
        store.push('top');

        // when
        store.release('bottom');
        store.release('top');

        // then
        expect(go).toHaveBeenCalledTimes(1);
        expect(go).toHaveBeenCalledWith(-2);
    });

    it('뒤로가기로 닫힌 뒤 아래에 남은 stale entry를 건너뛴다', async () => {
        // given
        store.push('stale');
        openOverlay('top', () => true);
        store.push('top');
        store.release('stale');

        // when
        await pressBack();
        store.release('top');

        // then
        expect(go).toHaveBeenCalledWith(-1);
    });

    it('스스로 되감으며 발생한 popstate는 뒤로가기로 처리하지 않는다', async () => {
        // given
        const onBottomBack = vi.fn(() => true);
        openOverlay('bottom', onBottomBack);
        store.push('bottom');
        store.push('top');

        // when
        store.release('top');
        await pressBack();

        // then
        expect(go).toHaveBeenCalledWith(-1);
        expect(onBottomBack).not.toHaveBeenCalled();
    });
});
