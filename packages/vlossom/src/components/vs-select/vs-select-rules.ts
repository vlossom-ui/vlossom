import type { Ref } from 'vue';

export function useSelectRules(
    required: Ref<boolean>,
    multiple: Ref<boolean>,
    min: Ref<number | string>,
    max: Ref<number | string>,
) {
    function requiredCheck(inputValue: Ref<any>): string {
        if (!required.value) {
            return '';
        }
        if (multiple.value) {
            return !Array.isArray(inputValue.value) || inputValue.value.length === 0 ? 'required' : '';
        }
        return !inputValue.value ? 'required' : '';
    }

    function maxCheck(inputValue: Ref<any>): string {
        if (!multiple.value || !Array.isArray(inputValue.value)) {
            return '';
        }
        const limit = Number(max.value);
        return inputValue.value.length > limit ? 'max number of items: ' + max.value : '';
    }

    function minCheck(inputValue: Ref<any>): string {
        if (!multiple.value || !Array.isArray(inputValue.value)) {
            return '';
        }
        const limit = Number(min.value);
        return inputValue.value.length < limit ? 'min number of items: ' + min.value : '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
    };
}
