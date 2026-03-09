<template>
    <div class="vs-table-pagination">
        <div class="vs-table-pagination-info">
            <vs-select
                v-if="pagination.showPageSizeSelect"
                v-model="pageSize"
                :options="pageSizeOptions"
                :disabled="loading"
                option-label="label"
                option-value="value"
                no-clear
                no-label
                no-messages
            />
            <span v-if="pagination.showTotal" class="vs-total-items">
                {{ pageStartIndex + 1 }}-{{ pageEndIndex }} / {{ totalItems }} items
            </span>
        </div>

        <vs-pagination
            v-model="page"
            :ghost="!primary"
            :outline="!primary"
            :style-set="paginationStyleSet"
            :disabled="loading"
            :length="totalPages"
            :showing-length="pagination.showingLength"
            :edge-buttons="pagination.edgeButtons"
            @change="paginate"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import type { VsPaginationStyleSet } from '../vs-pagination/types';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import type { VsTablePageSizeOptions } from './types';

import VsPagination from '@/components/vs-pagination/VsPagination.vue';
import VsSelect from '@/components/vs-select/VsSelect.vue';

export default defineComponent({
    components: { VsPagination, VsSelect },
    emits: ['paginate'],
    setup(_, { emit }) {
        const { pagination, totalPages, totalItems, page, pageSize, pageStartIndex, pageEndIndex, loading, primary } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        const pageSizeOptions = computed<VsTablePageSizeOptions>(() => {
            return pagination.value.pageSizeOptions ?? [];
        });

        const paginationStyleSet = computed<VsPaginationStyleSet>(() => {
            if (primary?.value) {
                return {};
            }
            return {
                variables: {
                    selectedButtonBackgroundColor: 'var(--vs-cs-bg-area)',
                    selectedButtonFontColor: 'var(--vs-cs-font-colored)',
                },
            };
        });

        function paginate(nextPage: number): void {
            emit('paginate', nextPage, pageSize.value);
        }

        return {
            pagination,
            page,
            pageSize,
            pageSizeOptions,
            totalPages,
            totalItems,
            pageStartIndex,
            pageEndIndex,
            paginate,
            loading,
            primary,
            paginationStyleSet,
        };
    },
});
</script>
