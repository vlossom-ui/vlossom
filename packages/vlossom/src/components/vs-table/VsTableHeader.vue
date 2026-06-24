<template>
    <thead class="vs-table-thead">
        <template v-if="headerCells.length">
            <tr class="vs-table-header-row" :style="headerStyle">
                <vs-table-drag-cell :cells="headerCells" :rowIdx="HEADER_ROW_INDEX" />
                <vs-table-checkbox-cell :cells="headerCells" :rowIdx="HEADER_ROW_INDEX" @select-row="selectRow">
                    <template #select="slotData">
                        <slot name="select" v-bind="slotData" />
                    </template>
                </vs-table-checkbox-cell>
                <th
                    class="vs-table-th"
                    v-for="(header, index) in headerCells"
                    :key="header.id"
                    :id="header.id"
                    :style="getCellStyle(index)"
                    @click.prevent.stop="clickCell(header, $event)"
                >
                    <slot
                        :name="findMatchingSlotName(header)"
                        :item="columns?.[header.colIdx]"
                        :value="header.value"
                        :colIdx="header.colIdx"
                        :rowIdx="header.rowIdx"
                    >
                        <div>
                            {{ header.value }}
                            <component
                                :is="getSortIcon(header)"
                                v-if="header.sortable"
                                class="vs-table-sort-icon"
                                @click="updateSortType(header.colKey)"
                            />
                        </div>
                    </slot>
                </th>
                <vs-table-expand-cell v-if="showExpand" :cells="headerCells" :rowIdx="HEADER_ROW_INDEX" />
            </tr>
        </template>
    </thead>
</template>

<script lang="ts">
import { defineComponent, inject, computed, type Component, type ComputedRef, type CSSProperties } from 'vue';
import { objectUtil } from '@/utils';
import {
    VsTableSortType,
    TABLE_STYLE_SET_TOKEN,
    type VsTableHeaderCell,
    type VsTableStyleSet,
} from './types';
import { HEADER_ROW_INDEX } from './models/strategy';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '@lucide/vue';
import VsTableDragCell from './VsTableDragCell.vue';
import VsTableExpandCell from './VsTableExpandCell.vue';
import VsTableCheckboxCell from './VsTableCheckboxCell.vue';

export default defineComponent({
    components: {
        VsTableDragCell,
        VsTableExpandCell,
        VsTableCheckboxCell,
    },
    emits: ['click-cell', 'select-row'],
    setup(props, { slots, emit }) {
        const { headerCells, columns, anyExpandable, sortType, sortColumn, updateSortType } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);

        const showExpand = computed(() => anyExpandable.value && !!slots.expand);
        const cellStyle = computed<CSSProperties | undefined>(() => tableStyleSet?.value?.$cell);
        const headerStyle = computed<CSSProperties | undefined>(() => {
            const { $selected, ...baseRow } = tableStyleSet?.value?.$row ?? {};
            return objectUtil.assign(baseRow, tableStyleSet?.value?.$header ?? {});
        });

        function getCellStyle(index: number): CSSProperties {
            const align = columns.value?.[index]?.headerAlign;
            const justifyContentMap: Record<string, string> = {
                left: 'flex-start',
                center: 'center',
                right: 'flex-end',
            };
            return {
                ...cellStyle.value,
                textAlign: align,
                justifyContent: align ? justifyContentMap[align] : undefined,
            };
        }

        function findMatchingSlotName(header: VsTableHeaderCell): string {
            const { id, colIdx, rowIdx, colKey } = header;
            const candidatePriority = [
                `header-${id}`,
                `header-${colKey}`,
                `header-col${colIdx}-row${rowIdx}`,
                `header-row${rowIdx}`,
                `header-col${colIdx}`,
                'header',
            ].filter((name) => name in slots);

            return candidatePriority[0] || '';
        }

        function getSortIcon(header: VsTableHeaderCell): Component {
            if (!header.sortable) {
                return ArrowUpDownIcon;
            }
            if (header.colKey !== sortColumn.value?.key) {
                return ArrowUpDownIcon;
            }
            if (sortType.value === VsTableSortType.ASCEND) {
                return ArrowUpIcon;
            }
            if (sortType.value === VsTableSortType.DESCEND) {
                return ArrowDownIcon;
            }
            return ArrowUpDownIcon;
        }

        function clickCell(cell: VsTableHeaderCell, event: MouseEvent): void {
            emit('click-cell', { ...cell }, event);
        }

        function selectRow(row: VsTableHeaderCell[], event: MouseEvent): void {
            emit('select-row', row, event);
            emit('click-cell', { ...row[0] }, event);
        }

        return {
            HEADER_ROW_INDEX,
            headerCells,
            findMatchingSlotName,
            showExpand,
            clickCell,
            selectRow,
            getSortIcon,
            updateSortType,
            columns,
            headerStyle,
            getCellStyle,
        };
    },
});
</script>
