import { h, type Component } from 'vue';
import { VsRender, createVsButton, type VsConfirmStyleSet } from '@/components';
import { useOverlayCallbackStore } from '@/stores';
import { CONFIRM_CANCEL, CONFIRM_OK, OVERLAY_CLOSE } from '@/declaration';
import type { ModalPlugin } from '../modal-plugin/types';
import type { ConfirmModalOptions, ConfirmPlugin } from './types';

export function createConfirmPlugin(modalPlugin: ModalPlugin): ConfirmPlugin {
    const overlayCallback = useOverlayCallbackStore();

    return {
        open(content: string | Component, options: ConfirmModalOptions = {}): Promise<boolean> {
            const { container = 'body', colorScheme, styleSet, okText, cancelText, swapButtons } = options;
            const classObj = {
                'flex-row-reverse': swapButtons,
            };
            const overlayId = overlayCallback.getLastOverlayId();

            const [okButton, okButtonHandler] = createVsButton({
                props: {
                    primary: true,
                    colorScheme,
                    styleSet: (styleSet as VsConfirmStyleSet)?.okButton,
                },
                content: okText ?? 'OK',
                templateRef: 'okRef',
            });
            okButtonHandler.push(() => {
                overlayCallback.run<boolean>(overlayId, CONFIRM_OK);
            });

            const [cancelButton, cancelButtonHandler] = createVsButton({
                props: {
                    colorScheme,
                    styleSet: (styleSet as VsConfirmStyleSet)?.cancelButton,
                },
                content: cancelText ?? 'Cancel',
                templateRef: 'cancelRef',
            });
            cancelButtonHandler.push(() => {
                overlayCallback.run<boolean>(overlayId, CONFIRM_CANCEL);
            });

            const contents = h(VsRender, { content });
            const buttons = h('div', { class: 'vs-confirm-buttons', classObj }, [okButton, cancelButton]);
            const confirm = h('div', { class: 'vs-confirm' }, [contents, buttons]);

            return new Promise((resolve) => {
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
