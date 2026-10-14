import type { Ref } from 'vue';
import type { OptionItem } from '@/declaration';
import { useMessages } from '@/composables';
import { objectUtil } from '@/utils';

export function useSelectRules(
    required: Ref<boolean>,
    multiple: Ref<boolean>,
    min: Ref<number | string>,
    max: Ref<number | string>,
    options: Ref<OptionItem[]>,
) {
    const { optionMessages, formatMessage } = useMessages();

    function isOptionValue(value: any) {
        return options.value.some((option) => objectUtil.isEqual(option.value, value));
    }

    // 선택이 없으면 inputValue가 배열이 아닌 emptyValue(null 등)일 수 있고,
    // options를 불러오는 중에는 정리되지 않은 값이 남아 있을 수 있어 options에 있는 값만 센다
    function countSelected(inputValue: any) {
        return Array.isArray(inputValue) ? inputValue.filter((value) => isOptionValue(value)).length : 0;
    }

    function requiredCheck(inputValue: any): string {
        if (!required.value) {
            return '';
        }
        const isSelected = multiple.value ? countSelected(inputValue) > 0 : isOptionValue(inputValue);
        return isSelected ? '' : optionMessages.value.VS_VALIDATION_REQUIRED;
    }

    function maxCheck(inputValue: any): string {
        if (!multiple.value) {
            return '';
        }
        const limit = Number(max.value);
        return countSelected(inputValue) > limit
            ? formatMessage(optionMessages.value.VS_VALIDATION_MAX_ITEMS, { value: max.value })
            : '';
    }

    function minCheck(inputValue: any): string {
        if (!multiple.value) {
            return '';
        }
        const limit = Number(min.value);
        return countSelected(inputValue) < limit
            ? formatMessage(optionMessages.value.VS_VALIDATION_MIN_ITEMS, { value: min.value })
            : '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
    };
}
