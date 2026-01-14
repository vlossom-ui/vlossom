import type { SearchProps } from '@/declaration';
import type { VsTablePaginationOptions } from './types';

export const TABLE_SEARCH_OPTIONS: Exclude<SearchProps, boolean> = {
    placeholder: 'Search',
    useCaseSensitive: true,
    useRegex: true,
} as const;

export const DEFAULT_PAGE_SIZE_ALL = -1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGINATION_OPTIONS: VsTablePaginationOptions = {
    pageSizeOptions: [50, 100, DEFAULT_PAGE_SIZE_ALL] as number[],
    showPageSizeSelect: true,
    showingLength: 10,
    edgeButtons: false,
    showTotal: true,
} as const;
