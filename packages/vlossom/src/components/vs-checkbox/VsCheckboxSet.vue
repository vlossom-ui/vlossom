<template>
    <vs-input-wrapper
        v-show="!hidden"
        :width="width"
        :style="componentStyleSet.wrapper"
        :grid="grid"
        :id="computedId"
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

        <div :class="['vs-checkbox-set', colorSchemeClass, classObj]" :style="styleSetVariables">
            <vs-checkbox
                v-for="(option, index) in options"
                :key="getOptionValue(option)"
                ref="checkboxRefs"
                class="vs-checkbox-item"
                no-label
                no-messages
                :color-scheme="colorScheme"
                :style-set="checkboxStyleSet"
                :model-value="getOptionValue(option)"
                :true-value="trueValue"
                :checked="isChecked(option)"
                :check-label="getOptionLabel(option)"
                :disabled="computedDisabled"
                :readonly="computedReadonly"
                :required="required"
                :id="`${computedId}-${index}`"
                :name="name"
                :state="computedState"
                :small="small"
                @update:modelValue="onToggle(option, $event)"
                @focus="onFocus(option, $event)"
                @blur="onBlur(option, $event)"
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
import { computed, defineComponent, ref, toRefs, type PropType, type TemplateRef } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getInputProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { useColorScheme, useInput, useStateClass, useStyleSet } from '@/composables';
import { objectUtil } from '@/utils';

import type { VsCheckboxSetStyleSet } from './types';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsCheckbox from '@/components/vs-checkbox/VsCheckbox.vue';

const name = VsComponent.VsCheckboxSet;

export default defineComponent({
    name,
    components: { VsInputWrapper, VsCheckbox },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsCheckboxSetStyleSet>(),
        ...getInputProps<any[], 'placeholder'>('placeholder'),
        ...getResponsiveProps(),
        options: { type: Array as PropType<any[]>, required: true, default: () => [] },
        optionLabel: { type: String, default: '' },
        optionValue: { type: String, default: '' },
        beforeChange: {
            type: Function as PropType<(from: any, to: any, option: any) => Promise<boolean> | null>,
            default: null,
        },
        max: {
            type: [Number, String],
            default: Number.MAX_SAFE_INTEGER,
        },
        min: {
            type: [Number, String],
            default: 0,
        },
        vertical: { type: Boolean, default: false },
        trueValue: { type: null, default: true },
        // v-model
        modelValue: {
            type: Array as PropType<any[]>,
            default: () => [],
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur'],
    setup(props, { emit }) {
        const {
            colorScheme,
            styleSet,
            beforeChange,
            disabled,
            id,
            modelValue,
            messages,
            optionLabel,
            optionValue,
            readonly,
            required,
            rules,
            state,
            max,
            min,
            noDefaultRules,
            trueValue,
            vertical,
        } = toRefs(props);

        const checkboxRefs: TemplateRef<InstanceType<typeof VsCheckbox>[]> = ref([]);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsCheckboxSetStyleSet>(name, styleSet);

        const { stateClasses } = useStateClass(state);

        const inputValue = ref<any[]>(modelValue.value || []);

        // validation rules
        function requiredCheck(v: any[]) {
            return required.value && (!v || v.length === 0) ? 'required' : '';
        }

        function maxCheck(v: any[]) {
            const limit = Number(max.value);
            return v && v.length > limit ? `max number of items: ${max.value}` : '';
        }

        function minCheck(v: any[]) {
            const limit = Number(min.value);
            return v && v.length < limit ? `min number of items: ${min.value}` : '';
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
                defaultRules: ref([requiredCheck, maxCheck, minCheck]),
                noDefaultRules,
                state,
                callbacks: {
                    onMounted: () => {
                        if (!Array.isArray(inputValue.value)) {
                            inputValue.value = [];
                        }
                    },
                    onChange: () => {
                        if (!Array.isArray(inputValue.value)) {
                            inputValue.value = [];
                        }
                    },
                    onClear: () => {
                        inputValue.value = [];
                    },
                },
            },
        );

        const classObj = computed(() => ({
            'vs-vertical': vertical.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
        }));

        const checkboxStyleSet = computed(() => {
            return componentStyleSet.value?.checkbox || {};
        });

        function getOptionLabel(option: any): string {
            if (!optionLabel.value) {
                return String(option);
            }
            return getNestedValue(option, optionLabel.value) || '';
        }

        function getOptionValue(option: any): any {
            if (!optionValue.value) {
                return option;
            }
            return getNestedValue(option, optionValue.value);
        }

        function getNestedValue(obj: any, path: string): any {
            return path.split('.').reduce((current, key) => current?.[key], obj);
        }

        function isChecked(option: any): boolean {
            if (!inputValue.value || !Array.isArray(inputValue.value)) {
                return false;
            }
            const optionVal = getOptionValue(option);
            return inputValue.value.some((v: any) => objectUtil.isEqual(v, optionVal));
        }

        async function onToggle(option: any, checked: any): Promise<void> {
            const optionVal = getOptionValue(option);
            const shouldBeChecked = objectUtil.isEqual(checked, trueValue.value);
            const isCurrentlyInArray = inputValue.value.some((v: any) => objectUtil.isEqual(v, optionVal));

            let toValue: any[];

            if (shouldBeChecked && !isCurrentlyInArray) {
                // Add to array
                toValue = [...inputValue.value, optionVal];
            } else if (!shouldBeChecked && isCurrentlyInArray) {
                // Remove from array
                toValue = inputValue.value.filter((v: any) => !objectUtil.isEqual(v, optionVal));
            } else {
                // No change needed
                return;
            }

            const beforeChangeFn = beforeChange.value;
            if (beforeChangeFn) {
                const result = await beforeChangeFn(inputValue.value, toValue, option);
                if (!result) {
                    return;
                }
            }

            inputValue.value = toValue;
        }

        function onFocus(option: any, e: FocusEvent): void {
            emit('focus', option, e);
        }

        function onBlur(option: any, e: FocusEvent): void {
            emit('blur', option, e);
        }

        function focus(): void {
            checkboxRefs.value?.[0]?.focus();
        }

        function blur(): void {
            checkboxRefs.value?.[0]?.blur();
        }

        return {
            checkboxRefs,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            classObj,
            stateClasses,
            computedId,
            computedMessages,
            computedState,
            computedDisabled,
            computedReadonly,
            checkboxStyleSet,
            shake,
            isChecked,
            getOptionLabel,
            getOptionValue,
            onToggle,
            onFocus,
            onBlur,
            validate,
            clear,
            focus,
            blur,
        };
    },
});
</script>

<style src="./VsCheckboxSet.css" />
