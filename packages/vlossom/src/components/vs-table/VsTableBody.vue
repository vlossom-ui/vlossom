<template>
    <draggable
        v-model="displayedBodyCells"
        v-bind="DEFAULT_SORTABLE_OPTIONS"
        :class="TABLE_DRAG_WRAPPER_CLASS"
        :item-key="getRowId"
        :disabled="loading"
        @update="handleDragUpdate"
    >
        <template #item="{ element: cells, index: rowIdx }">
            <tbody>
                <vs-table-body-row
                    :cells
                    :rowIdx
                    @click-cell="clickCell"
                    @select-row="selectRow"
                    @expand-row="expandRow"
                >
                    <template v-for="name in Object.keys($slots)" #[name]="slotData">
                        <slot :name v-bind="slotData || {}" />
                    </template>
                </vs-table-body-row>
            </tbody>
        </template>

        <tbody v-if="displayedBodyCells.length === 0">
            <tr>
                <td colspan="100%" class="h-52">
                    <div class="flex flex-col items-center justify-center text-gray-700">
                        <vs-render :content="tableIcons.noData" />
                        <p class="text-xl font-bold">NO DATA</p>
                    </div>
                </td>
            </tr>
        </tbody>
    </draggable>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, watch } from 'vue';
import { type BodyCell, getRowId, getRowItem } from './types';
import { tableIcons } from './icons';
import { DEFAULT_SORTABLE_OPTIONS, TABLE_DRAG_WRAPPER_CLASS } from './constants';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import draggable from 'vuedraggable/src/vuedraggable';
import type { SortableEvent } from 'sortablejs';

import VsRender from '@/components/vs-render/VsRender.vue';
import VsTableBodyRow from './VsTableBodyRow.vue';

export default defineComponent({
    components: {
        VsRender,
        VsTableBodyRow,
        draggable,
    },
    emits: ['click-cell', 'select-row', 'expand-row', 'drag'],
    setup(props, { emit }) {
        const { bodyCells, loading } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        // NOTE: These values are arrays used to represent the **draggable** view.
        const displayOrder = ref<number[]>([]);
        const displayedBodyCells = computed<BodyCell[][]>({
            get(): BodyCell[][] {
                const baseCells = bodyCells.value;
                if (displayOrder.value.length === 0) {
                    return baseCells;
                }
                return displayOrder.value.map((idx) => baseCells[idx]);
            },
            set(newCells: BodyCell[][]): void {
                const baseCells = bodyCells.value;
                const baseIds = baseCells.map(getRowId);

                displayOrder.value = newCells
                    .map((row) => baseIds.indexOf(getRowId(row)))
                    .filter((idx) => idx !== -1);
            },
        });

        function clickCell(cell: BodyCell, event: MouseEvent): void {
            emit('click-cell', { ...cell }, event);
        }

        function selectRow(row: BodyCell[], event: MouseEvent): void {
            emit('select-row', row, event);
            emit('click-cell', { ...row[0] }, event);
        }

        function expandRow(row: BodyCell[], event: MouseEvent): void {
            emit('expand-row', row, event);
        }

        function handleDragUpdate(event: SortableEvent): void {
            emit('drag', event);
        }

        watch(
            bodyCells,
            (newCells) => {
                displayOrder.value = newCells.map((_, idx) => idx);
            },
            { immediate: true },
        );

        return {
            DEFAULT_SORTABLE_OPTIONS,
            TABLE_DRAG_WRAPPER_CLASS,
            bodyCells,
            displayedBodyCells,
            loading,
            tableIcons,
            clickCell,
            getRowItem,
            getRowId,
            selectRow,
            expandRow,
            handleDragUpdate,
        };
    },
});
</script>
