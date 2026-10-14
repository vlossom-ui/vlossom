<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style-set="componentStyleSet.$wrapper"
        :width
        :grid
        :disabled="computedDisabled"
        :hidden
        :id="computedId"
        :label
        :no-label
        :no-messages
        :required
        :messages="computedMessages"
        :shake
    >
        <template #label v-if="!noLabel && (!!label || !!$slots.label)">
            <slot name="label" />
        </template>

        <div :class="['vs-input', colorSchemeClass, classObj, stateBoxClasses]" :style="componentInlineStyle">
            <div v-if="$slots['prepend']" class="vs-prepend" :style="componentStyleSet.$prepend">
                <slot name="prepend" />
            </div>

            <input
                ref="inputRef"
                :style="componentStyleSet.$input"
                :id="computedId"
                :type
                :value="isEmpty ? '' : inputValue"
                :autocomplete="autocomplete ? 'on' : 'off'"
                :name
                :disabled="computedDisabled"
                :readonly="computedReadonly"
                :aria-required="required"
                :placeholder="computedPlaceholder"
                @input.stop="onInput"
                @focus.stop="onFocus"
                @blur.stop="onBlur"
                @change.stop
            />

            <button
                v-if="renderClearButton"
                type="button"
                class="vs-clear-button"
                :aria-label="optionMessages.VS_ARIA_INPUT_CLEAR"
                :class="{ show: !isEmpty }"
                :disabled="isEmpty"
                :tabindex="isEmpty ? -1 : 0"
                @click.stop="clearWithFocus"
            >
                <XIcon class="vs-clear-icon" />
            </button>

            <div v-if="$slots['append']" class="vs-append" :style="componentStyleSet.$append">
                <slot name="append" />
            </div>
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
    toRefs,
    useTemplateRef,
    ref,
    type PropType,
    type Ref,
    type TemplateRef,
    type ComputedRef,
} from 'vue';
import { VsComponent, type Size, type StringModifiers } from '@/declaration';
import {
    useColorScheme,
    useStyleSet,
    useInput,
    useStringModifier,
    useStateClass,
    useSizeClass,
    useMessages,
} from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps, getMinMaxProps } from '@/props';

import type { VsInputType, VsInputValueType, VsInputStyleSet } from './types';
import { useVsInputRules } from './vs-input-rules';

import { XIcon } from '@lucide/vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';

const componentName = VsComponent.VsInput;

export default defineComponent({
    name: componentName,
    components: { VsInputWrapper, XIcon },
    props: {
        ...getInputProps<VsInputValueType>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsInputStyleSet>(),
        ...getMinMaxProps(componentName),
        autocomplete: { type: Boolean, default: false },
        emptyValue: { type: [String, Number] as PropType<VsInputValueType> },
        noClear: { type: Boolean, default: false },
        size: { type: String as PropType<Size>, default: 'md' },
        type: { type: String as PropType<VsInputType>, default: 'text' },
        // v-model
        modelValue: {
            type: [String, Number] as PropType<VsInputValueType>,
            default: null,
        },
        modelModifiers: {
            type: Object as PropType<StringModifiers>,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur', 'clear'],
    // expose: ['focus', 'blur', 'validate', 'clear', 'reset', 'select'],
    setup(props, { emit }) {
        const { optionMessages } = useMessages();
        const {
            colorScheme,
            styleSet,
            type,
            emptyValue,
            modelValue,
            modelModifiers,
            required,
            max,
            min,
            id,
            noClear,
            disabled,
            readonly,
            messages,
            rules,
            noDefaultRules,
            size,
            state,
            placeholder,
            focusPlaceholder,
        } = toRefs(props);

        const inputValue: Ref<VsInputValueType> = ref(modelValue.value);
        const focused: Ref<boolean> = ref(false);

        const inputRef: TemplateRef<HTMLInputElement> = useTemplateRef('inputRef');
        const isNumberInput = computed(() => type.value === 'number');

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsInputStyleSet>(
            componentName,
            styleSet,
        );

        const { modifyStringValue } = useStringModifier(modelModifiers);
        const computedEmptyValue = computed(() => {
            if (emptyValue.value !== undefined) {
                return emptyValue.value;
            }
            return isNumberInput.value ? null : '';
        });

        function isEmptyValue(v: VsInputValueType | undefined) {
            return v === undefined || v === null || v === '' || v === computedEmptyValue.value;
        }

        const isEmpty = computed(() => isEmptyValue(inputValue.value));

        const { requiredCheck, maxCheck, minCheck } = useVsInputRules(required, max, min, type, isEmptyValue);

        const defaultRules = computed(() => {
            const arr = [];
            if (required.value) {
                arr.push(requiredCheck);
            }
            if (Number(max.value) < Number.MAX_SAFE_INTEGER) {
                arr.push(maxCheck);
            }
            if (Number(min.value) > 0) {
                arr.push(minCheck);
            }
            return arr;
        });

        function convertValue(v: VsInputValueType | undefined): VsInputValueType {
            if (isEmptyValue(v)) {
                return computedEmptyValue.value;
            }

            if (isNumberInput.value) {
                return Number(v);
            }

            return modifyStringValue(String(v));
        }

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
                messages,
                rules,
                defaultRules,
                noDefaultRules,
                state,
                callbacks: {
                    onMounted: () => {
                        inputValue.value = convertValue(inputValue.value);
                    },
                    onChange: () => {
                        inputValue.value = convertValue(inputValue.value);
                    },
                    onClear: () => {
                        inputValue.value = computedEmptyValue.value;
                    },
                },
            },
        );

        const { sizeClass } = useSizeClass(size);

        const classObj = computed(() => ({
            'vs-focus-visible': !computedDisabled.value && !computedReadonly.value,
            'vs-focus-within': !computedDisabled.value && !computedReadonly.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
            [sizeClass.value]: !!sizeClass.value,
        }));

        const { stateBoxClasses } = useStateClass(computedState);

        const renderClearButton = computed(
            () => !isEmpty.value && !noClear.value && !computedReadonly.value && !computedDisabled.value,
        );

        const computedPlaceholder: ComputedRef<string> = computed(() => {
            if (focused.value && focusPlaceholder.value) {
                return focusPlaceholder.value;
            }
            return placeholder.value || '';
        });

        function onInput(event: Event) {
            const target = event.target as HTMLInputElement;
            const value = target.value || '';
            inputValue.value = convertValue(value);
        }

        function focus() {
            inputRef.value?.focus();
        }

        function blur() {
            inputRef.value?.blur();
        }

        function onFocus(e: FocusEvent) {
            emit('focus', e);
            focused.value = true;
        }

        function onBlur(e: FocusEvent) {
            emit('blur', e);
            focused.value = false;
        }

        function select() {
            inputRef.value?.select();
        }

        function clearWithFocus() {
            clear();
            focus();
        }

        return {
            // Refs
            inputRef,

            // Computed
            classObj,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,
            inputValue,
            isEmpty,
            computedMessages,
            computedDisabled,
            computedReadonly,
            computedPlaceholder,
            optionMessages,
            renderClearButton,
            shake,
            stateBoxClasses,
            computedId,

            // Methods
            onInput,
            focus,
            blur,
            select,
            clear,
            reset,
            onFocus,
            onBlur,
            validate,
            clearWithFocus,
        };
    },
});
</script>

<style lang="css" src="./VsInput.css" />
