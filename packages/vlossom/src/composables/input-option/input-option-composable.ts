import { watch, ref, type Ref } from 'vue';
import { logUtil, objectUtil } from '@/utils';
import { useOptionLabelValue } from '@/composables/option-label-value/option-label-value-composable';

export function useInputOption(
    inputValue: Ref<any>,
    options: Ref<any[]>,
    optionLabel: Ref<string>,
    optionValue: Ref<string>,
    multiple = ref(false),
) {
    const { getOptionLabel, getOptionValue } = useOptionLabelValue(optionLabel, optionValue);

    watch(options, (newOptions, oldOptions) => {
        if (objectUtil.isEqual(newOptions, oldOptions)) {
            return;
        }

        if (multiple.value && Array.isArray(inputValue.value)) {
            const removedValues = inputValue.value.filter((value) => {
                return !newOptions.some((o) => objectUtil.isEqual(getOptionValue(o), value));
            });
            if (removedValues.length > 0) {
                logUtil.warning('modelValue', `${JSON.stringify(removedValues)} not in options, removed`);
            }
            inputValue.value = inputValue.value.filter((value) => {
                return newOptions.some((o) => objectUtil.isEqual(getOptionValue(o), value));
            });
        } else {
            const option = newOptions.find((o) => objectUtil.isEqual(getOptionValue(o), inputValue.value));

            if (!option) {
                if (inputValue.value !== null && inputValue.value !== undefined) {
                    logUtil.warning('modelValue', `"${inputValue.value}" not in options, reset to null`);
                }
                inputValue.value = null;
            }
        }
    });

    return {
        getOptionLabel,
        getOptionValue,
    };
}
