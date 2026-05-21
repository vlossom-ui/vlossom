<template>
    <component v-if="draggable" :is="tag" :class="[cellTypeClass, TABLE_DRAG_HANDLE_CLASS]" :style="cellStyle">
        <GripVerticalIcon />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef, type PropType, inject } from 'vue';
import { type VsTableTag, type VsTableCell, TABLE_STYLE_SET_TOKEN, type VsTableStyleSet } from './types';
import { isVsTableBodyRow } from './models/table-model';
import { TABLE_DRAG_HANDLE_CLASS } from './constants';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

import { GripVerticalIcon } from '@lucide/vue';

export default defineComponent({
    components: {
        GripVerticalIcon,
    },
    props: {
        cells: {
            type: Array as PropType<VsTableCell[]>,
            required: true,
        },
    },
    setup(props) {
        const { cells } = toRefs(props);
        const { draggable } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);

        const tag = computed<VsTableTag>(() => (isVsTableBodyRow(cells.value) ? 'td' : 'th'));
        const cellTypeClass = computed(() => (isVsTableBodyRow(cells.value) ? 'vs-table-td' : 'vs-table-th'));
        const cellStyle = computed(() => tableStyleSet?.value?.$cell);

        return {
            TABLE_DRAG_HANDLE_CLASS,
            tag,
            cellTypeClass,
            cellStyle,
            draggable,
        };
    },
});
</script>
