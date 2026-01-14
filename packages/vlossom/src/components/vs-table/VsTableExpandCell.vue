<template>
    <template v-if="isBodyRow(cells)">
        <td v-if="anyExpandable" class="w-10">
            <vs-button
                v-if="isExpandable(cells, rowIdx)"
                small
                :disabled="loading"
                :style-set="{ padding: '0', height: '100%', width: '100%' }"
                @click.prevent.stop="expandRow(cells, $event)"
            >
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
import { type Cell, getRowItem, isBodyRow, type BodyCell } from './types';
import { tableIcons } from './icons';

import VsButton from '@/components/vs-button/VsButton.vue';
import VsRender from '@/components/vs-render/VsRender.vue';

export default defineComponent({
    components: {
        VsButton,
        VsRender,
    },
    props: {
        cells: {
            type: Array as PropType<Cell[]>,
            default: () => [],
        },
        rowIdx: { type: Number, default: 0 },
    },
    emits: ['expand-row'],
    setup(_props, { emit }) {
        const { anyExpandable, isExpanded, expandable, toggleExpand, items, loading } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        function isExpandable(cells: BodyCell[], rowIdx: number): boolean {
            return expandable.value(getRowItem(cells), rowIdx, items.value);
        }

        function expandRow(cells: Cell[], event: MouseEvent): void {
            if (!toggleExpand(cells)) {
                return;
            }
            emit('expand-row', cells, event);
        }

        return {
            isBodyRow,
            isExpandable,
            anyExpandable,
            isExpanded,
            expandRow,
            tableIcons,
            loading,
        };
    },
});
</script>
