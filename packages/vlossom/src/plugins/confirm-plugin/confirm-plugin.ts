import { h, type Component } from 'vue';
import { VsRender } from '@/components';
import { useOverlayCallbackStore } from '@/stores';
import { CONFIRM_CANCEL, CONFIRM_OK, OVERLAY_CLOSE } from '@/declaration';
import type { ModalPlugin } from '../modal-plugin/types';
import type { ConfirmModalOptions, ConfirmPlugin } from './types';
import { confirmButtons } from './components/buttons-vnode';

export function createConfirmPlugin(modalPlugin: ModalPlugin): ConfirmPlugin {
    const overlayCallback = useOverlayCallbackStore();

    return {
        open(content: string | Component, options: ConfirmModalOptions = {}): Promise<boolean> {
            const container = options.container || 'body';

            return new Promise((resolve) => {
                const buttons = confirmButtons(overlayCallback, options);
                const contents = h(VsRender, { content });
                const confirm = h('div', { class: 'vs-confirm' }, [contents, buttons]);

                const modalId = modalPlugin.open(confirm, {
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
