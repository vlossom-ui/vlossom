<template>
    <template v-if="isBodyRow(cells)">
        <td v-if="anyExpandable" class="w-10">
            <vs-button small :style-set="{ padding: '0' }" @click.prevent.stop="expandRow(cells, $event)">
                <vs-render
                    class="transition-transform"
                    :class="{ 'rotate-180': isExpanded(cells) }"
                    :content="tableIcons.expandArrow"
                />
            </vs-button>
        </td>
    </template>
    <template v-else>
        <th v-if="anyExpandable" class="w-10" />
    </template>
</template>

<script lang="ts">
import { defineComponent, inject, type PropType } from 'vue';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import { type Cell, isBodyRow } from './types';
import { tableIcons } from './icons';

export default defineComponent({
    props: {
        cells: {
            type: Array as PropType<Cell[]>,
            default: () => [],
        },
        rowIdx: {
            type: Number,
            default: 0,
        },
    },
    emits: ['expand-row'],
    setup(_props, { emit }) {
        const { anyExpandable, isExpanded, toggleExpand } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        function expandRow(cells: Cell[], event: MouseEvent): void {
            if (!toggleExpand(cells)) {
                return;
            }
            emit('expand-row', cells, event);
        }

        return {
            isBodyRow,
            anyExpandable,
            isExpanded,
            expandRow,
            tableIcons,
        };
    },
});
</script>
