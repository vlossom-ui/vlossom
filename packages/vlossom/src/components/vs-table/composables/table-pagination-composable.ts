import { computed, type ComputedRef, type Ref } from 'vue';
import { useMessages } from '@/composables';
import type { VsTablePageSizeOption, VsTablePageSizeOptions, VsTablePaginationOptions } from './../types';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_ALL, DEFAULT_PAGE_SIZES } from './../constants';

// label이 전역 messages에서 오기 때문에 모듈 로드 시점에 고정하지 않고 호출 시점에 만든다
export function toDefaultPageSizeOptions(pageSize: number): VsTablePageSizeOption {
    const { optionMessages, formatMessage } = useMessages();
    if (pageSize === DEFAULT_PAGE_SIZE_ALL) {
        return { label: formatMessage(optionMessages.value.VS_TABLE_PAGE_SIZE_ALL), value: DEFAULT_PAGE_SIZE_ALL };
    }
    return {
        label: formatMessage(optionMessages.value.VS_TABLE_PAGE_SIZE_ITEMS, { size: pageSize }),
        value: pageSize,
    };
}

export function getDefaultPageSizeOptions(): VsTablePageSizeOptions {
    return DEFAULT_PAGE_SIZES.map((pageSize) => toDefaultPageSizeOptions(pageSize));
}

export function getDefaultPaginationOptions(): VsTablePaginationOptions {
    return {
        pageSizeOptions: getDefaultPageSizeOptions(),
        showPageSizeSelect: true,
        showingLength: 10,
        edgeButtons: false,
        showTotal: true,
    };
}

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
            const serverTotalItemCount = options.value.totalItemCount ?? 0;
            return serverTotalItemCount > 0 ? Math.ceil(serverTotalItemCount / currentPageSize) : 0;
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
