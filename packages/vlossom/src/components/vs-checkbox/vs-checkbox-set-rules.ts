import type { Ref } from 'vue';
import { useMessages } from '@/composables';

export function useVsCheckboxSetRules(
    required: Ref<boolean>,
    max: Ref<number | string>,
    min: Ref<number | string>,
    isOptionValue: (value: any) => boolean = () => true,
) {
    const { optionMessages, formatMessage } = useMessages();

    // options를 불러오는 중에는 정리되지 않은 값이 남아 있을 수 있어 options에 있는 값만 센다
    function countSelected(v: any[]) {
        return v.filter((value) => isOptionValue(value)).length;
    }

    function requiredCheck(v: any[]) {
        return required.value && v && countSelected(v) === 0 ? optionMessages.value.VS_VALIDATION_REQUIRED : '';
    }

    function maxCheck(v: any[]) {
        const limit = Number(max.value);
        return v && countSelected(v) > limit
            ? formatMessage(optionMessages.value.VS_VALIDATION_MAX_ITEMS, { value: max.value })
            : '';
    }

    function minCheck(v: any[]) {
        const limit = Number(min.value);
        return v && countSelected(v) < limit
            ? formatMessage(optionMessages.value.VS_VALIDATION_MIN_ITEMS, { value: min.value })
            : '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
    };
}
