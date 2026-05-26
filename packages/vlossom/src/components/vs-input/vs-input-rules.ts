import type { Ref } from 'vue';
import type { VsInputType, VsInputValueType } from './types';

export function useVsInputRules(
    required: Ref<boolean>,
    max: Ref<number | string>,
    min: Ref<number | string>,
    type: Ref<VsInputType>,
) {
    function requiredCheck(v: VsInputValueType) {
        if (required.value && v === '') {
            return 'required';
        }

        return '';
    }

    function maxCheck(v: VsInputValueType) {
        const limit = Number(max.value);
        if (type.value === 'number' && typeof v === 'number' && v > limit) {
            return 'max value: ' + max.value;
        }

        if (type.value !== 'number' && typeof v === 'string' && v.length > limit) {
            return 'max length: ' + max.value;
        }

        return '';
    }

    function minCheck(v: VsInputValueType) {
        const limit = Number(min.value);
        if (type.value === 'number' && typeof v === 'number' && v < limit) {
            return 'min value: ' + min.value;
        }

        if (type.value !== 'number' && typeof v === 'string' && v.length < limit) {
            return 'min length: ' + min.value;
        }

        return '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
    };
}
