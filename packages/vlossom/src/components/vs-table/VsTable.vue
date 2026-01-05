<template>
    <div :class="['vs-table', colorSchemeClass, classObj]" :style="styleSetVariables">
        <vs-search-input
            ref="searchInputRef"
            class="mb-2 flex justify-end"
            v-bind="searchOptions"
            @search="searchRows"
        />

        <table>
            <vs-table-header
                class="vs-table-sticky-header"
                v-if="stickyHeader && headerInvisible"
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
            <vs-table-body @click-cell="clickCell" @select-row="selectRow" @expand-row="expandRow">
                <template v-for="name in bodySlots" #[name]="slotData">
                    <slot :name v-bind="slotData || {}" />
                </template>
            </vs-table-body>
        </table>

        <vs-table-pagination v-if="pagination" v-model:page="pageRef" v-model:page-size="pageSizeRef" />
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
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
import { logUtil, objectUtil, stringUtil } from '@/utils';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import { LayoutStore } from '@/stores';

import { TABLE_COMPOSABLE_TOKEN, useTable, type TableComposable } from './composables/table-composable';
import {
    type BodyCell,
    type ColumnDef,
    type Item,
    type VsTableSearchOptions,
    type VsTableStyleSet,
    type VsTablePaginationOptions,
    getRowItem,
} from './types';
import { TABLE_SEARCH_OPTIONS } from './constants';

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
        responsive: {
            type: Boolean,
            default: false,
        },
        stickyHeader: {
            type: Boolean,
            default: false,
        },
        selectable: {
            type: [Boolean, Function] as PropType<boolean | ((item: Item, index?: number, items?: Item[]) => boolean)>,
            default: false,
        },
        expandable: {
            type: [Boolean, Function] as PropType<boolean | ((item: Item, index?: number, items?: Item[]) => boolean)>,
            default: false,
        },
        search: {
            type: [Boolean, Object] as PropType<boolean | VsTableSearchOptions>,
            default: false,
        },
        pagination: {
            type: [Boolean, Object] as PropType<boolean | VsTablePaginationOptions>,
            default: false,
        },
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
        page: {
            type: Number as PropType<number>, // 0-based page index
            required: true,
            default: 0,
        },
        pageSize: {
            type: Number as PropType<number>,
            required: true,
            default: 20,
        },
    },
    emits: [
        'click-cell',
        'select-row',
        'expand-row',
        'search',
        'update:selectedItems',
        'update:page',
        'update:pageSize',
    ],
    setup(props, { slots, emit }) {
        const { colorScheme, styleSet, responsive, search, page: rawPage, pageSize: rawPageSize } = toRefs(props);
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

        const table: TableComposable = useTable(props, { searchInputRef }, { updateSelectedItems });
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

        const searchOptions = computed<VsTableSearchOptions>(() => {
            if (typeof search.value === 'boolean') {
                return TABLE_SEARCH_OPTIONS;
            }
            return { ...TABLE_SEARCH_OPTIONS, ...search.value };
        });

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
        const pageRef = computed({
            get: () => rawPage.value,
            set: (value) => emit('update:page', value),
        });

        const pageSizeRef = computed({
            get: () => rawPageSize.value,
            set: (value) => emit('update:pageSize', value),
        });

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

        function updateSelectedItems(items: Item[]): void {
            emit('update:selectedItems', items);
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
            searchOptions,
            headerInvisible,
            stickyHeaderTop,
            pageRef,
            pageSizeRef,
            clickCell,
            selectRow,
            expandRow,
            searchRows,
            updateSelectedItems,
        };
    },
});
</script>

<style src="./VsTable.css" />
