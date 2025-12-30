<template>
    <vs-search-input
        ref="searchInputRef"
        class="flex w-fit justify-end p-2"
        v-bind="computedSearchOptions"
        @search="onSearch"
    />
</template>

<script lang="ts">
import { computed, defineComponent, type PropType, inject, toRefs, useTemplateRef, onMounted } from 'vue';
import type { VsSearchInputRef } from '../vs-search-input/types';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import type { VsTableSearchOptions } from './types';

import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';

const defaultSearchOptions: VsTableSearchOptions = {
    placeholder: 'Search...',
    useCaseSensitive: true,
    useRegex: true,
};

export default defineComponent({
    name: 'VsTableSearch',
    components: { VsSearchInput },
    props: {
        searchOptions: {
            type: [Boolean, Object] as PropType<boolean | VsTableSearchOptions>,
            default: false,
        },
    },
    emits: ['search-rows'],
    setup(props, { emit }) {
        const { searchOptions } = toRefs(props);
        const searchInputRef = useTemplateRef<VsSearchInputRef>('searchInputRef');
        const { bodyCells, initSearchInputRef } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        const computedSearchOptions = computed<VsTableSearchOptions>(() => {
            if (typeof searchOptions.value === 'boolean') {
                return { ...defaultSearchOptions };
            }
            return { ...defaultSearchOptions, ...searchOptions.value };
        });

        function onSearch(searchText: string): void {
            emit('search-rows', bodyCells.value, searchText);
        }

        onMounted(() => {
            initSearchInputRef(searchInputRef);
        });

        return {
            computedSearchOptions,
            onSearch,
        };
    },
});
</script>
