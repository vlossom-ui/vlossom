import { h, type Component } from 'vue';
import { VsRender } from '@/components';
import { useOverlayCallbackStore } from '@/stores';
import { CONFIRM_CANCEL, CONFIRM_OK, OVERLAY_CLOSE } from '@/declaration';
import type { ModalPlugin } from '../modal-plugin/types';
import type { ConfirmModalOptions, ConfirmPlugin } from './types';
import createButtons from './components/buttons-vnode';

export function createConfirmPlugin(modalPlugin: ModalPlugin): ConfirmPlugin {
    const overlayCallback = useOverlayCallbackStore();

    return {
        open(content: string | Component, options: ConfirmModalOptions = {}): Promise<boolean> {
            const container = options.container || 'body';

            return new Promise((resolve) => {
                const confirmDiv = h('div', { class: 'vs-confirm' }, [
                    h(VsRender, { content }),
                    createButtons(overlayCallback, options),
                ]);
                const innerComponent = h(confirmDiv, options);
                const modalId = modalPlugin.open(innerComponent, {
                    ...options,
                    callbacks: {
                        ...options?.callbacks,
                        [CONFIRM_OK]: () => {
                            resolve(true);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        [CONFIRM_CANCEL]: () => {
                            resolve(false);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        'key-Enter': () => {
                            resolve(true);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        'key-Escape': () => {
                            resolve(false);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        [OVERLAY_CLOSE]: () => {
                            resolve(false);
                        },
                    },
                });
            });
        },
    };
}
