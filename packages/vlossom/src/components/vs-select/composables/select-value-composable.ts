import { computed, ref, type Ref } from 'vue';
import { objectUtil } from '@/utils';
import type { OptionItem } from '@/declaration';

export function useSelectValue({
    isSelectUnavailable,
    computedOptions,
    filteredOptions,
    multiple,
    isOptionValue,
    emptyValue = computed(() => (multiple.value ? [] : null)),
}: {
    isSelectUnavailable: Ref<boolean>;
    computedOptions: Ref<OptionItem[]>;
    filteredOptions: Ref<OptionItem[]>;
    multiple: Ref<boolean>;
    isOptionValue: (value: any) => boolean;
    emptyValue?: Ref<any>;
}) {
    const selectedOptionIds: Ref<string[]> = ref([]);

    const isEmpty = computed(() => {
        return selectedOptionIds.value.length === 0;
    });

    const availableOptionIds = computed(() => {
        return filteredOptions.value.filter((option) => !option.disabled).map((option) => option.id);
    });

    const isSelectedAll = computed(() => {
        if (!multiple.value) {
            return false;
        }

        return (
            availableOptionIds.value.length > 0 &&
            availableOptionIds.value.every((optionId) => selectedOptionIds.value.includes(optionId))
        );
    });

    const selectedOptions = computed(() => {
        return selectedOptionIds.value
            .map((id) => computedOptions.value.find((option) => option.id === id))
            .filter((option): option is OptionItem => option !== undefined);
    });

    function isSelected(optionId: string) {
        return selectedOptionIds.value.includes(optionId);
    }

    function selectOption(optionId: string) {
        if (isSelectUnavailable.value || !availableOptionIds.value.includes(optionId)) {
            return;
        }

        if (multiple.value) {
            selectedOptionIds.value.push(optionId);
        } else {
            selectedOptionIds.value = [optionId];
        }
    }

    function deselectOption(optionId: string) {
        if (!isSelected(optionId)) {
            return;
        }

        selectedOptionIds.value = selectedOptionIds.value.filter((id) => id !== optionId);
    }

    function toggleSelect(optionId: string) {
        if (isSelectUnavailable.value) {
            return;
        }

        if (multiple.value) {
            if (isSelected(optionId)) {
                deselectOption(optionId);
            } else {
                selectOption(optionId);
            }
        } else {
            selectOption(optionId);
        }
    }

    function selectAll() {
        if (isSelectUnavailable.value) {
            return;
        }

        const existingIds = selectedOptionIds.value;
        const newIds = availableOptionIds.value.filter((id) => !existingIds.includes(id));
        selectedOptionIds.value = [...existingIds, ...newIds];
    }

    function deselectAll() {
        selectedOptionIds.value = selectedOptionIds.value.filter((id) => !availableOptionIds.value.includes(id));
    }

    function clearSelected() {
        selectedOptionIds.value = [];
    }

    function toggleSelectAll() {
        if (isSelectUnavailable.value) {
            return;
        }

        if (isSelectedAll.value) {
            deselectAll();
        } else {
            selectAll();
        }
    }

    function convertValue(v: any) {
        if (multiple.value) {
            if (v === undefined || v === null) {
                return emptyValue.value;
            }

            const arrayValue = Array.isArray(v) ? v : [v];
            const existingValues = arrayValue.filter((value) => isOptionValue(value));
            return existingValues.length > 0 ? existingValues : emptyValue.value;
        }

        return isOptionValue(v) ? v : emptyValue.value;
    }

    function isEmptyValue(v: any) {
        return v === undefined || v === null || objectUtil.isEqual(v, emptyValue.value);
    }

    return {
        selectedOptionIds,
        availableOptionIds,
        isSelectedAll,
        isEmpty,
        selectedOptions,
        convertValue,
        isEmptyValue,
        isSelected,
        selectOption,
        deselectOption,
        toggleSelect,
        selectAll,
        deselectAll,
        clearSelected,
        toggleSelectAll,
    };
}
