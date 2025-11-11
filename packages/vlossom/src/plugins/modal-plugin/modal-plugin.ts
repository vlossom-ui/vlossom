import { type Component } from 'vue';
import { useOverlayContainerStore, useModalContainerStore, useOverlayCallbackStore } from '@/stores';
import { logUtil } from '@/utils';
import type { ModalOptions } from '@/declaration';
import type { ModalPlugin } from './types';
import { createModalInfo } from './modal-model';

export function createModalPlugin(): ModalPlugin {
    const overlayContainerStore = useOverlayContainerStore();
    const modalStore = useModalContainerStore();
    const overlayCallbackStore = useOverlayCallbackStore();

    return {
        open(content: string | Component, options: ModalOptions = {}): string {
            const container = options.container || 'body';
            const containerElement: HTMLElement | null = document.querySelector(container);
            if (!containerElement) {
                logUtil.error('modal-plugin.open', `Modal container not found: ${container}`);
                return '';
            }

            if (!containerElement.style.position) {
                containerElement.style.position = 'relative';
            }
            // mount ModalView to OverlayWrapper
            const overlayId = `vs-modal-overlay-${container.replace('#', '')}`;
            overlayContainerStore.push(overlayId, container, 'VsModalView');

            const modalInfo = createModalInfo(content, options);
            modalStore.push(container, modalInfo);

            return modalInfo.id;
        },

        emit(eventName: string, ...args: any[]): Promise<any> {
            const lastOverlayId = overlayCallbackStore.getLastOverlayId();
            return overlayCallbackStore.run(lastOverlayId, eventName, ...args);
        },

        emitWithId(id: string, eventName: string, ...args: any[]): Promise<any> {
            return overlayCallbackStore.run(id, eventName, ...args);
        },

        close(container = 'body') {
            modalStore.pop(container);

            const lastOverlayId = overlayCallbackStore.getLastOverlayId();
            overlayCallbackStore.remove(lastOverlayId);
        },

        closeWithId(container: string, id: string) {
            modalStore.remove(container, id);

            overlayCallbackStore.remove(id);
        },

        clear(container = 'body') {
            const modalIds = modalStore.get(container).map((modal) => modal.id);
            modalIds.forEach((modalId) => {
                overlayCallbackStore.remove(modalId);
            });
            modalStore.delete(container);
        },
    };
}
