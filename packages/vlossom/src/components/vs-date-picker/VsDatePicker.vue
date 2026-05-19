<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style-set="componentStyleSet.$wrapper"
        :width
        :grid
        :disabled="computedDisabled"
        :hidden
        :id="computedId"
        :label
        :no-label
        :no-messages
        :required
        :messages="computedMessages"
        :shake
    >
        <template #label v-if="!noLabel && (!!label || !!$slots.label)">
            <slot name="label" />
        </template>

        <div :class="['vs-date-picker', { 'has-timezone': timezone, 'vs-responsive': responsive }]">
            <div class="vs-date-picker-row">
                <div
                    class="vs-date-picker-input-wrapper"
                    :class="{
                        'vs-disabled': computedDisabled,
                        'vs-readonly': computedReadonly,
                        'vs-focus-within': !computedDisabled && !computedReadonly,
                    }"
                    @click="open"
                >
                    <vs-input
                        class="vs-date-picker-display"
                        readonly
                        :no-clear="noClear"
                        :clear-on-readonly="!computedReadonly"
                        no-label
                        no-messages
                        :model-value="displayValue"
                        :placeholder="computedPlaceholder"
                        :disabled="computedDisabled"
                        :state="computedState"
                        :rules="[]"
                        no-default-rules
                        :color-scheme="colorScheme"
                        :style-set="componentStyleSet.$input"
                        @update:model-value="onDisplayClear"
                    >
                        <template #prepend>
                            <i class="vs-date-picker-icon size-5">
                                <vs-render :content="calendarIcon" />
                            </i>
                            <slot v-if="$slots['prepend']" name="prepend" />
                        </template>
                        <template v-if="$slots['append']" #append>
                            <slot name="append" />
                        </template>
                    </vs-input>

                    <input
                        ref="nativeDateRef"
                        class="vs-date-picker-native"
                        :type
                        :value="displayValue"
                        :min="minDisplay"
                        :max="maxDisplay"
                        :step="normalizedStep"
                        :name
                        :disabled="computedDisabled"
                        :readonly="computedReadonly"
                        :aria-required="required"
                        :aria-invalid="computedState === 'error' ? true : undefined"
                        tabindex="-1"
                        aria-hidden="true"
                        @input.stop="onNativeInput"
                        @change.stop
                    />
                </div>

                <vs-divider
                    v-if="timezone"
                    vertical
                    :responsive
                    class="vs-date-picker-divider"
                    aria-hidden="true"
                />

                <vs-select
                    v-if="timezone"
                    :model-value="currentTimezone"
                    class="vs-date-picker-timezone"
                    :options="timezoneOptions"
                    option-label="label"
                    option-value="value"
                    :search="timezoneSearchable"
                    :style-set="componentStyleSet.$timezoneSelect"
                    :disabled="computedDisabled"
                    :readonly="computedReadonly"
                    no-clear
                    no-label
                    no-messages
                    aria-label="Timezone"
                    @update:model-value="onTimezoneChange"
                >
                    <template v-if="$slots['timezone-option']" #option="ctx">
                        <slot name="timezone-option" v-bind="ctx" />
                    </template>
                </vs-select>
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
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import { dateUtil } from '@/utils';

import {
    DEFAULT_TIMEZONE_OPTIONS,
    type TimezoneOption,
    type VsDatePickerStyleSet,
    type VsDatePickerType,
    type VsDatePickerValueType,
} from './types';
import { useVsDatePickerRules } from './vs-date-picker-rules';

import VsDivider from '@/components/vs-divider/VsDivider.vue';
import VsInput from '@/components/vs-input/VsInput.vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsRender from '@/components/vs-render/VsRender.vue';
import VsSelect from '@/components/vs-select/VsSelect.vue';

const componentName = VsComponent.VsDatePicker;

const FALLBACK_CALENDAR_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

