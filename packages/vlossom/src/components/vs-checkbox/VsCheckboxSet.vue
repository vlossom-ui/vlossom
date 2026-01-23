<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style-set="componentStyleSet.wrapper"
        :id="computedId"
        :disabled="computedDisabled"
        :messages="computedMessages"
        :width
        :grid
        :label
        :required
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
                width="unset"
                :model-value="inputValue"
                :true-value="getOptionValue(option)"
                :before-change="beforeChange"
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
                :name
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
import { computed, defineComponent, ref, toRefs, type ComputedRef, type PropType, type TemplateRef } from 'vue';
import { VsComponent } from '@/declaration';
import {
    getColorSchemeProps,
    getOptionsProps,
    getInputProps,
    getResponsiveProps,
    getStyleSetProps,
    getMinMaxProps,
} from '@/props';
import { useColorScheme, useInput, useStateClass, useStyleSet, useInputOption } from '@/composables';
import { objectUtil } from '@/utils';

import type { VsCheckboxSetStyleSet } from './types';
import { useVsCheckboxSetRules } from './vs-checkbox-set-rules';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsCheckbox from '@/components/vs-checkbox/VsCheckbox.vue';

const componentName = VsComponent.VsCheckboxSet;

export default defineComponent({
    name: componentName,
    components: { VsInputWrapper, VsCheckbox },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsCheckboxSetStyleSet>(),
        ...getInputProps<any[], 'placeholder'>('placeholder'),
        ...getResponsiveProps(),
        ...getOptionsProps(),
        ...getMinMaxProps(componentName),
        beforeChange: {
            type: Function as PropType<(from: any, to: any, optionValue: any) => Promise<boolean> | null>,
            default: null,
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

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<Partial<VsCheckboxSetStyleSet>> = computed(() => ({}));

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsCheckboxSetStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

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

        function onCheckboxUpdate(value: any[]) {
            if (objectUtil.isEqual(inputValue.value, value)) {
                return;
            }
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
