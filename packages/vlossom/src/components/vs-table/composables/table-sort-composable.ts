import { computed, ref, type ComputedRef } from 'vue';
import { compareUtil, objectUtil } from '@/utils';
import { VsTableSortType, type VsTableColumnDef, type VsTableItem, type VsTableSort } from './../types';

const NEXT_SORT_TYPE: Record<VsTableSortType, VsTableSortType> = {
    [VsTableSortType.NONE]: VsTableSortType.ASCEND,
    [VsTableSortType.ASCEND]: VsTableSortType.DESCEND,
    [VsTableSortType.DESCEND]: VsTableSortType.NONE,
};

export function useTableSortComposable(columns: ComputedRef<VsTableColumnDef[]>, items: ComputedRef<VsTableItem[]>) {
    const sort = ref<VsTableSort>({ key: '', type: VsTableSortType.NONE });

    const sortColumn = computed<VsTableColumnDef | null>(() => {
        if (sort.value.type === VsTableSortType.NONE || !sort.value.key) {
            return null;
        }
        return columns.value.find(({ key }) => key === sort.value.key) ?? null;
    });

    const sortedItems = computed<VsTableItem[]>(() => {
        const column = sortColumn.value;
        if (!column) {
            return items.value;
        }

        const sortKey = column.sortBy ?? column.key;
        const direction = sort.value.type === VsTableSortType.ASCEND ? 1 : -1;
        return [...items.value].sort(
            (aItem, bItem) =>
                direction * compareUtil.compareValues(objectUtil.get(aItem, sortKey), objectUtil.get(bItem, sortKey)),
        );
    });

    function updateSort(columnKey: string): void {
        if (!columns.value.some(({ key }) => key === columnKey)) {
            return;
        }
        sort.value =
            sort.value.key === columnKey
                ? { key: columnKey, type: NEXT_SORT_TYPE[sort.value.type] }
                : { key: columnKey, type: VsTableSortType.ASCEND };
    }

    return { sort, sortedItems, updateSort };
}
