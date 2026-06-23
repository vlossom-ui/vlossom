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

    function getAllModals(): ModalInfo[] {
        const containers = Array.from(modalStore.map.value.keys());
        return containers.flatMap((container) => modalStore.get(container));
    }

    function findModal(id: string): ModalInfo | undefined {
        return getAllModals().find((modal) => modal.id === id);
    }

    // overlay 스택은 모달 외 오버레이(드로어, 툴팁 등)도 공유하므로, 스택을 위에서부터 훑어
    // 실제 모달인 최상단 항목을 찾는다. close()와 close(container)가 동일한 순서 기준을 쓰도록 하기 위함.
    function findTopModal(container?: string): ModalInfo | undefined {
        const overlays = overlayCallbackStore.overlays.value;
        for (let i = overlays.length - 1; i >= 0; i--) {
            const [overlayId] = overlays[i];
            const modal = findModal(overlayId);
            if (modal && (!container || modal.container === container)) {
                return modal;
            }
        }
        return undefined;
    }

    async function closeModal(modal: ModalInfo): Promise<boolean> {
        if (!(await runBeforeClose(modal))) {
            return false;
        }

        modalStore.remove(modal.container, modal.id);
        overlayCallbackStore.remove(modal.id);
        return true;
    }

    function removeModals(modals: ModalInfo[]) {
        modals.forEach((modal) => {
            overlayCallbackStore.remove(modal.id);
        });
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

        async close(container?: string): Promise<boolean> {
            const target = findTopModal(container);
            if (!target) {
                return false;
            }
            return closeModal(target);
        },

        async closeWithId(id: string): Promise<boolean> {
            const target = findModal(id);
            if (!target) {
                return false;
            }
            return closeModal(target);
        },

        clear(container?: string) {
            if (container) {
                removeModals(modalStore.get(container));
                modalStore.delete(container);
                return;
            }

            removeModals(getAllModals());
            modalStore.clear();
        },
    };
}
