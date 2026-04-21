<template>
    <draggable
        tag="tbody"
        v-model="displayedBodyCells"
        v-bind="DEFAULT_SORTABLE_OPTIONS"
        :class="[TABLE_DRAG_WRAPPER_CLASS, 'vs-table-body']"
        :item-key="getRowId"
        :disabled="loading"
        @update="handleDragUpdate"
    >
        <template #item="{ element, index }">
            <vs-table-body-row
                :cells="element"
                :rowIdx="index"
                @click-cell="clickCell"
                @select-row="selectRow"
                @expand-row="expandRow"
            >
                <template v-for="name in bodySlots" #[name]="slotData">
                    <slot :name v-bind="slotData || {}" />
                </template>
            </vs-table-body-row>
        </template>
    </draggable>

    <tbody class="vs-table-tbody" v-if="displayedBodyCells.length === 0">
        <tr class="vs-table-body-row">
            <td class="vs-table-td vs-table-no-data-cell" colspan="100%">
                <div class="vs-table-no-data">
                    <template v-if="loading">
                        <vs-loading />
                    </template>
                    <template v-else>
                        <vs-render :content="tableIcons.noData" />
                        <p class="vs-table-no-data-text">NO DATA</p>
                    </template>
                </div>
            </td>
        </tr>
    </tbody>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, watch } from 'vue';
import { type VsTableBodyCell, getRowId, getRowItem } from './types';
import { tableIcons } from './icons';
import { DEFAULT_SORTABLE_OPTIONS, TABLE_DRAG_WRAPPER_CLASS } from './constants';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import draggable from 'vuedraggable/src/vuedraggable';
import type { SortableEvent } from 'sortablejs';

import VsLoading from '@/components/vs-loading/VsLoading.vue';
import VsRender from '@/components/vs-render/VsRender.vue';
import VsTableBodyRow from './VsTableBodyRow.vue';

export default defineComponent({
    components: {
        VsLoading,
        VsRender,
        VsTableBodyRow,
        draggable,
    },
    emits: ['click-cell', 'select-row', 'expand-row', 'drag'],
    setup(props, { slots, emit }) {
        const { bodyCells, loading } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        const bodySlots = computed(() =>
            Object.keys(slots).filter((slotName) =>
                ['body', 'select', 'expand'].some((whitelist) => slotName.startsWith(whitelist)),
            ),
        );

        // NOTE: These values are arrays used to represent the **draggable** view.
        const displayOrder = ref<number[]>([]);
        const displayedBodyCells = computed<VsTableBodyCell[][]>({
            get(): VsTableBodyCell[][] {
                const baseCells = bodyCells.value;
                if (displayOrder.value.length === 0) {
                    return baseCells;
                }
                return displayOrder.value.map((idx) => baseCells[idx]);
            },
            set(newCells: VsTableBodyCell[][]): void {
                const baseCells = bodyCells.value;
                const baseIds = baseCells.map(getRowId);

                displayOrder.value = newCells.map((row) => baseIds.indexOf(getRowId(row))).filter((idx) => idx !== -1);
            },
        });

        function clickCell(cell: VsTableBodyCell, event: MouseEvent): void {
            emit('click-cell', { ...cell }, event);
        }

        function selectRow(row: VsTableBodyCell[], event: MouseEvent): void {
            emit('select-row', row, event);
            emit('click-cell', { ...row[0] }, event);
        }

        function expandRow(row: VsTableBodyCell[], event: MouseEvent): void {
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
            bodySlots,
            displayedBodyCells,
            loading,
            tableIcons,
            clickCell,
            getRowItem: getRowItem,
            getRowId,
            selectRow,
            expandRow,
            handleDragUpdate,
        };
    },
});
</script>
