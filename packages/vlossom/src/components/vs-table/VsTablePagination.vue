<template>
    <div class="vs-table-pagination">
        <div class="vs-table-pagination-info">
            <vs-select
                v-if="options.showPageSizeSelect"
                :options="pageSizeOptions"
                :model-value="pageSize"
                :color-scheme
                :style-set="styleSet.$pageSizeSelect"
                :disabled="loading"
                :size
                option-label="label"
                option-value="value"
                no-clear
                no-label
                no-messages
                @update:model-value="$emit('update:pageSize', $event)"
            />
            <span v-if="options.showTotal" class="vs-total-items">
                {{
                    formatMessage(optionMessages.VS_TABLE_ITEMS_SUMMARY, {
                        start: pageStartIndex + 1,
                        end: pageEndIndex,
                        total: totalCount,
                    })
                }}
            </span>
        </div>

        <vs-pagination
            :model-value="page"
            :color-scheme
            :style-set="styleSet.$pagination"
            :disabled="loading"
            :length="totalPages"
            :showing-length="options.showingLength"
            :edge-buttons="options.edgeButtons"
            :size
            @update:model-value="$emit('update:page', $event)"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type PropType } from 'vue';
import { useMessages } from '@/composables';
import type { ColorScheme, Size } from '@/declaration';
import type { VsTablePageSizeOptions, VsTablePaginationOptions, VsTableStyleSet } from './types';

import VsPagination from '@/components/vs-pagination/VsPagination.vue';
import VsSelect from '@/components/vs-select/VsSelect.vue';

export default defineComponent({
    components: { VsPagination, VsSelect },
    props: {
        options: { type: Object as PropType<VsTablePaginationOptions>, default: () => ({}) },
        page: { type: Number, default: 0 },
        pageSize: { type: Number, default: 0 },
        totalPages: { type: Number, default: 0 },
        totalCount: { type: Number, default: 0 },
        pageStartIndex: { type: Number, default: 0 },
        pageEndIndex: { type: Number, default: 0 },
        colorScheme: { type: String as PropType<ColorScheme> },
        styleSet: { type: Object as PropType<VsTableStyleSet>, default: () => ({}) },
        size: { type: String as PropType<Size>, default: 'md' },
        loading: { type: Boolean, default: false },
    },
    emits: ['update:page', 'update:pageSize'],
    setup(props) {
        const { options } = toRefs(props);
        const { optionMessages, formatMessage } = useMessages();

        const pageSizeOptions = computed<VsTablePageSizeOptions>(() => options.value.pageSizeOptions ?? []);

        return { pageSizeOptions, optionMessages, formatMessage };
    },
});
</script>
