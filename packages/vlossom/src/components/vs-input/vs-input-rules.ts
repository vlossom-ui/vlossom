import type { Ref } from 'vue';
import type { VsInputType, VsInputValueType } from './types';
import { useMessages } from '@/composables';

export function useVsInputRules(
    required: Ref<boolean>,
    max: Ref<number | string>,
    min: Ref<number | string>,
    type: Ref<VsInputType>,
    isEmpty: (v: VsInputValueType) => boolean,
) {
    const { optionMessages, formatMessage } = useMessages();

    // emptyValue에 상관없이 min/max가 같은 빈 값 기준으로 동작하도록 정규화
    function normalize(v: VsInputValueType): VsInputValueType {
        if (!isEmpty(v)) {
            return v;
        }
        return type.value === 'number' ? null : '';
    }

    function requiredCheck(v: VsInputValueType) {
        if (required.value && isEmpty(v)) {
            return optionMessages.value.VS_VALIDATION_REQUIRED;
        }

        return '';
    }

    function maxCheck(v: VsInputValueType) {
        const value = normalize(v);
        const limit = Number(max.value);
        if (type.value === 'number' && typeof value === 'number' && value > limit) {
            return formatMessage(optionMessages.value.VS_VALIDATION_MAX_VALUE, { value: max.value });
        }

        if (type.value !== 'number' && typeof value === 'string' && value.length > limit) {
            return formatMessage(optionMessages.value.VS_VALIDATION_MAX_LENGTH, { value: max.value });
        }

        return '';
    }

    function minCheck(v: VsInputValueType) {
        const value = normalize(v);
        const limit = Number(min.value);
        if (type.value === 'number' && typeof value === 'number' && value < limit) {
            return formatMessage(optionMessages.value.VS_VALIDATION_MIN_VALUE, { value: min.value });
        }

        if (type.value !== 'number' && typeof value === 'string' && value.length < limit) {
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
