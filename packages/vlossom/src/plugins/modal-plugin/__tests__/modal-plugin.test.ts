import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import { useModalContainerStore, useOverlayCallbackStore } from '@/stores';
import { createModalPlugin } from './../modal-plugin';
import type { ModalPlugin } from './../types';

const PANEL_SELECTOR = '#panel';

describe('modal-plugin', () => {
    const modalStore = useModalContainerStore();
    const overlayCallbackStore = useOverlayCallbackStore();
    let modal: ModalPlugin;

    // VsModalNode registers its overlay callback on mount; mimic that so close() can
    // resolve the last-opened modal through the overlay stack.
    function open(content: string, options?: Parameters<ModalPlugin['open']>[1]): string {
        const id = modal.open(content, options);
        overlayCallbackStore.push(id, ref({}));
        return id;
    }

    beforeEach(() => {
        modalStore.clear();
        overlayCallbackStore.clear();

        const panel = document.createElement('div');
        panel.id = 'panel';
        document.body.appendChild(panel);

        modal = createModalPlugin();
    });

    afterEach(() => {
        document.querySelector(PANEL_SELECTOR)?.remove();
    });

    describe('close', () => {
        it('컨테이너를 지정하지 않으면 컨테이너와 무관하게 마지막으로 열린 모달을 닫는다', async () => {
            open('first', { container: 'body' });
            const lastId = open('second', { container: PANEL_SELECTOR });

            const closed = await modal.close();

            expect(closed).toBe(true);
            expect(modalStore.get(PANEL_SELECTOR)).toHaveLength(0);
            expect(modalStore.get('body')).toHaveLength(1);
            expect(overlayCallbackStore.overlays.value.find(([id]) => id === lastId)).toBeUndefined();
        });

        it('컨테이너를 지정하면 해당 컨테이너의 마지막 모달을 닫는다', async () => {
            const bodyId = open('body-modal', { container: 'body' });
            open('panel-modal', { container: PANEL_SELECTOR });

            const closed = await modal.close('body');

            expect(closed).toBe(true);
            expect(modalStore.get('body').some((m) => m.id === bodyId)).toBe(false);
            expect(modalStore.get(PANEL_SELECTOR)).toHaveLength(1);
        });

        it('열린 모달이 없으면 false를 반환한다', async () => {
            expect(await modal.close()).toBe(false);
            expect(await modal.close(PANEL_SELECTOR)).toBe(false);
        });

        it('beforeClose가 false를 반환하면 모달을 닫지 않는다', async () => {
            open('keep-open', { beforeClose: () => false });

            const closed = await modal.close();

            expect(closed).toBe(false);
            expect(modalStore.get('body')).toHaveLength(1);
        });

        it('modalStore 배열 순서가 아니라 overlay 스택(마운트 순서)을 기준으로 닫는다', async () => {
            const firstId = modal.open('first', { container: 'body' });
            const secondId = modal.open('second', { container: 'body' });
            // 마운트 순서가 open 순서와 다른 상황을 모사: overlay 스택 최상단을 firstId로 만든다.
            overlayCallbackStore.push(secondId, ref({}));
            overlayCallbackStore.push(firstId, ref({}));

            await modal.close('body');

            expect(modalStore.get('body').some((m) => m.id === firstId)).toBe(false);
            expect(modalStore.get('body').some((m) => m.id === secondId)).toBe(true);
        });

        it('모달이 아닌 오버레이가 스택 최상단에 있어도 그 아래의 모달을 닫는다', async () => {
            const modalId = open('modal', { container: 'body' });
            // 드로어/툴팁 등 모달 외 오버레이가 위에 쌓인 상황을 모사
            overlayCallbackStore.push('non-modal-overlay', ref({}));

            const closed = await modal.close();

            expect(closed).toBe(true);
            expect(modalStore.get('body').some((m) => m.id === modalId)).toBe(false);
        });
    });

    describe('closeWithId', () => {
        it('컨테이너와 무관하게 ID로 모달을 닫는다', async () => {
            open('body-modal', { container: 'body' });
            const panelId = open('panel-modal', { container: PANEL_SELECTOR });

            const closed = await modal.closeWithId(panelId);

            expect(closed).toBe(true);
            expect(modalStore.get(PANEL_SELECTOR)).toHaveLength(0);
            expect(modalStore.get('body')).toHaveLength(1);
        });

        it('해당 ID의 모달이 없으면 false를 반환한다', async () => {
            open('body-modal');

            expect(await modal.closeWithId('unknown-id')).toBe(false);
            expect(modalStore.get('body')).toHaveLength(1);
        });
    });

    describe('clear', () => {
        it('컨테이너를 지정하지 않으면 모든 컨테이너의 모달을 닫는다', () => {
            open('body-modal', { container: 'body' });
            open('panel-modal', { container: PANEL_SELECTOR });

            modal.clear();

            expect(modalStore.get('body')).toHaveLength(0);
            expect(modalStore.get(PANEL_SELECTOR)).toHaveLength(0);
            expect(overlayCallbackStore.overlays.value).toHaveLength(0);
        });

        it('컨테이너를 지정하면 해당 컨테이너의 모달만 닫는다', () => {
            open('body-modal', { container: 'body' });
            open('panel-modal', { container: PANEL_SELECTOR });

            modal.clear(PANEL_SELECTOR);

            expect(modalStore.get(PANEL_SELECTOR)).toHaveLength(0);
            expect(modalStore.get('body')).toHaveLength(1);
        });
    });
});
