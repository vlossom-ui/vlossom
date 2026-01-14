<template>
    <div :class="['vs-table', colorSchemeClass, classObj]" :style="styleSetVariables">
        <vs-search-input
            v-if="search"
            ref="searchInputRef"
            class="vs-table-search-input"
            v-bind="searchOptions"
            :disabled="loading"
            @search="searchRows"
        />

        <table>
            <vs-table-header
                v-if="stickyHeader && headerInvisible"
                class="vs-table-sticky-header"
                @click-cell="clickCell"
                @select-row="selectRow"
            >
                <template v-for="name in headerSlots" #[name]="slotData">
                    <slot :name v-bind="slotData || {}" />
                </template>
            </vs-table-header>

            <caption v-if="$slots['caption']">
                <slot name="caption" />
            </caption>
            <vs-table-header ref="headerRef" @click-cell="clickCell" @select-row="selectRow">
                <template v-for="name in headerSlots" #[name]="slotData">
                    <slot :name v-bind="slotData || {}" />
                </template>
            </vs-table-header>
            <vs-table-body
                :virtual-scroll
                :virtual-scroll-root-margin
                @click-cell="clickCell"
                @select-row="selectRow"
                @expand-row="expandRow"
            >
                <template v-for="name in bodySlots" #[name]="slotData">
                    <slot :name v-bind="slotData || {}" />
                </template>
            </vs-table-body>
        </table>

        <vs-table-pagination v-if="pagination" @paginate="paginate" />
    </div>
</template>

