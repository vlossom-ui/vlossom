import { h } from 'vue';
import type { OverlayCallbackStore } from '@/stores';
import { CONFIRM_CANCEL, CONFIRM_OK } from '@/declaration';
import { VsButton, type VsConfirmStyleSet } from '@/components';
import type { ConfirmModalOptions } from '../types';

const createButtons = (overlayCallback: OverlayCallbackStore, options?: ConfirmModalOptions) =>
    h(
        'div',
        {
            class: [
                'flex',
                'w-full',
                'items-center',
                'justify-center',
                'gap-2',
                { 'flex-row-reverse': options?.swapButtons },
            ],
        },
        [
            h(
                VsButton,
                {
                    ref: 'okRef',
                    primary: true,
                    colorScheme: options?.colorScheme,
                    styleSet: (options?.styleSet as VsConfirmStyleSet)?.okButton,
                    onClick: (event: Event) => {
                        event.preventDefault();
                        overlayCallback.run<boolean>(overlayCallback.getLastOverlayId(), CONFIRM_OK);
                    },
                },
                { default: () => options?.okText ?? 'OK' },
            ),
            h(
                VsButton,
                {
                    ref: 'cancelRef',
                    colorScheme: options?.colorScheme,
                    styleSet: (options?.styleSet as VsConfirmStyleSet)?.cancelButton,
                    onClick: (event: Event) => {
                        event.preventDefault();
                        overlayCallback.run<boolean>(overlayCallback.getLastOverlayId(), CONFIRM_CANCEL);
                    },
                },
                { default: () => options?.cancelText ?? 'Cancel' },
            ),
        ],
    );

export default createButtons;
