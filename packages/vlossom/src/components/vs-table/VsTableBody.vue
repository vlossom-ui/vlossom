<template>
    <tbody>
        <template v-if="bodyCells.length">
            <tr v-for="cells in bodyCells" :key="cells[0].rowKey" @click.prevent.stop="clickRow(cells, $event)">
                <td v-for="cell in cells" :key="cell.id" @click.prevent.stop="clickCell(cell, $event)">
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
import type { BodyCell } from './types';
import { tableIcons } from './icons';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

export default defineComponent({
    emits: ['click-cell', 'click-row'],
    setup(_props, { emit, slots }) {
        const { bodyCells } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        function findMatchingSlotName(cell: BodyCell): string {
            const { id, colIdx, rowIdx, colKey } = cell;

            const cadidatePriority = [
                `body-${id}`,
                `body-${colKey}`,
                `body-col${colIdx}-row${rowIdx}`,
                `body-row${rowIdx}`,
                `body-col${colIdx}`,
            ]
                .map((name) => name.toLowerCase())
                .filter((name) => name in slots);

            return cadidatePriority[0] || '';
        }

        function clickCell(cell: BodyCell, event: MouseEvent): void {
            emit('click-cell', event, { ...cell });
        }

        function clickRow(row: BodyCell[], event: MouseEvent): void {
            const clickedRow = row.map((cell) => ({ ...cell }));
            emit('click-row', event, clickedRow);
        }

        return {
            tableIcons,
            bodyCells,
            findMatchingSlotName,
            clickCell,
            clickRow,
        };
    },
});
</script>
