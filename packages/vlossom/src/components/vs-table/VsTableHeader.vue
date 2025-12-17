<template>
    <thead>
        <template v-if="headerCells.length">
            <tr>
                <th v-for="header in headerCells" :key="header.id">
                    <slot :name="findMatchingSlotName(header)" :header="header.value">
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
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import type { HeaderCell } from '..';

export default defineComponent({
    setup(_props, { slots }) {
        const { headerCells } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        function findMatchingSlotName(header: HeaderCell): string {
            const { id, colKey } = header;
            const cadidatePriority = [`header-${id}`, `header-${colKey}`]
                .map((name) => name.toLowerCase())
                .filter((name) => name in slots);

            return cadidatePriority[0] || '';
        }

        return {
            headerCells,
            findMatchingSlotName,
        };
    },
});
</script>
