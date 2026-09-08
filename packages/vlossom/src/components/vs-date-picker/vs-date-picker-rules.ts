import type { Ref } from 'vue';
import { formatMessage } from '@/declaration';
import { useOptionsStore } from '@/stores';

export function useVsDatePickerRules(
    required: Ref<boolean>,
    min: Ref<string | undefined>,
    max: Ref<string | undefined>,
) {
    const messages = useOptionsStore().messages;
    function requiredCheck(v: string): string {
        if (required.value && !v) {
            return messages.value.VS_VALIDATION_REQUIRED;
        }
        return '';
    }

    function minCheck(v: string): string {
        if (!v || !min.value) {
            return '';
        }
        return v >= min.value ? '' : formatMessage(messages.value.VS_VALIDATION_DATE_MIN, { value: min.value });
    }

    function maxCheck(v: string): string {
        if (!v || !max.value) {
            return '';
        }
        return v <= max.value ? '' : formatMessage(messages.value.VS_VALIDATION_DATE_MAX, { value: max.value });
    }

    return {
        requiredCheck,
        minCheck,
        maxCheck,
    };
}
