import { computed, ref, toRefs, watch, type ComputedRef, type Ref, type TemplateRef } from 'vue';
import { functionUtil, logUtil, objectUtil, stringUtil } from '@/utils';
import { type PropsOf, VsComponent, type SearchProps } from '@/declaration';
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
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGINATION_OPTIONS, TABLE_SEARCH_OPTIONS } from '../constants';

export const TABLE_COMPOSABLE_TOKEN = Symbol('TABLE_COMPOSABLE_TOKEN');
export function useTable(
    props: PropsOf<VsComponent.VsTable>,
    refs: { searchInputRef: TemplateRef<VsSearchInputRef> },
    cb?: {
        updateSelectedItems: (items: Item[]) => void;
        updatePage: (page: number) => void;
        updatePageSize: (pageSize: number) => void;
    },
) {
    const {
        columns: rawColumns,
        items: rawItems,
        selectable: rawSelectable,
        expandable: rawExpandable,
        selectedItems: rawSelectedItems,
        search: rawSearch,
        pagination: rawPagination,
        serverMode: rawServerMode,
        page: rawPage,
        pageSize: rawPageSize,
        loading,
        draggable,
    } = toRefs(props);

    // normalize
    const columns = computed<ColumnDef[]>(() => {
        if (!rawColumns?.value) {
            return [];
        }
        if (isColumnDefArray(rawColumns.value)) {
            return rawColumns.value;
        }
        return rawColumns.value.map((column) => {
            return { key: column, label: column } as ColumnDef;
        });
    });
    const items = computed<Item[]>(() => {
        return rawItems.value.map((item) => ({
            ...item,
            id: item.id ?? stringUtil.createID(),
        }));
    });
    const expandable = computed(() => {
        return functionUtil.toCallable<[Item, number?, Item[]?]>(rawExpandable?.value);
    });
    const selectable = computed(() => {
        return functionUtil.toCallable<[Item, number?, Item[]?]>(rawSelectable?.value);
    });
    const selectedItems = computed<Item[]>(() => {
        if (!rawSelectedItems?.value) {
            return [];
        }
        const itemIds = new Set(items.value.map((i) => i.id));
        const invalidIdItems = rawSelectedItems.value.filter((item) => !itemIds.has(item.id));
        if (invalidIdItems.length) {
            logUtil.propError(VsComponent.VsTable, 'selectedItems', 'selectedItems id must be in items');
            return [];
        }
        return rawSelectedItems.value;
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
        if (typeof rawPagination?.value === 'boolean') {
            return DEFAULT_PAGINATION_OPTIONS;
        }

        return {
            ...DEFAULT_PAGINATION_OPTIONS,
            ...rawPagination.value,
        };
    });
    const serverMode = computed(() => rawServerMode?.value ?? false);
    const internalPage = ref(0);
    const internalPageSize = ref(DEFAULT_PAGE_SIZE);
    const page = computed<number>({
        get: () => rawPage?.value ?? internalPage.value,
        set: (value: number) => {
            internalPage.value = value;
            cb?.updatePage(value);
        },
    });
    const pageSize = computed<number>({
        get: () => {
            const currentPageSize = rawPageSize?.value;
            const pageSizeOptions = pagination.value.pageSizeOptions;

            if (!currentPageSize) {
                return internalPageSize.value;
            }
            if (pageSizeOptions) {
                const isValidPageSize = pageSizeOptions.some((option) => option.value === currentPageSize);

                if (!isValidPageSize) {
                    logUtil.propWarning(
                        VsComponent.VsTable,
                        'pageSize',
                        `pageSize (${currentPageSize}) is not in [${pageSizeOptions.map((option) => option.value)}]`,
                    );
                }
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
    const { selectedIds, selectedAll, selectedPartial, anySelectable, toggleSelectAll } = useTableSelect(
        selectable,
        items,
        selectedItems,
    );

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
    const bodyCells = computed<BodyCell[][]>(() => {
        if (objectUtil.isEmpty(pagination.value)) {
            return rawBodyCells.value.filter(matchBySearch).sort(compareRows);
        }
        if (serverMode.value) {
            return rawBodyCells.value.filter(matchBySearch).sort(compareRows);
        }
        return rawBodyCells.value
            .filter(matchBySearch)
            .sort(compareRows)
            .slice(pageStartIndex.value, pageEndIndex.value);
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

    watch(
        [columns, items],
        ([nextColumnDefs, nextItems]) => {
            const nextCells: Cell[][] = tableCellBuilder
                .updateColumnDefs(nextColumnDefs)
                .updateItems(nextItems)
                .build();

            initCells(nextCells);
        },
        { deep: true },
    );

    watch(selectedIds, (nextSelectedIds) => {
        const nextSelectedItems = nextSelectedIds
            .map((selectedId) => items.value.find((item) => item.id === selectedId))
            .filter(Boolean) as Item[];

        cb?.updateSelectedItems(nextSelectedItems);
    });

    return {
        initialize,
        columns,
        items,
        selectable,
        expandable,
        draggable,
        headerCells,
        bodyCells,
        loading,
        anyExpandable,
        isExpanded,
        toggleExpand,
        anySelectable,
        selectedIds,
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
    selectedIds: Ref<string[]>;
    selectedAll: ComputedRef<boolean>;
    selectedPartial: ComputedRef<boolean>;
    selectable: ComputedRef<(item: Item, index?: number, items?: Item[]) => boolean>;
    expandable: ComputedRef<(item: Item, index?: number, items?: Item[]) => boolean>;
    sortType: Ref<SortType>;
    sortColumn: Ref<ColumnDef | null>;
    loading: Ref<boolean | undefined> | undefined;
    draggable: Ref<boolean | undefined> | undefined;
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
