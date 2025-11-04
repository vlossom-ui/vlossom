import type { Ref } from 'vue';
import type { VsTextareaValueType } from './types';

export function useVsTextareaRules(required: Ref<boolean>, max: Ref<number | string>, min: Ref<number | string>) {
    function requiredCheck(v: VsTextareaValueType) {
        if (required.value && v === '') {
            return 'required';
        }

        return '';
    }

    function maxCheck(v: VsTextareaValueType) {
        const limit = Number(max.value);
        if (typeof v === 'string' && v.length > limit) {
            return 'max length: ' + max.value;
        }

        return '';
    }

    function minCheck(v: VsTextareaValueType) {
        const limit = Number(min.value);
        if (typeof v === 'string' && v.length < limit) {
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
