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
            :type
            :no-clear
            :name
            :required
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
                <component :is="computedIcon" v-else class="vs-date-picker-icon size-5" />
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
    provide,
    ref,
    toRefs,
    useTemplateRef,
    watch,
    type Component,
    type PropType,
    type Ref,
    type TemplateRef,
} from 'vue';
import { CalendarIcon, ClockIcon } from '@lucide/vue';
import { VsComponent, FORM_STORE_KEY } from '@/declaration';
import { FormStore } from '@/stores';
import { useStyleSet, useInput } from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps, getDateMinMaxProps } from '@/props';

import { FORMAT_PATTERNS, TYPE_TO_FORMAT } from './constants';
import { type VsDatePickerStyleSet, type VsDatePickerType, type VsDatePickerValueType } from './types';
import { useVsDatePickerRules } from './vs-date-picker-rules';

import type { VsInputRef } from '@/components/vs-input/types';
import VsInput from '@/components/vs-input/VsInput.vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';

const componentName = VsComponent.VsDatePicker;

function isValidFormat(value: string, type: VsDatePickerType): boolean {
    return !value || FORMAT_PATTERNS[type].test(value);
}

function convertFormat(value: string, from: VsDatePickerType, to: VsDatePickerType): string {
    if (!value || from === to) {
        return value;
    }
    if (!FORMAT_PATTERNS[from].test(value)) {
        return '';
    }

    // date 'YYYY-MM-DD'
    if (from === 'date') {
        if (to === 'datetime-local') {
            return `${value}T00:00`;
        }
        if (to === 'month') {
            return value.slice(0, 7);
        }
        return '';
    }
    // datetime-local 'YYYY-MM-DDTHH:mm'
    if (from === 'datetime-local') {
        if (to === 'date') {
            return value.slice(0, 10);
        }
        if (to === 'time') {
            return value.slice(11, 16);
        }
        if (to === 'month') {
            return value.slice(0, 7);
        }
        return '';
    }
    // month 'YYYY-MM'
    if (from === 'month') {
        if (to === 'date') {
            return `${value}-01`;
        }
        if (to === 'datetime-local') {
            return `${value}-01T00:00`;
        }
        return '';
    }
    // time 'HH:mm' — no date info, cannot convert upward
    return '';
}

export default defineComponent({
    name: componentName,
    components: { VsInput, VsInputWrapper },
    props: {
        ...getInputProps<VsDatePickerValueType>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsDatePickerStyleSet>(),
        ...getDateMinMaxProps(),
        type: { type: String as PropType<VsDatePickerType>, default: 'date' },
        noClear: { type: Boolean, default: false },
        canSelectDate: {
            type: Function as PropType<(value: string) => boolean | undefined>,
            default: undefined,
        },

        // v-model
        modelValue: {
            type: String as PropType<VsDatePickerValueType>,
            default: '',
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur', 'clear', 'invalid'],
    setup(props, { emit }) {
        // 내부 VsInput 이 부모 VsForm 에 별도 필드로 등록되지 않도록 격리한다.
        provide(FORM_STORE_KEY, FormStore.getDefaultFormStore());

        const {
            styleSet,
            type,
            modelValue,
            required,
            min,
            max,
            canSelectDate,
            id,
            disabled,
            readonly: readonlyProp,
            messages,
            placeholder,
            rules,
            noDefaultRules,
            state,
        } = toRefs(props);

        const inputValue: Ref<VsDatePickerValueType> = ref(modelValue.value);
        const dateInputRef: TemplateRef<VsInputRef> = useTemplateRef('dateInputRef');

        const { componentStyleSet } = useStyleSet<VsDatePickerStyleSet>(componentName, styleSet);

        const { requiredCheck, minCheck, maxCheck, notDisabledCheck } = useVsDatePickerRules(
            required,
            min,
            max,
            canSelectDate,
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
        } = useInput<VsDatePickerValueType>(
            { emit },
            {
                inputValue,
                modelValue,
                id,
                disabled,
                readonly: readonlyProp,
                messages,
                rules,
                defaultRules: computed(() => [requiredCheck, minCheck, maxCheck, notDisabledCheck]),
                noDefaultRules,
                state,
                callbacks: {
                    onClear,
                },
            },
        );

        const computedPlaceholder = computed(() => placeholder.value || TYPE_TO_FORMAT[type.value]);

        const displayValue = computed(() => (isValidFormat(inputValue.value, type.value) ? inputValue.value : ''));

        function onDateInput(value: string | number | null) {
            const raw = value?.toString() ?? '';
            if (!raw) {
                onClear();
                return;
            }

            if (!isValidFormat(raw, type.value)) {
                emit('invalid', { input: raw });
                return;
            }

            if (canSelectDate.value?.(raw) === false) {
                emit('invalid', { input: raw });
                return;
            }

            inputValue.value = raw;
        }

        function onClear() {
            inputValue.value = '';
            emit('clear');
        }

        // type prop 변경 시 modelValue 를 새 format 에 맞춰 자동 패딩 변환, 실패 시 clear
        watch(type, (newType, oldType) => {
            if (!oldType || newType === oldType) {
                return;
            }
            const current = inputValue.value;
            if (!current) {
                return;
            }
            const converted = convertFormat(current, oldType, newType);
            if (converted !== current) {
                inputValue.value = converted;
            }
        });

        // 외부에서 invalid format 의 modelValue 가 주입된 경우 invalid emit (modelValue 는 유지)
        watch(
            modelValue,
            (v) => {
                if (v && !isValidFormat(v, type.value)) {
                    emit('invalid', { input: v });
                }
            },
            { immediate: true },
        );

        const computedIcon = computed<Component>(() => (type.value === 'time' ? ClockIcon : CalendarIcon));

        function focus() {
            dateInputRef.value?.focus();
        }

        function blur() {
            dateInputRef.value?.blur();
        }

        function onFocus(e: FocusEvent) {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent) {
            emit('blur', e);
        }

        function openPicker() {
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

        return {
            // Refs
            dateInputRef,

            // Computed
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
