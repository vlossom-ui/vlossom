import { h, type Component, type VNode } from 'vue';
import { VsRender, createVsButton } from '@/components';
import { useOverlayCallbackStore } from '@/stores';
import { CONFIRM_CANCEL, CONFIRM_OK } from '@/declaration';
import type { VsConfirmStyleSet } from '../types';

export interface CreateConfirmVNodeOptions {
    content: string | Component;
    colorScheme?: string;
    styleSet?: VsConfirmStyleSet;
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

export function createConfirmVNode(options: CreateConfirmVNodeOptions): VNode {
    const {
        content,
        colorScheme,
        styleSet,
        okText = 'OK',
        cancelText = 'Cancel',
        swapButtons,
    } = options;

    const overlayCallback = useOverlayCallbackStore();

    const classObj = {
        'flex-row-reverse': swapButtons,
    };

    const [okButton, okButtonHandler] = createVsButton({
        props: {
            primary: true,
            colorScheme,
            styleSet: styleSet?.okButton,
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
            styleSet: styleSet?.cancelButton,
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

    return confirm;
}
