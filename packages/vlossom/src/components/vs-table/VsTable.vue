<template>
    <div :class="['vs-table', colorSchemeClass, classObj]" :style="componentInlineStyle">
        <vs-grid v-if="search || $slots['toolbar']" class="vs-table-toolbar" :column-gap="'1rem'">
            <vs-responsive
                class="vs-table-toolbar-start"
                :grid="{ sm: 12, md: search ? 10 : 12 }"
                :style="componentStyleSet.$toolbar"
            >
                <slot name="toolbar" />
            </vs-responsive>
            <vs-responsive v-if="search" class="vs-table-search-input" :grid="{ sm: 12, md: 2 }">
                <vs-search-input
                    ref="searchInputRef"
                    v-bind="searchOptions"
                    :color-scheme="computedColorScheme"
                    :style-set="componentStyleSet.$search"
                    :disabled="loading"
                    :size
                    @search="searchRows"
                />
            </vs-responsive>
        </vs-grid>

        <div
            v-if="useStickyHeader"
            ref="stickyScrollRef"
            class="vs-table-sticky-wrapper"
            :style="{ top: componentStyleSet.$stickyHeaderTop }"
        >
            <table class="vs-table-table" :style="stickyTableColumnStyle">
                <vs-table-header
                    class="vs-table-sticky-header"
                    v-bind="headerProps"
                    @sort="updateSort"
                    @select-all="selectAll"
                >
                    <template v-for="name in headerSlots" #[name]="slotData">
                        <slot :name v-bind="slotData || {}" />
                    </template>
                </vs-table-header>
            </table>
        </div>

        <div class="vs-table-content" ref="scrollWrapperRef">
            <div ref="headerSentinelRef" class="vs-table-header-sentinel" aria-hidden="true" />
            <table ref="contentTableRef" class="vs-table-table" :style="tableColumnStyle">
                <caption v-if="$slots['caption']" class="vs-table-caption" :style="componentStyleSet.$caption">
                    <slot name="caption" />
                </caption>
                <vs-table-header
                    class="vs-table-original-header"
                    v-bind="headerProps"
                    @sort="updateSort"
                    @select-all="selectAll"
                >
                    <template v-for="name in headerSlots" #[name]="slotData">
                        <slot :name v-bind="slotData || {}" />
                    </template>
                </vs-table-header>

                <draggable
                    v-if="draggable"
                    tag="tbody"
                    class="vs-table-tbody"
                    v-model="draggableItems"
                    v-bind="DEFAULT_SORTABLE_OPTIONS"
                    :item-key="getItemKey"
                    :disabled="loading"
                    @update="$emit('drag', $event)"
                >
                    <template #item="{ element, index }">
                        <vs-table-row v-bind="getRowProps(element, index)" v-on="rowListeners">
                            <template v-for="name in itemSlots" #[name]="slotData">
                                <slot :name v-bind="slotData || {}" />
                            </template>
                        </vs-table-row>
                    </template>
                </draggable>
                <tbody v-else class="vs-table-tbody">
                    <vs-table-row
                        v-for="(item, index) in displayItems"
                        :key="getItemKey(item)"
                        v-bind="getRowProps(item, index)"
                        v-on="rowListeners"
                    >
                        <template v-for="name in itemSlots" #[name]="slotData">
                            <slot :name v-bind="slotData || {}" />
                        </template>
                    </vs-table-row>
                </tbody>

                <tbody v-if="!displayItems.length" class="vs-table-tbody">
                    <tr class="vs-table-body-row">
                        <td class="vs-table-td vs-table-no-data-cell" colspan="100%">
                            <div class="vs-table-no-data">
                                <vs-loading v-if="loading" :color-scheme="computedColorScheme" />
                                <slot v-else-if="$slots['empty']" name="empty" />
                                <template v-else>
                                    <BanIcon class="vs-table-no-data-icon" />
                                    <p class="vs-table-no-data-text">{{ optionMessages.VS_TABLE_NO_DATA }}</p>
                                </template>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <vs-table-pagination
            v-if="pagination && totalPages"
            :options="paginationOptions"
            :page="currentPage"
            :page-size="currentPageSize"
            :total-pages="totalPages"
            :total-count="totalCount"
            :page-start-index="pageStartIndex"
            :page-end-index="pageEndIndex"
            :color-scheme="computedColorScheme"
            :style-set="componentStyleSet"
            :size
            :loading
            @update:page="currentPage = $event"
            @update:page-size="currentPageSize = $event"
        />
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    toRefs,
    useTemplateRef,
    watch,
    type PropType,
    type TemplateRef,
} from 'vue';
import { useIntersectionObserver, useResizeObserver } from '@vueuse/core';
import { VsComponent, type PropsOf, type Size, type UIState } from '@/declaration';
import { functionUtil, logUtil } from '@/utils';
import { getColorSchemeProps, getSearchProps, getStyleSetProps } from '@/props';
import { useColorScheme, useMessages, useSizeClass, useStyleSet } from '@/composables';

