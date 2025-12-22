<template>
    <tbody>
        <template v-if="bodyCells.length">
            <tr v-for="(cells, rowIdx) in bodyCells" :key="rowIdx">
                <td v-if="anySelectable" class="w-10" @click.prevent.stop="selectRow(cells, $event)">
                    <slot name="selectable" :item="getRowItem(cells)" :rowIdx>
                        <vs-checkbox
                            v-if="selectable(getRowItem(cells), rowIdx, items)"
                            v-model="selectedIds"
                            :true-value="getRowItem(cells).id"
                            multiple
                            @toggle="selectRow(cells, $event)"
                        />
                    </slot>
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
        const { items, bodyCells, anySelectable, selectable, selectedIds, toggleSelectedRow } =
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

        function selectRow(row: BodyCell[], event: MouseEvent): void {
            const anyCell = row[0];
            if (!anyCell || !selectable.value(anyCell.item, anyCell.rowIdx, items.value)) {
                return;
            }

            toggleSelectedRow(anyCell.item);
            emit('select-row', event, row);
            emit('click-cell', event, { ...anyCell });
        }

        return {
            bodyCells,
            anySelectable,
            items,
            selectedIds,
            selectable,
            tableIcons,
            clickCell,
            findMatchingSlotName,
            getRowItem,
            selectRow,
        };
    },
});
</script>
