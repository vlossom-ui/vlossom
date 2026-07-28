<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style-set="componentStyleSet.$wrapper"
        :id="computedId"
        :disabled="computedDisabled"
        :messages="computedMessages"
        :width
        :grid
        :hidden
        :label
        :no-label
        :no-messages
        :required
        :shake
    >
        <template #label v-if="!noLabel && (!!label || !!$slots.label)">
            <slot name="label" />
        </template>

        <div
            :class="['vs-file-drop', colorSchemeClass, classObj, stateBoxClasses]"
            :style="{ ...styleSetVariables, ...componentInlineStyle }"
            @drop.prevent.stop="handleFileDrop"
            @dragenter.prevent.stop="setDragging(true)"
            @dragover.prevent.stop="setDragging(true)"
            @dragleave.prevent.stop="setDragging(false)"
        >
            <input
                ref="fileDropRef"
                type="file"
                class="vs-file-drop-ref"
                :id="computedId"
                :disabled="computedDisabled"
                :readonly="computedReadonly"
                :aria-required="required"
                :name
                :accept
                :multiple
                @change.stop="handleFileDialog"
                @click.stop="onClick"
                @focus.stop="onFocus"
                @blur.stop="onBlur"
                @keydown.enter.stop="openFileDialog"
                @keydown.space.prevent.stop="openFileDialog"
            />

            <div class="vs-file-drop-content">
                <slot :dragging="dragging">
                    <div class="vs-file-drop-placeholder" :style="componentStyleSet.$placeholder">
                        <PaperclipIcon class="placeholder-icon" :stroke-width="2.5" />
                        <span class="placeholder-text">{{ computedPlaceholder }}</span>
                    </div>

                    <div v-if="hasValue" class="vs-file-drop-files" :style="componentStyleSet.$files">
                        <vs-chip
                            v-for="(file, index) in inputValue as File[]"
                            :key="`${file.name}-${index}`"
                            class="vs-file-drop-file"
                            :id="`${file.name}-${index}`"
                            :color-scheme
                            :closable="!computedReadonly && !computedDisabled"
                            :style-set="componentStyleSet.$chip"
                            @close="handleFileRemove(file)"
                        >
                            <div class="vs-file-drop-file-wrapper">
                                <span class="vs-file-drop-file-name">{{ file.name }} </span>
                                <span class="vs-file-drop-file-size">
                                    {{ `(${stringUtil.toFileSizeFormat(file.size)})` }}
                                </span>
                            </div>
                        </vs-chip>
                    </div>
                    <span v-if="inputValue.length > 1" class="vs-file-drop-file-count">
                        {{ inputValue.length }} files selected
                    </span>
                </slot>
            </div>
            <button
                v-if="!noClear && hasValue && !computedReadonly && !computedDisabled"
                type="button"
                class="vs-file-drop-close-button"
                :style="componentStyleSet.$closeButton"
                aria-label="Clear"
                tabindex="-1"
                @click.prevent.stop="clear"
            >
                <XIcon class="vs-file-drop-close-icon" />
            </button>
        </div>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    ref,
    toRefs,
    useTemplateRef,
    type ComputedRef,
    type PropType,
    type Ref,
    type TemplateRef,
} from 'vue';
import { VsComponent, type Breakpoints, type StateMessage } from '@/declaration';
import { useColorScheme, useStyleSet, useInput, useStateClass } from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps, getMinMaxProps } from '@/props';
import { stringUtil, objectUtil } from '@/utils';

import type { FileDropValueType, VsFileDropStyleSet } from './types';
import { useVsFileDropRules } from './vs-file-drop-rules';

import { PaperclipIcon, XIcon } from '@lucide/vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsChip from '@/components/vs-chip/VsChip.vue';

