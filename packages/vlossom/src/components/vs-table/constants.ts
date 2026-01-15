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

/**
 * VsTable 기본 sortable 옵션
 * 드래그 앤 드롭 동작을 제어하는 Sortable.js 설정
 */
export const DEFAULT_SORTABLE_OPTIONS: Partial<SortableOptions> = {
    animation: 150, // 드래그 애니메이션 속도 (ms)
    ghostClass: 'vs-table-row-ghost', // 드래그 중 원본 위치의 스타일 클래스
    dragClass: 'vs-table-row-drag', // 드래그 중인 요소의 스타일 클래스
    scroll: true, // 스크롤 활성화
    scrollSensitivity: 100, // 스크롤 감도 (px)
    scrollSpeed: 10, // 스크롤 속도 (px/frame)
    forceFallback: false, // HTML5 DnD 사용 (false = 사용)
} as const;
