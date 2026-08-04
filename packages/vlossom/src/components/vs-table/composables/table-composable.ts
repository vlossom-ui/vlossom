import {
    computed,
    ref,
    toRefs,
    watch,
    type ComputedRef,
    type Ref,
    type TemplateRef,
    type WritableComputedRef,
} from 'vue';
import { functionUtil, objectUtil, stringUtil } from '@/utils';
import { type UIState, type VsComponent, type PropsOf, type Size } from '@/declaration';
import type { VsSearchInputRef } from '@/components';

import {
    type VsTableSortType,
    type VsTableColumnDef,
    type VsTableHeaderCell,
    type VsTableCell,
    type VsTableItem,
    type VsTableRow,
    type VsTablePaginationOptions,
    type VsTableSearchOptions,
} from './../types';
import { TableCellBuilder } from './../models/table-cell-builder';
import { isVsTableColumnDefArray } from './../models/table-model';
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
} from './../constants';

export const TABLE_COMPOSABLE_TOKEN = Symbol('TABLE_COMPOSABLE_TOKEN');
export function useTable(
    tableId: string,
    props: PropsOf<VsComponent.VsTable>,
    refs: { searchInputRef: TemplateRef<VsSearchInputRef>; hasExpandSlot: ComputedRef<boolean> },
    cb?: {
        updateSelectedItems: (items: VsTableItem[]) => void;
        updatePage: (page: number) => void;
        updatePageSize: (pageSize: number) => void;
        updatePagedItems: (items: VsTableItem[]) => void;
        updateTotalItems: (items: VsTableItem[]) => void;
        paginate: (page: number, pageSize: number) => void;
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
        size,
    } = toRefs(props);

    // normalize
    const columns = computed<VsTableColumnDef[]>(() => {
        if (!rawColumns?.value) {
            return [];
        }
        if (isVsTableColumnDefArray(rawColumns.value)) {
            return rawColumns.value;
        }
        return rawColumns.value.map((column: string) => {
            return { key: column, label: column } as VsTableColumnDef;
        });
    });
    const items = computed<VsTableItem[]>(() => {
        return rawItems?.value ?? ([] as VsTableItem[]);
    });
    const expandable = computed(() => {
        return functionUtil.toCallable<[VsTableItem, number?, VsTableItem[]?], boolean>(rawExpandable?.value);
    });
    const selectable = computed(() => {
        return functionUtil.toCallable<[VsTableItem, number?, VsTableItem[]?], boolean>(rawSelectable?.value);
    });
    const state = computed(() => {
        return functionUtil.toCallable<[VsTableItem, number?, VsTableItem[]?], UIState>(rawState?.value);
    });
    const selectedItems = computed<VsTableItem[]>(() => {
        return rawSelectedItems?.value ?? [];
    });
    const search = computed<VsTableSearchOptions>(() => {
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
        if (rawPagination.value.pageSizeOptions) {
            return { ...DEFAULT_PAGINATION_OPTIONS, ...rawPagination.value };
        }
        if (typeof rawPageSize?.value === 'number') {
            const isValidPageSize = DEFAULT_PAGE_SIZE_OPTIONS.some((option) => option.value === rawPageSize.value);
            if (isValidPageSize) {
                return { ...DEFAULT_PAGINATION_OPTIONS, ...rawPagination.value };
            }
            const addedOption = toDefaultPageSizeOptions(rawPageSize.value as number);
            const pageSizeOptions = [...DEFAULT_PAGE_SIZE_OPTIONS]
                .filter((option) => option.value !== addedOption.value)
                .concat(addedOption)
                .sort((a, b) => a.value - b.value);
            return {
                ...DEFAULT_PAGINATION_OPTIONS,
                ...rawPagination.value,
                pageSizeOptions,
            };
        }
        return { ...DEFAULT_PAGINATION_OPTIONS, ...rawPagination.value };
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
            // NaN === internalPageSize, means that pageSize is about to be initialized
            if (!Number.isNaN(internalPageSize.value)) {
                return internalPageSize.value;
            }
            const currentPageSize = rawPageSize?.value;
            if (typeof currentPageSize === 'number') {
                return currentPageSize;
            }
            return pagination.value.pageSizeOptions?.[0]?.value ?? DEFAULT_PAGE_SIZE;
        },
        set: (value: number) => {
            internalPageSize.value = value;
            cb?.updatePageSize(value);
            // reset page to 0 when page size changes
            page.value = 0;
        },
    });

    const tableCellBuilder = new TableCellBuilder(tableId, items.value, columns.value);
    const { anyExpandable, isExpanded, toggleExpand, setExpand } = useTableExpand(expandable, items);
    const { sortType, sortColumn, compareRows, updateSortType } = useTableSort(columns);
    const { matchBySearch } = useTableSearch(refs.searchInputRef, columns, search);
    const {
        selectedItems: internalSelectedItems,
        selectedAll,
        selectedPartial,
        anySelectable,
        toggleSelectAll,
    } = useTableSelect(selectable, items, selectedItems);

    function getGridColumnWidth(column: VsTableColumnDef): string {
        const { width, minWidth, maxWidth } = column;
        if (width) {
            return stringUtil.toStringSize(width);
        }
        const min = minWidth ? stringUtil.toStringSize(minWidth) : null;
        const max = maxWidth ? stringUtil.toStringSize(maxWidth) : null;
        if (min && max) {
            return `minmax(${min}, ${max})`;
        }
        if (min) {
            return `minmax(${min}, 1fr)`;
        }
        if (max) {
            return `minmax(auto, ${max})`;
        }
        return 'minmax(max-content, 1fr)';
    }

    const gridTemplateColumns = computed<string>(() => {
        const cols: string[] = [];
        if (draggable?.value) {
            cols.push('auto');
        }
        if (anySelectable.value) {
            cols.push('auto');
        }
        columns.value.forEach((column) => {
            cols.push(getGridColumnWidth(column));
        });
        // expand 셀은 anyExpandable && expand 슬롯이 있을 때만 렌더되므로(showExpand) 트랙도 같은 조건으로 추가한다.
        if (anyExpandable.value && refs.hasExpandSlot.value) {
            cols.push('auto');
        }
        return cols.join(' ');
    });

    const builtTable = computed<{ header: VsTableHeaderCell[]; rows: VsTableRow[] }>(() => {
        return tableCellBuilder.updateColumnDefs(columns.value).updateItems(items.value).build();
    });
    const headerCells = ref<VsTableHeaderCell[]>([]);
    const rawBodyRows = ref<VsTableRow[]>([]);

    const totalItemsCount = computed(() => rawBodyRows.value.filter(matchBySearch).length);
    const { totalPages, totalItems, pageStartIndex, pageEndIndex } = useTablePagination(
        pagination,
        page,
        pageSize,
        totalItemsCount,
        serverMode,
    );
    const preprocessedBodyRows = computed<VsTableRow[]>(() => {
        return rawBodyRows.value.filter(matchBySearch).sort(compareRows);
    });
    const bodyRows = computed<VsTableRow[]>(() => {
        if (objectUtil.isEmpty(pagination.value)) {
            return preprocessedBodyRows.value;
        }
        if (serverMode.value) {
            return preprocessedBodyRows.value;
        }
        return preprocessedBodyRows.value.slice(pageStartIndex.value, pageEndIndex.value);
    });

    function initTable(built: { header: VsTableHeaderCell[]; rows: VsTableRow[] }): void {
        headerCells.value = [...built.header];
        rawBodyRows.value = [...built.rows];
    }

    function initialize(): void {
        initTable(tableCellBuilder.build());
    }

    watch(builtTable, (next) => {
        initTable(next);
    });

    watch(internalSelectedItems, (nextSelectedItems) => {
        cb?.updateSelectedItems(nextSelectedItems);
    });

    watch(bodyRows, (rows) => {
        cb?.updatePagedItems(rows.map((row) => row.item));
    });

    watch(preprocessedBodyRows, (rows) => {
        cb?.updateTotalItems(rows.map((row) => row.item));
    });

    // pageSize 변경은 page를 0으로 리셋하지만 두 변경이 같은 tick에 일어나므로 콜백은 한 번만 실행된다.
    watch([page, pageSize], ([nextPage, nextPageSize]) => {
        cb?.paginate(nextPage, nextPageSize);
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
        bodyRows,
        loading,
        gridTemplateColumns,
        anyExpandable,
        isExpanded,
        toggleExpand,
        setExpand,
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
        size,
    };
}

