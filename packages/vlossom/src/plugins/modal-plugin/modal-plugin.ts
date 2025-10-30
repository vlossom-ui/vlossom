import { type Component } from 'vue';
import { useOverlayContainerStore, useModalContainerStore, useOverlayCallbackStore } from '@/stores';
import { logUtil } from '@/utils';
import type { ModalOptions, ModalPlugin } from './types';
import { createModalInfo } from './modal-model';

export function createModalPlugin(): ModalPlugin {
    return {
        open(content: string | Component, options: ModalOptions = {}) {
            const container = options.container || 'body';

            const overlayContainerStore = useOverlayContainerStore();
            const modalStore = useModalContainerStore();

            // mount ModalView to OverlayWrapper
            const overlayId = `vs-modal-overlay-${container.replace('#', '')}`;
            overlayContainerStore.push(overlayId, container, 'VsModalView');

            const containerElement: HTMLElement | null = document.querySelector(container);

            if (!containerElement) {
                logUtil.error('modal-plugin.open', `Modal container not found: ${container}`);
                return '';
            }

            if (!containerElement.style.position) {
                containerElement.style.position = 'relative';
            }

            const modalInfo = createModalInfo(content, options);
            modalStore.push(container, modalInfo);

            return modalInfo.id;
        },

        emit(eventName: string, ...args: any[]): Promise<any> {
            const overlayCallbackStore = useOverlayCallbackStore();
            const lastOverlayId = overlayCallbackStore.getLastOverlayId();
            return overlayCallbackStore.run(lastOverlayId, eventName, ...args);
        },

        emitWithId(id: string, eventName: string, ...args: any[]): Promise<any> {
            const overlayCallbackStore = useOverlayCallbackStore();
            return overlayCallbackStore.run(id, eventName, ...args);
        },

        close(container = 'body') {
            const modalStore = useModalContainerStore();
            modalStore.pop(container);
        },

        closeWithId(container: string, id: string) {
            const modalStore = useModalContainerStore();
            modalStore.remove(container, id);
        },

        clear(container = 'body') {
            const modalStore = useModalContainerStore();
            modalStore.delete(container);
        },
    };
}
