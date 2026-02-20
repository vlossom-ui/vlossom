<template>
    <component v-if="draggable" :is="tag" :class="TABLE_DRAG_HANDLE_CLASS" :style="cellStyle">
        <vs-render :content="tableIcons.dragHandle" />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef, type PropType, inject } from 'vue';
import { tableIcons } from './icons';
import { isBodyRow, type Tag, type Cell, TABLE_STYLE_SET_TOKEN, type VsTableStyleSet } from './types';
import { TABLE_DRAG_HANDLE_CLASS } from './constants';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

import VsRender from '@/components/vs-render/VsRender.vue';

export default defineComponent({
    components: {
        VsRender,
    },
    props: {
        cells: {
            type: Array as PropType<Cell[]>,
            required: true,
        },
    },
    setup(props) {
        const { cells } = toRefs(props);
        const { draggable } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);

        const tag = computed<Tag>(() => {
            return isBodyRow(cells.value) ? 'td' : 'th';
        });

        const cellStyle = computed(() => {
            return tableStyleSet?.value?.cell;
        });

        return {
            TABLE_DRAG_HANDLE_CLASS,
            tableIcons,
            tag,
            cellStyle,
            draggable,
        };
    },
});
</script>
