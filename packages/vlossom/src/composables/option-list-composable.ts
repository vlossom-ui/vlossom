import { computed, type Ref } from 'vue';
import { stringUtil } from '@/utils';
import { useOptionLabelValue } from './option-label-value-composable';

export function useOptionList(
    options: Ref<any[]>,
    optionLabel: Ref<string>,
    optionValue: Ref<string>,
    disabled: Ref<boolean | ((option: any, index: number, options: any[]) => boolean)>,
) {
    const { getOptionLabel, getOptionValue } = useOptionLabelValue(optionLabel, optionValue);

    const computedOptions = computed(() => {
        return options.value.map((option, index) => {
            const label = getOptionLabel(option);
            const value = getOptionValue(option);

            return {
                id: stringUtil.hash(label + index), // unique id for each option
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
