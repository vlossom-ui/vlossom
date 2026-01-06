<template>
    <div class="vs-table-pagination">
        <!-- TODO: Use <vs-select /> instead  -->
        <div class="vs-table-pagination-info">
            <div v-if="pagination.showPageSizeSelector" class="vs-page-size-selector">
                <label for="page-size-select">Page size:</label>
                <select id="page-size-select" v-model="pageSizeRef" class="vs-page-size-select">
                    <option v-for="size in pagination.pageSizeOptions" :key="size" :value="size">
                        {{ size }}
                    </option>
                </select>
            </div>

            <div v-if="pagination.showTotal" class="vs-total-items">
                {{ startIndex + 1 }}-{{ endIndex }} / {{ totalItems }} items
            </div>
        </div>

        <vs-pagination
            v-model="pageRef"
            :length="totalPages"
            :showing-length="pagination.showingLength"
            :edge-buttons="pagination.edgeButtons"
            @change="paginate"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, type PropType } from 'vue';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

import VsPagination from '@/components/vs-pagination/VsPagination.vue';

export default defineComponent({
    components: { VsPagination },
    props: {
        page: {
            type: Number as PropType<number>,
            required: true,
        },
        pageSize: {
            type: Number as PropType<number>,
            required: true,
        },
    },
    emits: ['paginate', 'update:page', 'update:pageSize'],
    setup(props, { emit }) {
        const { pagination, totalPages, filteredRowsCount } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        const pageRef = computed({
            get: () => props.page,
            set: (value) => emit('update:page', value),
        });
        const pageSizeRef = computed({
            get: () => props.pageSize,
            set: (value) => emit('update:pageSize', value),
        });

        const totalItems = computed<number>(() => {
            if (pagination.value.mode === 'server') {
                return pagination.value.totalItemCount ?? 0;
            }
            return filteredRowsCount.value;
        });
        const startIndex = computed(() => pageRef.value * pageSizeRef.value);
        const endIndex = computed(() => Math.min(startIndex.value + pageSizeRef.value, totalItems.value));

        function paginate(page: number): void {
            emit('paginate', page, pageSizeRef.value);
        }

        return {
            pagination,
            pageRef,
            pageSizeRef,
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
