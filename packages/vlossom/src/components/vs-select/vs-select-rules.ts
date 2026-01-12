import type { Ref } from 'vue';

export function useSelectRules(
    required: Ref<boolean>,
    multiple: Ref<boolean>,
    min: Ref<number | string>,
    max: Ref<number | string>,
) {
    function requiredCheck(inputValue: any): string {
        if (!required.value) {
            return '';
        }
        if (multiple.value) {
            return !Array.isArray(inputValue) || inputValue.length === 0 ? 'required' : '';
        }
        return !inputValue ? 'required' : '';
    }

    function maxCheck(inputValue: any): string {
        if (!multiple.value || !Array.isArray(inputValue)) {
            return '';
        }
        const limit = Number(max.value);
        return inputValue.length > limit ? 'max number of items: ' + max.value : '';
    }

    function minCheck(inputValue: any): string {
        if (!multiple.value || !Array.isArray(inputValue)) {
            return '';
        }
        const limit = Number(min.value);
        return inputValue.length < limit ? 'min number of items: ' + min.value : '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
    };
}
