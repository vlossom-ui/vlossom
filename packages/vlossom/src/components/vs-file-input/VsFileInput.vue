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
            ref="containerRef"
            :class="['vs-file-input', colorSchemeClass, sizeClass, stateBoxClasses, classObj]"
            :style="componentInlineStyle"
            :tabindex="computedDisabled ? -1 : 0"
            @click.stop="onContainerClick"
            @keydown.enter.prevent.stop="openFileDialog"
            @keydown.space.prevent.stop="openFileDialog"
            @focus.stop="onFocus"
            @blur.stop="onBlur"
        >
            <div class="vs-file-input-prepend" :style="componentStyleSet.$prepend">
                <slot name="prepend">
                    <PaperclipIcon class="vs-file-input-icon" :stroke-width="2.5" />
                </slot>
            </div>

            <div class="vs-file-input-content">
                <template v-if="hasValue">
                    <template v-if="collapseChips && inputValue.length > 1">
                        <vs-chip
                            :color-scheme
                            :style-set="componentStyleSet.$chip"
                            :closable="!computedReadonly && !computedDisabled"
                            size="xs"
                            @close="handleFileRemove(inputValue[0])"
                            @click.stop
                        >
                            {{ inputValue[0].name }}
                        </vs-chip>
                        <span class="vs-file-input-collapsed-count">+{{ inputValue.length - 1 }}</span>
                    </template>
                    <template v-else>
                        <vs-chip
                            v-for="(file, i) in inputValue"
                            :key="`${file.name}-${i}`"
                            :color-scheme
                            :style-set="componentStyleSet.$chip"
                            :closable="!computedReadonly && !computedDisabled"
                            size="xs"
                            @close="handleFileRemove(file)"
                            @click.stop
                        >
                            {{ file.name }}
                        </vs-chip>
                    </template>
                </template>
                <span v-else class="vs-file-input-placeholder">{{ placeholder }}</span>
            </div>

            <button
                v-if="!noClear && hasValue && !computedReadonly && !computedDisabled"
                type="button"
                class="vs-file-input-clear"
                :aria-label="optionMessages.VS_ARIA_FILE_INPUT_CLEAR"
                tabindex="-1"
                @click.prevent.stop="clear"
            >
                <XIcon class="vs-file-input-clear-icon" />
            </button>

            <div v-if="$slots['append']" class="vs-file-input-append" :style="componentStyleSet.$append">
                <slot name="append" />
            </div>

            <input
                ref="nativeInputRef"
                :id="computedId"
                type="file"
                class="vs-file-input-native"
                :accept
                :multiple="multiple || directory"
                :webkitdirectory="directory ? '' : undefined"
                :name
                :aria-required="required"
                :disabled="computedDisabled"
                tabindex="-1"
                @change.stop="handleFileChange"
            />
        </div>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, useTemplateRef, type PropType, type Ref, type TemplateRef } from 'vue';
import { VsComponent, type Size } from '@/declaration';
import {
    useColorScheme,
    useFileRules,
    useStyleSet,
    useInput,
    useStateClass,
    useSizeClass,
    useMessages,
} from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps } from '@/props';

import type { FileInputValueType, VsFileInputStyleSet } from './types';

import { PaperclipIcon, XIcon } from '@lucide/vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsChip from '@/components/vs-chip/VsChip.vue';

const componentName = VsComponent.VsFileInput;

export default defineComponent({
    name: componentName,
    components: { VsInputWrapper, VsChip, PaperclipIcon, XIcon },
    props: {
        ...getInputProps<FileInputValueType>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsFileInputStyleSet>(),
        accept: { type: String, default: '' },
        collapseChips: { type: Boolean, default: false },
        directory: { type: Boolean, default: false },
        noClear: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        size: { type: String as PropType<Size>, default: 'md' },

        // v-model
        modelValue: {
            type: Array as PropType<FileInputValueType>,
            default: () => [],
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur', 'clear'],
    setup(props, { emit }) {
        const { optionMessages } = useMessages();
        const {
            colorScheme,
            styleSet,
            accept,
            multiple,
            size,
            required,
            modelValue,
            id,
            disabled,
            readonly,
            messages,
            rules,
            noDefaultRules,
            state,
        } = toRefs(props);

        const inputValue: Ref<FileInputValueType> = ref([]);
        const containerRef: TemplateRef<HTMLDivElement> = useTemplateRef('containerRef');
        const nativeInputRef: TemplateRef<HTMLInputElement> = useTemplateRef('nativeInputRef');

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, componentInlineStyle } = useStyleSet<VsFileInputStyleSet>(componentName, styleSet);

        const { requiredCheck, acceptCheck } = useFileRules(accept, multiple, required);

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
        } = useInput<FileInputValueType>(
            { emit },
            {
                inputValue,
                modelValue,
                id,
                disabled,
                readonly,
                messages,
                rules,
                defaultRules: computed(() => [requiredCheck, acceptCheck]),
                noDefaultRules,
                state,
                callbacks: {
                    onMounted: () => {
                        inputValue.value = modelValue.value ?? [];
                    },
                    onClear: () => {
                        if (nativeInputRef.value) {
                            nativeInputRef.value.value = '';
                        }
                        inputValue.value = [];
                    },
                },
            },
        );

        const { sizeClass } = useSizeClass(size);
        const { stateBoxClasses } = useStateClass(computedState);

        const hasValue = computed(() => inputValue.value.length > 0);

        const classObj = computed(() => ({
            'vs-focus-visible': !computedDisabled.value && !computedReadonly.value,
            'vs-focus-within': !computedDisabled.value && !computedReadonly.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
        }));

        function openFileDialog(): void {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }
            nativeInputRef.value?.click();
        }

        function onContainerClick(): void {
            openFileDialog();
        }

        function handleFileChange(e: Event): void {
            const target = e.target as HTMLInputElement;
            const files = Array.from(target.files ?? []);
            if (files.length === 0) {
                return;
            }
            inputValue.value = files;
            target.value = '';
        }

        function handleFileRemove(file: File): void {
            inputValue.value = inputValue.value.filter((f) => f !== file);
        }

        function focus(): void {
            containerRef.value?.focus();
        }

        function blur(): void {
            containerRef.value?.blur();
        }

        function onFocus(e: FocusEvent): void {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent): void {
            emit('blur', e);
        }

        return {
            // Refs
            containerRef,
            nativeInputRef,

            // Computed
            classObj,
            colorSchemeClass,
            componentStyleSet,
            componentInlineStyle,
            hasValue,
            inputValue,
            computedMessages,
            computedDisabled,
            computedReadonly,
            computedState,
            optionMessages,
            sizeClass,
            shake,
            stateBoxClasses,
            computedId,

            // Methods
            onContainerClick,
            onFocus,
            onBlur,
            handleFileChange,
            handleFileRemove,
            openFileDialog,
            focus,
            blur,
            clear,
            reset,
            validate,
        };
    },
});
</script>

<style lang="css" src="./VsFileInput.css" />
