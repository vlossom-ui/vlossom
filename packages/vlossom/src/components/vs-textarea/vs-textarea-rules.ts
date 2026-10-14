import type { Ref } from 'vue';
import type { VsTextareaValueType } from './types';
import { useMessages } from '@/composables';

export function useVsTextareaRules(
    required: Ref<boolean>,
    max: Ref<number | string>,
    min: Ref<number | string>,
    isEmpty: (v: VsTextareaValueType) => boolean,
) {
    const { optionMessages, formatMessage } = useMessages();
    function requiredCheck(v: VsTextareaValueType) {
        if (required.value && isEmpty(v)) {
            return optionMessages.value.VS_VALIDATION_REQUIRED;
        }

        return '';
    }

    function maxCheck(v: VsTextareaValueType) {
        const value = isEmpty(v) ? '' : v;
        const limit = Number(max.value);
        if (typeof value === 'string' && value.length > limit) {
            return formatMessage(optionMessages.value.VS_VALIDATION_MAX_LENGTH, { value: max.value });
        }

        return '';
    }

    function minCheck(v: VsTextareaValueType) {
        const value = isEmpty(v) ? '' : v;
        const limit = Number(min.value);
        if (typeof value === 'string' && value.length < limit) {
            return formatMessage(optionMessages.value.VS_VALIDATION_MIN_LENGTH, { value: min.value });
        }

        return '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
    };
}
