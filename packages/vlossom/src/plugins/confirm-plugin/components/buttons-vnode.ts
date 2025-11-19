import { h } from 'vue';
import type { OverlayCallbackStore } from '@/stores';
import { CONFIRM_CANCEL, CONFIRM_OK } from '@/declaration';
import { VsButton, type VsConfirmStyleSet } from '@/components';
import type { ConfirmModalOptions } from '../types';

export function confirmButtons(overlayCallback: OverlayCallbackStore, options?: ConfirmModalOptions) {
    const { colorScheme, styleSet, swapButtons, okText, cancelText } = options ?? {};
    const classObj = {
        'flex-row-reverse': swapButtons,
    };
    const overlayId = overlayCallback.getLastOverlayId();

    const okButtonProps = {
        ref: 'okRef',
        primary: true,
        colorScheme,
        styleSet: (styleSet as VsConfirmStyleSet).okButton,
        onClick: (event: Event) => {
            event.preventDefault();
            overlayCallback.run<boolean>(overlayId, CONFIRM_OK);
        },
    };
    const okButton = h(VsButton, okButtonProps, { default: () => okText ?? 'OK' });

    const cancelButtonProps = {
        ref: 'cancelRef',
        colorScheme,
        styleSet: (styleSet as VsConfirmStyleSet).cancelButton,
        onClick: (event: Event) => {
            event.preventDefault();
            overlayCallback.run<boolean>(overlayId, CONFIRM_CANCEL);
        },
    };
    const cancelButton = h(VsButton, cancelButtonProps, { default: () => cancelText ?? 'Cancel' });

    return h(
        'div',
        { class: ['vs-confirm-buttons', 'flex', 'w-full', 'items-center', 'justify-center', 'gap-2', classObj] },
        [okButton, cancelButton],
    );
}
