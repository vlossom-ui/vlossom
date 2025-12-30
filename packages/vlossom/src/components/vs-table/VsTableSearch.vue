<template>
    <vs-search-input
        v-if="showSearch"
        class="flex w-fit justify-end p-2"
        v-model="searchText"
        v-model:case-sensitive="caseSensitiveActive"
        v-model:regex="regexActive"
        :placeholder="searchOptions.placeholder"
        :use-case-sensitive="searchOptions.caseSensitive"
        :use-regex="searchOptions.regex"
        @search="onSearch"
    />
</template>

<script lang="ts">
import { computed, defineComponent, ref, type PropType, inject, toRefs } from 'vue';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import type { VsTableSearchOptions } from './types';

import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';

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
            type: [Boolean, Object] as PropType<boolean | VsTableSearchOptions>,
            default: false,
        },
    },
    setup(props) {
        const { search } = toRefs(props);
        const table = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        const searchText = ref('');
        const caseSensitiveActive = ref(false);
        const regexActive = ref(false);

        const showSearch = computed(() => {
            return !!search.value;
        });
        const searchOptions = computed<VsTableSearchOptions>(() => {
            if (typeof search.value === 'boolean') {
                return { ...defaultSearchOptions };
            }
            return { ...defaultSearchOptions, ...search.value };
        });

        function onSearch(value: string) {
            table.updateSearch(value, {
                caseSensitive: caseSensitiveActive.value,
                regex: regexActive.value,
            });
        }

        return {
            searchText,
            showSearch,
            caseSensitiveActive,
            regexActive,
            searchOptions,
            onSearch,
        };
    },
});
</script>
