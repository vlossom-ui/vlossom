import { h, type Component } from 'vue';
import { VsRender, createVsButton } from '@/components';
import { useOverlayCallbackStore } from '@/stores';
import { CONFIRM_CANCEL, CONFIRM_OK, OVERLAY_CLOSE } from '@/declaration';
import type { ModalPlugin } from '../modal-plugin/types';
import type { ConfirmModalOptions, ConfirmPlugin, VsConfirmStyleSet } from './types';

export function createConfirmPlugin(modalPlugin: ModalPlugin): ConfirmPlugin {
    const overlayCallback = useOverlayCallbackStore();

    return {
        open(content: string | Component, options: ConfirmModalOptions = {}): Promise<boolean> {
            const {
                container = 'body',
                colorScheme,
                styleSet,
                okText = 'OK',
                cancelText = 'Cancel',
                swapButtons,
            } = options;

            const classObj = {
                'flex-row-reverse': swapButtons,
            };

            const [okButton, okButtonHandler] = createVsButton({
                props: {
                    primary: true,
                    colorScheme,
                    styleSet: (styleSet as VsConfirmStyleSet)?.okButton,
                },
                content: okText,
                templateRef: 'okRef',
            });
            okButtonHandler.push(() => {
                overlayCallback.run<boolean>(overlayCallback.getLastOverlayId(), CONFIRM_OK);
            });

            const [cancelButton, cancelButtonHandler] = createVsButton({
                props: {
                    colorScheme,
                    styleSet: (styleSet as VsConfirmStyleSet)?.cancelButton,
                },
                content: cancelText,
                templateRef: 'cancelRef',
            });
            cancelButtonHandler.push(() => {
                overlayCallback.run<boolean>(overlayCallback.getLastOverlayId(), CONFIRM_CANCEL);
            });

            const contents = h(VsRender, { content });
            const buttonsClass = 'flex w-full items-center justify-center gap-2';
            const buttons = h('div', { class: [...buttonsClass, classObj] }, [okButton, cancelButton]);
            const confirmClass = 'flex h-full flex-col items-center justify-center gap-12 pt-14';
            const confirm = h('div', { class: [confirmClass] }, [contents, buttons]);

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
