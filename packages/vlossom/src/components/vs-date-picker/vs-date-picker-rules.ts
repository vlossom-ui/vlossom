import type { Ref } from 'vue';

export function useVsDatePickerRules(
    required: Ref<boolean>,
    min: Ref<string | undefined>,
    max: Ref<string | undefined>,
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

    return {
        requiredCheck,
        minCheck,
        maxCheck,
    };
}
