import { computed, ref, type Ref } from 'vue';

export function useTableSelect(
    selectable: Ref<
        boolean | ((item: Record<string, unknown>, index?: number, items?: Record<string, unknown>[]) => boolean)
    >,
    items: Ref<Record<string, unknown>[]>,
) {
    const selectedRows = ref<number[]>([]);
    const hasSelectableRows = computed(() => {
        return items.value.some(isSelectableRow);
    });
    const selectableItems = computed(() => {
        return items.value.filter(isSelectableRow);
    });
    const partiallySelected = computed(() => {
        if (selectedRows.value.length === 0) {
            return false;
        }
        if (selectedRows.value.length === selectableItems.value.length) {
            return false;
        }
        return true;
    });
    const selectedAll = computed(() => {
        return selectedRows.value.length === selectableItems.value.length;
    });

    function initSelectedRows(): void {
        items.value.forEach((item, rowIdx) => {
            if (isSelectableRow(item) && !selectedRows.value.includes(rowIdx)) {
                selectedRows.value.push(rowIdx);
            }
        });
    }

    function clearSelectedRows(): void {
        selectedRows.value = [];
    }

    function toggleSelectedAll(): void {
        if (selectedAll.value) {
            clearSelectedRows();
            return;
        }
        initSelectedRows();
    }

    function findRowIndex(item: Record<string, unknown>): number {
        return items.value.findIndex((i) => i === item);
    }

    function isSelectableRow(item: Record<string, unknown>): boolean {
        if (selectable.value === undefined) {
            return false;
        }
        if (typeof selectable.value === 'function') {
            const rowIdx = findRowIndex(item);
            if (rowIdx === -1) {
                return false;
            }
            return selectable.value(item, rowIdx, items.value);
        }
        return selectable.value;
    }

    function updateSelectedRow(item: Record<string, unknown>): void {
        if (!isSelectableRow(item)) {
            return;
        }
        const rowIdx = findRowIndex(item);

        if (selectedRows.value.includes(rowIdx)) {
            selectedRows.value = selectedRows.value.filter((idx) => idx !== rowIdx);
        } else {
            selectedRows.value = [...selectedRows.value, rowIdx];
        }
    }

    return {
        selectedRows,
        selectedAll,
        initSelectedRows,
        clearSelectedRows,
        toggleSelectedAll,
        updateSelectedRow,
        partiallySelected,
        isSelectableRow,
        hasSelectableRows,
    };
}
