import type { Ref } from 'vue';
import { logUtil, objectUtil } from '@/utils';

export function useOptionLabelValue(optionLabel: Ref<string>, optionValue: Ref<string>) {
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

    return {
        getOptionLabel,
        getOptionValue,
    };
}
