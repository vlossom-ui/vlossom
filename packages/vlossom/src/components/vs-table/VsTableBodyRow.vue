<template>
    <tr>
        <vs-table-drag-cell :cells :rowIdx />
        <vs-table-checkbox-cell :cells :rowIdx @select-row="selectRow">
            <template #select="{ cells, rowIdx }">
                <slot name="select" :cells :rowIdx />
            </template>
        </vs-table-checkbox-cell>
        <template v-for="cell in cells" :key="cell.id">
            <td
                :id="cell.id"
                :data-label="getHeaderLabel(cell.colIdx, cell.colKey)"
                @click.prevent.stop="clickCell(cell, $event)"
            >
                <vs-skeleton v-if="loading" :style-set="{ height: '1.25rem' }" />
                <template v-else>
                    <slot :name="findMatchingSlotName(cell)" :item="cell.item">
                        {{ cell.value }}
                    </slot>
                </template>
            </td>
        </template>
        <vs-table-expand-cell :cells :rowIdx @expand-row="expandRow" />
    </tr>
    <tr v-if="anyExpandable">
        <vs-table-expanded-panel :cells :rowIdx>
            <template #expand="{ cells, rowIdx }">
                <slot name="expand" :cells :rowIdx />
            </template>
        </vs-table-expanded-panel>
    </tr>
</template>

<script lang="ts">
import { defineComponent, inject, type PropType } from 'vue';
import { stringUtil } from '@/utils';
import type { BodyCell } from './types';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

import VsSkeleton from '@/components/vs-skeleton/VsSkeleton.vue';
import VsTableDragCell from './VsTableDragCell.vue';
import VsTableExpandCell from './VsTableExpandCell.vue';
import VsTableExpandedPanel from './VsTableExpandedPanel.vue';
import VsTableCheckboxCell from './VsTableCheckboxCell.vue';

export default defineComponent({
    components: {
        VsSkeleton,
        VsTableDragCell,
        VsTableExpandCell,
        VsTableExpandedPanel,
        VsTableCheckboxCell,
    },
    props: {
        cells: {
            type: Array as PropType<BodyCell[]>,
            required: true,
        },
        rowIdx: {
            type: Number,
            required: true,
        },
    },
    emits: ['click-cell', 'select-row', 'expand-row'],
    setup(props, { emit, slots }) {
        const { anyExpandable, draggable, headerCells, loading } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        function findMatchingSlotName(cell: BodyCell): string {
            const { id, colIdx, rowIdx, colKey } = cell;

            const candidatePriority = [
                `body-${id}`,
                `body-${stringUtil.kebabCase(colKey)}`,
                `body-col${colIdx}-row${rowIdx}`,
                `body-row${rowIdx}`,
                `body-col${colIdx}`,
                'body',
            ]
                .map((name) => name.toLowerCase())
                .filter((name) => name in slots);

            return candidatePriority[0] || '';
        }

        function clickCell(cell: BodyCell, event: MouseEvent): void {
            emit('click-cell', { ...cell }, event);
        }

        function getHeaderLabel(colIdx: number, fallback: string): string {
            if (loading?.value) {
                return '';
            }
            const header = headerCells.value?.[colIdx];
            if (!header) {
                return fallback;
            }
            return String(header.value ?? fallback);
        }

        function selectRow(row: BodyCell[], event: MouseEvent): void {
            emit('select-row', row, event);
        }

        function expandRow(row: BodyCell[], event: MouseEvent): void {
            emit('expand-row', row, event);
        }

        return {
            anyExpandable,
            draggable,
            loading,
            clickCell,
            findMatchingSlotName,
            selectRow,
            expandRow,
            getHeaderLabel,
        };
    },
});
</script>
