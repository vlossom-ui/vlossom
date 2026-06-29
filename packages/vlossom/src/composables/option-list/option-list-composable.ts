import { computed, type Ref } from 'vue';
import { objectUtil, stringUtil } from '@/utils';
import { useOptionLabelValue } from '@/composables/option-label-value/option-label-value-composable';

export function useOptionList(
    options: Ref<any[]>,
    optionLabel: Ref<string>,
    optionValue: Ref<string>,
    disabled: Ref<boolean | ((option: any, index: number, options: any[]) => boolean)>,
) {
    const { getOptionLabel, getOptionValue } = useOptionLabelValue(optionLabel, optionValue);

    const optionIdMap = new WeakMap<object, string>();

    function getOptionId(option: any): string {
        if (objectUtil.isObject(option)) {
            let id = optionIdMap.get(option);
            if (!id) {
                id = stringUtil.createID();
                optionIdMap.set(option, id);
            }
            return id;
        }
        // 원시값은 WeakMap에서 구분할 수 없기 때문에, hash로 정규화해 사용
        return stringUtil.hash(String(option));
    }

    const computedOptions = computed(() => {
        return options.value.map((option, index) => {
            const label = getOptionLabel(option);
            const value = getOptionValue(option);

            return {
                id: getOptionId(option),
                item: option,
                label,
                value,
                index,
                disabled:
                    typeof disabled.value === 'function'
                        ? disabled.value(option, index, options.value)
                        : disabled.value,
            };
        });
    });

    return {
        computedOptions,
    };
}