import type {
    VsTableCell,
    VsTableColumnDef,
    VsTableItem,
    VsTableItemKey,
    VsTablePaginationOptions,
    VsTableSearchOptions,
    VsTableStyleSet,
} from './types';
import { DEFAULT_SORTABLE_OPTIONS, VS_TABLE_HEADER_SLOT_PREFIXES, VS_TABLE_ITEM_SLOT_PREFIXES } from './constants';
import { useTableColumnComposable } from './composables/table-column-composable';
import { useTableDragComposable } from './composables/table-drag-composable';
import { useTableExpandComposable } from './composables/table-expand-composable';
import { useTableItemKeyComposable } from './composables/table-item-key-composable';
import { useTablePaginationComposable } from './composables/table-pagination-composable';
import { useTableSearchComposable } from './composables/table-search-composable';
import { useTableSelectionComposable } from './composables/table-selection-composable';
import { useTableSortComposable } from './composables/table-sort-composable';

import type { VsSearchInputRef } from '@/components/vs-search-input/types';

import draggable from 'vuedraggable/src/vuedraggable';
import { BanIcon } from '@lucide/vue';
import VsGrid from '@/components/vs-grid/VsGrid.vue';
import VsLoading from '@/components/vs-loading/VsLoading.vue';
import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';
import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';
import VsTableHeader from './VsTableHeader.vue';
import VsTablePagination from './VsTablePagination.vue';
import VsTableRow from './VsTableRow.vue';

const componentName = VsComponent.VsTable;

