import { computed, type ComputedRef, type Ref } from 'vue';
import type { BodyCell, VsTablePaginationOptions } from '../types';

export function useTablePagination(
    options: ComputedRef<VsTablePaginationOptions | null>,
    rowsCount: ComputedRef<number>,
    page: Ref<number>,
    pageSize: Ref<number>,
) {
    function paginateRows(rows: BodyCell[][]): BodyCell[][] {
        if (!options.value) {
            return rows;
        }
        const start = page.value * pageSize.value;
        const end = start + pageSize.value;
        return rows.slice(start, end);
    }

    const totalPages = computed<number>(() => {
        if (!options.value || pageSize.value <= 0) {
            return 1;
        }
        return Math.ceil(rowsCount.value / pageSize.value);
    });

    return {
        totalPages,
        paginateRows,
    };
}
