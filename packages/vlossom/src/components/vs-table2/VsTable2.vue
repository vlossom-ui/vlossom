<template>
    <div :class="['vs-table2', colorSchemeClass, classObj]" :style="componentInlineStyle">
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
                <vs-table2-header
                    class="vs-table-sticky-header"
                    v-bind="headerProps"
                    @sort="updateSort"
                    @select-all="selectAll"
                >
                    <template v-for="name in headerSlots" #[name]="slotData">
                        <slot :name v-bind="slotData || {}" />
                    </template>
                </vs-table2-header>
            </table>
        </div>

        <div class="vs-table-content" ref="scrollWrapperRef">
            <div ref="headerSentinelRef" class="vs-table-header-sentinel" aria-hidden="true" />
            <table ref="contentTableRef" class="vs-table-table" :style="tableColumnStyle">
                <caption v-if="$slots['caption']" class="vs-table-caption" :style="componentStyleSet.$caption">
                    <slot name="caption" />
                </caption>
                <vs-table2-header
                    class="vs-table-original-header"
                    v-bind="headerProps"
                    @sort="updateSort"
                    @select-all="selectAll"
                >
                    <template v-for="name in headerSlots" #[name]="slotData">
                        <slot :name v-bind="slotData || {}" />
                    </template>
                </vs-table2-header>

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
                        <vs-table2-row v-bind="getRowProps(element, index)" v-on="rowListeners">
                            <template v-for="name in itemSlots" #[name]="slotData">
                                <slot :name v-bind="slotData || {}" />
                            </template>
                        </vs-table2-row>
                    </template>
                </draggable>
                <tbody v-else class="vs-table-tbody">
                    <vs-table2-row
                        v-for="(item, index) in displayItems"
                        :key="getItemKey(item)"
                        v-bind="getRowProps(item, index)"
                        v-on="rowListeners"
                    >
                        <template v-for="name in itemSlots" #[name]="slotData">
                            <slot :name v-bind="slotData || {}" />
                        </template>
                    </vs-table2-row>
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

        <vs-table2-pagination
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
    VsTable2Cell,
    VsTable2ColumnDef,
    VsTable2Item,
    VsTable2ItemKey,
    VsTable2PaginationOptions,
    VsTable2SearchOptions,
    VsTable2StyleSet,
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
import VsTable2Header from './VsTable2Header.vue';
import VsTable2Pagination from './VsTable2Pagination.vue';
import VsTable2Row from './VsTable2Row.vue';

const componentName = VsComponent.VsTable2;

export default defineComponent({
    name: componentName,
    components: {
        BanIcon,
        draggable,
        VsGrid,
        VsLoading,
        VsResponsive,
        VsSearchInput,
        VsTable2Header,
        VsTable2Pagination,
        VsTable2Row,
    },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTable2StyleSet>(),
        ...getSearchProps<VsTable2SearchOptions>(),
        columns: {
            type: Array as PropType<VsTable2ColumnDef[] | string[]>,
            default: () => [],
        },
        items: {
            type: Array as PropType<VsTable2Item[]>,
            default: () => [],
            validator: (value: VsTable2Item[]) => {
                if (value.length > 0 && typeof value[0] !== 'object') {
                    logUtil.propError(componentName, 'items', 'items must be an array of objects');
                    return false;
                }
                return true;
            },
        },
        itemKey: { type: [String, Function] as PropType<VsTable2ItemKey> },
        size: { type: String as PropType<Size>, default: 'md' },
        primary: { type: Boolean, default: false },
        responsive: { type: Boolean, default: false },
        stickyHeader: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        serverMode: {
            type: Boolean,
            default: false,
            validator: (serverMode: boolean, props: unknown) => {
                const { pagination } = props as PropsOf<VsComponent.VsTable2>;
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
                boolean | ((item: VsTable2Item, index?: number, items?: VsTable2Item[]) => boolean)
            >,
            default: false,
        },
        expandable: {
            type: [Boolean, Function] as PropType<
                boolean | ((item: VsTable2Item, index?: number, items?: VsTable2Item[]) => boolean)
            >,
            default: true,
        },
        state: {
            type: [String, Function] as PropType<
                UIState | ((item: VsTable2Item, index?: number, items?: VsTable2Item[]) => UIState)
            >,
            default: 'idle',
        },
        pagination: {
            type: [Boolean, Object] as PropType<boolean | VsTable2PaginationOptions>,
            default: false,
        },
        // v-model
        selectedItems: {
            type: Array as PropType<VsTable2Item[]>,
            default: () => [] as VsTable2Item[],
        },
        page: { type: Number as PropType<number> }, // 0-based page index
        pageSize: {
            type: Number as PropType<number>,
            validator: (value: number, props: unknown) => {
                if (value <= 0) {
                    logUtil.propError(componentName, 'pageSize', 'pageSize must be greater than or equal to 1');
                    return false;
                }
                const { pagination } = props as PropsOf<VsComponent.VsTable2>;
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
        pagedItems: { type: Array as PropType<VsTable2Item[]>, default: () => [] },
        totalItems: { type: Array as PropType<VsTable2Item[]>, default: () => [] },
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
        const { componentStyleSet, componentInlineStyle } = useStyleSet<VsTable2StyleSet>(componentName, styleSet);
        const { sizeClass } = useSizeClass(size);

        const searchInputRef: TemplateRef<VsSearchInputRef> = useTemplateRef('searchInputRef');
        const headerSentinelRef: TemplateRef<HTMLDivElement> = useTemplateRef('headerSentinelRef');
        const contentTableRef: TemplateRef<HTMLTableElement> = useTemplateRef('contentTableRef');
        const scrollWrapperRef: TemplateRef<HTMLDivElement> = useTemplateRef('scrollWrapperRef');
        const stickyScrollRef: TemplateRef<HTMLDivElement> = useTemplateRef('stickyScrollRef');

        const items = computed<VsTable2Item[]>(() => rawItems.value ?? []);
        const getItemState = computed(() =>
            functionUtil.toCallable<[VsTable2Item, number?, VsTable2Item[]?], UIState>(state.value),
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
        const displayItems = computed<VsTable2Item[]>(() =>
            isClientPaged.value ? viewItems.value.slice(pageStartIndex.value, pageEndIndex.value) : viewItems.value,
        );
        const draggableItems = computed<VsTable2Item[]>({
            get: () => displayItems.value,
            set: (nextItems: VsTable2Item[]) => setDragOrder(nextItems, isClientPaged.value ? pageStartIndex.value : 0),
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

        function getRowProps(item: VsTable2Item, index: number) {
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

        function selectRow(item: VsTable2Item, index: number, selected: boolean, event: MouseEvent): void {
            if (!selectItem(item, index, selected)) {
                return;
            }
            emit('select-row', item, index, selected, event);
        }

        function expandRow(item: VsTable2Item, index: number, expanded: boolean, event: MouseEvent): void {
            if (!expandItem(item, index, expanded)) {
                return;
            }
            emit('expand-row', item, index, expanded, event);
        }

        const rowListeners = {
            'click-cell': (cell: VsTable2Cell, event: MouseEvent) => emit('click-cell', cell, event),
            'click-row': (item: VsTable2Item, index: number, event: MouseEvent) =>
                emit('click-row', item, index, event),
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

<style src="./VsTable2.css" />
