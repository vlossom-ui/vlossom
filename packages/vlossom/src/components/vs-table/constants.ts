import type { Options as SortableOptions } from 'sortablejs';
import type { SearchOptions } from '@/declaration';

export const TABLE_SEARCH_OPTIONS: SearchOptions = {
    useCaseSensitive: true,
    useRegex: true,
} as const;

export const DEFAULT_PAGE_SIZE_ALL = Infinity;
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZES = [50, 100, DEFAULT_PAGE_SIZE_ALL] as const;

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

export const VS_TABLE_HEADER_SLOT_PREFIXES = ['header', 'select', 'expand'] as const;
export const VS_TABLE_BODY_SLOT_PREFIXES = ['body', 'select', 'expand', 'empty'] as const;
