import { computed, ref, toRefs, watch, type ComputedRef, type Ref } from 'vue';
import { functionUtil, logUtil, stringUtil } from '@/utils';
import { type PropsOf, VsComponent } from '@/declaration';
import {
    isColumnDefArray,
    SortType,
    type BodyCell,
    type ColumnDef,
    type HeaderCell,
    type Cell,
    type Item,
} from '../types';
import { TableCellBuilder } from '../models/table-cell-builder';
import { useTableSelect } from './table-select-composable';
import { useTableSort } from './table-sort-composable';
import { useTableExpand } from './table-expand-composable';

export const TABLE_COMPOSABLE_TOKEN = Symbol('TABLE_COMPOSABLE_TOKEN');
export function useTable(props: PropsOf<VsComponent.VsTable>, cb?: { updateSelectedItems: (items: Item[]) => void }) {
    const {
        columns: rawColumns,
        items: rawItems,
        selectable: rawSelectable,
        expandable: rawExpandable,
        selectedItems: rawSelectedItems,
    } = toRefs(props);

    // normalize
    const columns = computed<ColumnDef[] | null>(() => {
        if (!rawColumns?.value) {
            return null;
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

    const tableCellBuilder = new TableCellBuilder(items.value, columns.value);
    const { anyExpandable, isExpanded, toggleExpand } = useTableExpand(expandable, items);
    const { sortType, sortColumn, compareRows, updateSortType } = useTableSort(columns);
    const { selectedIds, selectedAll, selectedPartial, anySelectable, toggleSelectAll } = useTableSelect(
        selectable,
        items,
        selectedItems,
    );

    const headerCells = ref<HeaderCell[]>([]);
    const rawBodyCells = ref<BodyCell[][]>([]);
    const bodyCells = computed<BodyCell[][]>(() => {
        if (sortType.value === SortType.NONE) {
            return rawBodyCells.value;
        }
        return [...rawBodyCells.value].sort(compareRows);
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
        headerCells,
        bodyCells,
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
        compareRows,
        updateSortType,
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
    isExpanded: (row: Cell[]) => boolean;
    toggleExpand: (row: Cell[]) => boolean;
    compareRows: (aRow: BodyCell[], bRow: BodyCell[]) => number;
    updateSortType: (headerKey: string) => void;
    initialize: () => void;
    toggleSelectAll: () => void;
};
