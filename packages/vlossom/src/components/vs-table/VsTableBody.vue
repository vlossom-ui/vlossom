<template>
    <tbody>
        <template v-if="bodyCells.length">
            <template v-for="(cells, rowIdx) in bodyCells" :key="rowIdx">
                <tr>
                    <td v-if="anySelectable" class="w-10" @click.prevent.stop="selectRow(cells, $event)">
                        <slot name="selectable" :item="getRowItem(cells)" :rowIdx>
                            <vs-checkbox
                                v-if="isRowSelectable(cells, rowIdx)"
                                multiple
                                v-model="selectedIds"
                                :true-value="getRowId(cells)"
                                @toggle="selectRow(cells, $event)"
                            />
                        </slot>
                    </td>

                    <td
                        v-for="cell in cells"
                        :id="cell.id"
                        :key="cell.id"
                        @click.prevent.stop="clickCell(cell, $event)"
                    >
                        <slot :name="findMatchingSlotName(cell)" :item="cell.item">
                            {{ cell.value }}
                        </slot>
                    </td>

                    <td v-if="anyExpandable" class="w-10" @click.prevent.stop="expandRow(cells, $event)">
                        <vs-button>
                            {{ 'EXPAND' }}
                        </vs-button>
                    </td>
                </tr>
                <tr>
                    <td class="expand" colspan="100%">
                        <slot name="expend" :item="getRowItem(cells)" :rowIdx>
                            <vs-expandable :open="expanded.has(getRowId(cells))">
                                <div>
                                    <p>EXPANDED</p>
                                </div>
                            </vs-expandable>
                        </slot>
                    </td>
                </tr>
            </template>
        </template>

        <template v-else>
            <tr>
                <td colspan="100%" class="h-52">
                    <div class="flex flex-col items-center justify-center text-gray-700">
                        <vs-render :content="tableIcons.noData" />
                        <p class="text-xl font-bold">NO DATA</p>
                    </div>
                </td>
            </tr>
        </template>
    </tbody>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue';
import { stringUtil } from '@/utils';
import type { BodyCell, Item } from './types';
import { tableIcons } from './icons';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

export default defineComponent({
    emits: ['click-cell', 'select-row', 'expand-row'],
    setup(_props, { emit, slots }) {
        const { items, bodyCells, anySelectable, selectable, selectedIds, expandable } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        const expanded = ref(new Set());
        const anyExpandable = computed(() => items.value.some(expandable.value));

        function findMatchingSlotName(cell: BodyCell): string {
            const { id, colIdx, rowIdx, colKey } = cell;

            const candidatePriority = [
                `body-${id}`,
                `body-${stringUtil.kebabCase(colKey)}`,
                `body-col${colIdx}-row${rowIdx}`,
                `body-row${rowIdx}`,
                `body-col${colIdx}`,
                'body',
            ]
                .map((name) => name.toLowerCase())
                .filter((name) => name in slots);

            return candidatePriority[0] || '';
        }

        function clickCell(cell: BodyCell, event: MouseEvent): void {
            emit('click-cell', { ...cell }, event);
        }

        function getRowItem(row: BodyCell[]): Item {
            const anyCell = row[0];
            if (!anyCell) {
                return {};
            }
            return anyCell.item;
        }

        function isRowSelectable(row: BodyCell[], rowIdx: number): boolean {
            const item = getRowItem(row);
            return selectable.value(item, rowIdx, items.value);
        }

        function getRowId(row: BodyCell[]): string | number | undefined {
            return getRowItem(row)?.id;
        }

        function selectRow(row: BodyCell[], event: MouseEvent): void {
            const anyCell = row[0];
            if (!anyCell || !selectable.value(anyCell.item, anyCell.rowIdx, items.value)) {
                return;
            }

            emit('select-row', row, event);
            emit('click-cell', { ...anyCell }, event);
        }

        function expandRow(row: BodyCell[], event: MouseEvent): void {
            const rowId = getRowId(row);
            if (!rowId) {
                return;
            }

            emit('expand-row', row, event);
            if (expanded.value.has(rowId)) {
                expanded.value.delete(rowId);
            } else {
                expanded.value.add(rowId);
            }
        }

        return {
            bodyCells,
            anySelectable,
            anyExpandable,
            expanded,
            items,
            selectedIds,
            selectable,
            tableIcons,
            clickCell,
            findMatchingSlotName,
            getRowItem,
            isRowSelectable,
            getRowId,
            selectRow,
            expandRow,
        };
    },
});
</script>
