<template>
    <template v-if="isBodyRow(cells)">
        <td v-if="anySelectable" :style="cellStyle" @click.prevent.stop="selectRow(cells, $event)">
            <slot name="select" :cells :rowIdx>
                <vs-checkbox
                    v-if="isRowSelectable(cells, rowIdx)"
                    multiple
                    :disabled="loading"
                    v-model="selectedItems"
                    :true-value="getRowItem(cells)"
                    @toggle="selectRow(cells, $event)"
                />
            </slot>
        </td>
    </template>

    <template v-else>
        <th v-if="anySelectable" :style="cellStyle" @click.prevent.stop="selectRow(cells, $event)">
            <slot name="select" :cells :rowIdx>
                <vs-checkbox
                    :style-set="headerCheckboxStyle"
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
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import type { VsCheckboxStyleSet } from '../vs-checkbox/types';
import { getRowItem, type Cell, isBodyRow, TABLE_STYLE_SET_TOKEN, type VsTableStyleSet } from './types';

import VsCheckbox from '@/components/vs-checkbox/VsCheckbox.vue';

export default defineComponent({
    components: {
        VsCheckbox,
    },
    props: {
        cells: {
            type: Array as PropType<Cell[]>,
            default: () => [],
        },
        rowIdx: { type: Number, default: 0 },
    },
    emits: ['select-row'],
    setup(_props, { emit }) {
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
        } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);

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

        function isRowSelectable(row: Cell[], rowIdx: number): boolean {
            if (!isBodyRow(row)) {
                return false;
            }
            const item = getRowItem(row);
            return selectable.value(item, rowIdx, items.value);
        }

        function selectRow(row: Cell[], event: MouseEvent): void {
            if (!isBodyRow(row)) {
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
            isBodyRow,
            getRowItem,
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
        };
    },
});
</script>
