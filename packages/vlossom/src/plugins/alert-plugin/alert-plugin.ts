import { h, ref, type Component, type Ref } from 'vue';
import { ALERT_OK, OVERLAY_CLOSE } from '@/declaration';
import { useOverlayCallbackStore } from '@/stores';
import { useStyleSet } from '@/composables';
import { VsRender } from '@/components';
import { vnodeUtils } from './../utils/vnode-utils';
import type { ModalPlugin } from './../modal-plugin';
import type { AlertModalOptions, AlertPlugin, VsAlertStyleSet } from './types';

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
            const { componentProps, ...modalOptions } = options;
            const { container = 'body', colorScheme, styleSet, okText = 'OK' } = modalOptions;

            const baseStyleSet: Ref<Partial<VsAlertStyleSet>> = ref({
                $okButton: { minWidth: '8rem' },
            });
            const { componentStyleSet } = useStyleSet<VsAlertStyleSet>('VsAlert', ref(styleSet), baseStyleSet);

            const buttonsClass = ['flex', 'w-full', 'items-center', 'justify-center', 'gap-2'];
            const contentClass = ['flex', 'h-full', 'flex-col', 'items-center', 'justify-center', 'gap-12', 'pt-6'];

            const okButton = vnodeUtils.createVsButton({
                props: { colorScheme, styleSet: componentStyleSet.value.$okButton },
                content: okText,
                onClickEvent: handleOk,
            });

            const contents = h(VsRender, { content, componentProps });
            const buttons = h('div', { class: buttonsClass, style: componentStyleSet.value.$buttons }, [okButton]);
            const alert = h('div', { class: contentClass }, [contents, buttons]);

            return new Promise((resolve) => {
                const modalId = modalPlugin.open(alert, {
                    ...modalOptions,
                    callbacks: {
                        ...modalOptions.callbacks,
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
