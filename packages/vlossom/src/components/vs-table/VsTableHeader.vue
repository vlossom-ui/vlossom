<template>
    <thead>
        <template v-if="headerCells.length">
            <tr :style="{ ...gridStyle, ...rowStyle }">
                <vs-table-drag-cell :cells="headerCells" :rowIdx="HEADER_ROW_INDEX" />
                <vs-table-checkbox-cell :cells="headerCells" :rowIdx="HEADER_ROW_INDEX" @select-row="selectRow">
                    <template #select="{ cells, rowIdx }">
                        <slot name="select" :cells :rowIdx />
                    </template>
                </vs-table-checkbox-cell>
                <th
                    v-for="header in headerCells"
                    :key="header.id"
                    :id="header.id"
                    :style="cellStyle"
                    @click.prevent.stop="clickCell(header, $event)"
                >
                    <slot :name="findMatchingSlotName(header)" :header>
                        {{ header.value }}
                        <vs-render
                            v-if="header.sortable"
                            class="w-auto! shrink-0 cursor-pointer"
                            :content="getSortIcon(header)"
                            @click="updateSortType(header.colKey)"
                        />
                    </slot>
                </th>
                <vs-table-expand-cell :cells="headerCells" :rowIdx="HEADER_ROW_INDEX" />
            </tr>
        </template>
    </thead>
</template>

<script lang="ts">
import { defineComponent, inject, computed, type ComputedRef } from 'vue';
import { stringUtil } from '@/utils';
import { SortType, TABLE_STYLE_SET_TOKEN, type HeaderCell, type VsTableStyleSet } from './types';
import { HEADER_ROW_INDEX } from './models/strategy';
import { tableIcons } from './icons';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

import VsRender from '@/components/vs-render/VsRender.vue';
import VsTableDragCell from './VsTableDragCell.vue';
import VsTableExpandCell from './VsTableExpandCell.vue';
import VsTableCheckboxCell from './VsTableCheckboxCell.vue';

export default defineComponent({
    components: {
        VsRender,
        VsTableDragCell,
        VsTableExpandCell,
        VsTableCheckboxCell,
    },
    emits: ['click-cell', 'select-row'],
    setup(_props, { slots, emit }) {
        const { headerCells, anyExpandable, anySelectable, draggable, sortType, sortColumn, updateSortType } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);

        const rowStyle = computed(() => tableStyleSet?.value?.row);
        const cellStyle = computed(() => tableStyleSet?.value?.cell);
        const gridStyle = computed(() => {
            const cols: string[] = [];
            if (draggable?.value) {
                cols.push('auto');
            }
            if (anySelectable.value) {
                cols.push('auto');
            }
            headerCells.value.forEach(() => {
                cols.push('1fr');
            });
            if (anyExpandable.value) {
                cols.push('auto');
            }
            return {
                gridTemplateColumns: cols.join(' '),
            };
        });

        function findMatchingSlotName(header: HeaderCell): string {
            const { id, colIdx, rowIdx, colKey } = header;
            const candidatePriority = [
                `header-${id}`,
                `header-${stringUtil.kebabCase(colKey)}`,
                `header-col${colIdx}-row${rowIdx}`,
                `header-row${rowIdx}`,
                `header-col${colIdx}`,
                'header',
            ].filter((name) => name in slots);

            return candidatePriority[0] || '';
        }

        function getSortIcon(header: HeaderCell) {
            if (!header.sortable) {
                return '';
            }
            if (header.colKey !== sortColumn.value?.key) {
                return tableIcons.sortNone;
            }
            if (sortType.value === SortType.ASCEND) {
                return tableIcons.sortAsc;
            }
            if (sortType.value === SortType.DESCEND) {
                return tableIcons.sortDesc;
            }
            return tableIcons.sortNone;
        }

        function clickCell(cell: HeaderCell, event: MouseEvent): void {
            emit('click-cell', { ...cell }, event);
        }

        function selectRow(row: HeaderCell[], event: MouseEvent): void {
            emit('select-row', row, event);
            emit('click-cell', { ...row[0] }, event);
        }

        return {
            HEADER_ROW_INDEX,
            headerCells,
            gridStyle,
            findMatchingSlotName,
            clickCell,
            selectRow,
            getSortIcon,
            updateSortType,
            rowStyle,
            cellStyle,
        };
    },
});
</script>
