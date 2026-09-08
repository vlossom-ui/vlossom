import type { Ref } from 'vue';
import type { VsInputType, VsInputValueType } from './types';
import { useMessages } from '@/composables';

export function useVsInputRules(
    required: Ref<boolean>,
    max: Ref<number | string>,
    min: Ref<number | string>,
    type: Ref<VsInputType>,
) {
    const { messages, formatMessage } = useMessages();
    function requiredCheck(v: VsInputValueType) {
        if (required.value && v === '') {
            return messages.value.VS_VALIDATION_REQUIRED;
        }

        return '';
    }

    function maxCheck(v: VsInputValueType) {
        const limit = Number(max.value);
        if (type.value === 'number' && typeof v === 'number' && v > limit) {
            return formatMessage(messages.value.VS_VALIDATION_MAX_VALUE, { value: max.value });
        }

        if (type.value !== 'number' && typeof v === 'string' && v.length > limit) {
            return formatMessage(messages.value.VS_VALIDATION_MAX_LENGTH, { value: max.value });
        }

        return '';
    }

    function minCheck(v: VsInputValueType) {
        const limit = Number(min.value);
        if (type.value === 'number' && typeof v === 'number' && v < limit) {
            return formatMessage(messages.value.VS_VALIDATION_MIN_VALUE, { value: min.value });
        }

        if (type.value !== 'number' && typeof v === 'string' && v.length < limit) {
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
