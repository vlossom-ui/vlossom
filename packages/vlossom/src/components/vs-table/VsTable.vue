<template>
    <div class="vs-table">
        {{ 'VsTable' }}
    </div>
</template>

<script lang="ts">
import { defineComponent, provide, type PropType } from 'vue';
import { VsComponent } from '@/declaration';
import { logUtil } from '@/utils';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useTable } from './composables/table-composable';
import type { ColumnDef, Item, VsTableStyleSet } from './types';

const componentName = VsComponent.VsTable;

export default defineComponent({
    name: componentName,
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
    setup(props) {
        const TABLE_COMPOSABLE_TOKEN = Symbol('TABLE_COMPOSABLE_TOKEN');
        const table = useTable(props);

        provide(TABLE_COMPOSABLE_TOKEN, table);

        return {
            TABLE_COMPOSABLE_TOKEN,
        };
    },
});
</script>

<style src="./VsTable.css" />
