import type { Ref } from 'vue';
import type { VsDatePickerCanSelectDate } from './types';

export function useVsDatePickerRules(
    required: Ref<boolean>,
    min: Ref<Date | undefined>,
    max: Ref<Date | undefined>,
    canSelectDate: Ref<VsDatePickerCanSelectDate | undefined>,
) {
    function requiredCheck(v: Date | null): string {
        if (required.value && v === null) {
            return 'Required';
        }
        return '';
    }

    function minCheck(v: Date | null): string {
        if (v === null || !min.value) {
            return '';
        }
        return v.getTime() >= min.value.getTime()
            ? ''
            : `Must be on or after ${min.value.toISOString()}`;
    }

    function maxCheck(v: Date | null): string {
        if (v === null || !max.value) {
            return '';
        }
        return v.getTime() <= max.value.getTime()
            ? ''
            : `Must be on or before ${max.value.toISOString()}`;
    }

    function notDisabledCheck(v: Date | null): string {
        if (v === null) {
            return '';
        }
        return canSelectDate.value?.(v) === false ? 'This date is not selectable' : '';
    }

    function invalidValueCheck(v: Date | null): string {
        if (v === undefined) {
            return 'Invalid date';
        }
        return '';
    }

    return {
        requiredCheck,
        minCheck,
        maxCheck,
        notDisabledCheck,
        invalidValueCheck,
    };
}
