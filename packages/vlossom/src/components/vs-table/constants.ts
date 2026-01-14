import type { SearchProps } from '@/declaration';
import type { VsTablePageSizeOptions, VsTablePaginationOptions } from './types';

export const TABLE_SEARCH_OPTIONS: Exclude<SearchProps, boolean> = {
    placeholder: 'Search',
    useCaseSensitive: true,
    useRegex: true,
} as const;

export const DEFAULT_PAGE_SIZE_ALL = -1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZE_OPTIONS: VsTablePageSizeOptions = [
    { label: '50 items', value: 50 },
    { label: '100 items', value: 100 },
    { label: 'All', value: DEFAULT_PAGE_SIZE_ALL },
];
export const DEFAULT_PAGINATION_OPTIONS: VsTablePaginationOptions = {
    pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    showPageSizeSelect: true,
    showingLength: 10,
    edgeButtons: false,
    showTotal: true,
} as const;
