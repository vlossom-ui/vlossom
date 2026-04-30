import { type Component } from 'vue';
import { useOverlayContainerStore, useModalContainerStore, useOverlayCallbackStore } from '@/stores';
import { logUtil } from '@/utils';
import type { ModalInfo, ModalOptions, ModalPlugin } from './types';
import { createModalInfo } from './modal-model';

export function createModalPlugin(): ModalPlugin {
    const overlayContainerStore = useOverlayContainerStore();
    const modalStore = useModalContainerStore();
    const overlayCallbackStore = useOverlayCallbackStore();

    async function runBeforeClose(modal: ModalInfo): Promise<boolean> {
        const fn = modal.beforeClose;
        if (!fn) {
            return true;
        }
        const result = await fn();
        return result !== false;
    }

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

        async close(container = 'body'): Promise<boolean> {
            const modals = modalStore.get(container);
            if (modals.length === 0) {
                return false;
            }
            const last = modals[modals.length - 1];
            if (!(await runBeforeClose(last))) {
                return false;
            }

            modalStore.pop(container);

            const lastOverlayId = overlayCallbackStore.getLastOverlayId();
            overlayCallbackStore.remove(lastOverlayId);
            return true;
        },

        async closeWithId(container: string, id: string): Promise<boolean> {
            const target = modalStore.get(container).find((modal) => modal.id === id);
            if (!target) {
                return false;
            }
            if (!(await runBeforeClose(target))) {
                return false;
            }

            modalStore.remove(container, id);

            overlayCallbackStore.remove(id);
            return true;
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
