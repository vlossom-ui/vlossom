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

        <div :class="['vs-radio-set', colorSchemeClass, classObj]" :style="styleSetVariables">
            <vs-radio
                v-for="(option, index) in options"
                :key="getOptionValue(option)"
                ref="radioRefs"
                class="vs-radio-item"
                width="unset"
                :id="`${computedId}-${index}`"
                :model-value="inputValue"
                :radio-value="getOptionValue(option)"
                :radio-label="getOptionLabel(option)"
                :style-set="componentStyleSet.radio"
                :disabled="computedDisabled"
                :readonly="computedReadonly"
                :state="computedState"
                :name="resolvedName"
                no-label
                no-messages
                :before-change
                :color-scheme
                :required
                @update:modelValue="onRadioUpdate"
                @focus="onFocus(option, $event)"
                @blur="onBlur(option, $event)"
            >
                <template #radio-label v-if="$slots['radio-label']">
                    <slot name="radio-label" :option :value="getOptionValue(option)" :label="getOptionLabel(option)" />
                </template>
            </vs-radio>
        </div>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, type ComputedRef, type TemplateRef, useTemplateRef, type PropType } from 'vue';
import { useColorScheme, useInput, useInputOption, useStyleSet } from '@/composables';
import { getColorSchemeProps, getOptionsProps, getInputProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import { objectUtil } from '@/utils';
import type { VsRadioSetStyleSet } from './types';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsRadio from '@/components/vs-radio/VsRadio.vue';

const componentName = VsComponent.VsRadioSet;
export default defineComponent({
    name: componentName,
    components: { VsInputWrapper, VsRadio },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsRadioSetStyleSet>(),
        ...getInputProps<any, 'placeholder'>('placeholder'),
        ...getResponsiveProps(),
        ...getOptionsProps(),
        beforeChange: {
            type: Function as PropType<(from: any, to: any, optionValue: any) => Promise<boolean> | null>,
            default: null,
        },
        vertical: { type: Boolean, default: false },
        // v-model
        modelValue: { type: null, default: null },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur'],
    // expose: ['focus', 'blur', 'validate', 'clear'],
    setup(props, { emit }) {
        const {
            colorScheme,
            styleSet,
            disabled,
            grid,
            hidden,
            id,
            label,
            messages,
            modelValue,
            name,
            noMessages,
            noDefaultRules,
            options,
            optionLabel,
            optionValue,
            readonly,
            required,
            rules,
            state,
            vertical,
            width,
        } = toRefs(props);

        const radioRefs: TemplateRef<InstanceType<typeof VsRadio>[]> = useTemplateRef('radioRefs');

        const inputValue = ref(modelValue.value);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<Partial<VsRadioSetStyleSet>> = computed(() => ({}));

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsRadioSetStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

        const { getOptionLabel, getOptionValue } = useInputOption(inputValue, options, optionLabel, optionValue);

        function requiredCheck(value: any) {
            if (!required.value) {
                return '';
            }

            return value === null || value === undefined ? 'required' : '';
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
                    onClear: () => {
                        inputValue.value = null;
                    },
                },
            },
        );

        const classObj = computed(() => ({
            'vs-vertical': vertical.value,
        }));

        const resolvedName = computed(() => name.value || computedId.value);

        function onRadioUpdate(value: any) {
            if (objectUtil.isEqual(inputValue.value, value)) {
                return;
            }
            inputValue.value = value;
        }

        function onFocus(option: any, event: FocusEvent) {
            emit('focus', option, event);
        }

        function onBlur(option: any, event: FocusEvent) {
            emit('blur', option, event);
        }

        function focus() {
            radioRefs.value?.[0]?.focus?.();
        }

        function blur() {
            radioRefs.value?.[0]?.blur?.();
        }

        return {
            hidden,
            label,
            width,
            grid,
            noMessages,
            colorScheme,
            options,
            required,
            radioRefs,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            classObj,
            computedId,
            computedMessages,
            computedState,
            computedDisabled,
            computedReadonly,
            shake,
            inputValue,
            getOptionLabel,
            getOptionValue,
            resolvedName,
            onRadioUpdate,
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

<style src="./VsRadioSet.css" />
