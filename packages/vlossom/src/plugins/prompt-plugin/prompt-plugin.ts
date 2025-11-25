import { h, type Component, ref } from 'vue';
import { OVERLAY_CLOSE, PROMPT_CANCEL, PROMPT_OK } from '@/declaration';
import { stringUtil } from '@/utils';
import { useOverlayCallbackStore } from '@/stores';
import { VsInput, VsRender, type VsInputRef, type VsInputValueType } from '@/components';
import type { ModalPlugin } from '../modal-plugin';
import type { PromptModalOptions, PromptPlugin } from './types';
import { vnodeUtils } from '../utils/vnode-utils';

export function createPromptPlugin(modalPlugin: ModalPlugin): PromptPlugin {
    const overlayCallback = useOverlayCallbackStore();

    function handleButton(eventName: typeof PROMPT_OK | typeof PROMPT_CANCEL) {
        const overlayId = overlayCallback.getLastOverlayId();
        if (!overlayId) {
            return;
        }
        overlayCallback.run<VsInputValueType>(overlayId, eventName);
    }

    return {
        open(content: string | Component, options: PromptModalOptions = {}): Promise<string | number | null> {
            const {
                container = 'body',
                colorScheme,
                styleSet,
                okText = 'OK',
                cancelText = 'Cancel',
                swapButtons,
                input: inputOptions,
            } = options;

            const inputRef = ref<VsInputRef | null>(null);
            const inputValue = ref<VsInputValueType>(inputOptions?.initialValue ?? null);

            const buttonsClass = ['flex', 'w-full', 'items-center', 'justify-center', 'gap-2'];
            const interactsClass = ['flex', 'h-full', 'flex-col', 'items-center', 'justify-center', 'pt-8', 'gap-8'];
            const wrapperClass = ['flex', 'h-full', 'flex-col', 'items-center', 'justify-center'];

            const additionalButtonsClass = [
                swapButtons && 'flex-row-reverse',
                styleSet?.buttonsGap && `gap-[${stringUtil.toStringSize(styleSet.buttonsGap)}]`,
                styleSet?.buttonsAlign && `justify-[${styleSet.buttonsAlign}]`,
            ].filter(Boolean);

            const okButton = vnodeUtils.createVsButton({
                props: { colorScheme, styleSet: styleSet?.okButton, primary: true },
                content: okText,
                onClickEvent: () => handleButton(PROMPT_OK),
            });
            const cancelButton = vnodeUtils.createVsButton({
                props: { colorScheme, styleSet: styleSet?.cancelButton },
                content: cancelText,
                onClickEvent: () => handleButton(PROMPT_CANCEL),
            });
            const buttons = h('div', { class: [...buttonsClass, additionalButtonsClass] }, [okButton, cancelButton]);
            const contents = h(VsRender, { content });

            // NOTE. 함수형 VNode를 사용하여 컴포넌트 인스턴스(`inputRef`)를 가져올 수 있도록 하기 위함
            const prompt = () => {
                const input = h(VsInput, {
                    ...inputOptions,
                    colorScheme,
                    styleSet: styleSet?.input,

                    ref: inputRef,
                    modelValue: inputValue.value,
                    'onUpdate:modelValue': (value: VsInputValueType) => {
                        inputValue.value = value;
                    },
                });

                const interactions = h('div', { class: interactsClass }, [input, buttons]);
                return h('div', { class: wrapperClass }, [contents, interactions]);
            };

            return new Promise((resolve) => {
                const modalId = modalPlugin.open(prompt, {
                    ...options,
                    callbacks: {
                        ...options?.callbacks,
                        [PROMPT_OK]: () => {
                            if (!inputRef.value?.validate()) {
                                return;
                            }
                            resolve(inputValue.value);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        [PROMPT_CANCEL]: () => {
                            inputRef.value?.clear();
                            resolve(null);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        'key-Enter': () => {
                            if (!inputRef.value?.validate()) {
                                return;
                            }
                            resolve(inputValue.value);
                            modalPlugin.closeWithId(container, modalId);
                        },
                        'key-Escape': () => {
                            inputRef.value?.clear();
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
