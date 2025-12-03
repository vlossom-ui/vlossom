<template>
    <div class="vs-table">
        {{ 'VsTable' }}
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { VsComponent, type UIState } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsTableColumn, VsTableStyleSet } from './types';

const name = VsComponent.VsTable;
export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTableStyleSet>(),
        headers: {
            type: Array as PropType<VsTableColumn[] | string[]>,
            default: () => [],
        },
        items: {
            type: Array as PropType<any[]>,
            required: true,
        },
        stickyHeader: {
            type: Boolean,
            default: false,
        },
        dense: {
            type: Boolean,
            default: false,
        },
        responsive: {
            type: Boolean,
            default: false,
        },
        primary: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        selectable: {
            type: [Boolean, Function] as PropType<boolean | ((row: any, index: number) => boolean)>,
            default: false,
        },
        expandable: {
            type: [Boolean, Function] as PropType<boolean | ((row: any, index: number) => boolean)>,
            default: false,
        },
        state: {
            type: [String, Function] as PropType<UIState | ((row: any, index: number) => UIState)>,
            default: 'idle',
        },
        search: {
            type: Boolean,
            default: false,
        },
        searchPlaceholder: {
            type: String,
            default: 'search',
        },
        searchableKeys: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
        searchCaseSensitive: {
            type: Boolean,
            default: true,
        },
        searchRegex: {
            type: Boolean,
            default: true,
        },
        pagination: {
            type: Boolean,
            default: false,
        },
        paginationOptions: {
            type: Array as PropType<number[]>,
            default: () => [50, 100, -1],
        },
        paginationTotalLength: {
            type: Number,
        },
        paginationEdgeButtons: {
            type: Boolean,
            default: false,
        },
        draggable: {
            type: Boolean,
            default: false,
        },
        // v-model
        selectedItems: {
            type: Array as PropType<any[]>,
            default: () => [],
        },
        pagedItems: {
            type: Array as PropType<any[]>,
            default: () => [],
        },
        itemsPerPage: {
            type: Number,
            default: 50,
        },
        currentItems: {
            type: Array as PropType<any[]>,
            default: () => [],
        },
        page: {
            type: Number,
            default: 1,
        },
    },
    emits: [
        'clickRow',
        'drag',
        'update:itemsPerPage',
        'update:pagedItems',
        'update:page',
        'update:selectedItems',
        'update:totalItems',
    ],
});
</script>

<style src="./VsTable.css" />
