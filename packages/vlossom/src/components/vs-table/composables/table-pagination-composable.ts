import { computed, type ComputedRef, type Ref } from 'vue';
import { logUtil } from '@/utils';
import { VsComponent } from '@/declaration';
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
        if (options.value.mode === 'server') {
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
        if (options.value.mode === 'server') {
            if (!options.value.totalItemCount) {
                logUtil.propError(
                    VsComponent.VsTable,
                    'VsTablePaginationOptions',
                    'totalItemCount is required when mode is server',
                );
                return -1;
            }
            return Math.ceil(options.value.totalItemCount / pageSize.value);
        }
        return Math.ceil(rowsCount.value / pageSize.value);
    });

    return {
        totalPages,
        paginateRows,
    };
}
