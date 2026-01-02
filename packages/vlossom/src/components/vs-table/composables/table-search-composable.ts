import { computed, ref, type ComputedRef, type TemplateRef, type Ref } from 'vue';
import type { VsSearchInputRef } from '@/components';
import type { BodyCell, ColumnDef } from '../types';

export function useTableSearch(columns: ComputedRef<ColumnDef[] | null>) {
    const tableSearchInputRef: Ref<VsSearchInputRef | null> = ref(null);

    const searchColumnKeyList = computed<string[]>(() => {
        if (!columns.value) {
            return [];
        }
        return columns.value.filter((col) => !col.skipSearch).map((column) => column.key);
    });

    function initSearchInputRef(searchInputRef: TemplateRef<VsSearchInputRef>): void {
        tableSearchInputRef.value = searchInputRef.value;
    }

    function matchBySearch(row: BodyCell[]): boolean {
        if (!tableSearchInputRef.value) {
            return true;
        }
        const matchFn = tableSearchInputRef.value.match;

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
        initSearchInputRef,
    };
}
