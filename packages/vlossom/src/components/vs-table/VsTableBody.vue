<template>
    <draggable
        tag="tbody"
        v-model="displayedRows"
        v-bind="DEFAULT_SORTABLE_OPTIONS"
        :id
        :class="[TABLE_DRAG_WRAPPER_CLASS, 'vs-table-body']"
        :item-key="getRowKey"
        :disabled="loading"
        @update="handleDragUpdate"
    >
        <template #item="{ element, index }">
            <vs-table-body-row
                :row="element"
                :rowIdx="index"
                @click-cell="clickCell"
                @click-row="clickRow"
                @select-row="selectRow"
                @expand-row="expandRow"
            >
                <template v-for="name in bodySlots" #[name]="slotData">
                    <slot :name v-bind="slotData || {}" />
                </template>
            </vs-table-body-row>
        </template>
    </draggable>

    <tbody class="vs-table-tbody" v-if="displayedRows.length === 0">
        <tr class="vs-table-body-row">
            <td class="vs-table-td vs-table-no-data-cell" colspan="100%">
                <div class="vs-table-no-data">
                    <template v-if="loading">
                        <vs-loading :color-scheme />
                    </template>
                    <template v-else-if="$slots['empty']">
                        <slot name="empty" />
                    </template>
                    <template v-else>
                        <BanIcon class="vs-table-no-data-icon" />
                        <p class="vs-table-no-data-text">NO DATA</p>
                    </template>
                </div>
            </td>
        </tr>
    </tbody>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, watch, type ComputedRef } from 'vue';
import type { ColorScheme } from '@/declaration';
import { TABLE_COLOR_SCHEME_TOKEN, type VsTableBodyCell, type VsTableRow } from './types';
import { DEFAULT_SORTABLE_OPTIONS, TABLE_DRAG_WRAPPER_CLASS, VS_TABLE_BODY_SLOT_PREFIXES } from './constants';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import draggable from 'vuedraggable/src/vuedraggable';
import type { SortableEvent } from 'sortablejs';

import { BanIcon } from '@lucide/vue';
import VsLoading from '@/components/vs-loading/VsLoading.vue';
import VsTableBodyRow from './VsTableBodyRow.vue';

export default defineComponent({
    components: {
        VsLoading,
        VsTableBodyRow,
        BanIcon,
        draggable,
    },
    props: {
        id: { type: String, default: '' },
    },
    emits: ['click-cell', 'click-row', 'select-row', 'expand-row', 'drag'],
    setup(props, { slots, emit }) {
        const { bodyRows, loading } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const colorScheme = inject<ComputedRef<ColorScheme | undefined>>(TABLE_COLOR_SCHEME_TOKEN);

        const bodySlots = computed(() =>
            Object.keys(slots).filter((slotName) =>
                VS_TABLE_BODY_SLOT_PREFIXES.some((whitelist) => slotName.startsWith(whitelist)),
            ),
        );

        // NOTE: These values are arrays used to represent the **draggable** view.
        const displayOrder = ref<number[]>([]);
        const displayedRows = computed<VsTableRow[]>({
            get(): VsTableRow[] {
                const base = bodyRows.value;
                if (displayOrder.value.length === 0) {
                    return base;
                }
                return displayOrder.value.map((idx) => base[idx]);
            },
            set(newRows: VsTableRow[]): void {
                const baseKeys = bodyRows.value.map((row) => row.key);

                displayOrder.value = newRows.map((row) => baseKeys.indexOf(row.key)).filter((idx) => idx !== -1);
            },
        });

        function getRowKey(row: VsTableRow): string {
            return row.key;
        }

        function clickCell(cell: VsTableBodyCell, event: MouseEvent): void {
            emit('click-cell', { ...cell }, event);
        }

        function clickRow(item: VsTableBodyCell['item'], index: number, event: MouseEvent): void {
            emit('click-row', item, index, event);
        }

        function selectRow(row: VsTableBodyCell[], event: MouseEvent): void {
            emit('select-row', row, event);
            emit('click-cell', { ...row[0] }, event);
        }

        function expandRow(row: VsTableBodyCell[], event: MouseEvent): void {
            emit('expand-row', row, event);
        }

        function handleDragUpdate(event: SortableEvent): void {
            emit('drag', event);
        }

        watch(
            bodyRows,
            (rows) => {
                displayOrder.value = rows.map((_, idx) => idx);
            },
            { immediate: true },
        );

        return {
            DEFAULT_SORTABLE_OPTIONS,
            TABLE_DRAG_WRAPPER_CLASS,
            bodySlots,
            colorScheme,
            displayedRows,
            getRowKey,
            loading,
            clickCell,
            clickRow,
            selectRow,
            expandRow,
            handleDragUpdate,
        };
    },
});
</script>