const componentName = VsComponent.VsFileDrop;
export default defineComponent({
    name: componentName,
    components: { VsInputWrapper, VsChip, PaperclipIcon, XIcon },
    props: {
        ...getInputProps<FileDropValueType>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsFileDropStyleSet>(),
        ...getMinMaxProps(componentName),
        accept: { type: String, default: '' },
        height: { type: [String, Number, Object] as PropType<string | number | Breakpoints>, default: 'auto' },
        noClear: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },

        // v-model
        modelValue: {
            type: Array as PropType<FileDropValueType>,
            default: () => [],
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'drop', 'focus', 'blur', 'clear'],
    // expose: ['focus', 'blur', 'validate', 'clear', 'reset'],
    setup(props, { emit }) {
        const {
            colorScheme,
            styleSet,
            required,
            accept,
            modelValue,
            id,
            disabled,
            readonly,
            messages,
            multiple,
            rules,
            state,
            max,
            min,
            width,
            height,
            placeholder,
            focusPlaceholder,
        } = toRefs(props);

        const inputValue: Ref<FileDropValueType> = ref([]);
        const fileDropRef: TemplateRef<HTMLInputElement> = useTemplateRef('fileDropRef');
        const dragging: Ref<boolean> = ref(false);
        const isDialogOpen: Ref<boolean> = ref(false);
        const componentMessages: Ref<StateMessage[]> = ref([]);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: Ref<VsFileDropStyleSet> = ref({
            $chip: {
                width: '100%',
            },
        });

        const additionalStyleSet = computed<Partial<VsFileDropStyleSet>>(() => {
            return objectUtil.shake({
                width: width.value,
                height: height.value,
            });
        });

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsFileDropStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        const { requiredCheck, maxCheck, minCheck, acceptCheck, verifyMultipleFileUpload } = useVsFileDropRules(
            required,
            max,
            min,
            accept,
            multiple,
        );

        const {
            computedId,
            computedMessages,
            computedState,
            computedDisabled,
            computedReadonly,
            shake,
            validate,
            clear,
            reset,
        } = useInput(
            { emit },
            {
                inputValue,
                modelValue,
                id,
                disabled,
                readonly,
                messages: computed(() => [...messages.value, ...componentMessages.value]),
                rules,
                defaultRules: computed(() => [requiredCheck, acceptCheck]),
                state,
                callbacks: {
                    onMounted: () => {
                        inputValue.value = modelValue.value ?? [];
                    },
                    onClear: () => {
                        if (fileDropRef.value) {
                            fileDropRef.value.value = '';
                        }

                        inputValue.value = [];
                        componentMessages.value = [];
                    },
                },
            },
        );

        const classObj = computed(() => ({
            'vs-focus-visible': !computedDisabled.value && !computedReadonly.value,
            'vs-focus-within': !computedDisabled.value && !computedReadonly.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
            'vs-dragging': dragging.value,
        }));

        const { stateBoxClasses } = useStateClass(computedState);
        const hasValue = computed(() => inputValue.value.length > 0);
        const computedPlaceholder: ComputedRef<string> = computed(() => {
            if (!focusPlaceholder.value) {
                return placeholder.value || '';
            }
            if (isDialogOpen.value) {
                return focusPlaceholder.value;
            }
            if (dragging.value) {
                return focusPlaceholder.value;
            }
            return placeholder.value || '';
        });

        function setDragging(value: boolean) {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            if (dragging.value === value) {
                return;
            }

            dragging.value = value;
        }

        function openFileDialog() {
            if (computedReadonly.value || computedDisabled.value) {
                return;
            }

            fileDropRef.value?.click();
        }

        function checkFileInputCondition(files: File[]) {
            componentMessages.value = [];

            const multipleFileUploadError = verifyMultipleFileUpload(files);
            if (multipleFileUploadError) {
                componentMessages.value.push({ state: 'error', text: multipleFileUploadError });

                return false;
            }

            const minError = minCheck(files);
            if (minError) {
                componentMessages.value.push({ state: 'error', text: minError });

                return false;
            }

            const maxError = maxCheck(files);
            if (maxError) {
                componentMessages.value.push({ state: 'error', text: maxError });

                return false;
            }

            return true;
        }

        function setInputValue(files: File[]) {
            if (!files || files.length === 0) {
                return;
            }

            if (!checkFileInputCondition(files)) {
                return;
            }

            inputValue.value = files;
            emit('update:changed', files);
        }

        function handleFileDialog(event: Event) {
            const target = event.target as HTMLInputElement;
            const files = Array.from(target.files || []);

            if (files.length === 0) {
                return;
            }

            setInputValue(files);

            target.value = '';
        }

        function handleFileDrop(event: DragEvent) {
            const files = Array.from(event.dataTransfer?.files || []);

            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            emit('drop', files);
            setDragging(false);
            setInputValue(files);
        }

        function handleFileRemove(target: File): void {
            if (!target) {
                return;
            }

            const files = inputValue.value;
            const filteredFiles = files.filter((file) => file !== target);

            const minError = minCheck(filteredFiles);
            if (minError) {
                componentMessages.value = [];
                componentMessages.value.push({ state: 'error', text: minError });
            }

            inputValue.value = filteredFiles;
        }

        function onClick(): void {
            isDialogOpen.value = true;
        }

        function onFocus(e: FocusEvent): void {
            /**
             * OS 파일 선택 다이얼로그가 닫히는 시점을 focus 이벤트로 감지한다.
             *
             * 'file' 타입 <input/> 은 포커스 동작이 독특하다.
             * 1. 다이얼로그를 열려고 <input/> 을 클릭(터치)하면,
             *    브라우저는 <input/> 을 focus 했다가 곧바로 blur 한다 (즉, 다이얼로그가 떠 있는 동안 <input/> 은 blur 상태다.)
             * 2. 다이얼로그를 닫으면, 브라우저는 blur 돼 있던 <input/> 을 다시 focus 한다.
             *
             * 따라서 isDialogOpen 이 true 인데 focus 가 들어왔다면,
             * 다이얼로그가 방금 닫혔다는 뜻이므로 상태를 false 로 되돌린다.
             */
            if (isDialogOpen.value) {
                isDialogOpen.value = false;
            }
            emit('focus', e);
        }

        function onBlur(e: FocusEvent): void {
            emit('blur', e);
        }

        function focus() {
            fileDropRef.value?.focus();
        }

        function blur() {
            fileDropRef.value?.blur();
        }

        return {
            // Refs
            fileDropRef,

            // Computed
            computedId,
            computedMessages,
            computedDisabled,
            computedReadonly,
            computedPlaceholder,
            shake,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,
            classObj,
            stateBoxClasses,
            dragging,
            inputValue,
            hasValue,
            stringUtil,

            // Methods
            setDragging,
            openFileDialog,
            handleFileDialog,
            handleFileDrop,
            handleFileRemove,
            onClick,
            onFocus,
            onBlur,
            focus,
            blur,
            validate,
            clear,
            reset,
        };
    },
});
</script>

<style src="./VsFileDrop.css"></style>
