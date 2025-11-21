import { h, type Component, ref } from 'vue';
import { OVERLAY_CLOSE, PROMPT_CANCEL, PROMPT_OK } from '@/declaration';
import { useOverlayCallbackStore } from '@/stores';
import { VsInput, VsRender } from '@/components';
import type { ModalPlugin } from '../modal-plugin';
import type { PromptModalOptions, PromptPlugin } from './types';
import { vnodeUtils } from '../utils/vnode-utils';

export function createPromptPlugin(modalPlugin: ModalPlugin): PromptPlugin {
    const overlayCallback = useOverlayCallbackStore();

    return {
        open(content: string | Component, options: PromptModalOptions = {}): Promise<string | number | null> {
            const {
                container = 'body',
                colorScheme,
                styleSet,
                inputType = 'text',
                inputPlaceholder = '',
                inputRules = [],
                inputInitialValue = null,
                inputLabel = '',
                inputMessages = [],
                buttonOkText = 'OK',
                buttonCancelText = 'Cancel',
                swapButtons,
            } = options;

            function handleButton(eventName: typeof PROMPT_OK | typeof PROMPT_CANCEL) {
                const overlayId = overlayCallback.getLastOverlayId();
                if (!overlayId) {
                    return;
                }
                overlayCallback.run<string | number | null>(overlayId, eventName);
            }

            const inputValue = ref<string | number | null>(inputInitialValue);
            // had i to use modelValue this way?
            // TODO: could i need to make VsInput Vnode util?
            const input = h(VsInput, {
                modelValue: inputValue.value,
                'onUpdate:modelValue': (value: string | number | null) => {
                    inputValue.value = value;
                },
                props: {
                    type: inputType,
                    placeholder: inputPlaceholder,
                    rules: inputRules,
                    initialValue: inputInitialValue,
                    label: inputLabel,
                    messages: inputMessages,
                },
            });

            const buttonsClassSwap = swapButtons && 'flex-row-reverse';

            const okButton = vnodeUtils.createVsButton({
                props: { colorScheme, styleSet: styleSet?.okButton, primary: true },
                content: buttonOkText,
                onClickEvent: () => handleButton(PROMPT_OK),
            });

            const cancelButton = vnodeUtils.createVsButton({
                props: { colorScheme, styleSet: styleSet?.cancelButton },
                content: buttonCancelText,
                onClickEvent: () => handleButton(PROMPT_CANCEL),
            });

            const buttons = h(
                'div',
                { class: ['flex', 'w-full', 'items-center', 'justify-center', 'gap-2', buttonsClassSwap] },
                [okButton, cancelButton],
            );
            const contents = h(VsRender, { content });

            // TODO: check style classes
            const inputWithButtons = h(
                'div',
                { class: ['flex', 'h-full', 'flex-col', 'items-center', 'justify-center', 'gap-12', 'pt-14'] },
                [input, buttons],
            );

            const prompt = h(
                'div',
                { class: ['flex', 'h-full', 'flex-col', 'items-center', 'justify-center', 'gap-12', 'pt-14'] },
                [contents, inputWithButtons],
            );

            return new Promise((resolve) => {
                const modalId = modalPlugin.open(prompt, {
                    ...options,
                    callbacks: {
                        ...options?.callbacks,
                        [PROMPT_OK]: () => {
                            // TODO: check input value is valid, use rule?
                            resolve(inputValue.value);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        [PROMPT_CANCEL]: () => {
                            resolve(null);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        'key-Enter': () => {
                            resolve(inputValue.value);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        'key-Escape': () => {
                            resolve(null);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        [OVERLAY_CLOSE]: () => {
                            resolve(null);
                        },
                    },
                });
            });
        },
    };
}
