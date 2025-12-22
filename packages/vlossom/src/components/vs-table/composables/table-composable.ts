import { computed, ref, toRefs, watch, type ComputedRef, type Ref } from 'vue';
import type { PropsOf, VsComponent } from '@/declaration';
import { isColumnDefArray, type BodyCell, type ColumnDef, type HeaderCell, type Cell, type Item } from '../types';
import { TableCellBuilder } from '../models/table-cell-builder';
import { useTableSelect } from './table-select-composable';
import { functionUtil, stringUtil } from '@/utils';

export const TABLE_COMPOSABLE_TOKEN = Symbol('TABLE_COMPOSABLE_TOKEN');
export function useTable(props: PropsOf<VsComponent.VsTable>) {
    const { columns: rawColumns, items: rawItems, selectable: rawSelectable } = toRefs(props);

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
    const selectable = computed(() => {
        return functionUtil.toCallable<[Item, number?, Item[]?]>(rawSelectable?.value);
    });
    const headerCells = ref<HeaderCell[]>([]);
    const bodyCells = ref<BodyCell[][]>([]);
    const tableCellBuilder = new TableCellBuilder(items.value, columns.value);

    const { selectedIds, selectedAll, anySelectable, partiallySelected, toggleSelectedAll, toggleSelectedRow } =
        useTableSelect(selectable, items);

    function initCells(cellMatrix: Cell[][]): void {
        const [header, ...body] = cellMatrix;
        const nextHeaderCells = [...header] as HeaderCell[];
        const nextBodyCells = [...body] as BodyCell[][];

        headerCells.value = nextHeaderCells;
        bodyCells.value = nextBodyCells;
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

    return {
        initialize,
        columns,
        items,
        selectable,
        headerCells,
        bodyCells,
        anySelectable,
        selectedIds,
        selectedAll,
        partiallySelected,
        toggleSelectedAll,
        toggleSelectedRow,
    };
}

// return type of useTable
export type TableComposable = {
    columns: ComputedRef<ColumnDef[] | null>;
    items: Ref<Item[]>;
    headerCells: Ref<HeaderCell[]>;
    bodyCells: Ref<BodyCell[][]>;
    anySelectable: ComputedRef<boolean>;
    selectedIds: Ref<string[]>;
    selectedAll: ComputedRef<boolean>;
    partiallySelected: ComputedRef<boolean>;
    selectable: ComputedRef<(item: Item, index?: number, items?: Item[]) => boolean>;
    initialize: () => void;
    toggleSelectedAll: () => void;
    toggleSelectedRow: (item: Item) => void;
};
