import { computed, onBeforeMount, ref, toRefs, watch, type ComputedRef, type Ref } from 'vue';
import type { PropsOf, VsComponent } from '@/declaration';
import { isColumnDefArray, type BodyCell, type ColumnDef, type HeaderCell, type Cell } from '../types';
import { TableCellBuilder } from '../models/table-cell-builder';

export const TABLE_COMPOSABLE_TOKEN = Symbol('TABLE_COMPOSABLE_TOKEN');
export function useTable(props: PropsOf<VsComponent.VsTable>) {
    const { columns: rawColumns, items } = toRefs(props);

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

    const headerCells = ref<HeaderCell[]>([]);
    const bodyCells = ref<BodyCell[][]>([]);
    const tableCellBuilder = new TableCellBuilder(items.value, columns.value);

    function initCells(cellMatrix: Cell[][]): void {
        const [header, ...body] = cellMatrix;
        const nextHeaderCells = [...header] as HeaderCell[];
        const nextBodyCells = [...body] as BodyCell[][];

        headerCells.value = nextHeaderCells;
        bodyCells.value = nextBodyCells;
    }

    onBeforeMount(() => {
        initCells(tableCellBuilder.build());
    });

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
        columns,
        headerCells,
        bodyCells,
    };
}

// return type of useTable
export type TableComposable = {
    columns: ComputedRef<ColumnDef[] | null>;
    headerCells: Ref<HeaderCell[]>;
    bodyCells: Ref<BodyCell[][]>;
};
