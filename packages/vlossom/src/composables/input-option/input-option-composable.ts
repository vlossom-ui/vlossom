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
            const removedValues: any[] = [];
            const keptValues = inputValue.value.filter((value) => {
                const found = newOptions.some((o) => objectUtil.isEqual(getOptionValue(o), value));
                if (!found) {
                    removedValues.push(value);
                }
                return found;
            });
            if (removedValues.length > 0) {
                logUtil.warning(
                    'modelValue',
                    `Some selected values are no longer in options: ${JSON.stringify(removedValues)}. Removed them.`,
                );
            }
            inputValue.value = keptValues;
        } else {
            const option = newOptions.find((o) => objectUtil.isEqual(getOptionValue(o), inputValue.value));

            if (!option) {
                if (inputValue.value !== null && inputValue.value !== undefined) {
                    logUtil.warning(
                        'modelValue',
                        `Current value ${JSON.stringify(inputValue.value)} is no longer in options. Reset to null.`,
                    );
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
