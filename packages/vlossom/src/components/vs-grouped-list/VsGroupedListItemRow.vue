<template>
    <div
        :id="row.item.id"
        :class="['vs-grouped-list-item', { 'vs-disabled': row.item.disabled }]"
        :style="styleSet"
        :role="itemRole"
        :aria-posinset="row.itemPosition"
        :aria-setsize="itemCount"
        :aria-disabled="row.item.disabled || undefined"
        :aria-selected="itemRole === 'option' ? ariaSelected : undefined"
        @click.stop="$emit('click')"
    >
        <slot
            v-bind="row.item"
            :group="row.group"
            :group-index="row.groupIndex"
            :grouped-index="row.groupedIndex"
            :item-index="row.itemIndex"
        >
            <div class="vs-grouped-list-item-content">
                <span>{{ row.item.label }}</span>
            </div>
        </slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, type CSSProperties, type PropType } from 'vue';
import type { ItemRow } from './types';

export default defineComponent({
    name: 'VsGroupedListItemRow',
    props: {
        styleSet: { type: Object as PropType<CSSProperties> },
        row: { type: Object as PropType<ItemRow>, required: true },
        itemCount: { type: Number, default: 0 },
        itemRole: { type: String as PropType<'listitem' | 'option'>, default: 'listitem' },
        ariaSelected: { type: Boolean, default: undefined },
    },
    emits: ['click'],
});
</script>
