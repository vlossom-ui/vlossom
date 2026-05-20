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

        <div :class="['vs-date-picker', 'vs-responsive', { 'has-timezone': timezone }]">
            <div class="vs-date-picker-row">
                <vs-input
                    ref="dateInputRef"
                    class="vs-date-picker-display"
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
                        <i v-else class="vs-date-picker-icon size-5">
                            <vs-render :content="computedIcon" />
                        </i>
                    </template>
                    <template v-if="$slots['append']" #append>
                        <slot name="append" />
                    </template>
                </vs-input>

                <template v-if="timezone">
                    <vs-divider class="vs-date-picker-divider" vertical responsive />

                    <vs-select
                        class="vs-date-picker-timezone"
                        :style-set="componentStyleSet.$timezoneSelect"
                        :model-value="currentTimezone"
                        :options="timezoneOptions"
                        option-label="label"
                        option-value="value"
                        :disabled="computedDisabled"
                        :readonly="computedReadonly"
                        :color-scheme
                        no-clear
                        no-label
                        no-messages
                        aria-label="Timezone"
                        @update:model-value="onTimezoneChange"
                    />
                </template>
            </div>
        </div>

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
    readonly,
    ref,
    toRefs,
    useTemplateRef,
    type PropType,
    type Ref,
    type TemplateRef,
} from 'vue';
import { VsComponent, FORM_STORE_KEY } from '@/declaration';
import { FormStore } from '@/stores';
import { useStyleSet, useInput } from '@/composables';
import {
    getInputProps,
    getResponsiveProps,
    getColorSchemeProps,
    getStyleSetProps,
    getDateMinMaxProps,
} from '@/props';
import { dateUtil } from '@/utils';

import { datePickerIcons } from './icons';
import { DEFAULT_TIMEZONE_OPTIONS, TYPE_TO_ISO_FORMAT } from './constants';
import {
    type TimezoneOption,
    type VsDatePickerCanSelectDate,
    type VsDatePickerStyleSet,
    type VsDatePickerType,
    type VsDatePickerValueType,
} from './types';
import { useVsDatePickerRules } from './vs-date-picker-rules';

import type { VsInputRef } from '@/components/vs-input/types';
import VsInput from '@/components/vs-input/VsInput.vue';
import VsDivider from '@/components/vs-divider/VsDivider.vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsRender from '@/components/vs-render/VsRender.vue';
import VsSelect from '@/components/vs-select/VsSelect.vue';

const componentName = VsComponent.VsDatePicker;

