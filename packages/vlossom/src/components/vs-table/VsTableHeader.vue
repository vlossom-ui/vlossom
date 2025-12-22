<template>
    <thead>
        <template v-if="headerCells.length">
            <tr>
                <th v-if="anySelectable" class="w-10" @click.prevent.stop="selectRow(headerCells, $event)">
                    <slot name="selectable" :cells="headerCells" :rowIdx="HEADER_ROW_INDEX">
                        <vs-checkbox
                            :model-value="selectedAll"
                            :indeterminate="selectedPartial"
                            @toggle="toggleSelectAll"
                        />
                    </slot>
                </th>

                <th
                    v-for="header in headerCells"
                    :key="header.id"
                    :id="header.id"
                    @click.prevent.stop="clickCell(header, $event)"
                >
                    <slot :name="findMatchingSlotName(header)" :header>
                        {{ header.value }}
                        <vs-render
                            v-if="header.sortable"
                            class="inline"
                            :content="getSortIcon(header)"
                            @click="updateSortType(header.colKey)"
                        />
                    </slot>
                </th>
            </tr>
        </template>

        <template v-else>
            <tr>
                <th colspan="100%" class="h-10" />
            </tr>
        </template>
    </thead>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { stringUtil } from '@/utils';
import { SortType, type HeaderCell } from './types';
import { HEADER_ROW_INDEX } from './models/strategy';
import { tableIcons } from './icons';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

export default defineComponent({
    emits: ['click-cell', 'select-row'],
    setup(_props, { slots, emit }) {
        const {
            headerCells,
            anySelectable,
            selectedAll,
            selectedPartial,
            toggleSelectAll,
            sortType,
            sortColumn,
            updateSortType,
        } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        function findMatchingSlotName(header: HeaderCell): string {
            const { id, colIdx, rowIdx, colKey } = header;
            const candidatePriority = [
                `header-${id}`,
                `header-${stringUtil.kebabCase(colKey)}`,
                `header-col${colIdx}-row${rowIdx}`,
                `header-row${rowIdx}`,
                `header-col${colIdx}`,
                'header',
            ]
                .map((name) => name.toLowerCase())
                .filter((name) => name in slots);

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
            emit('click-cell', event, { ...cell });
        }

        function selectRow(row: HeaderCell[], event: MouseEvent): void {
            toggleSelectAll();
            emit('select-row', event, row);
            emit('click-cell', event, { ...row[0] });
        }

        return {
            HEADER_ROW_INDEX,
            anySelectable,
            headerCells,
            selectedAll,
            selectedPartial,
            toggleSelectAll,
            findMatchingSlotName,
            clickCell,
            selectRow,
            getSortIcon,
            updateSortType,
        };
    },
});
</script>
