<template>
    <template v-if="isVsTableBodyRow(cells)">
        <td class="vs-table-td vs-table-expand-handle" :style="cellStyle">
            <vs-button
                v-if="isExpandable(cells, rowIdx)"
                :color-scheme
                :disabled="loading"
                :style-set="expandButtonStyleSet"
                :size="buttonSize"
                @click.prevent.stop="expandRow(cells, $event)"
            >
                <ChevronDownIcon class="vs-table-expand-icon" :class="{ 'rotate-180': isExpanded(cells) }" />
            </vs-button>
        </td>
    </template>
    <template v-else>
        <th class="vs-table-th vs-table-expand-handle" :style="cellStyle" />
    </template>
</template>

<script lang="ts">
import { computed, defineComponent, inject, type ComputedRef, type PropType } from 'vue';
import type { ColorScheme, Size } from '@/declaration';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import {
    type VsTableCell,
    type VsTableBodyCell,
    TABLE_STYLE_SET_TOKEN,
    TABLE_COLOR_SCHEME_TOKEN,
    type VsTableStyleSet,
} from './types';
import { getRowItem, isVsTableBodyRow } from './models/table-model';

import { ChevronDownIcon } from '@lucide/vue';
import VsButton from '@/components/vs-button/VsButton.vue';

export default defineComponent({
    components: { VsButton, ChevronDownIcon },
    props: {
        cells: {
            type: Array as PropType<VsTableCell[]>,
            default: () => [],
        },
        rowIdx: { type: Number, default: 0 },
    },
    emits: ['expand-row'],
    setup(_props, { emit }) {
        const { isExpanded, expandable, toggleExpand, items, loading, primary, size } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);
        const colorScheme = inject<ComputedRef<ColorScheme | undefined>>(TABLE_COLOR_SCHEME_TOKEN);

        const buttonSize = computed<Size>(() => {
            const map: Record<Size, Size> = { xs: 'xs', sm: 'xs', md: 'sm', lg: 'md', xl: 'lg' };
            return map[size?.value ?? 'md'];
        });
        const cellStyle = computed(() => tableStyleSet?.value?.$cell);
        const expandButtonStyleSet = computed(() => ({
            $content: { padding: '0' },
            border: 'none',
            width: 'calc(var(--vs-size-height, var(--vs-comp-height-md)) * 0.75)',
            height: 'calc(var(--vs-size-height, var(--vs-comp-height-md)) * 0.75)',
            backgroundColor: 'var(--vs-cs-bg-colored)',
            color: 'var(--vs-cs-font-colored)',
        }));

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
            isVsTableBodyRow,
            isExpandable,
            isExpanded,
            expandRow,
            cellStyle,
            loading,
            primary,
            colorScheme,
            buttonSize,
            expandButtonStyleSet,
        };
    },
});
</script>
