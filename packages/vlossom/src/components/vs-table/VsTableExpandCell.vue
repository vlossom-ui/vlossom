<template>
    <template v-if="isBodyRow(cells)">
        <td v-if="anyExpandable" class="vs-table-td vs-table-expand-handle" :style="cellStyle">
            <vs-button
                v-if="isExpandable(cells, rowIdx)"
                :color-scheme
                :disabled="loading"
                :style-set="{
                    variables: { padding: '0' },
                    component: {
                        border: 'none',
                        height: '1.8rem',
                        width: '1.8rem',
                        backgroundColor: 'var(--vs-cs-bg-colored)',
                        color: 'var(--vs-cs-font-colored)',
                    },
                }"
                @click.prevent.stop="expandRow(cells, $event)"
                small
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
        <th v-if="anyExpandable" class="vs-table-th vs-table-expand-handle" :style="cellStyle" />
    </template>
</template>

<script lang="ts">
import { computed, defineComponent, inject, type ComputedRef, type PropType } from 'vue';
import type { ColorScheme } from '@/declaration';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import {
    type VsTableCell,
    getRowItem,
    isVsTableBodyRow,
    type VsTableBodyCell,
    TABLE_STYLE_SET_TOKEN,
    TABLE_COLOR_SCHEME_TOKEN,
    type VsTableStyleSet,
} from './types';
import { tableIcons } from './icons';

import VsButton from '@/components/vs-button/VsButton.vue';
import VsRender from '@/components/vs-render/VsRender.vue';

export default defineComponent({
    components: { VsButton, VsRender },
    props: {
        cells: {
            type: Array as PropType<VsTableCell[]>,
            default: () => [],
        },
        rowIdx: { type: Number, default: 0 },
    },
    emits: ['expand-row'],
    setup(_props, { emit }) {
        const { anyExpandable, isExpanded, expandable, toggleExpand, items, loading, primary } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);
        const colorScheme = inject<ComputedRef<ColorScheme | undefined>>(TABLE_COLOR_SCHEME_TOKEN);

        const cellStyle = computed(() => tableStyleSet?.value?.cell);

        function isExpandable(cells: VsTableBodyCell[], rowIdx: number): boolean {
            return expandable.value(getRowItem(cells), rowIdx, items.value);
        }

        function expandRow(cells: VsTableCell[], event: MouseEvent): void {
            if (!toggleExpand(cells)) {
                return;
            }
            emit('expand-row', cells, event);
        }

        return {
            isBodyRow: isVsTableBodyRow,
            isExpandable,
            anyExpandable,
            isExpanded,
            expandRow,
            tableIcons,
            cellStyle,
            loading,
            primary,
            colorScheme,
        };
    },
});
</script>
