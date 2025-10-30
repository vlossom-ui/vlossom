import { h, render } from 'vue';
import type { ModalPlugin } from './types';
import { getApp } from '@/vlossom-framework';
import { utils } from '@/utils';
import { store } from '@/stores';
import type { VsModalOptions } from '@/components';
import { VsModalView } from '@/components';
import { useOverlayDom } from '@/composables';

export const modalPlugin: ModalPlugin = {
    open(options: VsModalOptions) {
        const { id = utils.string.createID(), container = 'body' } = options;
        const containerElement = document.querySelector(container);
        if (!containerElement) {
            utils.log.error('modal', `target container not found (${container})`);
            return '';
        }

        const { appendOverlayDom } = useOverlayDom();
        const overlay = appendOverlayDom(containerElement, `vs-modal-overlay-${container.replace('#', '')}`, {
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
        });

        const modalView = h(VsModalView, { container });
        modalView.appContext = getApp()._context;
        render(modalView, overlay);

        store.modal.push({ ...options, id });

        return id;
    },
    close(...args: any[]) {
        store.modal.pop();
        return store.overlay.pop(...args);
    },
    closeWithId(id: string, ...args: any[]) {
        store.modal.remove(id);
        return store.overlay.remove(id, ...args);
    },
    clear(...args: any[]) {
        store.modal.clear();
        store.overlay.clear(...args);
    },
};