export default defineComponent({
    name: componentName,
    components: { VsDivider, VsInput, VsInputWrapper, VsRender, VsSelect },
    props: {
        ...getInputProps<VsDatePickerValueType>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsDatePickerStyleSet>(),
        type: { type: String as PropType<VsDatePickerType>, default: 'date' },
        min: { type: Date as PropType<Date | undefined>, default: undefined },
        max: { type: Date as PropType<Date | undefined>, default: undefined },
        step: { type: Number as PropType<number | undefined>, default: undefined },
        noStepNormalize: { type: Boolean, default: false },
        disabledDates: { type: Array as PropType<Date[]>, default: () => [] },
        noClear: { type: Boolean, default: false },
        calendarIcon: { type: String, default: FALLBACK_CALENDAR_ICON },
        /**
         * container width 가 좁아지면 (@container max-width 768px) date input 과
         * timezone select 를 세로(column) 로 stack. timezone 사용 케이스에서만 의미 있음.
         */
        responsive: { type: Boolean, default: false },
        timezone: { type: Boolean, default: false },
        timezoneOptions: {
            type: Array as PropType<TimezoneOption[]>,
            default: () => DEFAULT_TIMEZONE_OPTIONS,
        },
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
            step,
            noStepNormalize,
            disabledDates,
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
        const nativeDateRef: TemplateRef<HTMLInputElement> = useTemplateRef('nativeDateRef');

        const currentTimezone = ref(
            timezone.value && timezoneOptions.value.length > 0
                ? timezoneOptions.value[0].value
                : 'Etc/UTC',
        );

        const { componentStyleSet } = useStyleSet<VsDatePickerStyleSet>(componentName, styleSet);

        const { requiredCheck, minCheck, maxCheck, notDisabledCheck, invalidValueCheck } =
            useVsDatePickerRules(required, min, max, disabledDates);

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

        function sliceWall(wall: string): string {
            switch (type.value) {
                case 'date':
                    return wall.slice(0, 10);
                case 'datetime-local':
                    return wall;
                case 'time':
                    return wall.slice(11, 16);
                case 'month':
                    return wall.slice(0, 7);
                default:
                    return wall;
            }
        }

        const displayValue = computed(() => {
            if (!inputValue.value) {
                return '';
            }
            const wall = dateUtil.toZonedIso(inputValue.value, currentTimezone.value);
            return sliceWall(wall);
        });

        function toDisplayBound(d: Date | undefined): string | undefined {
            if (!d) {
                return undefined;
            }
            return sliceWall(dateUtil.toZonedIso(d, currentTimezone.value));
        }

        const minDisplay = computed(() => toDisplayBound(min.value));
        const maxDisplay = computed(() => toDisplayBound(max.value));

        const normalizedStep = computed(() => {
            const s = step.value;
            if (s === undefined) {
                return undefined;
            }
            if (noStepNormalize.value) {
                return s;
            }
            if (s >= 60) {
                return s;
            }
            const rounded = Math.ceil(s / 60) * 60;
            console.warn(
                `[VsDatePicker] step=${s}s is sub-minute; rounded to ${rounded}s. ` +
                    'Pass noStepNormalize=true to disable.',
            );
            return rounded;
        });

        function expandToFullIso(value: string): string | null {
            switch (type.value) {
                case 'date':
                    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00` : null;
                case 'datetime-local':
                    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value) ? value.slice(0, 16) : null;
                case 'time':
                    return /^\d{2}:\d{2}/.test(value) ? `1970-01-01T${value.slice(0, 5)}` : null;
                case 'month':
                    return /^\d{4}-\d{2}$/.test(value) ? `${value}-01T00:00` : null;
            }
        }

        function onNativeInput(event: Event) {
            const raw = (event.target as HTMLInputElement).value;
            if (!raw) {
                inputValue.value = null;
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

            if (disabledDates.value.some((d) => dateUtil.sameDay(d, utc))) {
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
                const wall = dateUtil.toZonedIso(inputValue.value, fromTz);
                const newUtc = dateUtil.fromZonedIso(wall, newTz);
                inputValue.value = newUtc;
            }
            currentTimezone.value = newTz;
            emit('timezone-change', { from: fromTz, to: newTz });
        }

        const timezoneSearchable = computed(() => timezoneOptions.value.length >= 20);

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
                defaultRules: computed(() => [
                    requiredCheck,
                    minCheck,
                    maxCheck,
                    notDisabledCheck,
                    invalidValueCheck,
                ]),
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
            nativeDateRef.value?.focus();
        }

        function blur() {
            nativeDateRef.value?.blur();
        }

        function onFocus(e: FocusEvent) {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent) {
            emit('blur', e);
        }

        /*
         * VsInput 내장 clear 버튼이 클릭되면 @update:model-value 로 빈 문자열을 emit 한다.
         * 그것을 받아 우리 modelValue 를 null 로 reset 하고 picker 트리거에 focus.
         */
        function onDisplayClear(value: string) {
            if (!value) {
                onClear();
                focus();
            }
        }

        function openPicker() {
            const el = nativeDateRef.value;
            if (!el || computedDisabled.value || computedReadonly.value) {
                return;
            }
            /*
             * focus 를 먼저 부여해서 wrapper 의 :focus-within outline 이 표시되게 한다.
             * (showPicker() 자체는 focus 를 자동으로 부여하지 않음)
             */
            el.focus();
            const showPicker = (el as HTMLInputElement & { showPicker?: () => void }).showPicker;
            if (typeof showPicker === 'function') {
                try {
                    showPicker.call(el);
                } catch {
                    /* picker open 이 거부되어도 focus 는 유지 */
                }
            }
        }

        return {
            // refs
            nativeDateRef,

            // state
            componentStyleSet,
            displayValue,
            minDisplay,
            maxDisplay,
            normalizedStep,
            computedPlaceholder,
            computedMessages,
            computedDisabled,
            computedReadonly,
            computedState,
            shake,
            computedId,
            currentTimezone: readonly(currentTimezone),
            timezoneSearchable,

            // methods
            onNativeInput,
            onFocus,
            onBlur,
            onTimezoneChange,
            onDisplayClear,
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
