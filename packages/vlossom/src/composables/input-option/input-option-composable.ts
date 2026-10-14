import { computed, watch, ref, type Ref } from 'vue';
import { logUtil, objectUtil } from '@/utils';
import { useOptionLabelValue } from '@/composables/option-label-value/option-label-value-composable';

export function useInputOption(
    inputValue: Ref<any>,
    options: Ref<any[]>,
    optionLabel: Ref<string>,
    optionValue: Ref<string>,
    multiple = ref(false),
    emptyValue: Ref<any> = computed(() => (multiple.value ? [] : null)),
) {
    const { getOptionLabel, getOptionValue } = useOptionLabelValue(optionLabel, optionValue);

    function isOptionValue(value: any) {
        return options.value.some((option) => objectUtil.isEqual(getOptionValue(option), value));
    }

    watch(options, (newOptions, oldOptions) => {
        // 빈 options는 아직 불러오는 중(또는 다시 불러오는 중)일 수 있어 정리를 미룬다
        if (objectUtil.isEqual(newOptions, oldOptions) || newOptions.length === 0) {
            return;
        }

        if (multiple.value && Array.isArray(inputValue.value)) {
            const removedValues: any[] = [];
            const keptValues = inputValue.value.filter((value) => {
                const found = isOptionValue(value);
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
            inputValue.value = keptValues.length > 0 ? keptValues : emptyValue.value;
        } else if (!isOptionValue(inputValue.value)) {
            const isEmpty =
                inputValue.value === null ||
                inputValue.value === undefined ||
                objectUtil.isEqual(inputValue.value, emptyValue.value);
            if (!isEmpty) {
                const current = JSON.stringify(inputValue.value);
                const resetTo = JSON.stringify(emptyValue.value);
                logUtil.warning('modelValue', `Current value ${current} is no longer in options. Reset to ${resetTo}.`);
            }
            inputValue.value = emptyValue.value;
        }
    });

    return {
        getOptionLabel,
        getOptionValue,
        isOptionValue,
    };
}
