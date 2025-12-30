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
        return row.some((cell) => {
            if (!tableSearchInputRef.value) {
                return true;
            }
            if (!searchColumnKeyList.value.includes(cell.colKey)) {
                return false;
            }
            const cellValue = cell.value ? String(cell.value) : '';
            return tableSearchInputRef.value.match(cellValue);
        });
    }

    return {
        matchBySearch,
        initSearchInputRef,
    };
}
