import { computed, type ComputedRef, type Ref } from 'vue';
import { logUtil } from '@/utils';
import { VsComponent } from '@/declaration';
import type { BodyCell, VsTablePaginationOptions } from '../types';

export function useTablePagination(
    options: ComputedRef<VsTablePaginationOptions | null>,
    rowsCount: ComputedRef<number>,
    page: Ref<number | undefined>,
    pageSize: Ref<number | undefined>,
) {
    function paginateRows(rows: BodyCell[][]): BodyCell[][] {
        if (!options.value) {
            return rows;
        }
        if (options.value.mode === 'server') {
            return rows;
        }
        const currentPage = page.value ?? 0;
        const currentPageSize = pageSize.value ?? 50;
        const start = currentPage * currentPageSize;
        const end = start + currentPageSize;
        return rows.slice(start, end);
    }

    const totalPages = computed<number>(() => {
        const currentPageSize = pageSize.value ?? 50;
        if (!options.value || currentPageSize <= 0) {
            return 1;
        }
        if (options.value.mode === 'server') {
            if (!options.value.totalItemCount) {
                logUtil.propError(
                    VsComponent.VsTable,
                    'VsTablePaginationOptions',
                    'totalItemCount is required when mode is server',
                );
                return -1;
            }
            return Math.ceil(options.value.totalItemCount / currentPageSize);
        }
        return Math.ceil(rowsCount.value / currentPageSize);
    });

    return {
        totalPages,
        paginateRows,
    };
}
