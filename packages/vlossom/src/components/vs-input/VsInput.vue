<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style-set="componentStyleSet.wrapper"
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

        <div :class="['vs-input', colorSchemeClass, classObj, stateClasses]" :style="componentStyleSet.component">
            <div v-if="$slots['prepend']" class="vs-prepend" :style="componentStyleSet.prepend">
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
                <i class="size-5">
                    <vs-render :content="closeIcon" />
                </i>
            </button>

            <div v-if="$slots['append']" class="vs-append" :style="componentStyleSet.append">
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
import { closeIcon } from '@/icons';

import type { VsInputType, VsInputValueType, VsInputStyleSet } from './types';
import { useVsInputRules } from './vs-input-rules';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsRender from '@/components/vs-render/VsRender.vue';

const componentName = VsComponent.VsInput;

export default defineComponent({
    name: componentName,
    components: { VsInputWrapper, VsRender },
    props: {
        ...getInputProps<VsInputValueType>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsInputStyleSet>(),
        ...getMinMaxProps(componentName),
        autocomplete: { type: Boolean, default: false },
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

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsInputStyleSet>(componentName, styleSet);

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
            onFocus,
            onBlur,
            validate,
            clearWithFocus,

            // Icons
            closeIcon,
        };
    },
});
</script>

<style lang="css" src="./VsInput.css" />
