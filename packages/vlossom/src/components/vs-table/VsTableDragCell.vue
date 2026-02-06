<template>
    <component v-if="draggable" :is="tag" :class="TABLE_DRAG_HANDLE_CLASS">
        <vs-render :content="tableIcons.dragHandle" />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type PropType, inject } from 'vue';
import { tableIcons } from './icons';
import { isBodyRow, type Tag, type Cell } from './types';
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

        const tag = computed<Tag>(() => {
            return isBodyRow(cells.value) ? 'td' : 'th';
        });

        return {
            TABLE_DRAG_HANDLE_CLASS,
            tableIcons,
            tag,
            draggable,
        };
    },
});
</script>
