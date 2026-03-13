<template>
    <vs-expandable
        :open="isExpanded(cells)"
        :style-set="{ component: { backgroundColor: 'var(--vs-cs-bg-area-colored)' } }"
    >
        <slot name="expand" :item="getRowItem(cells)" :value="isExpanded(cells)" :rowIdx />
    </vs-expandable>
</template>

<script lang="ts">
import { defineComponent, inject, type PropType } from 'vue';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import { type VsTableBodyCell, getRowItem } from './types';

import VsExpandable from '@/components/vs-expandable/VsExpandable.vue';

export default defineComponent({
    components: {
        VsExpandable,
    },
    props: {
        cells: {
            type: Array as PropType<VsTableBodyCell[]>,
            required: true,
        },
        rowIdx: { type: Number, required: true },
    },
    setup() {
        const { isExpanded } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        return {
            isExpanded,
            getRowItem,
        };
    },
});
</script>
