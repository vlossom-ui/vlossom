<template>
    <tbody>
        <template v-if="bodyCells.length">
            <tr v-for="(cells, rowIdx) in bodyCells" :key="rowIdx" @click.prevent.stop="clickRow(cells, $event)">
                <td v-if="hasSelectableRows" class="w-10" @click.prevent.stop="selectRow(cells)">
                    <template v-if="$slots['selectable']">
                        <slot name="selectable" :item="getRowItem(cells)" :rowIdx="rowIdx" />
                    </template>
                    <template v-else>
                        <vs-checkbox
                            v-if="isSelectableRow(getRowItem(cells))"
                            v-model="selectedRows"
                            :true-value="rowIdx"
                            multiple
                        />
                    </template>
                </td>

                <td v-for="cell in cells" :id="cell.id" :key="cell.id" @click.prevent.stop="clickCell(cell, $event)">
                    <slot :name="findMatchingSlotName(cell)" :item="cell.item">
                        {{ cell.value }}
                    </slot>
                </td>
            </tr>
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
    </tbody>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { stringUtil } from '@/utils';
import type { BodyCell } from './types';
import { tableIcons } from './icons';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

export default defineComponent({
    emits: ['click-cell', 'click-row', 'select-row'],
    setup(_props, { emit, slots }) {
        const { bodyCells, hasSelectableRows, isSelectableRow, selectedRows, updateSelectedRow } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

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

        function getRowItem(cells: BodyCell[]): Record<string, unknown> {
            const anyCell = cells[0];
            if (!anyCell) {
                return {};
            }
            return anyCell.item;
        }

        function clickCell(cell: BodyCell, event: MouseEvent): void {
            emit('click-cell', event, { ...cell });
        }

        function clickRow(row: BodyCell[], event: MouseEvent): void {
            const clickedRow = row.map((cell) => ({ ...cell }));
            emit('click-row', event, clickedRow);
        }

        function selectRow(cells: BodyCell[]): void {
            const anyCell = cells[0];
            if (!anyCell || !isSelectableRow(anyCell.item)) {
                return;
            }

            updateSelectedRow(anyCell.item);
            emit('select-row', anyCell.item, anyCell.rowIdx);
        }

        return {
            tableIcons,
            bodyCells,
            hasSelectableRows,
            isSelectableRow,
            selectedRows,
            findMatchingSlotName,
            getRowItem,
            selectRow,
            clickCell,
            clickRow,
        };
    },
});
</script>
