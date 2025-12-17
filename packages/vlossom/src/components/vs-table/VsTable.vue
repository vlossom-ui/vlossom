<template>
    <table :class="['vs-table', colorSchemeClass]">
        <caption v-if="$slots['caption']">
            <slot name="caption" />
        </caption>
        <vs-table-header>
            <template v-for="name in headerSlots" #[name]="slotData">
                <slot :name v-bind="slotData || {}" />
            </template>
        </vs-table-header>
        <vs-table-body>
            <template v-for="name in bodySlots" #[name]="slotData">
                <slot :name v-bind="slotData || {}" />
            </template>
        </vs-table-body>
    </table>
</template>

<script lang="ts">
import { defineComponent, provide, type PropType, toRefs, computed } from 'vue';
import { VsComponent } from '@/declaration';
import { logUtil } from '@/utils';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme } from '@/composables';

import { TABLE_COMPOSABLE_TOKEN, useTable, type TableComposable } from './composables/table-composable';
import type { ColumnDef, Item, VsTableStyleSet } from './types';

import VsTableHeader from './VsTableHeader.vue';
import VsTableBody from './VsTableBody.vue';
const componentName = VsComponent.VsTable;

export default defineComponent({
    name: componentName,
    components: { VsTableHeader, VsTableBody },
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
    },
    setup(props, { slots }) {
        const { colorScheme } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const table = useTable(props);
        provide<TableComposable>(TABLE_COMPOSABLE_TOKEN, table);

        const headerSlots = computed(() => Object.keys(slots).filter((k) => k.startsWith('header-')));
        const bodySlots = computed(() => Object.keys(slots).filter((k) => k.startsWith('body-')));

        return {
            colorSchemeClass,
            headerSlots,
            bodySlots,
        };
    },
});
</script>

<style src="./VsTable.css" />
