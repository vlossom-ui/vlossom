import { computed, type ComputedRef, type Ref } from 'vue';
import type { VsTablePaginationOptions } from '../types';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_ALL } from '../constants';

export function useTablePagination(
    options: ComputedRef<VsTablePaginationOptions | null>,
    page: Ref<number>,
    pageSize: Ref<number>,
    totalItemsCount: ComputedRef<number>,
    serverMode: Ref<boolean>,
) {
    const pageStartIndex = computed<number>(() => {
        if (pageSize.value === DEFAULT_PAGE_SIZE_ALL) {
            return 0;
        }
        return page.value * pageSize.value;
    });

    const totalItems = computed<number>(() => {
        if (serverMode.value) {
            return options.value?.totalItemCount ?? 0;
        }
        return totalItemsCount.value;
    });

    const pageEndIndex = computed<number>(() => {
        if (pageSize.value === DEFAULT_PAGE_SIZE_ALL) {
            return totalItems.value;
        }
        const calculatedEnd = pageStartIndex.value + pageSize.value;
        return Math.min(calculatedEnd, totalItems.value);
    });

    const totalPages = computed<number>(() => {
        const currentPageSize = pageSize.value ?? DEFAULT_PAGE_SIZE;
        if (!options.value) {
            return 1;
        }
        if (currentPageSize <= 0 || currentPageSize === DEFAULT_PAGE_SIZE_ALL) {
            return 1;
        }
        if (serverMode.value) {
            if (!options.value.totalItemCount) {
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
