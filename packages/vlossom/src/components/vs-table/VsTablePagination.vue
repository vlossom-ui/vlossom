<template>
    <div class="vs-table-pagination">
        <div class="vs-table-pagination-info">
            <vs-select
                v-if="pagination.showPageSizeSelector"
                v-model="pageSize"
                :options="pageSizeOptions"
                no-clear
                no-label
                no-messages
            />
            <span v-if="pagination.showTotal" class="vs-total-items">
                {{ startIndex + 1 }}-{{ endIndex }} / {{ totalItems }} items
            </span>
        </div>

        <vs-pagination
            v-model="page"
            :length="totalPages"
            :showing-length="pagination.showingLength"
            :edge-buttons="pagination.edgeButtons"
            @change="paginate"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

import VsPagination from '@/components/vs-pagination/VsPagination.vue';
import VsSelect from '@/components/vs-select/VsSelect.vue';

export default defineComponent({
    components: { VsPagination, VsSelect },

    emits: ['paginate'],
    setup(_, { emit }) {
        const { pagination, totalPages, filteredRowsCount, page, pageSize } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        const pageSizeOptions = computed<number[]>(() => {
            return pagination.value.pageSizeOptions ?? [];
        });
        const totalItems = computed<number>(() => {
            if (pagination.value.mode === 'server') {
                return pagination.value.totalItemCount ?? 0;
            }
            return filteredRowsCount.value;
        });
        const startIndex = computed(() => page.value * pageSize.value);
        const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, totalItems.value));

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
            startIndex,
            endIndex,
            paginate,
        };
    },
});
</script>

<style src="./VsTablePagination.css" />
