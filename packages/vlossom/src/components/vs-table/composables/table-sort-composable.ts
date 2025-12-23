import { ref, type Ref } from 'vue';
import { SortType, type ColumnDef, type BodyCell } from '../types';
import { objectUtil, compareUtil } from '@/utils';

const SORT_TYPE_COUNT = Object.keys(SortType).length;

export function useTableSort(columns: Ref<ColumnDef[] | null>) {
    const sortType = ref<SortType>(SortType.NONE);
    const sortColumn = ref<ColumnDef | null>(null);

    function compareRows(aRow: BodyCell[], bRow: BodyCell[]): number {
        if (!columns.value || !sortColumn.value) {
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
        const direction = sortType.value === SortType.ASCEND ? 1 : -1;

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
        const current: SortType = sortType.value ?? SortType.NONE;
        const next: SortType = (current + 1) % SORT_TYPE_COUNT;

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
