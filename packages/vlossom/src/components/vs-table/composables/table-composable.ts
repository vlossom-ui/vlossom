import { computed, ref, toRefs, watch, type ComputedRef, type Ref, type TemplateRef } from 'vue';
import { functionUtil, objectUtil } from '@/utils';
import { type UIState, type VsComponent, type PropsOf, type SearchProps } from '@/declaration';
import type { VsSearchInputRef } from '@/components';

import {
    isColumnDefArray,
    type SortType,
    type BodyCell,
    type ColumnDef,
    type HeaderCell,
    type Cell,
    type Item,
    type VsTablePaginationOptions,
} from '../types';
import { TableCellBuilder } from '../models/table-cell-builder';
import { useTableSelect } from './table-select-composable';
import { useTableSort } from './table-sort-composable';
import { useTableExpand } from './table-expand-composable';
import { useTableSearch } from './table-search-composable';
import { useTablePagination } from './table-pagination-composable';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_PAGINATION_OPTIONS,
    TABLE_SEARCH_OPTIONS,
    toDefaultPageSizeOptions,
} from '../constants';

export const TABLE_COMPOSABLE_TOKEN = Symbol('TABLE_COMPOSABLE_TOKEN');
export function useTable(
    props: PropsOf<VsComponent.VsTable>,
    refs: { searchInputRef: TemplateRef<VsSearchInputRef> },
    cb?: {
        updateSelectedItems: (items: Item[]) => void;
        updatePage: (page: number) => void;
        updatePageSize: (pageSize: number) => void;
        updatePagedItems: (items: Item[]) => void;
        updateTotalItems: (items: Item[]) => void;
    },
) {
    const {
        columns: rawColumns,
        items: rawItems,
        selectable: rawSelectable,
        expandable: rawExpandable,
        state: rawState,
        selectedItems: rawSelectedItems,
        search: rawSearch,
        pagination: rawPagination,
        serverMode: rawServerMode,
        page: rawPage,
        pageSize: rawPageSize,
        loading,
        draggable,
        primary,
    } = toRefs(props);

    // normalize
    const columns = computed<ColumnDef[]>(() => {
        if (!rawColumns?.value) {
            return [];
        }
        if (isColumnDefArray(rawColumns.value)) {
            return rawColumns.value;
        }
        return rawColumns.value.map((column: string) => {
            return { key: column, label: column } as ColumnDef;
        });
    });
    const items = computed<Item[]>(() => {
        return rawItems.value;
    });
    const expandable = computed(() => {
        return functionUtil.toCallable<[Item, number?, Item[]?], boolean>(rawExpandable?.value);
    });
    const selectable = computed(() => {
        return functionUtil.toCallable<[Item, number?, Item[]?], boolean>(rawSelectable?.value);
    });
    const state = computed(() => {
        return functionUtil.toCallable<[Item, number?, Item[]?], UIState>(rawState?.value);
    });
    const selectedItems = computed<Item[]>(() => {
        return rawSelectedItems?.value ?? [];
    });
    const search = computed<Exclude<SearchProps, boolean>>(() => {
        if (!rawSearch?.value) {
            return {};
        }
        if (typeof rawSearch?.value === 'boolean') {
            return TABLE_SEARCH_OPTIONS;
        }
        return { ...TABLE_SEARCH_OPTIONS, ...rawSearch.value };
    });
    const pagination = computed<VsTablePaginationOptions>(() => {
        if (!rawPagination?.value) {
            return {};
        }
        if (typeof rawPagination?.value !== 'boolean') {
            return { ...DEFAULT_PAGINATION_OPTIONS, ...rawPagination.value };
        }

        if (
            typeof rawPageSize?.value === 'number' &&
            !DEFAULT_PAGE_SIZE_OPTIONS.some((option) => option.value === rawPageSize.value) // warning: page size not in pageSizeOptions
        ) {
            return {
                ...DEFAULT_PAGINATION_OPTIONS,
                pageSizeOptions: [
                    ...DEFAULT_PAGE_SIZE_OPTIONS,
                    toDefaultPageSizeOptions(rawPageSize.value as number),
                ].sort((a, b) => a.value - b.value),
            };
        }
        return DEFAULT_PAGINATION_OPTIONS;
    });
    const serverMode = computed(() => rawServerMode?.value ?? false);
    const internalPage = ref(0);
    const internalPageSize = ref(Number.NaN);
    const page = computed<number>({
        get: () => rawPage?.value ?? internalPage.value,
        set: (value: number) => {
            internalPage.value = value;
            cb?.updatePage(value);
        },
    });
    const pageSize = computed<number>({
        get: () => {
            if(!Number.isNaN(internalPageSize.value)) {
                return internalPageSize.value;
            }
            const currentPageSize = rawPageSize?.value;
            if (!currentPageSize) {
                return DEFAULT_PAGE_SIZE;
            }
            return currentPageSize;
        },
        set: (value: number) => {
            internalPageSize.value = value;
            cb?.updatePageSize(value);

            page.value = 0; // NOTE: reset page to 0 when page size changes
        },
    });

    const tableCellBuilder = new TableCellBuilder(items.value, columns.value);
    const { anyExpandable, isExpanded, toggleExpand } = useTableExpand(expandable, items);
    const { sortType, sortColumn, compareRows, updateSortType } = useTableSort(columns);
    const { matchBySearch } = useTableSearch(refs.searchInputRef, columns);
    const {
        selectedItems: internalSelectedItems,
        selectedAll,
        selectedPartial,
        anySelectable,
        toggleSelectAll,
    } = useTableSelect(selectable, items, selectedItems);

    const builtCellMatrix = computed<Cell[][]>(() => {
        return tableCellBuilder.updateColumnDefs(columns.value).updateItems(items.value).build();
    });
    const headerCells = ref<HeaderCell[]>([]);
    const rawBodyCells = ref<BodyCell[][]>([]);

    const totalItemsCount = computed(() => rawBodyCells.value.filter(matchBySearch).length);
    const { totalPages, totalItems, pageStartIndex, pageEndIndex } = useTablePagination(
        pagination,
        page,
        pageSize,
        totalItemsCount,
        serverMode,
    );
    const preprocessedBodyCells = computed<BodyCell[][]>(() => {
        return rawBodyCells.value.filter(matchBySearch).sort(compareRows);
    });
    const bodyCells = computed<BodyCell[][]>(() => {
        if (objectUtil.isEmpty(pagination.value)) {
            return preprocessedBodyCells.value;
        }
        if (serverMode.value) {
            return preprocessedBodyCells.value;
        }
        return preprocessedBodyCells.value.slice(pageStartIndex.value, pageEndIndex.value);
    });

    function initCells(cellMatrix: Cell[][]): void {
        const [header, ...body] = cellMatrix;
        const nextHeaderCells = [...header] as HeaderCell[];
        const nextBodyCells = [...body] as BodyCell[][];

        headerCells.value = nextHeaderCells;
        rawBodyCells.value = nextBodyCells;
    }

    function initialize(): void {
        initCells(tableCellBuilder.build());
    }

    watch(builtCellMatrix, (matrix) => {
        initCells(matrix);
    });

    watch(internalSelectedItems, (nextSelectedItems) => {
        cb?.updateSelectedItems(nextSelectedItems);
    });

    watch(bodyCells, (nextBodyCells) => {
        const pagedItems = nextBodyCells.map((row) => {
            const firstCell = row[0];
            return firstCell?.item || {};
        });
        cb?.updatePagedItems(pagedItems);
    });

    watch(preprocessedBodyCells, (nextBodyCells) => {
        const nextTotalItems = nextBodyCells.map((row) => {
            const firstCell = row[0];
            return firstCell?.item || {};
        });
        cb?.updateTotalItems(nextTotalItems);
    });

    return {
        initialize,
        columns,
        items,
        selectable,
        expandable,
        state,
        draggable,
        headerCells,
        bodyCells,
        loading,
        anyExpandable,
        isExpanded,
        toggleExpand,
        anySelectable,
        selectedItems: internalSelectedItems,
        selectedAll,
        selectedPartial,
        toggleSelectAll,
        sortType,
        sortColumn,
        updateSortType,
        search,
        pagination,
        page,
        pageSize,
        totalPages,
        totalItems,
        pageStartIndex,
        pageEndIndex,
        primary,
    };
}

