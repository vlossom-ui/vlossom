<template>
    <div class="flex flex-col gap-4 p-4">
        <h1 class="text-2xl font-bold">VsTable</h1>
        <VsTable :columns="columns" :items="items" />

        <h1 class="text-2xl font-bold">VsTable with selectable rows</h1>
        <VsTable :columns="columns" :row="{ selectable: true }" :items="items" />

        <h1 class="text-2xl font-bold">VsTable with custom selectable rows</h1>
        <VsTable :columns="columns" :row="row" :items="items" />

        <h1 class="text-2xl font-bold">VsTable with no items (has header but no body)</h1>
        <VsTable :columns="columns" :items="[]" />

        <h1 class="text-2xl font-bold">VsTable with no columns and items</h1>
        <VsTable :items="[]" />

        <h1 class="text-2xl font-bold">VsTable with no columns</h1>
        <VsTable :columns="null" :items="items" />

        <h1 class="text-2xl font-bold">VsTable with string columns</h1>
        <VsTable :columns="columns.map((column) => column.key)" :items="items" />

        <h1 class="text-2xl font-bold">VsTable with custom SLOTs</h1>
        <VsTable :columns="columns" :items="items">
            <template #caption>
                <span class="font-bold text-blue-500">Custom Caption</span>
            </template>
            <template #header-name="{ header }">
                <span class="flex items-center gap-2 text-amber-700">
                    {{ header.value }} <span class="text-xs font-semibold">custom</span>
                </span>
            </template>
            <template #body-name-item-1="{ item }">
                <span class="font-semibold text-red-500">Custom Body {{ item.name }}</span>
            </template>
            <template #body-age="{ item }">
                <span class="font-semibold text-yellow-500">{{ item.age }}</span>
            </template>
            <template #body-metadata-email-item-1="{ item }">
                <vs-input
                    v-if="janesEmailEditingMode"
                    v-model="item.metadata.email"
                    @blur="toggleJaneEmailEditingMode"
                />
                <span v-else @click="toggleJaneEmailEditingMode">{{ item.metadata.email }}</span>
            </template>
            <template #body-metadata-email-2="{ item }">
                <span class="text-green-500">Custom Body {{ item.metadata }}</span>
            </template>
        </VsTable>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const columns = reactive([
            { key: 'name', label: 'Name' },
            { key: 'age', label: 'Age', sortable: true },
            { key: 'metadata.email', label: 'Email', sortable: true },
        ]);
        const items = reactive([
            { name: 'John', age: 30, metadata: { email: 'john@example.com' } },
            { name: 'Jane', age: 25, metadata: { email: 'jane@example.com' } },
            { name: 'Jim', age: 35, metadata: { email: 'jim@example.com' } },
        ]);
        const row = reactive({
            selectable: (item: Record<string, unknown>) => {
                return item.name !== 'Jane';
            },
        });

        const janesEmailEditingMode = ref(false);

        function toggleJaneEmailEditingMode(): void {
            janesEmailEditingMode.value = !janesEmailEditingMode.value;
        }

        return {
            columns,
            items,
            row,
            janesEmailEditingMode,
            toggleJaneEmailEditingMode,
        };
    },
});
</script>
