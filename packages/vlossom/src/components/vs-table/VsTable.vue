<template>
    <div ref="tableRef" :class="['vs-table', colorSchemeClass]" :style="styleSetVariables">
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
import type { VsSearchInputRef } from '../vs-search-input/types';

import { TABLE_COMPOSABLE_TOKEN, useTable, type TableComposable } from './composables/table-composable';
import {
    type BodyCell,
    type ColumnDef,
    type Item,
    type VsTableSearchOptions,
    type VsTableStyleSet,
    getRowItem,
} from './types';
import { TABLE_SEARCH_OPTIONS } from './constants';

import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';
import VsTableHeader from './VsTableHeader.vue';
import VsTableBody from './VsTableBody.vue';
import { LayoutStore } from '@/stores';

const componentName = VsComponent.VsTable;

export default defineComponent({
    name: componentName,
    components: { VsTableHeader, VsTableBody, VsSearchInput },
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
        stickyHeader: {
            type: Boolean,
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
    },
    emits: ['click-cell', 'select-row', 'expand-row', 'search', 'update:selectedItems'],
    setup(props, { slots, emit }) {
        const { colorScheme, search, styleSet } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const additionalStyleSet = computed<Partial<VsTableStyleSet>>(() => {
            return objectUtil.shake({
                stickyHeaderTop:
                    stickyHeaderTop.value === undefined ? undefined : stringUtil.toStringSize(stickyHeaderTop.value),
            });
        });
        const { styleSetVariables } = useStyleSet<VsTableStyleSet>(componentName, styleSet, additionalStyleSet);

        const searchInputRef = useTemplateRef<VsSearchInputRef>('searchInputRef');
        const tableRef = useTemplateRef<HTMLDivElement>('tableRef');
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
            tableRef,
            headerRef,
            headerSlots,
            bodySlots,
            searchOptions,
            headerInvisible,
            stickyHeaderTop,
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