// return type of useTable
export type TableComposable = {
    columns: ComputedRef<ColumnDef[] | null>;
    items: Ref<Item[]>;
    headerCells: Ref<HeaderCell[]>;
    bodyCells: ComputedRef<BodyCell[][]>;
    anyExpandable: ComputedRef<boolean>;
    anySelectable: ComputedRef<boolean>;
    selectedItems: Ref<Item[]>;
    selectedAll: ComputedRef<boolean>;
    selectedPartial: ComputedRef<boolean>;
    selectable: ComputedRef<(item: Item, index?: number, items?: Item[]) => boolean>;
    expandable: ComputedRef<(item: Item, index?: number, items?: Item[]) => boolean>;
    state: ComputedRef<(item: Item, index?: number, items?: Item[]) => UIState>;
    sortType: Ref<SortType>;
    sortColumn: Ref<ColumnDef | null>;
    loading: Ref<boolean | undefined> | undefined;
    draggable: Ref<boolean | undefined> | undefined;
    primary: Ref<boolean | undefined> | undefined;
    search: ComputedRef<Exclude<SearchProps, boolean>>;
    pagination: ComputedRef<VsTablePaginationOptions>;
    page: ComputedRef<number>;
    pageSize: ComputedRef<number>;
    totalPages: ComputedRef<number>;
    totalItems: ComputedRef<number>;
    pageStartIndex: ComputedRef<number>;
    pageEndIndex: ComputedRef<number>;
    isExpanded: (row: Cell[]) => boolean;
    toggleExpand: (row: Cell[]) => boolean;
    updateSortType: (headerKey: string) => void;
    initialize: () => void;
    toggleSelectAll: () => void;
};
