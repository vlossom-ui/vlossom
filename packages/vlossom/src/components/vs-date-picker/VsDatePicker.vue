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
            @pointerdown="onPointerDown"
            @click="onClick"
            @keydown.enter.stop="onKeydownEnter"
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
        const isFocused = ref(false);
        const pointerInitiated = ref(false);
        // 네이티브 picker는 열기/닫기 API가 없어 상태를 직접 추적
        const pickerOpen = ref(false);
        const suppressFocusEvents = ref(false);

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
                    getClearPayload: (oldValue) => oldValue,
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

        // date/time input은 placeholder를 무시 → 비어있고 비포커스면 text로 노출 후 네이티브 타입으로 캐스팅
        const deceiveType = computed<VsInputType>(() => {
            if (!isFocused.value && !displayValue.value) {
                return 'text';
            }
            return type.value as unknown as VsInputType;
        });

        function onDateInput(value: string | number | null): void {
            pickerOpen.value = false;

            const raw = value?.toString() ?? '';
            if (!raw) {
                if (inputValue.value && !isValidFormat(inputValue.value, type.value)) {
                    return;
                }
                clear();
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
        }

        function onPointerDown(): void {
            pointerInitiated.value = true;
        }

        function onFocus(e: FocusEvent): void {
            // 포인터 focus는 click까지 text 유지(타입 변경 시 click 무시), 키보드 focus는 즉시 전환
            if (!pointerInitiated.value) {
                isFocused.value = true;
            }
            if (suppressFocusEvents.value) {
                return;
            }
            emit('focus', e);
        }

        function onBlur(e: FocusEvent): void {
            isFocused.value = false;
            pointerInitiated.value = false;
            pickerOpen.value = false;
            if (suppressFocusEvents.value) {
                return;
            }
            emit('blur', e);
        }

        // text→네이티브 타입 전환 후 picker 열기. click 핸들러 안에서 해야 제스처가 유지돼 첫 click에 열림
        function openPicker(): void {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            const input = dateInputRef.value?.inputRef;
            if (!input) {
                return;
            }

            isFocused.value = true;
            if (input.type !== type.value) {
                input.type = type.value;
            }

            input.focus();

            const showPicker = input.showPicker;
            if (typeof showPicker === 'function') {
                showPicker.call(input);
            }
            pickerOpen.value = true;
        }

        // 포커스 유지하며 닫는 API가 없어 blur로 닫고 재포커스
        function closePicker(input: HTMLInputElement): void {
            pickerOpen.value = false;
            suppressFocusEvents.value = true;
            input.blur();
            input.focus();
            suppressFocusEvents.value = false;
        }

        // 토글: 열린 picker는 mousedown에서 브라우저가 닫으므로 재오픈만 안 하면 됨
        function onClick(): void {
            pointerInitiated.value = false;

            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            if (pickerOpen.value) {
                pickerOpen.value = false;
                return;
            }

            openPicker();
        }

        function onKeydownEnter(e: KeyboardEvent): void {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            const input = dateInputRef.value?.inputRef;
            if (!input) {
                return;
            }

            e.preventDefault();

            if (pickerOpen.value) {
                closePicker(input);
                return;
            }

            openPicker();
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
            onPointerDown,
            onClick,
            onKeydownEnter,
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