// return type of useTable
export type TableComposable = {
    columns: ComputedRef<VsTableColumnDef[] | null>;
    items: Ref<VsTableItem[]>;
    headerCells: Ref<VsTableHeaderCell[]>;
    bodyRows: ComputedRef<VsTableRow[]>;
    gridTemplateColumns: ComputedRef<string>;
    anyExpandable: ComputedRef<boolean>;
    anySelectable: ComputedRef<boolean>;
    selectedItems: Ref<VsTableItem[]>;
    selectedAll: ComputedRef<boolean>;
    selectedPartial: ComputedRef<boolean>;
    selectable: ComputedRef<(item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean>;
    expandable: ComputedRef<(item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean>;
    state: ComputedRef<(item: VsTableItem, index?: number, items?: VsTableItem[]) => UIState>;
    sortType: Ref<VsTableSortType>;
    sortColumn: Ref<VsTableColumnDef | null>;
    loading: Ref<boolean | undefined> | undefined;
    draggable: Ref<boolean | undefined> | undefined;
    primary: Ref<boolean | undefined> | undefined;
    size: Ref<Size | undefined> | undefined;
    search: ComputedRef<VsTableSearchOptions>;
    pagination: ComputedRef<VsTablePaginationOptions>;
    page: WritableComputedRef<number>;
    pageSize: WritableComputedRef<number>;
    totalPages: ComputedRef<number>;
    totalItems: ComputedRef<number>;
    pageStartIndex: ComputedRef<number>;
    pageEndIndex: ComputedRef<number>;
    isExpanded: (row: VsTableCell[]) => boolean;
    toggleExpand: (row: VsTableCell[]) => boolean;
    setExpand: (row: VsTableCell[], shouldExpand: boolean) => boolean;
    updateSortType: (headerKey: string) => void;
    initialize: () => void;
    toggleSelectAll: () => void;
};