<script lang="ts">
import {
    type PropType,
    defineComponent,
    provide,
    toRefs,
    computed,
    ref,
    onBeforeMount,
    useTemplateRef,
    onBeforeUnmount,
    inject,
} from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { LAYOUT_STORE_KEY, type SearchProps, VsComponent } from '@/declaration';
import { logUtil, objectUtil, stringUtil } from '@/utils';
import { getColorSchemeProps, getStyleSetProps, getSearchProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import { LayoutStore } from '@/stores';

import { TABLE_COMPOSABLE_TOKEN, useTable, type TableComposable } from './composables/table-composable';
import {
    type BodyCell,
    type ColumnDef,
    type Item,
    type VsTableStyleSet,
    type VsTablePaginationOptions,
    getRowItem,
} from './types';

import type { VsSearchInputRef } from '../vs-search-input/types';

import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';
import VsTableHeader from './VsTableHeader.vue';
import VsTableBody from './VsTableBody.vue';
import VsTablePagination from './VsTablePagination.vue';

const componentName = VsComponent.VsTable;

export default defineComponent({
    name: componentName,
    components: { VsTableHeader, VsTableBody, VsSearchInput, VsTablePagination },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTableStyleSet>(),
        ...getSearchProps(),
        columns: {
            type: Array as PropType<ColumnDef[] | string[] | null>,
            default: () => [],
        },
        items: {
            type: Array as PropType<Item[]>,
            required: true,
            validator: (value: Item[]) => {
                if (!Array.isArray(value)) {
                    logUtil.propError(componentName, 'items', 'items must be an array');
                    return false;
                }
                return true;
            },
        },
        responsive: { type: Boolean, default: false },
        stickyHeader: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        serverMode: { type: Boolean, default: false },
        virtualScroll: { type: Boolean, default: false },
        selectable: {
            type: [Boolean, Function] as PropType<boolean | ((item: Item, index?: number, items?: Item[]) => boolean)>,
            default: false,
        },
        expandable: {
            type: [Boolean, Function] as PropType<boolean | ((item: Item, index?: number, items?: Item[]) => boolean)>,
            default: false,
        },
        pagination: {
            type: [Boolean, Object] as PropType<boolean | VsTablePaginationOptions>,
            default: false,
        },
        virtualScrollRootMargin: { type: String, default: '200px' },
        // v-model
        selectedItems: {
            type: Array as PropType<Item[]>,
            default: () => [] as Item[],
            validator: (value: Item[]) => {
                if (!Array.isArray(value)) {
                    logUtil.propError(componentName, 'selectedItems', 'selectedItems must be an array');
                    return false;
                }
                if (value.some((item) => !item.id)) {
                    logUtil.propError(componentName, 'selectedItems', 'selectedItems must have id');
                    return false;
                }
                return true;
            },
        },
        page: { type: Number as PropType<number> }, // 0-based page index
        pageSize: { type: Number as PropType<number> },
    },
    emits: [
        'click-cell',
        'select-row',
        'expand-row',
        'search',
        'paginate',
        'update:selectedItems',
        'update:page',
        'update:pageSize',
    ],
    setup(props, { slots, emit }) {
        const { colorScheme, styleSet, responsive } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const additionalStyleSet = computed<Partial<VsTableStyleSet>>(() => {
            return objectUtil.shake({
                stickyHeaderTop:
                    stickyHeaderTop.value === undefined ? undefined : stringUtil.toStringSize(stickyHeaderTop.value),
            });
        });
        const { styleSetVariables } = useStyleSet<VsTableStyleSet>(componentName, styleSet, additionalStyleSet);

        const searchInputRef = useTemplateRef<VsSearchInputRef>('searchInputRef');
        const headerRef = useTemplateRef<HTMLTableSectionElement>('headerRef');
        const headerInvisible = ref(true);
        const stickyHeaderTop = ref('0px');
        const { header: vsLayoutHeader } = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());

        const table: TableComposable = useTable(
            props,
            { searchInputRef },
            { updateSelectedItems, updatePage, updatePageSize },
        );
        provide<TableComposable>(TABLE_COMPOSABLE_TOKEN, table);

        const headerSlots = computed(() =>
            Object.keys(slots).filter((slotName) =>
                ['header', 'select'].some((whitelist) => slotName.startsWith(whitelist)),
            ),
        );
        const bodySlots = computed(() =>
            Object.keys(slots).filter((slotName) =>
                ['body', 'select', 'expand'].some((whitelist) => slotName.startsWith(whitelist)),
            ),
        );

        const classObj = computed(() => ({
            'vs-table-responsive': responsive.value,
        }));

        const searchOptions = computed<Exclude<SearchProps, boolean>>(() => table.search.value);

        const { pause: pauseHeaderObserver } = useIntersectionObserver(
            headerRef,
            ([{ isIntersecting }]) => {
                headerInvisible.value = !isIntersecting;
                if (isIntersecting) {
                    stickyHeaderTop.value = stringUtil.toStringSize(vsLayoutHeader.value.height);
                }
            },
            { threshold: 1 },
        );

        function clickCell(cell: BodyCell, event: MouseEvent): void {
            emit('click-cell', cell, event);
        }

        function selectRow(row: BodyCell[], event: MouseEvent): void {
            emit('select-row', row, event);
        }

        function expandRow(row: BodyCell[], event: MouseEvent): void {
            emit('expand-row', row, event);
        }

        function searchRows(searchText: string): void {
            const items = table.bodyCells.value.map((row) => getRowItem(row));
            emit('search', items, searchText);
        }

        function paginate(nextPage: number): void {
            emit('paginate', nextPage, table.pageSize.value);
        }

        function updateSelectedItems(items: Item[]): void {
            emit('update:selectedItems', items);
        }
        function updatePage(page: number): void {
            emit('update:page', page);
        }
        function updatePageSize(pageSize: number): void {
            emit('update:pageSize', pageSize);
        }

        onBeforeMount(() => {
            table.initialize();
        });

        onBeforeUnmount(() => {
            pauseHeaderObserver();
        });

        return {
            colorSchemeClass,
            styleSetVariables,
            classObj,
            headerRef,
            headerSlots,
            bodySlots,
            headerInvisible,
            stickyHeaderTop,
            searchOptions,
            table,
            clickCell,
            selectRow,
            expandRow,
            searchRows,
            paginate,
            updateSelectedItems,
            updatePage,
            updatePageSize,
        };
    },
});
</script>

<style src="./VsTable.css" />
