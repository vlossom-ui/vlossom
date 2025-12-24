<template>
    <template v-if="isBodyRow(cells)">
        <td v-if="anySelectable" class="w-10" @click.prevent.stop="selectRow(cells, $event)">
            <slot name="select" :cells :rowIdx>
                <vs-checkbox
                    v-if="isRowSelectable(cells, rowIdx)"
                    multiple
                    v-model="selectedIds"
                    :true-value="getRowId(cells)"
                    @toggle="selectRow(cells, $event)"
                />
            </slot>
        </td>
    </template>

    <template v-else>
        <th v-if="anySelectable" class="w-10" @click.prevent.stop="selectRow(cells, $event)">
            <slot name="select" :cells :rowIdx>
                <vs-checkbox :model-value="selectedAll" :indeterminate="selectedPartial" @toggle="toggleSelectAll" />
            </slot>
        </th>
    </template>
</template>

<script lang="ts">
import { defineComponent, inject, type PropType } from 'vue';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import { getRowItem, type Cell, isBodyRow, getRowId } from './types';

export default defineComponent({
    props: {
        cells: {
            type: Array as PropType<Cell[]>,
            default: () => [],
        },
        rowIdx: {
            type: Number,
            default: 0,
        },
    },
    emits: ['select-row'],
    setup(_props, { emit }) {
        const { anySelectable, selectedIds, selectable, items, selectedAll, selectedPartial, toggleSelectAll } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        function isRowSelectable(row: Cell[], rowIdx: number): boolean {
            if (!isBodyRow(row)) {
                return false;
            }
            const item = getRowItem(row);
            return selectable.value(item, rowIdx, items.value);
        }

        function selectRow(row: Cell[], event: MouseEvent): void {
            if (!isBodyRow(row)) {
                return;
            }
            const item = getRowItem(row);
            const rowIdx = row[0]?.rowIdx;
            if (!rowIdx) {
                return;
            }
            if (!item || !selectable.value(item, rowIdx, items.value)) {
                return;
            }
            emit('select-row', row, event);
        }

        return {
            isBodyRow,
            getRowId,
            isRowSelectable,
            selectRow,
            anySelectable,
            selectedIds,
            selectedAll,
            selectedPartial,
            toggleSelectAll,
        };
    },
});
</script>
