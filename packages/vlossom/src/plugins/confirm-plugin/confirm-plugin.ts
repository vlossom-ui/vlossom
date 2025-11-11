import { h, type Component } from 'vue';
import { VsConfirm } from '@/components';
import { objectUtil } from '@/utils';
import { CONFIRM_CANCEL, CONFIRM_OK } from '@/declaration';
import type { ModalPlugin } from '../modal-plugin/types';
import type { ConfirmModalOptions, ConfirmPlugin } from './types';

export function createConfirmPlugin(modalPlugin: ModalPlugin): ConfirmPlugin {
    return {
        open(content: string | Component, options: ConfirmModalOptions = {}): Promise<boolean> {
            const modalOptions = options?.modalOptions || {};
            const container = modalOptions.container || 'body';
            const props = objectUtil.omit(options, ['modalOptions']);

            return new Promise((resolve) => {
                const innerComponent = h(VsConfirm, props, { default: () => content });
                const modalId = modalPlugin.open(innerComponent, {
                    ...modalOptions,
                    callbacks: {
                        ...modalOptions?.callbacks,
                        [CONFIRM_OK]: () => {
                            modalPlugin.closeWithId(container, modalId);
                            resolve(true);
                        },
                        [CONFIRM_CANCEL]: () => {
                            modalPlugin.closeWithId(container, modalId);
                            resolve(false);
                        },
                        'key-Enter': () => {
                            modalPlugin.closeWithId(container, modalId);
                            resolve(true);
                        },
                        'key-Escape': () => {
                            modalPlugin.closeWithId(container, modalId);
                            resolve(false);
                        },
                    },
                });
            });
        },
    };
}
