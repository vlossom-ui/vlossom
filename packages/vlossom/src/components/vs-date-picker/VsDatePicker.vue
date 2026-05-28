<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style-set="componentStyleSet.$wrapper"
        :id="computedId"
        :disabled="computedDisabled"
        :messages="computedMessages"
        :width
        :grid
        :hidden
        :label
        :no-label
        :no-messages
        :required
        :shake
    >
        <template #label v-if="!noLabel && (!!label || !!$slots.label)">
            <slot name="label" />
        </template>

        <vs-input
            ref="dateInputRef"
            class="vs-date-picker"
            :model-value="displayValue"
            :style-set="componentStyleSet.$input"
            :placeholder="computedPlaceholder"
            :disabled="computedDisabled"
            :readonly="computedReadonly"
            :state="computedState"
            :color-scheme
            :type="deceiveType"
            :no-clear
            :name
            :required
            :size
            no-label
            no-messages
            no-default-rules
            @update:model-value="onDateInput"
            @focus="onFocus"
            @blur="onBlur"
            @click="open"
        >
            <template #prepend>
                <slot v-if="$slots['prepend']" name="prepend" />
                <component v-else :is="computedIcon" class="vs-date-picker-icon" />
            </template>
            <template v-if="$slots['append']" #append>
                <slot name="append" />
            </template>
        </vs-input>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    ref,
    toRefs,
    useTemplateRef,
    watch,
    type Component,
    type PropType,
    type Ref,
    type TemplateRef,
} from 'vue';
import { VsComponent, type Size } from '@/declaration';
import { logUtil } from '@/utils';
import { useStyleSet, useInput } from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps } from '@/props';

import { FORMAT_PATTERNS, TYPE_TO_FORMAT } from './constants';
import { type VsDatePickerStyleSet, type VsDatePickerType, type VsDatePickerValueType } from './types';
import { useVsDatePickerRules } from './vs-date-picker-rules';

import { CalendarIcon, ClockIcon } from '@lucide/vue';
import type { VsInputRef, VsInputType } from '@/components/vs-input/types';
import VsInput from '@/components/vs-input/VsInput.vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';

const componentName = VsComponent.VsDatePicker;

function isValidFormat(value: string, type: VsDatePickerType): boolean {
    return !value || FORMAT_PATTERNS[type].test(value);
}

