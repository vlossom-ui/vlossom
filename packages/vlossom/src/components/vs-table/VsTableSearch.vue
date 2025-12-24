<template>
    <div v-if="showSearch" class="vs-table-search">
        <vs-search-input
            v-model="searchText"
            :placeholder="searchOptions.placeholder"
            :use-case-sensitive="searchOptions.caseSensitive"
            :use-regex="searchOptions.regex"
            small
            @search="onSearch"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, type PropType, inject } from 'vue';
import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import type { VsTableSearchProp, VsTableSearchOptions } from './types';

const defaultSearchOptions: VsTableSearchOptions = {
    placeholder: '',
    caseSensitive: false,
    regex: false,
};

export default defineComponent({
    name: 'VsTableSearch',
    components: { VsSearchInput },
    props: {
        search: {
            type: [Boolean, Object] as PropType<VsTableSearchProp>,
            default: false,
        },
    },
    emits: ['search'],
    setup(props, { emit }) {
        const table = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN);
        const searchText = ref('');

        const showSearch = computed(() => {
            return !!props.search;
        });

        const searchOptions = computed<VsTableSearchOptions>(() => {
            if (typeof props.search === 'boolean') {
                return { ...defaultSearchOptions };
            }
            return { ...defaultSearchOptions, ...props.search };
        });

        function onSearch(value: string) {
            emit('search', value);
        }

        return {
            table,
            searchText,
            showSearch,
            searchOptions,
            onSearch,
        };
    },
});
</script>

<style scoped>
.vs-table-search {
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem 0;
}
</style>
