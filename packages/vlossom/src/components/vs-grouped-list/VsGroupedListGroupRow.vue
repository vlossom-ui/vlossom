<template>
    <div class="vs-grouped-list-group" :style="styleSet">
        <slot :group="row.name" :group-index="row.groupIndex" :items="row.items">
            <div class="vs-grouped-list-group-content">
                <span>{{ row.name || 'Ungrouped' }}</span>
            </div>
        </slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, type CSSProperties, type PropType } from 'vue';
import type { GroupRow } from './types';

export default defineComponent({
    name: 'VsGroupedListGroupRow',
    props: {
        styleSet: { type: Object as PropType<CSSProperties> },
        row: { type: Object as PropType<GroupRow>, required: true },
    },
});
</script>