export default defineComponent({
    name: componentName,
    components: { VsDivider, VsInput, VsInputWrapper, VsRender, VsSelect },
    props: {
        ...getInputProps<VsDatePickerValueType>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsDatePickerStyleSet>(),
        ...getDateMinMaxProps(),
        type: { type: String as PropType<VsDatePickerType>, default: 'date' },
        noClear: { type: Boolean, default: false },
        canSelectDate: {
            type: Function as PropType<VsDatePickerCanSelectDate>,
            default: undefined,
        },
        timezone: { type: Boolean, default: false },
        timezoneOptions: {
            type: Array as PropType<TimezoneOption[]>,
            default: () => DEFAULT_TIMEZONE_OPTIONS,
        },

        // v-model
        modelValue: {
            type: Date as PropType<VsDatePickerValueType>,
            default: null,
        },
    },
    emits: [
        'update:modelValue',
        'update:changed',
        'update:valid',
        'change',
        'focus',
        'blur',
        'clear',
        'invalid',
        'timezone-change',
    ],
    setup(props, { emit }) {
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
            timezone,
            timezoneOptions,
        } = toRefs(props);

        const inputValue: Ref<VsDatePickerValueType> = ref(modelValue.value);
        const dateInputRef: TemplateRef<VsInputRef> = useTemplateRef('dateInputRef');

        const currentTimezone = ref(
            timezone.value && timezoneOptions.value.length > 0
                ? timezoneOptions.value[0].value
                : DEFAULT_TIMEZONE_OPTIONS[0].value,
        );

        const { componentStyleSet } = useStyleSet<VsDatePickerStyleSet>(componentName, styleSet);

        const { requiredCheck, minCheck, maxCheck, notDisabledCheck, invalidValueCheck } = useVsDatePickerRules(
            required,
            min,
            max,
            canSelectDate,
        );

        /*
         * placeholder 가 명시되지 않은 경우 type 별 기본 hint 를 자동 제공해 readonly display
         * 가 비어있는 상태에서도 사용자가 입력 포맷을 알 수 있게 한다.
         */
        const computedPlaceholder = computed(() => {
            if (placeholder.value) {
                return placeholder.value;
            }
            switch (type.value) {
                case 'date':
                    return 'YYYY-MM-DD';
                case 'datetime-local':
                    return 'YYYY-MM-DD HH:MM';
                case 'time':
                    return 'HH:MM';
                case 'month':
                    return 'YYYY-MM';
                default:
                    return '';
            }
        });

        function toDisplayIso(zonedIso: string): string {
            const parsed = dateUtil.fromIso(zonedIso, 'YYYY-MM-DDTHH:mm');
            if (!parsed) {
                return zonedIso;
            }
            return dateUtil.toIso(parsed, TYPE_TO_ISO_FORMAT[type.value]);
        }

        const displayValue = computed(() => {
            if (!inputValue.value) {
                return '';
            }
            const zonedIso = dateUtil.toZonedIso(inputValue.value, currentTimezone.value);
            return toDisplayIso(zonedIso);
        });

        function toTypedIso(value: string): string {
            switch (type.value) {
                case 'datetime-local':
                    return value.slice(0, 16);
                case 'time':
                    return value.slice(0, 5);
                default:
                    return value;
            }
        }

        function expandToFullIso(value: string): string | null {
            const parsed = dateUtil.fromIso(toTypedIso(value), TYPE_TO_ISO_FORMAT[type.value]);
            if (!parsed) {
                return null;
            }
            return dateUtil.toIso(parsed, 'YYYY-MM-DDTHH:mm');
        }

        function onDateInput(value: string | number | null) {
            const raw = value?.toString() ?? '';
            if (!raw) {
                onClear();
                return;
            }

            const fullIso = expandToFullIso(raw);
            if (!fullIso) {
                emit('invalid', { reason: 'parse', input: raw });
                return;
            }

            const tz = type.value === 'time' ? 'Etc/UTC' : currentTimezone.value;
            const utc = dateUtil.fromZonedIso(fullIso, tz);
            if (!utc) {
                emit('invalid', { reason: 'parse', input: raw });
                return;
            }

            if (canSelectDate.value?.(utc) === false) {
                emit('invalid', { reason: 'disabled', input: raw });
                return;
            }

            inputValue.value = utc;
        }

        function onClear() {
            inputValue.value = null;
            emit('clear');
        }

        function onTimezoneChange(newTz: string) {
            if (!dateUtil.isValidTimezone(newTz)) {
                emit('invalid', { reason: 'timezone', input: newTz });
                return;
            }
            const fromTz = currentTimezone.value;
            if (inputValue.value) {
                const zonedIso = dateUtil.toZonedIso(inputValue.value, fromTz);
                const newUtc = dateUtil.fromZonedIso(zonedIso, newTz);
                inputValue.value = newUtc;
            }
            currentTimezone.value = newTz;
            emit('timezone-change', { from: fromTz, to: newTz });
        }

        const computedIcon = computed(() => {
            if (type.value === 'time') {
                return datePickerIcons.CLOCK_ICON;
            }
            return datePickerIcons.CALENDAR_ICON;
        });

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
                defaultRules: computed(() => [requiredCheck, minCheck, maxCheck, notDisabledCheck, invalidValueCheck]),
                noDefaultRules,
                state,
                callbacks: {
                    onClear,
                },
            },
        );

        /*
         * descendant VsInput / VsSelect 가 outer VsForm 의 FormStore 에 등록되지 않도록 격리.
         * VsDatePicker 자신은 위 useInput 호출 시점에 outer FormStore 를 inject 받아 이미
         * 등록을 마쳤으므로, 이 시점 이후의 provide 는 descendants 에만 영향.
         */
        provide(FORM_STORE_KEY, FormStore.getDefaultFormStore());

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

            input.focus();
            const showPicker = input.showPicker;
            if (typeof showPicker !== 'function') {
                return;
            }

            try {
                showPicker.call(input);
            } catch {
                /* picker open 이 거부되어도 focus 는 유지 */
            }
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
            currentTimezone: readonly(currentTimezone),

            // Methods
            onDateInput,
            onFocus,
            onBlur,
            onTimezoneChange,
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
