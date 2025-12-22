<template>
    <thead>
        <template v-if="headerCells.length">
            <tr>
                <th v-if="anySelectable" class="w-10" @click.prevent.stop="selectRow(headerCells, $event)">
                    <slot name="selectable" :cells="headerCells" :rowIdx="HEADER_ROW_INDEX">
                        <vs-checkbox
                            :model-value="selectedAll"
                            :indeterminate="partiallySelected"
                            @toggle="toggleSelectedAll"
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
import type { HeaderCell } from './types';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import { HEADER_ROW_INDEX } from './models/factories';

export default defineComponent({
    emits: ['click-cell', 'select-row'],
    setup(_props, { slots, emit }) {
        const { headerCells, anySelectable, selectedAll, partiallySelected, toggleSelectedAll, toggleSelectedRow } =
            inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

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

        function clickCell(cell: HeaderCell, event: MouseEvent): void {
            emit('click-cell', event, { ...cell });
        }

        function selectRow(row: HeaderCell[], event: MouseEvent): void {
            toggleSelectedAll();
            emit('select-row', event, row);
            emit('click-cell', event, { ...row[0] });
        }

        return {
            HEADER_ROW_INDEX,
            anySelectable,
            headerCells,
            selectedAll,
            partiallySelected,
            toggleSelectedAll,
            toggleSelectedRow,
            findMatchingSlotName,
            clickCell,
            selectRow,
        };
    },
});
</script>
