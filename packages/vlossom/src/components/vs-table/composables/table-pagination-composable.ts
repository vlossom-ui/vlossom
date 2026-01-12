import { computed, type ComputedRef, type Ref } from 'vue';
import { logUtil } from '@/utils';
import { VsComponent } from '@/declaration';
import type { VsTablePaginationOptions } from '../types';

export function useTablePagination(
    options: ComputedRef<VsTablePaginationOptions | null>,
    page: Ref<number>,
    pageSize: Ref<number>,
    totalItemsCount: ComputedRef<number>,
) {
    const pageStartIndex = computed<number>(() => {
        return page.value * pageSize.value;
    });

    const pageEndIndex = computed<number>(() => {
        return Math.min(pageStartIndex.value + pageSize.value, totalItemsCount.value);
    });

    const totalItems = computed<number>(() => {
        if (options.value?.mode === 'server') {
            return options.value?.totalItemCount ?? 0;
        }
        return totalItemsCount.value;
    });

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
        return Math.ceil(totalItemsCount.value / currentPageSize);
    });

    return {
        totalItems,
        totalPages,
        pageStartIndex,
        pageEndIndex,
    };
}
