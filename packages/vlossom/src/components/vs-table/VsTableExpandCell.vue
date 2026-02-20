<template>
    <template v-if="isBodyRow(cells)">
        <td v-if="anyExpandable" :style="cellStyle">
            <vs-button
                v-if="isExpandable(cells, rowIdx)"
                small
                :disabled="loading"
                :style-set="{ variables: { padding: '0' } }"
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
        <th v-if="anyExpandable" :style="cellStyle" />
    </template>
</template>

<script lang="ts">
import { computed, defineComponent, inject, type ComputedRef, type PropType } from 'vue';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import { type Cell, getRowItem, isBodyRow, type BodyCell, TABLE_STYLE_SET_TOKEN, type VsTableStyleSet } from './types';
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
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);

        const cellStyle = computed(() => tableStyleSet?.value?.cell);

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
            cellStyle,
            loading,
        };
    },
});
</script>
