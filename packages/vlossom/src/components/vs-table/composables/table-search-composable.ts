import { computed, type ComputedRef, type Ref } from 'vue';
import type { VsSearchInputRef } from '@/components';
import type { VsTableBodyCell, VsTableColumnDef } from '../types';

export function useTableSearch(ref: Ref<VsSearchInputRef | null>, columns: ComputedRef<VsTableColumnDef[] | null>) {
    const searchColumnKeyList = computed<string[]>(() => {
        if (!columns.value) {
            return [];
        }
        return columns.value.filter((col) => !col.skipSearch).map((column) => column.key);
    });

    function matchBySearch(row: VsTableBodyCell[]): boolean {
        if (!ref.value) {
            return true;
        }
        const matchFn = ref.value.match;

        return row.some((cell) => {
            if (!searchColumnKeyList.value.includes(cell.colKey)) {
                return false;
            }
            const cellValue = cell.value ? String(cell.value) : '';
            return matchFn(cellValue);
        });
    }

    return {
        matchBySearch,
    };
}
