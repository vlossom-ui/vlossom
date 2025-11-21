import { h, type Component } from 'vue';
import { VsRender } from '@/components';
import { useOverlayCallbackStore } from '@/stores';
import { CONFIRM_CANCEL, CONFIRM_OK, OVERLAY_CLOSE } from '@/declaration';
import { stringUtil } from '@/utils';
import type { ModalPlugin } from '@/plugins';

import type { ConfirmModalOptions, ConfirmPlugin } from './types';
import { createVsButton } from '../utils/vnode/create-vs-button-vnode/create-vs-button-vnode';

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
                props: { colorScheme, styleSet: styleSet?.okButton, primary: true },
                content: okText,
                templateRef: 'okRef',
            });
            okButtonHandler.push(() => {
                overlayCallback.run<boolean>(overlayCallback.getLastOverlayId(), CONFIRM_OK);
            });

            const [cancelButton, cancelButtonHandler] = createVsButton({
                props: { colorScheme, styleSet: styleSet?.cancelButton },
                content: cancelText,
                templateRef: 'cancelRef',
            });
            cancelButtonHandler.push(() => {
                overlayCallback.run<boolean>(overlayCallback.getLastOverlayId(), CONFIRM_CANCEL);
            });

            const buttonsClass = [
                'w-full',
                'items-center',
                styleSet?.buttonsGap ? `gap-[${stringUtil.toStringSize(styleSet?.buttonsGap)}]` : 'gap-2',
                styleSet?.buttonsAlign ? `justify-${styleSet?.buttonsAlign}` : 'justify-center',
            ];
            const contentClass = ['flex', 'h-full', 'flex-col', 'items-center', 'justify-center', 'gap-12', 'pt-14'];

            const contents = h(VsRender, { content });
            const buttons = h('div', { class: [...buttonsClass, classObj] }, [okButton, cancelButton]);
            const confirm = h('div', { class: [...contentClass] }, [contents, buttons]);

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
