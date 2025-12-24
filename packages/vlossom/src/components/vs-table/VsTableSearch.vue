<template>
    <div v-if="showSearch" class="vs-table-search">
        <vs-search-input
            v-model="searchText"
            v-model:case-sensitive="isCaseSensitive"
            v-model:regex="isRegex"
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
    caseSensitive: true,
    regex: true,
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
        const isCaseSensitive = ref(false);
        const isRegex = ref(false);

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
            table?.updateSearch(value, {
                caseSensitive: isCaseSensitive.value,
                regex: isRegex.value,
            });
            emit('search', value);
        }

        return {
            searchText,
            isCaseSensitive,
            isRegex,
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
    margin-left: auto;
    width: fit-content;
    padding: 0.5rem 0;
}
</style>
