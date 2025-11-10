<template>
    <vs-input-wrapper
        v-show="!hidden"
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
        :small
        :shake
    >
        <template #label v-if="!noLabel && (!!label || !!$slots.label)">
            <slot name="label" />
        </template>

        <div
            :class="['vs-file-drop', colorSchemeClass, classObj, stateClasses]"
            :style="styleSetVariables"
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
                @keydown.enter.stop="openFileDialog"
                @keydown.space.prevent.stop="openFileDialog"
            />

            <div class="vs-file-drop-content">
                <slot :dragging="dragging">
                    <div class="vs-file-drop-placeholder">
                        <i class="placeholder-icon" :class="{ 'size-4': small, 'size-6': !small }">
                            <vs-render :content="attachFileIcon" />
                        </i>
                        <span class="placeholder-text">{{ placeholder }}</span>
                    </div>

                    <div v-if="hasValue" class="vs-file-drop-files">
                        <div
                            v-for="(file, index) in inputValue as File[]"
                            :key="`${file.name}-${index}`"
                            class="vs-file-drop-file"
                        >
                            <vs-chip :id="file.name" :color-scheme :small :style-set="{ width: '100%' }">
                                <span class="vs-file-drop-file-name">{{ file.name }} </span>
                                <span class="vs-file-drop-file-size"> </span>
                            </vs-chip>
                        </div>
                    </div>
                </slot>
            </div>
            <button
                v-if="!noClear && hasValue && !computedReadonly && !computedDisabled"
                type="button"
                class="vs-file-drop-close-button"
                aria-label="Clear"
                tabindex="-1"
                @click.prevent.stop="onClear()"
            >
                <vs-render :content="closeIcon" />
            </button>
        </div>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, useTemplateRef, type PropType, type Ref, type TemplateRef } from 'vue';
import { VsComponent, type Breakpoints, type Message, type UIState } from '@/declaration';
import { useColorScheme, useStyleSet, useInput, useStateClass } from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import type { FileDropValueType, VsFileDropStyleSet } from './types';
import { useVsFileDropRules } from './vs-file-drop-rules';
import { stringUtil, propsUtil } from '@/utils';
import { attachFileIcon } from './icons';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsChip from '@/components/vs-chip/VsChip.vue';
import VsRender from '@/components/vs-render/VsRender.vue';
import { closeIcon } from '@/icons';

const name = VsComponent.VsFileDrop;

export default defineComponent({
    name,
    components: { VsInputWrapper, VsChip, VsRender },
    props: {
        ...getInputProps<FileDropValueType>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsFileDropStyleSet>(),
        accept: { type: String, default: '' },
        height: { type: [String, Number, Object] as PropType<string | number | Breakpoints>, default: 'auto' },
        max: {
            type: [Number, String],
            default: Number.MAX_SAFE_INTEGER,
            validator: (value: number | string) => propsUtil.checkValidNumber(name, 'max', value),
        },
        min: {
            type: [Number, String],
            default: Number.MIN_SAFE_INTEGER,
            validator: (value: number | string) => propsUtil.checkValidNumber(name, 'min', value),
        },
        noClear: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },

        // v-model
        modelValue: {
            type: Array as PropType<FileDropValueType>,
            default: () => [],
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'drop'],
    setup(props, { emit }) {
        const {
            colorScheme,
            small,
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
        } = toRefs(props);

        const inputValue: Ref<FileDropValueType> = ref(modelValue.value ?? []);
        const fileDropRef: TemplateRef<HTMLInputElement | null> = useTemplateRef('inputRef');
        const dragging = ref(false);
        const componentMessages: Ref<Message<FileDropValueType>[]> = ref([]);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const { styleSetVariables } = useStyleSet<VsFileDropStyleSet>(
            name,
            styleSet,
            computed(() => ({ width: width.value, height: height.value })),
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
                    onClear,
                },
            },
        );

        const classObj = computed(() => ({
            'vs-small': small.value,
            'vs-focusable': !computedDisabled.value && !computedReadonly.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
            'vs-dragging': dragging.value,
        }));

        const { stateClasses } = useStateClass(computedState);
        const hasValue = computed(() => inputValue.value.length > 0);

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

        function setFileNumberMessage() {
            if (inputValue.value.length > 1) {
                componentMessages.value.push({ state: 'info' as UIState, text: `${inputValue.value.length} files` });
            }
        }

        function checkFileInputCondition(files: File[]) {
            componentMessages.value = [];

            const multipleFileUploadError = verifyMultipleFileUpload(files);
            const minError = minCheck(files);
            const maxError = maxCheck(files);

            if (multipleFileUploadError) {
                componentMessages.value.push({ state: 'error' as UIState, text: multipleFileUploadError });

                return false;
            }

            if (minError) {
                componentMessages.value.push({ state: 'error' as UIState, text: minError });

                return false;
            }

            if (maxError) {
                componentMessages.value.push({ state: 'error' as UIState, text: maxError });

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
            setFileNumberMessage();
            emit('update:changed', files);
        }

        function handleFileDialog(event: Event) {
            const target = event.target as HTMLInputElement;
            const files = Array.from(target.files || []);

            if (files.length === 0) {
                return;
            }

            setInputValue(files);
        }

        function handleFileDrop(event: DragEvent) {
            const files = Array.from(event.dataTransfer?.files || []);

            emit('drop', files);
            setDragging(false);

            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            setInputValue(files);
        }

        function onClear() {
            if (fileDropRef.value) {
                fileDropRef.value.value = '';
            }

            inputValue.value = [];
        }

        return {
            fileDropRef,
            computedId,
            computedMessages,
            computedDisabled,
            computedReadonly,
            shake,
            colorSchemeClass,
            styleSetVariables,
            classObj,
            stateClasses,
            dragging,
            inputValue,
            hasValue,
            stringUtil,
            attachFileIcon,
            validate,
            clear,
            setDragging,
            openFileDialog,
            handleFileDialog,
            handleFileDrop,
            onClear,
            closeIcon,
        };
    },
});
</script>

<style src="./VsFileDrop.css"></style>
