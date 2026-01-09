import type { VsTablePaginationOptions, VsTableSearchOptions } from './types';

export const TABLE_SEARCH_OPTIONS: VsTableSearchOptions = {
    placeholder: 'Search',
    useCaseSensitive: true,
    useRegex: true,
} as const;

export const DEFAULT_PAGINATION_OPTIONS: VsTablePaginationOptions = {
    pageSizeOptions: [20, 50, 100] as number[],
    showPageSizeSelector: true,
    showingLength: 10,
    edgeButtons: false,
    showTotal: true,
    mode: 'client' as const,
} as const;
