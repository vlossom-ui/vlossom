import { watch, ref, type Ref } from 'vue';
import { objectUtil, logUtil } from '@/utils';

export function useInputOption(
    inputValue: Ref<any>,
    options: Ref<any[]>,
    optionLabel: Ref<string>,
    optionValue: Ref<string>,
    multiple = ref(false),
) {
    function getOptionLabel(option: any): string {
        if (objectUtil.isObject(option)) {
            if (optionLabel.value) {
                const label = objectUtil.get(option, optionLabel.value);

                if (!label) {
                    logUtil.error(
                        'option-label',
                        `${optionLabel.value} is not found in option: ${JSON.stringify(option)}`,
                    );

                    return JSON.stringify(option);
                }

                if (typeof label === 'string') {
                    return label;
                }

                return JSON.stringify(label);
            }
            return JSON.stringify(option);
        }

        return option + '';
    }

    function getOptionValue(option: any) {
        if (objectUtil.isObject(option) && optionValue.value) {
            const value = objectUtil.get(option, optionValue.value);

            if (value === undefined) {
                logUtil.error('option-value', `${optionValue.value} is not found in option: ${JSON.stringify(option)}`);

                return option;
            }

            return value;
        }

        return option;
    }

    watch(options, (newOptions, oldOptions) => {
        if (objectUtil.isEqual(newOptions, oldOptions)) {
            return;
        }

        if (multiple.value && Array.isArray(inputValue.value)) {
            inputValue.value = inputValue.value.filter((value) => {
                return newOptions.some((o) => objectUtil.isEqual(getOptionValue(o), value));
            });
        } else {
            const option = newOptions.find((o) => objectUtil.isEqual(getOptionValue(o), inputValue.value));

            if (!option) {
                inputValue.value = null;
            }
        }
    });

    return {
        getOptionLabel,
        getOptionValue,
    };
}
