import { h, type Component } from 'vue';
import { VsConfirm, VsRender } from '@/components';
import { CONFIRM_CANCEL, CONFIRM_OK, OVERLAY_CLOSE } from '@/declaration';
import type { ModalPlugin } from '../modal-plugin/types';
import type { ConfirmModalOptions, ConfirmPlugin } from './types';

export function createConfirmPlugin(modalPlugin: ModalPlugin): ConfirmPlugin {
    return {
        open(content: string | Component, options: ConfirmModalOptions = {}): Promise<boolean> {
            const container = options.container || 'body';

            return new Promise((resolve) => {
                const innerComponent = h(VsConfirm, options, { default: () => h(VsRender, { content }) });
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
