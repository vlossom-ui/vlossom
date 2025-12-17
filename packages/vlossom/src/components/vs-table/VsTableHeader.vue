<template>
    <thead>
        <template v-if="headerCells.length">
            <tr>
                <th v-for="header in headerCells" :key="header.name">
                    <slot :name="header.name" :header="header">
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

export default defineComponent({
    setup() {
        const { headerCells } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;

        return {
            headerCells,
        };
    },
});
</script>
