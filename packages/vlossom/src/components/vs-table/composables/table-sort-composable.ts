import { ref, type Ref } from 'vue';
import { VsTableSortType, type VsTableColumnDef, type VsTableBodyCell } from '../types';
import { objectUtil, compareUtil } from '@/utils';

const SORT_TYPE_COUNT = Object.keys(VsTableSortType).filter((value) => !isNaN(Number(value))).length;

export function useTableSort(columns: Ref<VsTableColumnDef[]>) {
    const sortType = ref<VsTableSortType>(VsTableSortType.NONE);
    const sortColumn = ref<VsTableColumnDef | null>(null);

    function compareRows(aRow: VsTableBodyCell[], bRow: VsTableBodyCell[]): number {
        if (sortType.value === VsTableSortType.NONE) {
            return 0;
        }
        if (!columns.value.length || !sortColumn.value) {
            return 0;
        }
        const aItem = aRow[0]?.item;
        const bItem = bRow[0]?.item;
        if (!aItem || !bItem) {
            return 0;
        }
        const sortKey = sortColumn.value.sortBy ?? sortColumn.value.key;
        const aValue: unknown = objectUtil.get(aItem, sortKey);
        const bValue: unknown = objectUtil.get(bItem, sortKey);
        const direction = sortType.value === VsTableSortType.ASCEND ? 1 : -1;

        return direction * compareUtil.compareValues(aValue, bValue);
    }

    function updateSortType(columnKey: string): void {
        if (!columns.value) {
            return;
        }
        const targetColumn = columns.value.find((column) => column.key === columnKey);
        if (!targetColumn) {
            return;
        }
        const current: VsTableSortType = sortType.value ?? VsTableSortType.NONE;
        const next: VsTableSortType = (current + 1) % SORT_TYPE_COUNT;

        sortType.value = next;
        sortColumn.value = targetColumn;
    }

    return {
        sortType,
        sortColumn,
        compareRows,
        updateSortType,
    };
}
