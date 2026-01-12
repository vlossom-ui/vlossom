import { computed, ref, type Ref } from 'vue';
import { objectUtil } from '@/utils';
import type { OptionItem } from '@/declaration';

export function useSelectValue({
    isSelectUnavailable,
    computedOptions,
    filteredOptions,
    multiple,
}: {
    isSelectUnavailable: Ref<boolean>;
    computedOptions: Ref<OptionItem[]>;
    filteredOptions: Ref<OptionItem[]>;
    multiple: Ref<boolean>;
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
            .filter((option) => option !== undefined);
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

    function isExistingValue(value: any) {
        for (const option of computedOptions.value.values()) {
            if (objectUtil.isEqual(option.value, value)) {
                return true;
            }
        }
        return false;
    }

    function convertValue(v: any) {
        if (multiple.value) {
            if (v === undefined || v === null) {
                return [];
            }

            const arrayValue = Array.isArray(v) ? v : [v];
            return arrayValue.filter((value) => isExistingValue(value));
        }

        if (v === undefined || v === null) {
            return null;
        }
        return isExistingValue(v) ? v : null;
    }

    return {
        selectedOptionIds,
        availableOptionIds,
        isSelectedAll,
        isEmpty,
        selectedOptions,
        convertValue,
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
