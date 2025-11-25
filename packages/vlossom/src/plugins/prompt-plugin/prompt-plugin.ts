import { defineComponent, h, type Component, ref } from 'vue';
import { OVERLAY_CLOSE, PROMPT_CANCEL, PROMPT_OK } from '@/declaration';
import { useOverlayCallbackStore } from '@/stores';
import { VsInput, VsRender, type VsInputRef } from '@/components';
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
            const inputRef = ref<VsInputRef | null>(null);
            const buttonsClassSwap = swapButtons && 'flex-row-reverse';

            const PromptContent = defineComponent({
                name: 'VsPromptContent',
                setup() {
                    return () => {
                        const input = h(VsInput, {
                            ref: (instance: unknown) => {
                                inputRef.value = instance as VsInputRef | null;
                            },
                            modelValue: inputValue.value,
                            'onUpdate:modelValue': (value: string | number | null) => {
                                inputValue.value = value;
                            },
                            type: inputType,
                            placeholder: inputPlaceholder,
                            rules: inputRules,
                            label: inputLabel,
                            noMessages: false,
                            messages: inputMessages,
                        });

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

                        const buttonsClass = [
                            'flex',
                            'w-full',
                            'items-center',
                            'justify-center',
                            'gap-2',
                            buttonsClassSwap,
                        ];
                        const buttons = h('div', { class: buttonsClass }, [okButton, cancelButton]);

                        const contents = h(VsRender, { content });

                        const inputWrapperClass = [
                            'flex',
                            'h-full',
                            'flex-col',
                            'items-center',
                            'justify-center',
                            'gap-12',
                            'pt-14',
                        ];
                        const inputWithButtons = h('div', { class: inputWrapperClass }, [input, buttons]);

                        const wrapperClass = ['flex', 'h-full', 'flex-col', 'items-center', 'justify-center', 'pt-14'];
                        return h('div', { class: wrapperClass }, [contents, inputWithButtons]);
                    };
                },
            });

            return new Promise((resolve, reject) => {
                const modalId = modalPlugin.open(PromptContent, {
                    ...options,
                    callbacks: {
                        ...options?.callbacks,
                        [PROMPT_OK]: () => {
                            if (inputRef.value?.validate()) {
                                resolve(inputValue.value);
                                modalPlugin.closeWithId(container, modalId);
                                return;
                            }
                            reject(new Error('Input is not valid'));
                        },
                        [PROMPT_CANCEL]: () => {
                            resolve(null);
                            inputRef.value?.clear();
                            modalPlugin.closeWithId(container, modalId);
                        },
                        'key-Enter': () => {
                            if (inputRef.value?.validate()) {
                                resolve(inputValue.value);
                                modalPlugin.closeWithId(container, modalId);
                                return;
                            }
                            reject(new Error('Input is not valid'));
                        },
                        'key-Escape': () => {
                            resolve(null);
                            inputRef.value?.clear();
                            modalPlugin.closeWithId(container, modalId);
                        },
                        [OVERLAY_CLOSE]: () => {
                            inputRef.value?.clear();
                            resolve(null);
                        },
                    },
                });
            });
        },
    };
}
