<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style-set="componentStyleSet.wrapper"
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
            :class="['vs-file-drop', colorSchemeClass, classObj, stateClasses]"
            :style="{ ...styleSetVariables, ...componentStyleSet.component }"
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
                @focus.stop="onFocus"
                @blur.stop="onBlur"
                @keydown.enter.stop="openFileDialog"
                @keydown.space.prevent.stop="openFileDialog"
            />

            <div class="vs-file-drop-content">
                <slot :dragging="dragging">
                    <div class="vs-file-drop-placeholder" :style="componentStyleSet.placeholder">
                        <i class="placeholder-icon size-6">
                            <vs-render :content="attachFileIcon" />
                        </i>
                        <span class="placeholder-text">{{ placeholder }}</span>
                    </div>

                    <div v-if="hasValue" class="vs-file-drop-files" :style="componentStyleSet.files">
                        <div
                            v-for="(file, index) in inputValue as File[]"
                            :key="`${file.name}-${index}`"
                            class="vs-file-drop-file"
                        >
                            <vs-chip
                                :id="`${file.name}-${index}`"
                                :color-scheme
                                :closable="!computedReadonly && !computedDisabled"
                                :style-set="componentStyleSet.chip"
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
                :style="componentStyleSet.closeButton"
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
import { VsComponent, type Breakpoints, type StateMessage } from '@/declaration';
import { useColorScheme, useStyleSet, useInput, useStateClass } from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps, getMinMaxProps } from '@/props';
import { stringUtil, objectUtil } from '@/utils';
import { closeIcon } from '@/icons';
import { attachFileIcon } from './icons';

import type { FileDropValueType, VsFileDropStyleSet } from './types';
import { useVsFileDropRules } from './vs-file-drop-rules';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsChip from '@/components/vs-chip/VsChip.vue';
import VsRender from '@/components/vs-render/VsRender.vue';

const componentName = VsComponent.VsFileDrop;
export default defineComponent({
    name: componentName,
    components: { VsInputWrapper, VsChip, VsRender },
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
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'drop', 'focus', 'blur'],
    // expose: ['focus', 'blur', 'validate', 'clear'],
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
        } = toRefs(props);

        const inputValue: Ref<FileDropValueType> = ref([]);
        const fileDropRef: TemplateRef<HTMLInputElement> = useTemplateRef('fileDropRef');
        const dragging = ref(false);
        const componentMessages: Ref<StateMessage[]> = ref([]);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: Ref<VsFileDropStyleSet> = ref({
            chip: {
                component: {
                    width: '100%',
                },
            },
        });

        const additionalStyleSet = computed<Partial<VsFileDropStyleSet>>(() => {
            return objectUtil.shake({
                component: objectUtil.shake({
                    width: width.value,
                    height: height.value,
                }),
            });
        });

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsFileDropStyleSet>(
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
            'vs-focus-visible': !computedDisabled.value && !computedReadonly.value,
            'vs-focus-within': !computedDisabled.value && !computedReadonly.value,
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

        function onClear() {
            if (fileDropRef.value) {
                fileDropRef.value.value = '';
            }

            inputValue.value = [];
            componentMessages.value = [];
        }

        function onFocus(e: FocusEvent) {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent) {
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
            shake,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            classObj,
            stateClasses,
            dragging,
            inputValue,
            hasValue,
            stringUtil,
            attachFileIcon,

            // Methods
            setDragging,
            openFileDialog,
            handleFileDialog,
            handleFileDrop,
            handleFileRemove,
            onClear,
            onFocus,
            onBlur,
            focus,
            blur,
            validate,
            clear,

            // Icons
            closeIcon,
        };
    },
});
</script>

<style src="./VsFileDrop.css"></style>
