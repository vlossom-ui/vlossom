<template>
    <vs-input-wrapper
        v-show="!hidden"
        :id="radioLabel ? '' : computedId"
        :disabled="computedDisabled"
        :messages="computedMessages"
        :grid
        :label
        :no-messages
        :required
        :shake
        :small
        :width
    >
        <template #label v-if="label || $slots['label']">
            <slot name="label" />
        </template>

        <div :class="['vs-radio', colorSchemeClass, classObj, stateClasses]" :style="styleSetVariables">
            <label class="vs-radio-wrap" :for="computedId">
                <input
                    ref="radioRef"
                    type="radio"
                    class="vs-radio-input"
                    :id="computedId"
                    :disabled="computedDisabled || computedReadonly"
                    :value="convertToString(radioValue)"
                    :checked="isChecked"
                    :aria-required="required"
                    :name
                    @change.stop="onToggle"
                    @focus.stop="onFocus"
                    @blur.stop="onBlur"
                />

                <span v-if="radioLabel || $slots['radio-label']" class="vs-radio-label">
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
import { computed, defineComponent, ref, toRefs, type TemplateRef, useTemplateRef, type PropType } from 'vue';
import { useColorScheme, useStyleSet, useInput, useStateClass } from '@/composables';
import { getColorSchemeProps, getInputProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import { stringUtil, objectUtil } from '@/utils';
import type { VsRadioStyleSet } from './types';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';

const componentName = VsComponent.VsRadio;
export default defineComponent({
    name: componentName,
    components: { VsInputWrapper },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsRadioStyleSet>(),
        ...getInputProps<any, 'placeholder'>('placeholder'),
        ...getResponsiveProps(),
        beforeChange: {
            type: Function as PropType<(from: any, to: any, optionValue: any) => Promise<boolean> | null>,
            default: null,
        },
        checked: { type: Boolean, default: false },
        radioLabel: { type: String, default: '' },
        radioValue: { type: null, required: true },
        // v-model
        modelValue: { type: null, default: null },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'toggle', 'focus', 'blur'],
    // expose: ['clear', 'validate', 'focus', 'blur'],
    setup(props, { emit }) {
        const {
            beforeChange,
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
            small,
            noDefaultRules,
            name,
        } = toRefs(props);

        const radioRef: TemplateRef<HTMLInputElement> = useTemplateRef('radioRef');

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { styleSetVariables } = useStyleSet<VsRadioStyleSet>(componentName, styleSet);

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
            },
        );

        const { stateClasses } = useStateClass(computedState);

        const classObj = computed(() => ({
            'vs-disabled': computedDisabled.value,
            'vs-focusable': !computedDisabled.value && !computedReadonly.value,
            'vs-readonly': computedReadonly.value,
            'vs-small': small.value,
        }));

        async function onToggle(event: Event) {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            const beforeChangeFn = beforeChange.value;

            if (beforeChangeFn) {
                const result = await beforeChangeFn(inputValue.value, radioValue.value, radioValue.value);
                if (!result) {
                    return;
                }
            }
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
            colorSchemeClass,
            computedState,
            styleSetVariables,
            classObj,
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
