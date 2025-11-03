<template>
    <vs-input-wrapper
        v-show="!hidden"
        :width="width"
        :grid="grid"
        :id="radioLabel ? '' : computedId"
        :label="label"
        :required="required"
        :disabled="computedDisabled"
        :messages="computedMessages"
        :no-messages="noMessages"
        :shake="shake"
    >
        <template #label v-if="label || $slots['label']">
            <slot name="label" />
        </template>

        <div :class="['vs-radio-node', computedColorSchemeClass, radioNodeClassObj]" :style="radioNodeStyleSet">
            <label class="vs-radio-wrap" :for="computedId">
                <input
                    ref="radioRef"
                    type="radio"
                    :class="['vs-radio-input', stateClasses]"
                    :id="computedId"
                    :disabled="computedDisabled || computedReadonly"
                    :name="name"
                    :value="convertToString(radioValue)"
                    :checked="isChecked"
                    :aria-required="required"
                    @change.stop="onToggle"
                    @focus.stop="onFocus"
                    @blur.stop="onBlur"
                />

                <span class="vs-radio-label">
                    <slot name="radio-label">{{ radioLabel }}</slot>
                </span>
            </label>
        </div>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, type PropType, type Ref } from 'vue';
import { useColorScheme, useStyleSet, useInput, useStateClass } from '@/composables';
import { getInputProps, getResponsiveProps } from '@/props';
import { VsComponent, type ColorScheme } from '@/declaration';
import { stringUtil, objectUtil } from '@/utils';
import type { VsRadioNodeStyleSet, VsRadioStyleSet } from './types';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';

const name = VsComponent.VsRadio;
export default defineComponent({
    name,
    components: { VsInputWrapper },
    props: {
        ...getInputProps<any, 'placeholder'>('placeholder'),
        ...getResponsiveProps(),
        colorScheme: { type: String as PropType<ColorScheme> },
        styleSet: { type: [String, Object] as PropType<string | VsRadioStyleSet> },
        checked: { type: Boolean, default: false },
        radioLabel: { type: String, default: '' },
        radioValue: { type: null, required: true },
        // v-model
        modelValue: { type: null, default: null },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'toggle', 'focus', 'blur'],
    // expose: ['clear', 'validate', 'focus', 'blur'],
    setup(props, context) {
        const {
            checked,
            colorScheme,
            id,
            disabled,
            readonly,
            messages,
            modelValue,
            radioValue,
            required,
            rules,
            state,
            styleSet,
            noDefaultRules,
        } = toRefs(props);

        const radioRef: Ref<HTMLInputElement | null> = ref(null);

        const { emit } = context;

        const { colorSchemeClass: computedColorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet: radioStyleSet } = useStyleSet<VsRadioStyleSet>(VsComponent.VsRadio, styleSet);
        const { componentStyleSet: radioNodeStyleSet } = useStyleSet<VsRadioNodeStyleSet>(
            VsComponent.VsRadio,
            computed(() => radioStyleSet.value || {}),
        );

        const { stateClasses } = useStateClass(state);

        const inputValue = ref(checked.value ? radioValue.value : modelValue.value);

        const isChecked = computed(() => {
            return objectUtil.isEqual(inputValue.value, radioValue.value);
        });

        function requiredCheck() {
            if (!required.value) {
                return '';
            }

            const radioElements = document.querySelectorAll(`input[name="${name.value}"]`);
            const checkedRadioElement = Array.from(radioElements).find((el) => (el as HTMLInputElement).checked);
            return !checkedRadioElement ? 'required' : '';
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
        } = useInput(context, {
            inputValue,
            modelValue,
            id,
            disabled,
            readonly,
            messages,
            rules,
            defaultRules: ref([requiredCheck]),
            noDefaultRules,
            state,
            callbacks: {
                onMounted: () => {
                    if (checked.value) {
                        inputValue.value = radioValue.value;
                    }
                },
                onClear: () => {
                    inputValue.value = null;
                },
            },
        });

        const radioNodeClassObj = computed(() => ({
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
        }));

        async function onToggle(event: Event) {
            // radio change event value is always true
            inputValue.value = radioValue.value;
            emit('change', event);
            emit('toggle', (event.target as HTMLInputElement).checked);
        }

        function onFocus(e: FocusEvent) {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent) {
            emit('blur', e);
        }

        function focus() {
            radioRef.value?.focus();
        }

        function blur() {
            radioRef.value?.blur();
        }

        return {
            computedId,
            radioRef,
            isChecked,
            computedColorSchemeClass,
            computedState,
            radioNodeStyleSet,
            radioNodeClassObj,
            stateClasses,
            computedDisabled,
            computedReadonly,
            inputValue,
            computedMessages,
            shake,
            validate,
            clear,
            onToggle,
            onFocus,
            onBlur,
            focus,
            blur,
            convertToString: stringUtil.convertToString,
        };
    },
});
</script>

<style src="./VsRadio.css" />
