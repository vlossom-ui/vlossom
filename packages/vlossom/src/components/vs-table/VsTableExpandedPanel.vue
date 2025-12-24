<template>
    <td colspan="100%" class="!p-0">
        <vs-expandable :open="isExpanded(cells)">
            <slot name="expand" :cells :rowIdx />
        </vs-expandable>
    </td>
</template>

<script lang="ts">
import { defineComponent, inject, type PropType } from 'vue';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import { type Cell } from './types';

export default defineComponent({
    props: {
        cells: {
            type: Array as PropType<Cell[]>,
            required: true,
        },
        rowIdx: {
            type: Number,
            required: true,
        },
    },
    setup() {
        const { isExpanded } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        return {
            isExpanded,
        };
    },
});
</script>
