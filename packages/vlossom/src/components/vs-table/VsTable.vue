<template>
    <div class="vs-table">
        {{ 'VsTable' }}
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { VsComponent } from '@/declaration';
import { logUtil } from '@/utils';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import type { ColumnDef, RowDef, VsTableStyleSet } from './types';

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
        row: {
            type: Object as PropType<RowDef | null>,
            default: () => null,
        },
        items: {
            type: Array as PropType<Record<string, unknown>[]>,
            required: true,
            validator: (value: Record<string, unknown>[]) => {
                if (!Array.isArray(value)) {
                    logUtil.propError(componentName, 'items', 'items must be an array');
                    return false;
                }
                return true;
            },
        },
    },
    emits: [],
});
</script>

<style src="./VsTable.css" />
