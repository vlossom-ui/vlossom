<template>
    <thead>
        <template v-if="headerCells.length">
            <tr :style="headerStyle">
                <vs-table-drag-cell :cells="headerCells" :rowIdx="HEADER_ROW_INDEX" />
                <vs-table-checkbox-cell :cells="headerCells" :rowIdx="HEADER_ROW_INDEX" @select-row="selectRow">
                    <template #select="{ cells, rowIdx }">
                        <slot name="select" :cells :rowIdx />
                    </template>
                </vs-table-checkbox-cell>
                <th
                    v-for="(header, index) in headerCells"
                    :key="header.id"
                    :id="header.id"
                    :style="getCellStyle(index)"
                    @click.prevent.stop="clickCell(header, $event)"
                >
                    <slot :name="findMatchingSlotName(header)" :header>
                        <div>
                            {{ header.value }}
                            <vs-render
                                v-if="header.sortable"
                                class="inline-block shrink-0 cursor-pointer align-middle"
                                :content="getSortIcon(header)"
                                @click="updateSortType(header.colKey)"
                            />
                        </div>
                    </slot>
                </th>
                <vs-table-expand-cell :cells="headerCells" :rowIdx="HEADER_ROW_INDEX" />
            </tr>
        </template>
    </thead>
</template>

<script lang="ts">
import { defineComponent, inject, computed, type ComputedRef, type CSSProperties } from 'vue';
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
        const { headerCells, anyExpandable, anySelectable, draggable, sortType, sortColumn, updateSortType, columns } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);

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
        const headerStyle = computed(() => ({
            ...tableStyleSet?.value?.row,
            ...tableStyleSet?.value?.header,
            ...gridStyle.value,
        }));

        function getCellStyle(index: number): CSSProperties {
            return {
                ...cellStyle.value,
                width: columns.value?.[index]?.width,
                maxWidth: columns.value?.[index]?.maxWidth,
                minWidth: columns.value?.[index]?.minWidth,
                textAlign: columns.value?.[index]?.align,
            };
        }

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
            findMatchingSlotName,
            clickCell,
            selectRow,
            getSortIcon,
            updateSortType,
            headerStyle,
            getCellStyle,
        };
    },
});
</script>
