<template>
    <vs-input-wrapper
        v-show="!hidden"
        :width
        :grid
        :disabled="computedDisabled"
        :hidden
        :id="computedId"
        :label
        :no-label
        :no-messages
        :required
        :small
        :messages="computedMessages"
        :shake
    >
        <template #label v-if="!noLabel && (!!label || !!$slots.label)">
            <slot name="label" />
        </template>

        <div :class="['vs-input', colorSchemeClass, classObj, stateClasses]" :style="styleSetVariables">
            <div v-if="$slots['prepend']" class="vs-prepend">
                <slot name="prepend" />
            </div>

            <input
                ref="inputRef"
                :id="computedId"
                :type
                :value="inputValue"
                :autocomplete="autocomplete ? 'on' : 'off'"
                :name
                :disabled="computedDisabled"
                :readonly="computedReadonly"
                :aria-required="required"
                :placeholder
                @input.stop="onInput"
                @change.stop
            />

            <button
                v-if="renderClearButton"
                type="button"
                class="vs-clear-button"
                :class="{ show: inputValue }"
                :disabled="!inputValue"
                aria-label="Clear"
                @click.stop="clearWithFocus"
            >
                <i v-html="closeIcon" :class="{ 'size-4': small, 'size-5': !small }" />
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
import { computed, defineComponent, toRefs, useTemplateRef, type PropType, type Ref, type TemplateRef, ref } from 'vue';
import { VsComponent, type StringModifiers } from '@/declaration';
import { useColorScheme, useStyleSet, useInput, useStringModifier, useStateClass } from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import { propsUtil } from '@/utils';
import type { VsInputType, VsInputValueType, VsInputStyleSet } from './types';
import { useVsInputRules } from './vs-input-rules';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import { closeIcon } from '@/icons';

const name = VsComponent.VsInput;

export default defineComponent({
    name,
    components: { VsInputWrapper },
    props: {
        ...getInputProps<VsInputValueType>(),
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
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change'],
    setup(props, { emit }) {
        const {
            colorScheme,
            small,
            styleSet,
            type,
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
            state,
        } = toRefs(props);

        const inputValue: Ref<VsInputValueType> = ref(modelValue.value);
        const inputRef: TemplateRef<HTMLInputElement> = useTemplateRef('inputRef');
        const isNumberInput = computed(() => type.value === 'number');

        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const { styleSetVariables } = useStyleSet<VsInputStyleSet>(name, styleSet);
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
            'vs-small': small.value,
            'vs-focusable': !computedDisabled.value && !computedReadonly.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
        }));

        const { stateClasses } = useStateClass(computedState);

        const renderClearButton = computed(() => !noClear.value && !computedReadonly.value && !computedDisabled.value);

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
            styleSetVariables,
            inputValue,
            computedMessages,
            computedDisabled,
            computedReadonly,
            renderClearButton,
            shake,
            stateClasses,
            computedId,

            // Methods
            onInput,
            focus,
            blur,
            select,
            clear,
            validate,
            clearWithFocus,

            // Icons
            closeIcon,
        };
    },
});
</script>

<style lang="css" src="./VsInput.css" />
