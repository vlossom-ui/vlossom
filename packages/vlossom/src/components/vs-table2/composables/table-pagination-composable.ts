import { computed, ref, type ComputedRef, type Ref } from 'vue';
import { useMessages } from '@/composables';
import type { VsTable2PageSizeOption, VsTable2PageSizeOptions, VsTable2PaginationOptions } from './../types';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_ALL, DEFAULT_PAGE_SIZES } from './../constants';

// label이 전역 messages에서 오기 때문에 모듈 로드 시점에 고정하지 않고 호출 시점에 만든다
export function toDefaultPageSizeOption(pageSize: number): VsTable2PageSizeOption {
    const { optionMessages, formatMessage } = useMessages();
    if (pageSize === DEFAULT_PAGE_SIZE_ALL) {
        return { label: formatMessage(optionMessages.value.VS_TABLE_PAGE_SIZE_ALL), value: DEFAULT_PAGE_SIZE_ALL };
    }
    return {
        label: formatMessage(optionMessages.value.VS_TABLE_PAGE_SIZE_ITEMS, { size: pageSize }),
        value: pageSize,
    };
}

export function getDefaultPageSizeOptions(): VsTable2PageSizeOptions {
    return DEFAULT_PAGE_SIZES.map(toDefaultPageSizeOption);
}

export function getDefaultPaginationOptions(): VsTable2PaginationOptions {
    return {
        pageSizeOptions: getDefaultPageSizeOptions(),
        showPageSizeSelect: true,
        showingLength: 10,
        edgeButtons: false,
        showTotal: true,
    };
}

export function toPaginationOptions(
    pagination: boolean | VsTable2PaginationOptions,
    pageSize: number | undefined,
): VsTable2PaginationOptions {
    if (!pagination) {
        return {};
    }

    const defaultOptions = getDefaultPaginationOptions();
    if (typeof pagination === 'boolean') {
        return defaultOptions;
    }
    if (pagination.pageSizeOptions || typeof pageSize !== 'number') {
        return { ...defaultOptions, ...pagination };
    }

    // 사용자가 지정한 pageSize가 기본 옵션에 없으면 선택 가능한 값으로 끼워 넣는다
    const defaultPageSizeOptions = getDefaultPageSizeOptions();
    if (defaultPageSizeOptions.some((option) => option.value === pageSize)) {
        return { ...defaultOptions, ...pagination };
    }
    return {
        ...defaultOptions,
        ...pagination,
        pageSizeOptions: [...defaultPageSizeOptions, toDefaultPageSizeOption(pageSize)].sort(
            (a, b) => a.value - b.value,
        ),
    };
}

export function useTablePaginationComposable(
    rawPagination: Ref<boolean | VsTable2PaginationOptions>,
    rawPage: Ref<number | undefined>,
    rawPageSize: Ref<number | undefined>,
    serverMode: Ref<boolean>,
    searchedCount: ComputedRef<number>,
    cb?: {
        updatePage: (page: number) => void;
        updatePageSize: (pageSize: number) => void;
    },
) {
    const internalPage = ref(0);
    const internalPageSize = ref<number | null>(null);

    const paginationOptions = computed<VsTable2PaginationOptions>(() =>
        toPaginationOptions(rawPagination.value, rawPageSize.value),
    );

    // page/pageSize prop이 바인딩되어 있으면 getter가 prop을 따르므로, 변경은 setter에서 바로 알린다
    const page = computed<number>({
        get: () => rawPage.value ?? internalPage.value,
        set: (value: number) => {
            internalPage.value = value;
            cb?.updatePage(value);
        },
    });

    const pageSize = computed<number>({
        get: () =>
            internalPageSize.value ??
            rawPageSize.value ??
            paginationOptions.value.pageSizeOptions?.[0]?.value ??
            DEFAULT_PAGE_SIZE,
        set: (value: number) => {
            internalPageSize.value = value;
            cb?.updatePageSize(value);
            // page size가 바뀌면 첫 페이지로 되돌린다
            page.value = 0;
        },
    });

    const totalCount = computed<number>(() =>
        serverMode.value ? (paginationOptions.value.totalItemCount ?? 0) : searchedCount.value,
    );

    const pageStartIndex = computed<number>(() =>
        pageSize.value === DEFAULT_PAGE_SIZE_ALL ? 0 : page.value * pageSize.value,
    );

    const pageEndIndex = computed<number>(() => {
        if (pageSize.value === DEFAULT_PAGE_SIZE_ALL) {
            return totalCount.value;
        }
        return Math.min(pageStartIndex.value + pageSize.value, totalCount.value);
    });

    const totalPages = computed<number>(() => {
        if (pageSize.value <= 0 || pageSize.value === DEFAULT_PAGE_SIZE_ALL) {
            return 1;
        }
        return Math.ceil(totalCount.value / pageSize.value);
    });

    return {
        paginationOptions,
        page,
        pageSize,
        totalCount,
        totalPages,
        pageStartIndex,
        pageEndIndex,
    };
}
