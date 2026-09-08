import type { Ref } from 'vue';
import type { VsTextareaValueType } from './types';
import { formatMessage } from '@/declaration';
import { useOptionsStore } from '@/stores';

export function useVsTextareaRules(required: Ref<boolean>, max: Ref<number | string>, min: Ref<number | string>) {
    const messages = useOptionsStore().messages;
    function requiredCheck(v: VsTextareaValueType) {
        if (required.value && v === '') {
            return messages.value.VS_VALIDATION_REQUIRED;
        }

        return '';
    }

    function maxCheck(v: VsTextareaValueType) {
        const limit = Number(max.value);
        if (typeof v === 'string' && v.length > limit) {
            return formatMessage(messages.value.VS_VALIDATION_MAX_LENGTH, { value: max.value });
        }

        return '';
    }

    function minCheck(v: VsTextareaValueType) {
        const limit = Number(min.value);
        if (typeof v === 'string' && v.length < limit) {
            return formatMessage(messages.value.VS_VALIDATION_MIN_LENGTH, { value: min.value });
        }

        return '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
    };
}
