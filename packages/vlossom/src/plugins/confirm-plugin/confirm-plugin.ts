import { h, type Component } from 'vue';
import type { ModalPlugin } from '../modal-plugin/types';
import type { ConfirmOptions, ConfirmPlugin } from './types';

import { VsConfirm } from '@/components';
import { CONFIRM_CANCEL, CONFIRM_OK } from '@/declaration';

export function createConfirmPlugin(modalPlugin: ModalPlugin): ConfirmPlugin {
    return {
        open(content: string | Component, options: ConfirmOptions = {}): Promise<boolean> {
            const container = options.container || 'body';
            const props = {
                colorScheme: options.colorScheme,
                styleSet: options.styleSet,
                okText: options.okText,
                cancelText: options.cancelText,
            };

            return new Promise((resolve) => {
                const modalId = modalPlugin.open(h(VsConfirm, props, { default: () => content }), {
                    ...options,
                    callbacks: {
                        ...options.callbacks,
                        [CONFIRM_OK]: () => {
                            options.callbacks?.[CONFIRM_OK]?.();
                            modalPlugin.closeWithId(container, modalId);
                            resolve(true);
                        },
                        [CONFIRM_CANCEL]: () => {
                            options.callbacks?.[CONFIRM_CANCEL]?.();
                            modalPlugin.closeWithId(container, modalId);
                            resolve(false);
                        },
                        'key-Enter': () => {
                            options.callbacks?.['key-Enter']?.();
                            modalPlugin.closeWithId(container, modalId);
                            resolve(true);
                        },
                        'key-Escape': () => {
                            options.callbacks?.['key-Escape']?.();
                            modalPlugin.closeWithId(container, modalId);
                            resolve(false);
                        },
                    },
                });
            });
        },
    };
}
