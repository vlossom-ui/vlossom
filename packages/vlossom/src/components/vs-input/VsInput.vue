<template>
    <vs-input-wrapper
        v-show="!hidden"
        v-bind="inputWrapperProps"
        :width="width"
        :grid="grid"
        :disabled="disabled"
        :hidden="hidden"
        :id="id"
        :label="label"
        :noLabel="noLabel"
        :noMessages="noMessages"
        :required="required"
        :small="small"
        :messages="computedMessages"
        :shake="shake"
    >
        <template #label v-if="!noLabel">
            <slot name="label" />
        </template>

        <div :class="['vs-input', colorSchemeClass, classObj, stateClasses]" :style="styleSetVariables">
            <div v-if="$slots['prepend']" class="vs-prepend">
                <slot name="prepend" />
            </div>

            <input
                ref="inputRef"
                :id="computedId"
                :type="type"
                :value="inputValue"
                :autocomplete="autocomplete ? 'on' : 'off'"
                :name="name"
                :disabled="computedDisabled"
                :readonly="computedReadonly"
                :aria-required="required"
                :placeholder="placeholder"
                @input.stop="updateValue"
                @focus.stop="onFocus"
                @blur.stop="onBlur"
                @keyup.enter.stop="onEnter"
                @change.stop
            />

            <button
                v-if="showClearButton"
                type="button"
                class="vs-clear-button"
                :class="{ show: inputValue }"
                :disabled="!inputValue"
                aria-label="Clear"
                tabindex="-1"
                @click.stop="clearWithFocus"
            >
                <i v-html="closeIcon" class="size-4" />
            </button>

            <div v-if="$slots['append']" class="vs-append">
                <slot name="append" />
            </div>
        </div>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, useTemplateRef, type PropType, type TemplateRef } from 'vue';
import { VsComponent, type StringModifiers } from '@/declaration';
import { useColorScheme, useStyleSet, useInput, useStringModifier, useStateClass } from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import { propsUtil } from '@/utils';
import type { InputType, InputValueType, VsInputStyleSet } from './types';
import { useVsInputRules } from './vs-input-rules';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import { closeIcon } from './icons';

const name = VsComponent.VsInput;

export default defineComponent({
    name,
    components: { VsInputWrapper },
    props: {
        ...getInputProps<InputValueType>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsInputStyleSet>(),
        autocomplete: { type: Boolean, default: false },
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
        type: { type: String as PropType<InputType>, default: 'text' },
        // v-model
        modelValue: {
            type: [String, Number] as PropType<InputValueType>,
            default: null,
        },
        modelModifiers: {
            type: Object as PropType<StringModifiers>,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur', 'enter'],
    setup(props, { emit }) {
        const inputRef: TemplateRef<HTMLInputElement> = useTemplateRef('inputRef');

        const { colorSchemeClass } = useColorScheme(
            name,
            computed(() => props.colorScheme),
        );
        const { styleSetVariables } = useStyleSet<VsInputStyleSet>(
            name,
            computed(() => props.styleSet),
        );
        const { modifyStringValue } = useStringModifier(computed(() => props.modelModifiers));

        const isNumberInput = computed(() => props.type === 'number');
        const { requiredCheck, maxCheck, minCheck } = useVsInputRules(
            computed(() => props.required),
            computed(() => props.max),
            computed(() => props.min),
            computed(() => props.type),
        );

        const inputValue = computed(() => props.modelValue);

        function convertValue(v: InputValueType | undefined): InputValueType {
            if (v === undefined || v === null || v === '') {
                return isNumberInput.value ? null : '';
            }

            if (isNumberInput.value) {
                return Number(v);
            }

            return modifyStringValue(v.toString());
        }

        function onClear() {
            emit('update:modelValue', isNumberInput.value ? null : '');
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
        } = useInput(
            { emit },
            {
                inputValue: computed({
                    get: () => props.modelValue,
                    set: (value) => emit('update:modelValue', value),
                }),
                modelValue: computed(() => props.modelValue),
                id: computed(() => props.id),
                disabled: computed(() => props.disabled),
                readonly: computed(() => props.readonly),
                messages: computed(() => props.messages),
                rules: computed(() => props.rules),
                defaultRules: computed(() => [requiredCheck, maxCheck, minCheck]),
                noDefaultRules: computed(() => props.noDefaultRules),
                state: computed(() => props.state),
                callbacks: {
                    onMounted: () => {
                        const convertedValue = convertValue(props.modelValue);
                        if (convertedValue !== props.modelValue) {
                            emit('update:modelValue', convertedValue);
                        }
                    },
                    onChange: () => {
                        const convertedValue = convertValue(props.modelValue);
                        if (convertedValue !== props.modelValue) {
                            emit('update:modelValue', convertedValue);
                        }
                    },
                    onClear,
                },
            },
        );

        // Input wrapper props 계산
        const inputWrapperProps = computed(() => ({
            width: props.width,
            grid: props.grid,
            id: computedId.value,
            label: props.label,
            required: props.required,
            disabled: computedDisabled.value,
            small: props.small,
            noLabel: props.noLabel,
        }));

        const classObj = computed(() => ({
            'vs-small': props.small,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
        }));

        const { stateClasses } = useStateClass(computedState);

        const showClearButton = computed(() => !props.noClear && !computedReadonly.value && !computedDisabled.value);

        function updateValue(event: Event) {
            const target = event.target as HTMLInputElement;
            const value = target.value || '';
            const convertedValue = convertValue(value);
            emit('update:modelValue', convertedValue);
        }

        function focus() {
            inputRef.value?.focus();
        }

        function blur() {
            inputRef.value?.blur();
        }

        function select() {
            inputRef.value?.select();
        }

        function onFocus(e: FocusEvent) {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent) {
            emit('blur', e);
        }

        function onEnter(e: KeyboardEvent) {
            emit('enter', e);
        }

        function clearWithFocus() {
            onClear();
            focus();
        }

        return {
            // Refs
            inputRef,

            // Computed
            inputWrapperProps,
            classObj,
            colorSchemeClass,
            styleSetVariables,
            inputValue,
            computedMessages,
            computedDisabled,
            computedReadonly,
            showClearButton,
            shake,
            stateClasses,
            computedId,

            // Methods
            updateValue,
            focus,
            blur,
            select,
            clear,
            validate,
            onFocus,
            onBlur,
            onEnter,
            clearWithFocus,

            // Icons
            closeIcon,
        };
    },
});
</script>

<style lang="css" src="./VsInput.css" />
