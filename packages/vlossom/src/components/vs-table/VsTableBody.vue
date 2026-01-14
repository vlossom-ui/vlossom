<template>
    <vs-visible-render tag="tbody" :disabled="!virtualScroll" :root-margin="'12.5rem'">
        <template v-if="bodyCells.length">
            <template v-for="(cells, rowIdx) in bodyCells" :key="rowIdx">
                <tr>
                    <vs-table-select-cell :cells :rowIdx @select-row="selectRow">
                        <template #select="{ cells, rowIdx }">
                            <slot name="select" :cells :rowIdx />
                        </template>
                    </vs-table-select-cell>
                    <td
                        v-for="cell in cells"
                        :id="cell.id"
                        :key="cell.id"
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
import { stringUtil } from '@/utils';
import { type BodyCell, getRowId, getRowItem } from './types';
import { tableIcons } from './icons';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

import VsRender from '@/components/vs-render/VsRender.vue';
import VsSkeleton from '@/components/vs-skeleton/VsSkeleton.vue';
import VsVisibleRender from '@/components/vs-visible-render/VsVisibleRender.vue';
import VsTableExpandCell from './VsTableExpandCell.vue';
import VsTableExpandedPanel from './VsTableExpandedPanel.vue';
import VsTableSelectCell from './VsTableSelectCell.vue';

export default defineComponent({
    components: {
        VsRender,
        VsSkeleton,
        VsVisibleRender,
        VsTableExpandCell,
        VsTableExpandedPanel,
        VsTableSelectCell,
    },
    props: {
        virtualScroll: { type: Boolean, default: false },
    },
    emits: ['click-cell', 'select-row', 'expand-row'],
    setup(props, { emit, slots }) {
        const { bodyCells, anyExpandable, headerCells, loading } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

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
                return '_';
            }
            const header = headerCells.value?.[colIdx];
            if (!header) {
                return fallback;
            }
            return String(header.value ?? fallback);
        }

        function selectRow(row: BodyCell[], event: MouseEvent): void {
            emit('select-row', row, event);
            emit('click-cell', { ...row[0] }, event);
        }

        function expandRow(row: BodyCell[], event: MouseEvent): void {
            emit('expand-row', row, event);
        }

        return {
            bodyCells,
            anyExpandable,
            loading,
            tableIcons,
            clickCell,
            findMatchingSlotName,
            getRowItem,
            getRowId,
            selectRow,
            expandRow,
            getHeaderLabel,
        };
    },
});
</script>
