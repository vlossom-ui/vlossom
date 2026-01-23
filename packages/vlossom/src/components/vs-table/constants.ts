import type { SearchProps } from '@/declaration';
import type { VsTablePageSizeOptions, VsTablePaginationOptions } from './types';
import type { Options as SortableOptions } from 'sortablejs';

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

export const TABLE_DRAG_WRAPPER_CLASS = 'vs-table-draggable-wrapper';
export const TABLE_DRAG_HANDLE_CLASS = 'vs-table-drag-handle';

export const DEFAULT_SORTABLE_OPTIONS: Partial<SortableOptions> = {
    animation: 150,
    dragClass: 'vs-table-row-drag',
    handle: `.${TABLE_DRAG_HANDLE_CLASS}`,
    scrollSensitivity: 100,
    swapThreshold: 0.65,
    invertSwap: true,
    invertedSwapThreshold: 0.65,
} as const;
