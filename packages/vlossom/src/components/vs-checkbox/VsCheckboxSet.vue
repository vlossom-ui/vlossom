<template>
    <vs-input-wrapper
        v-show="!hidden"
        :width="width"
        :grid="grid"
        :label="label"
        :required="required"
        :disabled="computedDisabled"
        :small="small"
        :messages="computedMessages"
        :no-messages="noMessages"
        :shake="shake"
        group-label
    >
        <template #label v-if="label || $slots['label']">
            <slot name="label" />
        </template>

        <div :class="['vs-checkbox-set', colorSchemeClass, { 'vs-vertical': vertical }]" :style="styleSetVariables">
            <vs-checkbox
                v-for="(option, index) in options"
                :key="getOptionValue(option)"
                ref="checkboxRefs"
                class="vs-checkbox-item"
                :color-scheme="colorScheme"
                :style-set="checkboxStyleSet"
                :model-value="isChecked(option)"
                :check-label="getOptionLabel(option)"
                :small="small"
                :disabled="computedDisabled"
                :id="`${computedId}-${index}`"
                :name="name"
                :readonly="computedReadonly"
                :required="required"
                :state="computedState"
                :true-value="getOptionValue(option)"
                :false-value="null"
                :aria-label="getOptionLabel(option)"
                :no-messages="true"
                :no-label="true"
                @update:model-value="(value) => onToggle(option, value)"
                @focus="(e) => onFocus(option, e)"
                @blur="(e) => onBlur(option, e)"
            >
                <template #check-label v-if="$slots['check-label']">
                    <slot
                        name="check-label"
                        :option="option"
                        :value="getOptionValue(option)"
                        :label="getOptionLabel(option)"
                    />
                </template>
            </vs-checkbox>
        </div>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { computed, defineComponent, ref, toRefs, type PropType, type Ref } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getInputProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { useColorScheme, useInput, useStyleSet } from '@/composables';
import { objectUtil } from '@/utils';
import type { VsCheckboxSetStyleSet, VsCheckboxStyleSet } from './types';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsCheckbox from './VsCheckbox.vue';
import { useVsCheckboxSetRules } from './vs-checkbox-set-rules';

const name = VsComponent.VsCheckboxSet;

function getInputOptionProps() {
    return {
        options: { type: Array as PropType<any[]>, required: true, default: () => [] },
        optionLabel: { type: String, default: '' },
        optionValue: { type: String, default: '' },
    };
}

export default defineComponent({
    name,
    components: { VsInputWrapper, VsCheckbox },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsCheckboxSetStyleSet>(),
        ...getInputProps<any[], 'placeholder'>('placeholder'),
        ...getInputOptionProps(),
        ...getResponsiveProps(),
        beforeChange: {
            type: Function as PropType<(from: any, to: any, option: any) => Promise<boolean> | null>,
            default: null,
        },
        max: {
            type: [Number, String],
            default: Number.MAX_SAFE_INTEGER,
            validator: (value: number | string) => {
                const num = Number(value);
                return !isNaN(num) && num >= 0;
            },
        },
        min: {
            type: [Number, String],
            default: 0,
            validator: (value: number | string) => {
                const num = Number(value);
                return !isNaN(num) && num >= 0;
            },
        },
        vertical: { type: Boolean, default: false },
        // v-model
        modelValue: {
            type: Array as PropType<any[]>,
            default: () => [],
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur'],
    expose: ['clear', 'validate', 'focus', 'blur'],
    setup(props, { emit }) {
        const {
            colorScheme,
            styleSet,
            beforeChange,
            disabled,
            id,
            modelValue,
            messages,
            options,
            optionLabel,
            optionValue,
            readonly,
            required,
            rules,
            state,
            max,
            min,
            noDefaultRules,
        } = toRefs(props);

        const checkboxRefs: Ref<typeof VsCheckbox[]> = ref([]);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsCheckboxSetStyleSet>(name, styleSet);

        const checkboxStyleSet = computed(() => componentStyleSet.value.checkbox || {});

        const inputValue = ref(modelValue.value);

        function getOptionLabel(option: any): string {
            if (!option) return '';
            if (typeof option === 'string' || typeof option === 'number') return String(option);
            return optionLabel.value && option[optionLabel.value] ? String(option[optionLabel.value]) : String(option);
        }

        function getOptionValue(option: any): any {
            if (!option) return option;
            if (typeof option === 'string' || typeof option === 'number') return option;
            return optionValue.value && option[optionValue.value] !== undefined ? option[optionValue.value] : option;
        }

        const { requiredCheck, maxCheck, minCheck } = useVsCheckboxSetRules(required, max, min);

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
                defaultRules: ref([requiredCheck, maxCheck, minCheck]),
                noDefaultRules,
                state,
                callbacks: {
                    onMounted: () => {
                        if (Array.isArray(inputValue.value) === false) {
                            inputValue.value = [];
                        }
                    },
                    onChange: () => {
                        if (Array.isArray(inputValue.value) === false) {
                            inputValue.value = [];
                        }
                    },
                    onClear: () => {
                        inputValue.value = [];
                    },
                },
            },
        );

        function isChecked(option: any): boolean {
            if (!inputValue.value || !Array.isArray(inputValue.value)) {
                return false;
            }
            return inputValue.value.some((v: any) => objectUtil.isEqual(v, getOptionValue(option)));
        }

        async function onToggle(option: any, value: any) {
            const targetOptionValue = getOptionValue(option);
            const isCheckedNow = value !== null && value !== false;
            
            const toValue = isCheckedNow
                ? [...inputValue.value, targetOptionValue]
                : inputValue.value.filter((v: any) => !objectUtil.isEqual(v, targetOptionValue));

            const beforeChangeFn = beforeChange.value;
            if (beforeChangeFn) {
                const result = await beforeChangeFn(inputValue.value, toValue, option);
                if (!result) {
                    return;
                }
            }

            inputValue.value = toValue;
        }

        function onFocus(option: any, e: FocusEvent) {
            emit('focus', option, e);
        }

        function onBlur(option: any, e: FocusEvent) {
            emit('blur', option, e);
        }

        function focus() {
            checkboxRefs.value[0]?.focus?.();
        }

        function blur() {
            checkboxRefs.value[0]?.blur?.();
        }

        return {
            computedId,
            checkboxRefs,
            colorSchemeClass,
            styleSetVariables,
            checkboxStyleSet,
            computedState,
            computedDisabled,
            computedReadonly,
            computedMessages,
            isChecked,
            getOptionLabel,
            getOptionValue,
            shake,
            validate,
            clear,
            onToggle,
            onFocus,
            onBlur,
            focus,
            blur,
        };
    },
});
</script>

<style src="./vs-checkbox-set.css" />
