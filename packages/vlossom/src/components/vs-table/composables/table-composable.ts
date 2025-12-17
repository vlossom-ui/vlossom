import { computed, onBeforeMount, ref, toRefs, watch, type ComputedRef, type Ref } from 'vue';
import { objectUtil } from '@/utils';
import { isColumnDefArray, type BodyCell, type ColumnDef, type HeaderCell } from '../types';
import { TableCellBuilder } from '../models/table-cell-builder';
import type { PropsOf, VsComponent } from '@/declaration';

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
    const cellBuilder = new TableCellBuilder(items.value, columns.value);

    function initCells(): void {
        const { headerCells: newHeaderCells, bodyCells: newBodyCells } = cellBuilder.build();
        headerCells.value = [...newHeaderCells];
        bodyCells.value = [...newBodyCells];
    }

    onBeforeMount(() => {
        initCells();
    });

    watch(
        [columns, items],
        ([newColumns, newItems], [oldColumns, oldItems]) => {
            if (newColumns && !objectUtil.isEqual(newColumns, oldColumns)) {
                cellBuilder.updateColumnDefs(newColumns);
            }
            if (newItems && !objectUtil.isEqual(newItems, oldItems)) {
                cellBuilder.updateItems(newItems);
            }
            initCells();
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
