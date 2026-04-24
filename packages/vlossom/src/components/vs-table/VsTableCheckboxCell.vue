<template>
    <template v-if="isBodyRow(cells)">
        <td class="vs-table-td" v-if="anySelectable" :style="cellStyle" @click.prevent.stop="selectRow(cells, $event)">
            <slot name="select" :item="getRowItem(cells)" :value="isSelected(cells)" :rowIdx>
                <vs-checkbox
                    v-if="isRowSelectable(cells, rowIdx)"
                    multiple
                    :color-scheme
                    :disabled="loading"
                    v-model="selectedItems"
                    :true-value="getRowItem(cells)"
                    @toggle="selectRow(cells, $event)"
                />
            </slot>
        </td>
    </template>

    <template v-else>
        <th class="vs-table-th" v-if="anySelectable" :style="cellStyle" @click.prevent.stop="selectRow(cells, $event)">
            <slot name="select" :item="null" :value="isSelected(cells)" :rowIdx="HEADER_ROW_INDEX">
                <vs-checkbox
                    :style-set="headerCheckboxStyle"
                    :color-scheme
                    :model-value="selectedAll"
                    :disabled="loading"
                    :indeterminate="selectedPartial"
                    @toggle="selectRow(cells, $event)"
                />
            </slot>
        </th>
    </template>
</template>

<script lang="ts">
import { computed, defineComponent, inject, type ComputedRef, type PropType } from 'vue';
import type { ColorScheme } from '@/declaration';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import type { VsCheckboxStyleSet } from './../vs-checkbox/types';
import { HEADER_ROW_INDEX } from './models/strategy';
import {
    getRowItem,
    type VsTableCell,
    isVsTableBodyRow,
    TABLE_STYLE_SET_TOKEN,
    TABLE_COLOR_SCHEME_TOKEN,
    type VsTableStyleSet,
} from './types';

import VsCheckbox from '@/components/vs-checkbox/VsCheckbox.vue';

export default defineComponent({
    components: { VsCheckbox },
    props: {
        cells: {
            type: Array as PropType<VsTableCell[]>,
            default: () => [],
        },
        rowIdx: { type: Number, required: true },
    },
    emits: ['select-row'],
    setup(props, { emit }) {
        const {
            anySelectable,
            selectedItems,
            selectable,
            items,
            selectedAll,
            selectedPartial,
            toggleSelectAll,
            loading,
            primary,
            columns,
        } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);
        const colorScheme = inject<ComputedRef<ColorScheme | undefined>>(TABLE_COLOR_SCHEME_TOKEN);

        const cellStyle = computed(() => tableStyleSet?.value?.cell);
        const headerCheckboxStyle = computed<VsCheckboxStyleSet>(() => {
            if (!primary?.value) {
                return {};
            }
            return {
                variables: {
                    checkboxColor: 'var(--vs-cs-bg-area)',
                    checkboxCheckedColor: 'var(--vs-cs-font-colored)',
                },
            };
        });

        function isRowSelectable(row: VsTableCell[], rowIdx: number): boolean {
            if (!isVsTableBodyRow(row)) {
                return false;
            }
            const item = getRowItem(row);
            return selectable.value(item, rowIdx, items.value);
        }

        function isSelected(row: VsTableCell[]): boolean {
            if (isVsTableBodyRow(row)) {
                return selectedItems.value.includes(getRowItem(row));
            }
            return selectedAll.value || selectedPartial.value;
        }

        function selectRow(row: VsTableCell[], event: MouseEvent): void {
            if (!isVsTableBodyRow(row)) {
                toggleSelectAll();
                emit('select-row', row, event);
                return;
            }
            const item = getRowItem(row);
            const rowIdx = row[0]?.rowIdx;
            if (!item || !selectable.value(item, rowIdx, items.value)) {
                return;
            }
            emit('select-row', row, event);
        }

        return {
            HEADER_ROW_INDEX,
            isBodyRow: isVsTableBodyRow,
            getRowItem,
            isSelected,
            isRowSelectable,
            selectRow,
            anySelectable,
            selectedItems,
            selectedAll,
            selectedPartial,
            cellStyle,
            loading,
            primary,
            headerCheckboxStyle,
            colorScheme,
            columns,
        };
    },
});
</script>
