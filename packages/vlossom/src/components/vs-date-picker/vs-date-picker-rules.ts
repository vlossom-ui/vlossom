import type { Ref } from 'vue';
import { useMessages } from '@/composables';

export function useVsDatePickerRules(
    required: Ref<boolean>,
    min: Ref<string | undefined>,
    max: Ref<string | undefined>,
) {
    const { optionMessages, formatMessage } = useMessages();
    function requiredCheck(v: string): string {
        if (required.value && !v) {
            return optionMessages.value.VS_VALIDATION_REQUIRED;
        }
        return '';
    }

    function minCheck(v: string): string {
        if (!v || !min.value) {
            return '';
        }
        return v >= min.value ? '' : formatMessage(optionMessages.value.VS_VALIDATION_DATE_MIN, { value: min.value });
    }

    function maxCheck(v: string): string {
        if (!v || !max.value) {
            return '';
        }
        return v <= max.value ? '' : formatMessage(optionMessages.value.VS_VALIDATION_DATE_MAX, { value: max.value });
    }

    return {
        requiredCheck,
        minCheck,
        maxCheck,
    };
}
