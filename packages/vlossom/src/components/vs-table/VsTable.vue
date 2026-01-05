<template>
    <div :class="['vs-table', colorSchemeClass]">
        <vs-search-input
            ref="searchInputRef"
            class="mb-2 flex justify-end"
            v-bind="searchOptions"
            @search="searchRows"
        />

        <table>
            <caption v-if="$slots['caption']">
                <slot name="caption" />
            </caption>
            <vs-table-header @click-cell="clickCell" @select-row="selectRow">
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
import { defineComponent, provide, type PropType, toRefs, computed, onBeforeMount, useTemplateRef } from 'vue';
import { VsComponent } from '@/declaration';
import { logUtil } from '@/utils';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme } from '@/composables';
import type { VsSearchInputRef } from '../vs-search-input/types';

import { TABLE_COMPOSABLE_TOKEN, useTable, type TableComposable } from './composables/table-composable';
import type { BodyCell, ColumnDef, Item, VsTableSearchOptions, VsTableStyleSet } from './types';
import { TABLE_SEARCH_OPTIONS } from './constants';

import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';
import VsTableHeader from './VsTableHeader.vue';
import VsTableBody from './VsTableBody.vue';

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
        const { colorScheme, search } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const searchInputRef = useTemplateRef<VsSearchInputRef>('searchInputRef');

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
            emit('search', table.bodyCells.value, searchText);
        }

        function updateSelectedItems(items: Item[]): void {
            emit('update:selectedItems', items);
        }

        onBeforeMount(() => {
            table.initialize();
        });

        return {
            colorSchemeClass,
            headerSlots,
            bodySlots,
            searchOptions,
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