export default defineComponent({
    name: componentName,
    components: { CalendarIcon, ClockIcon, VsInput, VsInputWrapper },
    props: {
        ...getInputProps<VsDatePickerValueType>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsDatePickerStyleSet>(),
        min: {
            type: String,
            validator: (value: string, props: any) => {
                if (!value) {
                    return true;
                }
                if (isValidFormat(value, props.type)) {
                    return true;
                }
                logUtil.propWarning(
                    componentName,
                    'min',
                    `Invalid format for type "${props.type}".` +
                        ` Expected format: ${TYPE_TO_FORMAT[props.type as VsDatePickerType]}.`,
                );
                return false;
            },
        },
        max: {
            type: String,
            validator: (value: string, props: any) => {
                if (!value) {
                    return true;
                }
                if (isValidFormat(value, props.type)) {
                    return true;
                }
                logUtil.propWarning(
                    componentName,
                    'max',
                    `Invalid format for type "${props.type}".` +
                        ` Expected format: ${TYPE_TO_FORMAT[props.type as VsDatePickerType]}.`,
                );
                return false;
            },
        },
        type: { type: String as PropType<VsDatePickerType>, default: 'date' },
        noClear: { type: Boolean, default: false },
        size: { type: String as PropType<Size>, default: 'md' },

        // v-model
        modelValue: {
            type: String as PropType<VsDatePickerValueType>,
            default: '',
            validator: (value: string, props: any) => {
                if (!value) {
                    return true;
                }
                if (isValidFormat(value, props.type)) {
                    return true;
                }
                logUtil.propWarning(
                    componentName,
                    'modelValue',
                    `Invalid format for type "${props.type}".` +
                        ` Expected format: ${TYPE_TO_FORMAT[props.type as VsDatePickerType]}.`,
                );
                return false;
            },
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur', 'clear', 'invalid'],
    setup(props, { emit }) {
        const {
            styleSet,
            type,
            modelValue,
            required,
            min,
            max,
            id,
            disabled,
            readonly,
            messages,
            placeholder,
            rules,
            noDefaultRules,
            state,
        } = toRefs(props);

        const dateInputRef: TemplateRef<VsInputRef> = useTemplateRef('dateInputRef');

        const inputValue: Ref<VsDatePickerValueType> = ref(modelValue.value);

        const { componentStyleSet } = useStyleSet<VsDatePickerStyleSet>(componentName, styleSet);

        const { requiredCheck, minCheck, maxCheck } = useVsDatePickerRules(required, min, max);

        const {
            computedId,
            computedMessages,
            computedState,
            computedDisabled,
            computedReadonly,
            shake,
            validate,
            clear,
        } = useInput<VsDatePickerValueType>(
            { emit },
            {
                inputValue,
                modelValue,
                id,
                disabled,
                readonly,
                messages,
                rules,
                defaultRules: computed(() => [requiredCheck, minCheck, maxCheck]),
                noDefaultRules,
                state,
                callbacks: {
                    onClear,
                },
            },
        );

        const computedPlaceholder = computed<string>(() => {
            if (!placeholder.value) {
                return TYPE_TO_FORMAT[type.value];
            }
            return placeholder.value;
        });

        const displayValue = computed<string>(() => {
            if (!isValidFormat(inputValue.value, type.value)) {
                return '';
            }
            return inputValue.value;
        });

        const computedIcon = computed<Component>(() => {
            if (type.value === 'time') {
                return ClockIcon;
            }
            return CalendarIcon;
        });

        /** What is THIS?!?
         * VsInputType is intentionally narrower for the public VsInput API.
         * VsDatePicker still needs to pass native date/time input types to reuse VsInput's UI shell.
         * Runtime validation stays in VsDatePicker, so this cast only bridges the internal prop type.
         */
        const deceiveType = computed<VsInputType>(() => {
            return type.value as unknown as VsInputType;
        });

        function onDateInput(value: string | number | null): void {
            const raw = value?.toString() ?? '';
            if (!raw) {
                if (inputValue.value && !isValidFormat(inputValue.value, type.value)) {
                    return;
                }
                onClear();
                return;
            }

            if (!isValidFormat(raw, type.value)) {
                emit('invalid', { input: raw });
                return;
            }

            inputValue.value = raw;
        }

        function focus(): void {
            dateInputRef.value?.focus();
        }

        function blur(): void {
            dateInputRef.value?.blur();
        }

        function onClear(): void {
            inputValue.value = '';
            emit('clear');
        }

        function onFocus(e: FocusEvent): void {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent): void {
            emit('blur', e);
        }

        function openPicker(): void {
            const input = dateInputRef.value?.inputRef;
            if (!input || computedDisabled.value || computedReadonly.value) {
                return;
            }
            const showPicker = input.showPicker;
            if (typeof showPicker !== 'function') {
                return;
            }

            input.focus();
            showPicker.call(input);
        }

        watch(
            modelValue,
            (v) => {
                if (v && !isValidFormat(v, type.value)) {
                    emit('invalid', { input: v });
                }
            },
            { immediate: true },
        );

        return {
            // Refs
            dateInputRef,

            // Computed
            deceiveType,
            componentStyleSet,
            displayValue,
            computedPlaceholder,
            computedMessages,
            computedDisabled,
            computedReadonly,
            computedState,
            computedIcon,
            shake,
            computedId,

            // Methods
            onDateInput,
            onFocus,
            onBlur,
            focus,
            blur,
            clear,
            validate,
            open: openPicker,
        };
    },
});
</script>

<style lang="css" src="./VsDatePicker.css" />
