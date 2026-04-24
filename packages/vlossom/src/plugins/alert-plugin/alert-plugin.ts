import { h, type Component } from 'vue';
import { ALERT_OK, OVERLAY_CLOSE } from '@/declaration';
import { useOverlayCallbackStore } from '@/stores';
import { VsRender } from '@/components';
import { vnodeUtils } from './../utils/vnode-utils';
import type { ModalPlugin } from './../modal-plugin';
import type { AlertModalOptions, AlertPlugin } from './types';

export function createAlertPlugin(modalPlugin: ModalPlugin): AlertPlugin {
    const overlayCallback = useOverlayCallbackStore();

    function handleOk() {
        const overlayId = overlayCallback.getLastOverlayId();
        if (!overlayId) {
            return;
        }
        overlayCallback.run<void>(overlayId, ALERT_OK);
    }

    return {
        open(content: string | Component, options: AlertModalOptions = {}): Promise<void> {
            const { container = 'body', colorScheme, styleSet, okText = 'OK' } = options;

            const buttonsClass = ['flex', 'w-full', 'items-center', 'justify-center', 'gap-2'];
            const contentClass = ['flex', 'h-full', 'flex-col', 'items-center', 'justify-center', 'gap-12', 'pt-6'];
            const additionalButtonsClass = [styleSet?.buttonsAlign && `justify-[${styleSet.buttonsAlign}]`].filter(
                Boolean,
            );

            const okButton = vnodeUtils.createVsButton({
                props: { colorScheme, styleSet: styleSet?.button },
                content: okText,
                onClickEvent: handleOk,
            });

            const contents = h(VsRender, { content });
            const buttons = h('div', { class: [...buttonsClass, additionalButtonsClass] }, [okButton]);
            const alert = h('div', { class: [...contentClass] }, [contents, buttons]);

            return new Promise((resolve) => {
                const modalId = modalPlugin.open(alert, {
                    ...options,
                    callbacks: {
                        ...options?.callbacks,
                        [ALERT_OK]: () => {
                            resolve();
                            modalPlugin.closeWithId(container, modalId);
                        },
                        'key-Enter': () => {
                            resolve();
                            modalPlugin.closeWithId(container, modalId);
                        },
                        'key-Escape': () => {
                            resolve();
                            modalPlugin.closeWithId(container, modalId);
                        },
                        [OVERLAY_CLOSE]: () => {
                            resolve();
                        },
                    },
                    size: 'xs',
                });
            });
        },
    };
}
