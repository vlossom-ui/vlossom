import type { Options as SortableOptions } from 'sortablejs';
import type { SearchOptions, TextAlignment, VerticalAlignment } from '@/declaration';

export const TABLE_SEARCH_OPTIONS: SearchOptions = {
    useCaseSensitive: true,
    useRegex: true,
} as const;

export const DEFAULT_PAGE_SIZE_ALL = Infinity;
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZES = [50, 100, DEFAULT_PAGE_SIZE_ALL] as const;

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

export const VS_TABLE_HEADER_SLOT_PREFIXES = ['header', 'select'] as const;
export const VS_TABLE_ITEM_SLOT_PREFIXES = ['item', 'select', 'expand'] as const;

export const JUSTIFY_CONTENTS: Record<TextAlignment, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
} as const;

export const ALIGN_ITEMS: Record<VerticalAlignment, string> = {
    top: 'flex-start',
    middle: 'center',
    bottom: 'flex-end',
} as const;
