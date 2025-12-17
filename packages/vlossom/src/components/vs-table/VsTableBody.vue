<template>
    <tbody>
        <template v-if="bodyCells.length">
            <tr v-for="(cells, rowIdx) in bodyCells" :key="rowIdx">
                <td v-for="(cell, colIdx) in cells" :key="colIdx" @click.prevent.stop="clickCell(cell)">
                    <slot :name="cell.name" :item="cell.item">
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
    emits: ['click-cell'],
    setup(_props, { emit }) {
        const { bodyCells } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        function clickCell(cell: BodyCell): void {
            emit('click-cell', cell.item, cell.colIdx, cell.rowIdx);
        }

        return {
            tableIcons,
            bodyCells,
            clickCell,
        };
    },
});
</script>
