<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style="componentStyleSet.wrapper"
        :id="computedId"
        :disabled="computedDisabled"
        :messages="computedMessages"
        :grid
        :label
        :required
        :small
        :no-messages
        :shake
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
                :model-value="inputValue"
                :true-value="getOptionValue(option)"
                :before-change="getOptionBeforeChange(option)"
                :width="width ?? 'unset'"
                :style-set="checkboxStyleSet"
                :check-label="getOptionLabel(option)"
                :disabled="computedDisabled"
                :readonly="computedReadonly"
                :id="`${computedId}-${index}`"
                :state="computedState"
                multiple
                no-label
                no-messages
                :color-scheme
                :required
                :name
                :small
                @update:modelValue="onCheckboxUpdate"
                @focus="onFocus(option, $event)"
                @blur="onBlur(option, $event)"
            >
                <template #check-label v-if="$slots['check-label']">
                    <slot name="check-label" :value="getOptionValue(option)" :label="getOptionLabel(option)" :option />
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
import { getColorSchemeProps, getInputOptionProps, getInputProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { useColorScheme, useInput, useStateClass, useStyleSet, useInputOption } from '@/composables';
import { propsUtil } from '@/utils';

import type { VsCheckboxSetStyleSet } from './types';
import { useVsCheckboxSetRules } from './vs-checkbox-set-rules';

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
        ...getInputOptionProps(),
        beforeChange: {
            type: Function as PropType<(from: any, to: any, option: any) => Promise<boolean> | null>,
            default: null,
        },
        max: {
            type: [Number, String],
            default: Number.MAX_SAFE_INTEGER,
            validator: (value: number | string) => propsUtil.checkValidNumber(name, 'max', value),
        },
        min: {
            type: [Number, String],
            default: 0,
            validator: (value: number | string) => propsUtil.checkValidNumber(name, 'min', value),
        },
        vertical: { type: Boolean, default: false },
        // v-model
        modelValue: {
            type: Array as PropType<any[]>,
            default: () => [],
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur'],
    // expose: ['focus', 'blur', 'validate', 'clear'],
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
            vertical,
        } = toRefs(props);

        const checkboxRefs: TemplateRef<InstanceType<typeof VsCheckbox>[]> = ref([]);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsCheckboxSetStyleSet>(name, styleSet);

        const { stateClasses } = useStateClass(state);

        const { requiredCheck, maxCheck, minCheck } = useVsCheckboxSetRules(required, max, min);

        const inputValue = ref<any[]>(modelValue.value || []);

        const { getOptionLabel, getOptionValue } = useInputOption(
            inputValue,
            options,
            optionLabel,
            optionValue,
            ref(true),
        );

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

        function getOptionBeforeChange(option: any) {
            if (!beforeChange.value) {
                return undefined;
            }

            return async (from: any[], to: any[]) => {
                const result = await beforeChange.value?.(from, to, option);
                return result ?? true;
            };
        }

        function onCheckboxUpdate(value: any[]) {
            inputValue.value = value;
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
            inputValue,
            getOptionLabel,
            getOptionValue,
            getOptionBeforeChange,
            onCheckboxUpdate,
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