export default defineComponent({
    name: componentName,
    components: {
        BanIcon,
        draggable,
        VsGrid,
        VsLoading,
        VsResponsive,
        VsSearchInput,
        VsTableHeader,
        VsTablePagination,
        VsTableRow,
    },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTableStyleSet>(),
        ...getSearchProps<VsTableSearchOptions>(),
        columns: {
            type: Array as PropType<VsTableColumnDef[] | string[]>,
            default: () => [],
        },
        items: {
            type: Array as PropType<VsTableItem[]>,
            default: () => [],
            validator: (value: VsTableItem[]) => {
                if (value.length > 0 && typeof value[0] !== 'object') {
                    logUtil.propError(componentName, 'items', 'items must be an array of objects');
                    return false;
                }
                return true;
            },
        },
        itemKey: { type: [String, Function] as PropType<VsTableItemKey> },
        size: { type: String as PropType<Size>, default: 'md' },
        primary: { type: Boolean, default: false },
        responsive: { type: Boolean, default: false },
        stickyHeader: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        serverMode: {
            type: Boolean,
            default: false,
            validator: (serverMode: boolean, props: unknown) => {
                const { pagination } = props as PropsOf<VsComponent.VsTable>;
                if (!serverMode || !pagination) {
                    return true;
                }
                const totalItemCount = typeof pagination === 'object' ? pagination.totalItemCount : undefined;
                if (totalItemCount === undefined || totalItemCount === null) {
                    logUtil.propError(
                        componentName,
                        'serverMode',
                        'totalItemCount is required when serverMode is true',
                    );
                    return false;
                }
                if (totalItemCount < 0) {
                    logUtil.propError(componentName, 'serverMode', 'totalItemCount must be greater than or equal to 0');
                    return false;
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
            default: true,
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
        },
        page: { type: Number as PropType<number> }, // 0-based page index
        pageSize: {
            type: Number as PropType<number>,
            validator: (value: number, props: unknown) => {
                if (value <= 0) {
                    logUtil.propError(componentName, 'pageSize', 'pageSize must be greater than or equal to 1');
                    return false;
                }
                const { pagination } = props as PropsOf<VsComponent.VsTable>;
                const pageSizeOptions = typeof pagination === 'object' ? pagination.pageSizeOptions : undefined;
                if (pageSizeOptions && !pageSizeOptions.some((option) => option.value === value)) {
                    logUtil.propError(
                        componentName,
                        'pageSize',
                        `pageSize ${value} is not in the pageSizeOptions ` +
                            `[${pageSizeOptions.map((option) => option.value).join(', ')}]`,
                    );
                    return false;
                }
                return true;
            },
        },
        pagedItems: { type: Array as PropType<VsTableItem[]>, default: () => [] },
        totalItems: { type: Array as PropType<VsTableItem[]>, default: () => [] },
    },
    emits: [
        'click-cell',
        'click-row',
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
        const {
            colorScheme,
            styleSet,
            columns: rawColumns,
            items: rawItems,
            itemKey,
            size,
            primary,
            responsive,
            stickyHeader,
            loading,
            serverMode,
            draggable: isDraggable,
            selectable,
            expandable,
            state,
            pagination,
            search: rawSearch,
            selectedItems: rawSelectedItems,
            page: rawPage,
            pageSize: rawPageSize,
        } = toRefs(props);

        const { optionMessages } = useMessages();
        const { colorSchemeClass, computedColorScheme } = useColorScheme(componentName, colorScheme);
        const { componentStyleSet, componentInlineStyle } = useStyleSet<VsTableStyleSet>(componentName, styleSet);
        const { sizeClass } = useSizeClass(size);

        const searchInputRef: TemplateRef<VsSearchInputRef> = useTemplateRef('searchInputRef');
        const headerSentinelRef: TemplateRef<HTMLDivElement> = useTemplateRef('headerSentinelRef');
        const contentTableRef: TemplateRef<HTMLTableElement> = useTemplateRef('contentTableRef');
        const scrollWrapperRef: TemplateRef<HTMLDivElement> = useTemplateRef('scrollWrapperRef');
        const stickyScrollRef: TemplateRef<HTMLDivElement> = useTemplateRef('stickyScrollRef');

        const items = computed<VsTableItem[]>(() => rawItems.value ?? []);
        const getItemState = computed(() =>
            functionUtil.toCallable<[VsTableItem, number?, VsTableItem[]?], UIState>(state.value),
        );

        const { getItemKey } = useTableItemKeyComposable(itemKey);
        const {
            isSelectable,
            selectedItems,
            anySelectable,
            selectedAll,
            selectedPartial,
            isSelected,
            selectItem,
            selectAll,
        } = useTableSelectionComposable(selectable, rawSelectedItems, items, getItemKey);
        const { isExpandable, anyExpandable, isExpanded, expandItem } = useTableExpandComposable(
            expandable,
            items,
            getItemKey,
        );
        const showExpand = computed<boolean>(() => anyExpandable.value && !!slots.expand);

        const { columns, gridTemplateColumns } = useTableColumnComposable(rawColumns, items, {
            drag: isDraggable,
            select: anySelectable,
            expand: showExpand,
        });
        const { searchOptions, searchedItems } = useTableSearchComposable(searchInputRef, rawSearch, columns, items);
        const { sort, sortedItems, updateSort } = useTableSortComposable(columns, searchedItems);
        const { viewItems, setDragOrder } = useTableDragComposable(sortedItems, items);
        const { paginationOptions, page, pageSize, totalCount, totalPages, pageStartIndex, pageEndIndex } =
            useTablePaginationComposable(
                pagination,
                rawPage,
                rawPageSize,
                serverMode,
                computed(() => viewItems.value.length),
                {
                    updatePage: (nextPage: number) => emit('update:page', nextPage),
                    updatePageSize: (nextPageSize: number) => emit('update:pageSize', nextPageSize),
                },
            );

        const isClientPaged = computed<boolean>(() => !!pagination.value && !serverMode.value);
        const displayItems = computed<VsTableItem[]>(() =>
            isClientPaged.value ? viewItems.value.slice(pageStartIndex.value, pageEndIndex.value) : viewItems.value,
        );
        const draggableItems = computed<VsTableItem[]>({
            get: () => displayItems.value,
            set: (nextItems: VsTableItem[]) => setDragOrder(nextItems, isClientPaged.value ? pageStartIndex.value : 0),
        });

        const classObj = computed(() => ({
            'vs-responsive': responsive.value,
            'vs-primary': primary.value,
            [sizeClass.value]: !!sizeClass.value,
        }));
        const tableColumnStyle = computed(() => ({ gridTemplateColumns: gridTemplateColumns.value }));

        const headerProps = computed(() => ({
            columns: columns.value,
            sort: sort.value,
            colorScheme: computedColorScheme.value,
            styleSet: componentStyleSet.value,
            size: size.value,
            loading: loading.value,
            primary: primary.value,
            selectedAll: selectedAll.value,
            selectedPartial: selectedPartial.value,
            showDrag: isDraggable.value,
            showSelect: anySelectable.value,
            showExpand: showExpand.value,
        }));

        const headerSlots = computed(() =>
            Object.keys(slots).filter((slotName) =>
                VS_TABLE_HEADER_SLOT_PREFIXES.some((prefix) => slotName.startsWith(prefix)),
            ),
        );
        const itemSlots = computed(() =>
            Object.keys(slots).filter((slotName) =>
                VS_TABLE_ITEM_SLOT_PREFIXES.some((prefix) => slotName.startsWith(prefix)),
            ),
        );

        function getRowProps(item: VsTableItem, index: number) {
            return {
                item,
                index,
                columns: columns.value,
                colorScheme: computedColorScheme.value,
                styleSet: componentStyleSet.value,
                size: size.value,
                loading: loading.value,
                state: getItemState.value(item, index, items.value),
                selected: isSelected(item),
                expanded: isExpanded(item),
                selectable: isSelectable.value(item, index, items.value),
                expandable: isExpandable.value(item, index, items.value),
                showDrag: isDraggable.value,
                showSelect: anySelectable.value,
                showExpand: showExpand.value,
            };
        }

        function selectRow(item: VsTableItem, index: number, selected: boolean, event: MouseEvent): void {
            if (!selectItem(item, index, selected)) {
                return;
            }
            emit('select-row', item, index, selected, event);
        }

        function expandRow(item: VsTableItem, index: number, expanded: boolean, event: MouseEvent): void {
            if (!expandItem(item, index, expanded)) {
                return;
            }
            emit('expand-row', item, index, expanded, event);
        }

        const rowListeners = {
            'click-cell': (cell: VsTableCell, event: MouseEvent) => emit('click-cell', cell, event),
            'click-row': (item: VsTableItem, index: number, event: MouseEvent) => emit('click-row', item, index, event),
            'select-row': selectRow,
            'expand-row': expandRow,
        };

        function searchRows(searchText: string): void {
            emit('search', displayItems.value, searchText);
        }

        function expand(index: number): void {
            expandItem(displayItems.value[index], index, true);
        }

        function collapse(index: number): void {
            expandItem(displayItems.value[index], index, false);
        }

        /* ── sticky header ── */
        const isHeaderOutOfView = ref<boolean>(true);
        const useStickyHeader = computed<boolean>(() => stickyHeader.value && isHeaderOutOfView.value);

        // sticky 헤더는 복제본이라 column의 폭이 실제 table과 달라져서 일치 시키는 작업이 필요
        const stickyColumnTracks = ref<string>('');
        const stickyTableColumnStyle = computed(() => ({
            gridTemplateColumns: stickyColumnTracks.value || gridTemplateColumns.value,
        }));

        function syncStickyColumns() {
            if (contentTableRef.value) {
                stickyColumnTracks.value = getComputedStyle(contentTableRef.value).gridTemplateColumns;
            }
        }

        function syncStickyScroll() {
            if (stickyScrollRef.value && scrollWrapperRef.value) {
                stickyScrollRef.value.scrollLeft = scrollWrapperRef.value.scrollLeft;
            }
        }

        useResizeObserver(contentTableRef, syncStickyColumns);

        // thead(.vs-table-thead)는 display:contents라 박스가 없어 직접 관측할 수 없다.
        // 콘텐츠 최상단(=헤더 상단)에 둔 sentinel을 관측해, 헤더가 화면 위로 벗어났는지를 판단한다.
        const { pause: pauseHeaderObserver } = useIntersectionObserver(
            headerSentinelRef,
            ([{ isIntersecting }]) => {
                isHeaderOutOfView.value = !isIntersecting;
            },
            // The '999999px' value for rootMargin ensures that the header visibility is considered partially hidden when an x-overflow occurs.
            { threshold: 0, rootMargin: '0px 999999px' },
        );

        watch(useStickyHeader, (visible) => {
            if (visible) {
                nextTick(() => {
                    syncStickyColumns();
                    syncStickyScroll();
                });
            }
        });

        watch(selectedItems, (nextSelectedItems) => emit('update:selectedItems', nextSelectedItems));
        watch(displayItems, (nextItems) => emit('update:pagedItems', nextItems), { immediate: true });
        watch(viewItems, (nextItems) => emit('update:totalItems', nextItems), { immediate: true });
        // pageSize 변경은 page를 0으로 리셋하지만 두 변경이 같은 tick에 일어나므로 콜백은 한 번만 실행된다.
        watch([page, pageSize], ([nextPage, nextPageSize]) => emit('paginate', nextPage, nextPageSize));

        onMounted(() => {
            scrollWrapperRef.value?.addEventListener('scroll', syncStickyScroll, { passive: true });

            if (serverMode.value && pagination.value) {
                emit('paginate', page.value, pageSize.value);
            }
        });

        onBeforeUnmount(() => {
            pauseHeaderObserver();
            scrollWrapperRef.value?.removeEventListener('scroll', syncStickyScroll);
        });

        return {
            DEFAULT_SORTABLE_OPTIONS,
            optionMessages,
            colorSchemeClass,
            computedColorScheme,
            componentStyleSet,
            componentInlineStyle,
            classObj,
            searchInputRef,
            headerSentinelRef,
            contentTableRef,
            scrollWrapperRef,
            stickyScrollRef,
            headerSlots,
            itemSlots,
            headerProps,
            rowListeners,
            searchOptions,
            displayItems,
            draggableItems,
            tableColumnStyle,
            stickyTableColumnStyle,
            useStickyHeader,
            paginationOptions,
            currentPage: page,
            currentPageSize: pageSize,
            totalPages,
            totalCount,
            pageStartIndex,
            pageEndIndex,
            getItemKey,
            getRowProps,
            searchRows,
            updateSort,
            selectAll,
            expand,
            collapse,
        };
    },
});
</script>

<style src="./VsTable.css" />
