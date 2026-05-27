import { h, ref, type Component, type Ref } from 'vue';
import { VsRender } from '@/components';
import { useStyleSet } from '@/composables';
import { useOverlayCallbackStore } from '@/stores';
import { CONFIRM_CANCEL, CONFIRM_OK, OVERLAY_CLOSE, VsComponent } from '@/declaration';
import type { ModalPlugin } from '@/plugins';

import { vnodeUtils } from './../utils/vnode-utils';
import type { ConfirmModalOptions, ConfirmPlugin, VsConfirmStyleSet } from './types';

export function createConfirmPlugin(modalPlugin: ModalPlugin): ConfirmPlugin {
    const overlayCallback = useOverlayCallbackStore();

    function handleButton(eventName: typeof CONFIRM_OK | typeof CONFIRM_CANCEL) {
        const overlayId = overlayCallback.getLastOverlayId();
        if (!overlayId) {
            return;
        }
        overlayCallback.run<boolean>(overlayId, eventName);
    }

    return {
        open(content: string | Component, options: ConfirmModalOptions = {}): Promise<boolean> {
            const { componentProps, ...modalOptions } = options;
            const {
                container = 'body',
                colorScheme,
                styleSet,
                okText = 'OK',
                cancelText = 'Cancel',
                swapButtons,
            } = modalOptions;

            const baseStyleSet: Ref<Partial<VsConfirmStyleSet>> = ref({
                $okButton: { minWidth: '8rem' },
                $cancelButton: { minWidth: '8rem' },
            });
            const { componentStyleSet } = useStyleSet<VsConfirmStyleSet>(
                VsComponent.VsConfirm,
                ref(styleSet),
                baseStyleSet,
            );

            const okButton = vnodeUtils.createVsButton({
                props: { colorScheme, styleSet: componentStyleSet.value.$okButton, primary: true },
                content: okText,
                onClickEvent: () => handleButton(CONFIRM_OK),
            });

            const cancelButton = vnodeUtils.createVsButton({
                props: { colorScheme, styleSet: componentStyleSet.value.$cancelButton },
                content: cancelText,
                onClickEvent: () => handleButton(CONFIRM_CANCEL),
            });

            const buttonsClass = ['flex', 'w-full', 'items-center', 'justify-center', 'gap-2'];
            const contentClass = ['flex', 'h-full', 'flex-col', 'items-center', 'justify-center', 'gap-12', 'pt-6'];

            const contents = h(VsRender, { content, componentProps });
            const buttons = h(
                'div',
                {
                    class: [...buttonsClass, swapButtons && 'flex-row-reverse'],
                    style: componentStyleSet.value.$buttons,
                },
                [okButton, cancelButton],
            );
            const confirm = h('div', { class: contentClass }, [contents, buttons]);

            return new Promise((resolve) => {
                const modalId = modalPlugin.open(confirm, {
                    ...modalOptions,
                    callbacks: {
                        ...modalOptions.callbacks,
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
                    size: 'xs',
                });
            });
        },
    };
}
