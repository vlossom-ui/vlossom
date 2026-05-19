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

        <div
            :class="['vs-date-picker-row', colorSchemeClass, classObj]"
            :style="{ ...componentInlineStyle, ...componentStyleSet.$row }"
        >
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
                :color-scheme="colorScheme"
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

            <div
                :class="['vs-date-picker', stateBoxClasses]"
                :style="componentStyleSet.$datePicker"
            >
                <div v-if="$slots['prepend']" class="vs-prepend" :style="componentStyleSet.$prepend">
                    <slot name="prepend" />
                </div>

                <input
                    ref="inputRef"
                    :style="componentStyleSet.$input"
                    :id="computedId"
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
                    :placeholder
                    @input.stop="onInput"
                    @focus.stop="onFocus"
                    @blur.stop="onBlur"
                    @change.stop
                />

                <button
                    v-if="renderClearButton"
                    type="button"
                    class="vs-clear-button"
                    aria-label="Clear"
                    :class="{ show: !!displayValue }"
                    :disabled="!displayValue"
                    :tabindex="!!displayValue ? 0 : -1"
                    @click.stop="clearWithFocus"
                >
                    <i class="size-5">
                        <vs-render :content="closeIcon" />
                    </i>
                </button>

                <button
                    type="button"
                    class="vs-date-picker-icon-button"
                    aria-label="Open date picker"
                    :style="componentStyleSet.$iconButton"
                    :disabled="computedDisabled || computedReadonly"
                    @click.stop="open"
                >
                    <i class="size-5">
                        <vs-render :content="calendarIcon" />
                    </i>
                </button>

                <div v-if="$slots['append']" class="vs-append" :style="componentStyleSet.$append">
                    <slot name="append" />
                </div>
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
    readonly,
    ref,
    toRefs,
    useTemplateRef,
    watch,
    type PropType,
    type Ref,
    type TemplateRef,
} from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet, useInput, useStateClass } from '@/composables';
import { getInputProps, getResponsiveProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import { closeIcon } from '@/icons';
import { dateUtil } from '@/utils';

import {
    DEFAULT_TIMEZONE_OPTIONS,
    type TimezoneOption,
    type VsDatePickerStyleSet,
    type VsDatePickerType,
    type VsDatePickerValueType,
} from './types';
import { useVsDatePickerRules } from './vs-date-picker-rules';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsRender from '@/components/vs-render/VsRender.vue';
import VsSelect from '@/components/vs-select/VsSelect.vue';

const componentName = VsComponent.VsDatePicker;

const FALLBACK_CALENDAR_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

export default defineComponent({
    name: componentName,
    components: { VsInputWrapper, VsRender, VsSelect },
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
            colorScheme,
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
            noClear,
            disabled,
            readonly: readonlyProp,
            messages,
            rules,
            noDefaultRules,
            state,
            timezone,
            timezoneOptions,
        } = toRefs(props);

        const inputValue: Ref<VsDatePickerValueType> = ref(modelValue.value);
        const inputRef: TemplateRef<HTMLInputElement> = useTemplateRef('inputRef');

        const currentTimezone = ref(
            timezone.value && timezoneOptions.value.length > 0
                ? timezoneOptions.value[0].value
                : 'Etc/UTC',
        );

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables, componentInlineStyle } =
            useStyleSet<VsDatePickerStyleSet>(componentName, styleSet);

        const { requiredCheck, minCheck, maxCheck, notDisabledCheck, invalidValueCheck } =
            useVsDatePickerRules(required, min, max, disabledDates);

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

        function onInput(event: Event) {
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

        const classObj = computed(() => ({
            'vs-focus-visible': !computedDisabled.value && !computedReadonly.value,
            'vs-focus-within': !computedDisabled.value && !computedReadonly.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
        }));

        const { stateBoxClasses } = useStateClass(computedState);

        const renderClearButton = computed(
            () => !noClear.value && !computedReadonly.value && !computedDisabled.value,
        );

        function focus() {
            inputRef.value?.focus();
        }

        function blur() {
            inputRef.value?.blur();
        }

        function onFocus(e: FocusEvent) {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent) {
            emit('blur', e);
        }

        function clearWithFocus() {
            onClear();
            focus();
        }

        function openPicker() {
            const el = inputRef.value;
            if (!el) {
                return;
            }
            const showPicker = (el as HTMLInputElement & { showPicker?: () => void }).showPicker;
            if (typeof showPicker === 'function') {
                try {
                    showPicker.call(el);
                } catch {
                    el.focus();
                }
            } else {
                el.focus();
            }
        }

        watch(currentTimezone, () => {
            // displayValue는 computed라 자동 갱신
        });

        return {
            // refs
            inputRef,

            // state
            classObj,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,
            displayValue,
            minDisplay,
            maxDisplay,
            normalizedStep,
            computedMessages,
            computedDisabled,
            computedReadonly,
            computedState,
            renderClearButton,
            shake,
            stateBoxClasses,
            computedId,
            currentTimezone: readonly(currentTimezone),
            timezoneSearchable,

            // methods
            onInput,
            onFocus,
            onBlur,
            onTimezoneChange,
            focus,
            blur,
            clear,
            validate,
            clearWithFocus,
            open: openPicker,

            // icons
            closeIcon,
        };
    },
});
</script>

<style lang="css" src="./VsDatePicker.css" />
