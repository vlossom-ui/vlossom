<template>
    <tbody>
        <template v-if="bodyCells.length">
            <template v-for="(cells, rowIdx) in bodyCells" :key="rowIdx">
                <tr>
                    <td v-if="anySelectable" class="w-10" @click.prevent.stop="selectRow(cells, $event)">
                        <slot name="select" :cells :rowIdx>
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

                    <td v-if="anyExpandable" class="w-10">
                        <vs-button @click.prevent.stop="expandRow(cells, $event)">
                            <vs-render
                                :class="{
                                    'rotate-180': isExpanded(cells),
                                    'transition-transform': true,
                                }"
                                :content="tableIcons.expandArrow"
                            />
                        </vs-button>
                    </td>
                </tr>
                <tr>
                    <td colspan="100%" class="!p-0">
                        <vs-expandable :open="isExpanded(cells)">
                            <slot name="expand" :cells :rowIdx />
                        </vs-expandable>
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
import { defineComponent, inject } from 'vue';
import { stringUtil } from '@/utils';
import { type BodyCell, getRowId, getRowItem } from './types';
import { tableIcons } from './icons';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

export default defineComponent({
    emits: ['click-cell', 'select-row', 'expand-row'],
    setup(_props, { emit, slots }) {
        const { items, bodyCells, anySelectable, selectable, selectedIds, anyExpandable, isExpanded, toggleExpand } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

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

        function isRowSelectable(row: BodyCell[], rowIdx: number): boolean {
            const item = getRowItem(row);
            return selectable.value(item, rowIdx, items.value);
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
            if (!toggleExpand(row)) {
                return;
            }
            emit('expand-row', row, event);
        }

        return {
            bodyCells,
            anySelectable,
            anyExpandable,
            isExpanded,
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
