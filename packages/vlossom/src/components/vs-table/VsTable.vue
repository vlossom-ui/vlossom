<template>
    <div :class="['vs-table', colorSchemeClass, classObj]" :style="componentStyleSet.component">
        <vs-search-input
            v-if="search"
            ref="searchInputRef"
            class="vs-table-search-input"
            v-bind="searchOptions"
            :disabled="loading"
            @search="searchRows"
        />

        <div
            v-if="useStickyHeader"
            ref="stickyScrollRef"
            class="vs-table-sticky-wrapper"
            :style="{ top: stickyHeaderTop }"
        >
            <table>
                <vs-table-header class="vs-table-sticky-header" @click-cell="clickCell" @select-row="selectRow">
                    <template v-for="name in headerSlots" #[name]="slotData">
                        <slot :name v-bind="slotData || {}" />
                    </template>
                </vs-table-header>
            </table>
        </div>

        <div class="vs-table-content" ref="scrollWrapperRef">
            <vs-visible-render
                :disabled="noVirtualScroll"
                :selector="`.${TABLE_DRAG_WRAPPER_CLASS}`"
                root-margin="150px"
            >
                <table>
                    <caption v-if="$slots['caption']">
                        <slot name="caption" />
                    </caption>
                    <vs-table-header
                        ref="headerRef"
                        class="vs-table-original-header"
                        @click-cell="clickCell"
                        @select-row="selectRow"
                    >
                        <template v-for="name in headerSlots" #[name]="slotData">
                            <slot :name v-bind="slotData || {}" />
                        </template>
                    </vs-table-header>
                    <vs-table-body
                        @click-cell="clickCell"
                        @select-row="selectRow"
                        @expand-row="expandRow"
                        @drag="dragRow"
                    >
                        <template v-for="name in bodySlots" #[name]="slotData">
                            <slot :name v-bind="slotData || {}" />
                        </template>
                    </vs-table-body>
                </table>
            </vs-visible-render>
        </div>

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
    onMounted,
    useTemplateRef,
    onBeforeUnmount,
    watch,
    nextTick,
    inject,
    type ComputedRef,
} from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import type { SortableEvent } from 'sortablejs';
import {
    LAYOUT_STORE_KEY,
    type SearchProps,
    type UIState,
    VsComponent,
    type PropsOf,
    type ColorScheme,
} from '@/declaration';
import { logUtil, stringUtil } from '@/utils';
import { getColorSchemeProps, getStyleSetProps, getSearchProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import { LayoutStore } from '@/stores';

import { TABLE_COMPOSABLE_TOKEN, useTable, type TableComposable } from './composables/table-composable';
import {
    TABLE_STYLE_SET_TOKEN,
    TABLE_COLOR_SCHEME_TOKEN,
    type VsTableBodyCell,
    type VsTableColumnDef,
    type VsTableItem,
    type VsTableStyleSet,
    type VsTablePaginationOptions,
    getRowItem,
    type VsTablePageSizeOptions,
} from './types';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS, TABLE_DRAG_WRAPPER_CLASS } from './constants';

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
            type: Array as PropType<VsTableColumnDef[] | string[]>,
            default: () => [],
        },
        items: {
            type: Array as PropType<VsTableItem[]>,
            required: true,
            validator: (value: VsTableItem[]) => {
                if (!Array.isArray(value)) {
                    logUtil.propError(componentName, 'items', 'items must be an array');
                    return false;
                }
                return true;
            },
        },
        dense: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
        responsive: { type: Boolean, default: false },
        noVirtualScroll: { type: Boolean, default: false },
        stickyHeader: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        serverMode: {
            type: Boolean,
            default: false,
            validator: (serverMode: boolean, props: unknown) => {
                const { pagination } = props as PropsOf<VsComponent.VsTable>;
                if (serverMode && typeof pagination === 'object') {
                    if (!pagination.totalItemCount) {
                        logUtil.propError(
                            componentName,
                            'serverMode',
                            'totalItemCount is required when serverMode is true',
                        );
                        return false;
                    }
                }
                return true;
            },
        },
        draggable: { type: Boolean, default: false },
        selectable: {
            type: [Boolean, Function] as PropType<
                boolean | ((item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean)
            >,
            default: false,
        },
        expandable: {
            type: [Boolean, Function] as PropType<
                boolean | ((item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean)
            >,
            default: false,
        },
        state: {
            type: [String, Function] as PropType<
                UIState | ((item: VsTableItem, index?: number, items?: VsTableItem[]) => UIState)
            >,
            default: 'idle',
        },
        pagination: {
            type: [Boolean, Object] as PropType<boolean | VsTablePaginationOptions>,
            default: false,
        },
        // v-model
        selectedItems: {
            type: Array as PropType<VsTableItem[]>,
            default: () => [] as VsTableItem[],
            validator: (value: VsTableItem[]) => {
                if (!Array.isArray(value)) {
                    logUtil.propError(componentName, 'selectedItems', 'selectedItems must be an array');
                    return false;
                }
                return true;
            },
        },
        page: { type: Number as PropType<number> }, // 0-based page index
        pageSize: {
            type: Number as PropType<number>,
            default: DEFAULT_PAGE_SIZE,
            validator: (value: number, props: unknown) => {
                const { pagination } = props as PropsOf<VsComponent.VsTable>;
                if (value <= 0) {
                    logUtil.propError(componentName, 'pageSize', 'pageSize must be greater than or equal to 1');
                    return false;
                }
                if (pagination && typeof pagination === 'object') {
                    const pageSizeOptions: VsTablePageSizeOptions =
                        pagination.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
                    const isValidPageSize = pageSizeOptions.some((option) => option.value === value);
                    if (!isValidPageSize) {
                        logUtil.propWarning(componentName, 'pageSize', 'pageSize has not been set in pageSizeOptions');
                        return true;
                    }
                }
                if (pagination && typeof pagination === 'boolean') {
                    const pageSizeOptions: VsTablePageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS;
                    const isValidPageSize = pageSizeOptions.some((option) => option.value === value);
                    if (!isValidPageSize) {
                        logUtil.propWarning(componentName, 'pageSize', 'pageSize has not been set in pageSizeOptions');
                        return true;
                    }
                }
                return true;
            },
        },
        pagedItems: { type: Array as PropType<VsTableItem[]>, default: () => [] },
        totalItems: {
            type: Array as PropType<VsTableItem[]>,
            default: () => [],
            validator: (value: VsTableItem[]) => {
                if (!Array.isArray(value)) {
                    logUtil.propError(componentName, 'totalItems', 'totalItems must be an array');
                    return false;
                }
                return true;
            },
        },
    },
    emits: [
        'click-cell',
        'select-row',
        'expand-row',
        'drag',
        'search',
        'paginate',
        'update:selectedItems',
        'update:page',
        'update:pageSize',
        'update:pagedItems',
        'update:totalItems',
    ],
    setup(props, { slots, emit }) {
        const { colorScheme, styleSet, responsive, stickyHeader, dense, primary } = toRefs(props);

        const searchInputRef = useTemplateRef<VsSearchInputRef>('searchInputRef');
        const headerRef = useTemplateRef<HTMLTableSectionElement>('headerRef');
        const scrollWrapperRef = useTemplateRef<HTMLDivElement>('scrollWrapperRef');
        const stickyScrollRef = useTemplateRef<HTMLDivElement>('stickyScrollRef');

        const isHeaderOutOfView = ref<boolean>(true);
        const stickyHeaderTop = ref<string>('0px');
        const { header: vsLayoutHeader } = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());
        const { colorSchemeClass, computedColorScheme } = useColorScheme(componentName, colorScheme);
        const { componentStyleSet } = useStyleSet<VsTableStyleSet>(componentName, styleSet);
        const table: TableComposable = useTable(
            props,
            { searchInputRef },
            { updateSelectedItems, updatePage, updatePageSize, updatePagedItems, updateTotalItems },
        );

        provide<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN, componentStyleSet);
        provide<ComputedRef<ColorScheme | undefined>>(TABLE_COLOR_SCHEME_TOKEN, computedColorScheme);
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
            'vs-responsive': responsive.value,
            'vs-dense': dense.value,
            'vs-primary': primary.value,
        }));
        const searchOptions = computed<Exclude<SearchProps, boolean>>(() => table.search.value);
        const useStickyHeader = computed<boolean>(() => stickyHeader.value && isHeaderOutOfView.value);

        const { pause: pauseHeaderObserver } = useIntersectionObserver(
            headerRef,
            ([{ isIntersecting, boundingClientRect }]) => {
                isHeaderOutOfView.value = !isIntersecting;
                if (!isIntersecting) {
                    const headerHeight = vsLayoutHeader.value.height;
                    // sticky header has to be positioned at the bottom of the vs-header when the table is hidden by vs-header
                    if (boundingClientRect.top < Number(headerHeight)) {
                        stickyHeaderTop.value = stringUtil.toStringSize(headerHeight);
                        return;
                    }
                    stickyHeaderTop.value = '0px';
                }
            },
            // The '999999px' value for rootMargin ensures that the header visibility is considered partially hidden when an x-overflow occurs.
            { threshold: 0, rootMargin: '0px 999999px' },
        );

        function syncStickyScroll() {
            if (stickyScrollRef.value && scrollWrapperRef.value) {
                stickyScrollRef.value.scrollLeft = scrollWrapperRef.value.scrollLeft;
            }
        }

        function clickCell(cell: VsTableBodyCell, event: MouseEvent): void {
            emit('click-cell', cell, event);
        }
        function selectRow(row: VsTableBodyCell[], event: MouseEvent): void {
            emit('select-row', row, event);
        }
        function expandRow(row: VsTableBodyCell[], event: MouseEvent): void {
            emit('expand-row', row, event);
        }
        function dragRow(event: SortableEvent): void {
            emit('drag', event);
        }
        function searchRows(searchText: string): void {
            const items = table.bodyCells.value.map((row) => getRowItem(row));
            emit('search', items, searchText);
        }
        function paginate(nextPage: number): void {
            emit('paginate', nextPage, table.pageSize.value);
        }
        function updateSelectedItems(items: VsTableItem[]): void {
            emit('update:selectedItems', items);
        }
        function updatePage(page: number): void {
            emit('update:page', page);
        }
        function updatePageSize(pageSize: number): void {
            emit('update:pageSize', pageSize);
        }
        function updatePagedItems(items: VsTableItem[]): void {
            emit('update:pagedItems', items);
        }
        function updateTotalItems(items: VsTableItem[]): void {
            emit('update:totalItems', items);
        }

        watch(useStickyHeader, (visible) => {
            if (visible) {
                nextTick(syncStickyScroll);
            }
        });

        onBeforeMount(() => {
            table.initialize();
        });

        onMounted(() => {
            scrollWrapperRef.value?.addEventListener('scroll', syncStickyScroll, { passive: true });
        });

        onBeforeUnmount(() => {
            pauseHeaderObserver();
            scrollWrapperRef.value?.removeEventListener('scroll', syncStickyScroll);
        });

        return {
            TABLE_DRAG_WRAPPER_CLASS,
            colorSchemeClass,
            componentStyleSet,
            classObj,
            headerRef,
            scrollWrapperRef,
            stickyScrollRef,
            headerSlots,
            bodySlots,
            useStickyHeader,
            stickyHeaderTop,
            searchOptions,
            table,
            clickCell,
            selectRow,
            expandRow,
            searchRows,
            paginate,
            dragRow,
            updateSelectedItems,
            updatePage,
            updatePageSize,
        };
    },
});
</script>

<style src="./VsTable.css" />
