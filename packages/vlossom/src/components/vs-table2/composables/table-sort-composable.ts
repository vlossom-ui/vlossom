import { computed, ref, type ComputedRef } from 'vue';
import { compareUtil, objectUtil } from '@/utils';
import { VsTable2SortType, type VsTable2ColumnDef, type VsTable2Item, type VsTable2Sort } from './../types';

const NEXT_SORT_TYPE: Record<VsTable2SortType, VsTable2SortType> = {
    [VsTable2SortType.NONE]: VsTable2SortType.ASCEND,
    [VsTable2SortType.ASCEND]: VsTable2SortType.DESCEND,
    [VsTable2SortType.DESCEND]: VsTable2SortType.NONE,
};

export function useTableSortComposable(columns: ComputedRef<VsTable2ColumnDef[]>, items: ComputedRef<VsTable2Item[]>) {
    const sort = ref<VsTable2Sort>({ key: '', type: VsTable2SortType.NONE });

    const sortColumn = computed<VsTable2ColumnDef | null>(() => {
        if (sort.value.type === VsTable2SortType.NONE || !sort.value.key) {
            return null;
        }
        return columns.value.find(({ key }) => key === sort.value.key) ?? null;
    });

    const sortedItems = computed<VsTable2Item[]>(() => {
        const column = sortColumn.value;
        if (!column) {
            return items.value;
        }

        const sortKey = column.sortBy ?? column.key;
        const direction = sort.value.type === VsTable2SortType.ASCEND ? 1 : -1;
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
                : { key: columnKey, type: VsTable2SortType.ASCEND };
    }

    return { sort, sortedItems, updateSort };
}
