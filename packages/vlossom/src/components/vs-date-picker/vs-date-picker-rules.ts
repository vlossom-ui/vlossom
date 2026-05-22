import type { Ref } from 'vue';

type CanSelectDate = (value: string) => boolean | undefined;

export function useVsDatePickerRules(
    required: Ref<boolean>,
    min: Ref<string | undefined>,
    max: Ref<string | undefined>,
    canSelectDate: Ref<CanSelectDate | undefined>,
) {
    function requiredCheck(v: string): string {
        if (required.value && !v) {
            return 'Required';
        }
        return '';
    }

    function minCheck(v: string): string {
        if (!v || !min.value) {
            return '';
        }
        return v >= min.value ? '' : `Must be on or after ${min.value}`;
    }

    function maxCheck(v: string): string {
        if (!v || !max.value) {
            return '';
        }
        return v <= max.value ? '' : `Must be on or before ${max.value}`;
    }

    function notDisabledCheck(v: string): string {
        if (!v) {
            return '';
        }
        return canSelectDate.value?.(v) === false ? 'This date is not selectable' : '';
    }

    return {
        requiredCheck,
        minCheck,
        maxCheck,
        notDisabledCheck,
    };
}
