<template>
    <vs-expandable :open="isExpanded(cells)" :style-set="expandableStyleSet">
        <slot name="expand" :item="getRowItem(cells)" :value="isExpanded(cells)" :rowIdx />
    </vs-expandable>
</template>

<script lang="ts">
import { computed, defineComponent, inject, type ComputedRef, type PropType } from 'vue';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import { type VsTableBodyCell } from './types';
import { getRowItem } from './models/table-model';

import type { VsExpandableStyleSet } from '@/components/vs-expandable/types';
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

        const expandableStyleSet: ComputedRef<VsExpandableStyleSet> = computed(() => ({
            component: {
                borderTop: '1px dashed var(--vs-cs-line)',
                backgroundColor: 'var(--vs-no-color)',
                boxShadow: 'inset 0 0 0.6rem 0 var(--vs-cs-shadow-color)',
            },
        }));

        return {
            isExpanded,
            getRowItem,
            expandableStyleSet,
        };
    },
});
</script>
