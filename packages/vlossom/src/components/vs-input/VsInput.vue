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
                :value="inputValue"
                :min="forwardMinAttr"
                :max="forwardMaxAttr"
                :step
                :autocomplete="autocomplete ? 'on' : 'off'"
                :name
                :disabled="computedDisabled"
                :readonly="computedReadonly"
                :aria-required="required"
                :placeholder
                @input.stop="onInput"
                @focus.stop="onFocus"
                @blur.stop="onBlur"
                @change.stop
            />

            <button
                v-if="renderClearButton"
                type="button"
                class="vs-clear-button"
                aria-label="Clear"
                :class="{ show: inputValue }"
                :disabled="!inputValue"
                :tabindex="!!inputValue ? 0 : -1"
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
import { computed, defineComponent, toRefs, useTemplateRef, type PropType, type Ref, type TemplateRef, ref } from 'vue';
import { VsComponent, type StringModifiers } from '@/declaration';
import { useColorScheme, useStyleSet, useInput, useStringModifier, useStateClass } from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps, getMinMaxProps } from '@/props';

import type { VsInputType, VsInputValueType, VsInputStyleSet } from './types';
import { useVsInputRules } from './vs-input-rules';

import { XIcon } from '@lucide/vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';

const componentName = VsComponent.VsInput;

type VsInputNativeType = VsInputType | 'date' | 'datetime-local' | 'time' | 'month';

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
        noClear: { type: Boolean, default: false },
        clearOnReadonly: { type: Boolean, default: false },
        step: {
            type: [Number, String] as PropType<number | string | undefined>,
            default: undefined,
        },
        type: { type: String as PropType<VsInputNativeType>, default: 'text' },
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
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur'],
    // expose: ['focus', 'blur', 'validate', 'clear', 'select'],
    setup(props, { emit }) {
        const {
            colorScheme,
            styleSet,
            type,
            modelValue,
            modelModifiers,
            required,
            max,
            min,
            id,
            noClear,
            clearOnReadonly,
            disabled,
            readonly,
            messages,
            rules,
            noDefaultRules,
            state,
        } = toRefs(props);

        const inputValue: Ref<VsInputValueType> = ref(modelValue.value);
        const inputRef: TemplateRef<HTMLInputElement> = useTemplateRef('inputRef');
        const isNumberInput = computed(() => type.value === 'number');

        /*
         * min/max prop 의 기본값(0, MAX_SAFE_INTEGER)은 number 타입에서 내부 minCheck/maxCheck
         * 룰이 사용하는 sentinel 이다. 그러나 html attribute 로 그대로 노출되면 type='date' 등
         * number 가 아닌 타입에서 <input type='date' min='0' max='9007199254740991'> 같이
         * 의미 없는 마크업이 된다. number 타입이 아닐 때만 sentinel 을 제거해서 forward 한다.
         */
        const forwardMinAttr = computed(() =>
            isNumberInput.value || min.value !== 0 ? min.value : undefined,
        );
        const forwardMaxAttr = computed(() =>
            isNumberInput.value || max.value !== Number.MAX_SAFE_INTEGER ? max.value : undefined,
        );

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsInputStyleSet>(
            componentName,
            styleSet,
        );

        const { modifyStringValue } = useStringModifier(modelModifiers);
        const { requiredCheck, maxCheck, minCheck } = useVsInputRules(required, max, min, type);

        function convertValue(v: VsInputValueType | undefined): VsInputValueType {
            if (v === undefined || v === null || v === '') {
                return isNumberInput.value ? null : '';
            }

            if (isNumberInput.value) {
                return Number(v);
            }

            return modifyStringValue(v.toString());
        }

        function onClear() {
            inputValue.value = isNumberInput.value ? null : '';
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
                inputValue,
                modelValue,
                id,
                disabled,
                readonly,
                messages,
                rules,
                defaultRules: computed(() => [requiredCheck, maxCheck, minCheck]),
                noDefaultRules,
                state,
                callbacks: {
                    onMounted: () => {
                        inputValue.value = convertValue(inputValue.value);
                    },
                    onChange: () => {
                        inputValue.value = convertValue(inputValue.value);
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
        }));

        const { stateBoxClasses } = useStateClass(computedState);

        const renderClearButton = computed(
            () => !noClear.value && !computedDisabled.value && (clearOnReadonly.value || !computedReadonly.value),
        );

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
        }

        function onBlur(e: FocusEvent) {
            emit('blur', e);
        }

        function select() {
            inputRef.value?.select();
        }

        function clearWithFocus() {
            onClear();
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
            forwardMinAttr,
            forwardMaxAttr,
            computedMessages,
            computedDisabled,
            computedReadonly,
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
            onFocus,
            onBlur,
            validate,
            clearWithFocus,
        };
    },
});
</script>

<style lang="css" src="./VsInput.css" />
