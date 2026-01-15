<template>
    <!-- draggable 활성화 시 -->
    <draggable
        v-if="draggable"
        tag="tbody"
        :data-draggable="!loading"
        v-model="displayedBodyCells"
        :item-key="getRowKey"
        :disabled="loading"
        v-bind="sortableOptions"
        @update="handleDragUpdate"
    >
        <template #item="{ element: cells, index: rowIdx }">
            <vs-table-body-row
                :cells
                :rowIdx
                @click-cell="clickCell"
                @select-row="selectRow"
                @expand-row="expandRow"
            >
                <!-- 모든 slot을 VsTableBodyRow로 전달 -->
                <template v-for="name in Object.keys($slots)" #[name]="slotData">
                    <slot :name v-bind="slotData || {}" />
                </template>
            </vs-table-body-row>
        </template>

        <!-- NO DATA 처리 -->
        <template v-if="displayedBodyCells.length === 0">
            <tr>
                <td colspan="100%" class="h-52">
                    <div class="flex flex-col items-center justify-center text-gray-700">
                        <vs-render :content="tableIcons.noData" />
                        <p class="text-xl font-bold">NO DATA</p>
                    </div>
                </td>
            </tr>
        </template>
    </draggable>

    <!-- 기존 vs-visible-render (draggable 비활성화 시) -->
    <vs-visible-render v-else tag="tbody" :disabled="!virtualScroll" :root-margin="'12.5rem'">
        <template v-if="bodyCells.length">
            <template v-for="(cells, rowIdx) in bodyCells" :key="rowIdx">
                <vs-table-body-row
                    :cells
                    :rowIdx
                    @click-cell="clickCell"
                    @select-row="selectRow"
                    @expand-row="expandRow"
                >
                    <!-- 모든 slot을 VsTableBodyRow로 전달 -->
                    <template v-for="name in Object.keys($slots)" #[name]="slotData">
                        <slot :name v-bind="slotData || {}" />
                    </template>
                </vs-table-body-row>
            </template>
        </template>

        <template v-else>
            <tr>
                <td colspan="100%" class="h-52">
                    <div class="flex flex-col items-center justify-center text-gray-700">
                        <vs-render :content="tableIcons.noData" />
                        <p class="text-xl font-bold">NO DATA</p>
                    </div>
                </td>
            </tr>
        </template>
    </vs-visible-render>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { type BodyCell, type DragPayload, getRowId, getRowItem } from './types';
import { tableIcons } from './icons';
import { DEFAULT_SORTABLE_OPTIONS } from './constants';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import draggable from 'vuedraggable/src/vuedraggable';
import type { SortableEvent } from 'sortablejs';

import VsRender from '@/components/vs-render/VsRender.vue';
import VsVisibleRender from '@/components/vs-visible-render/VsVisibleRender.vue';
import VsTableBodyRow from './VsTableBodyRow.vue';

export default defineComponent({
    components: {
        VsRender,
        VsVisibleRender,
        VsTableBodyRow,
        draggable,
    },
    props: {
        virtualScroll: { type: Boolean, default: false },
        draggable: { type: Boolean, default: false },
    },
    emits: ['click-cell', 'select-row', 'expand-row', 'drag'],
    setup(props, { emit }) {
        const { bodyCells, displayedBodyCells, createDragPayload, loading } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

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
            const payload = createDragPayload(event);
            if (payload) {
                emit('drag', payload);
            }
        }

        function getRowKey(cells: BodyCell[]): string {
            return getRowId(cells) || `row-${cells[0]?.rowIdx}`;
        }

        return {
            bodyCells,
            displayedBodyCells,
            loading,
            tableIcons,
            sortableOptions: DEFAULT_SORTABLE_OPTIONS,
            clickCell,
            getRowItem,
            getRowId,
            getRowKey,
            selectRow,
            expandRow,
            handleDragUpdate,
        };
    },
});
</script>
