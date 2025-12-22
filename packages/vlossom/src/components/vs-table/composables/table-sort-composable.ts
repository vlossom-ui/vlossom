import { reactive, ref, type Ref } from 'vue';
import { SortType, type ColumnDef, type BodyCell } from '../types';
import { objectUtil } from '@/utils';

export function useTableSort(columns: Ref<ColumnDef[] | null>) {
    const sortState = reactive<Record<string, SortType>>({});
    const currentSortTarget = ref<ColumnDef | null>(null);

    function initSortTypes(): void {
        if (!columns.value) {
            return;
        }
        columns.value.forEach((column) => {
            sortState[column.key] = SortType.NONE;
        });
    }

    function compareRows(aRow: BodyCell[], bRow: BodyCell[]): number {
        if (!columns.value || !currentSortTarget.value) {
            return 0;
        }

        const aItem = aRow[0]?.item;
        const bItem = bRow[0]?.item;

        if (!aItem || !bItem) {
            return 0;
        }

        const sortKey = currentSortTarget.value.sortBy ?? currentSortTarget.value.key;
        const aValue = objectUtil.get(aItem, sortKey);
        const bValue = objectUtil.get(bItem, sortKey);

        const aStr = String(aValue);
        const bStr = String(bValue);
        const sortType = sortState[currentSortTarget.value.key];

        if (sortType === SortType.ASCEND) {
            return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        }
        if (sortType === SortType.DESCEND) {
            return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
        }
        return 0;
    }

    function updateSortType(headerKey: string): void {
        const targetColumn = columns.value?.find((column) => column.key === headerKey);
        if (!targetColumn) {
            return;
        }
        const current: SortType = sortState[targetColumn.key] ?? SortType.NONE;
        const next: SortType = (current + 1) % SortType.LENGTH;

        initSortTypes();
        sortState[targetColumn.key] = next;
        currentSortTarget.value = targetColumn;
    }

    return {
        sortState,
        initSortTypes,
        compareRows,
        updateSortType,
    };
}
