import type { Ref } from 'vue';
import { useMessages } from '@/composables';

export function useSelectRules(
    required: Ref<boolean>,
    multiple: Ref<boolean>,
    min: Ref<number | string>,
    max: Ref<number | string>,
) {
    const { optionMessages, formatMessage } = useMessages();
    function requiredCheck(inputValue: any): string {
        if (!required.value) {
            return '';
        }
        if (multiple.value) {
            return !Array.isArray(inputValue) || inputValue.length === 0
                ? optionMessages.value.VS_VALIDATION_REQUIRED
                : '';
        }
        return !inputValue ? optionMessages.value.VS_VALIDATION_REQUIRED : '';
    }

    function maxCheck(inputValue: any): string {
        if (!multiple.value || !Array.isArray(inputValue)) {
            return '';
        }
        const limit = Number(max.value);
        return inputValue.length > limit
            ? formatMessage(optionMessages.value.VS_VALIDATION_MAX_ITEMS, { value: max.value })
            : '';
    }

    function minCheck(inputValue: any): string {
        if (!multiple.value || !Array.isArray(inputValue)) {
            return '';
        }
        const limit = Number(min.value);
        return inputValue.length < limit
            ? formatMessage(optionMessages.value.VS_VALIDATION_MIN_ITEMS, { value: min.value })
            : '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
    };
}
