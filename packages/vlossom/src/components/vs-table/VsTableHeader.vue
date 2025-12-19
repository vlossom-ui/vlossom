<template>
    <thead>
        <template v-if="headerCells.length">
            <tr>
                <th v-for="header in headerCells" :key="header.id" :id="header.id">
                    <slot :name="findMatchingSlotName(header)" :header="header">
                        {{ header.value }}
                    </slot>
                </th>
            </tr>
        </template>

        <template v-else>
            <tr>
                <td colspan="100%" />
            </tr>
        </template>
    </thead>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { stringUtil } from '@/utils';
import type { HeaderCell } from './types';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

export default defineComponent({
    setup(_props, { slots }) {
        const { headerCells } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

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

        return {
            headerCells,
            findMatchingSlotName,
        };
    },
});
</script>
