<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <div class="sandbox flex flex-col gap-8 p-4">
            <h1 class="text-2xl font-bold">Sandbox — VsTable sizes</h1>

            <section v-for="size in sizes" :key="`table-${size}`" class="flex flex-col gap-2">
                <h2 class="text-lg font-semibold">VsTable size = "{{ size }}"</h2>
                <vs-table :columns="columns" :items :size="size">
                    <template #expand="{ item }">
                        <div>{{ item.name }} — score {{ item.score }}</div>
                    </template>
                </vs-table>
            </section>

            <h1 class="mt-8 text-2xl font-bold">VsButton sizes</h1>
            <section v-for="size in sizes" :key="`button-${size}`" class="flex flex-col gap-2">
                <h2 class="text-lg font-semibold">size = "{{ size }}"</h2>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-button :size="size">Default</vs-button>
                    <vs-button :size="size" primary>Primary</vs-button>
                    <vs-button :size="size" outline>Outline</vs-button>
                    <vs-button :size="size" ghost>Ghost</vs-button>
                    <vs-button :size="size" loading>Loading</vs-button>
                    <vs-button :size="size" disabled>Disabled</vs-button>
                </div>
            </section>

            <h1 class="mt-8 text-2xl font-bold">VsChip sizes</h1>
            <section v-for="size in sizes" :key="`chip-${size}`" class="flex flex-col gap-2">
                <h2 class="text-lg font-semibold">size = "{{ size }}"</h2>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-chip :size="size">Default</vs-chip>
                    <vs-chip :size="size" primary>Primary</vs-chip>
                </div>
            </section>

            <h1 class="mt-8 text-2xl font-bold">VsTabs sizes</h1>
            <section v-for="size in sizes" :key="`tabs-${size}`" class="flex flex-col gap-2">
                <h2 class="text-lg font-semibold">size = "{{ size }}"</h2>
                <vs-tabs :tabs="tabs" :size="size" controls="show" />
            </section>

            <h1 class="mt-8 text-2xl font-bold">VsLabelValue sizes</h1>
            <section v-for="size in sizes" :key="`label-value-${size}`" class="flex flex-col gap-2">
                <h2 class="text-lg font-semibold">size = "{{ size }}"</h2>
                <vs-label-value :size="size">
                    <template #label>Label</template>
                    Lorem ipsum dolor sit amet
                </vs-label-value>
            </section>

            <h1 class="mt-8 text-2xl font-bold">VsLabelValue sizes (vertical)</h1>
            <section v-for="size in sizes" :key="`label-value-vertical-${size}`" class="flex flex-col gap-2">
                <h2 class="text-lg font-semibold">size = "{{ size }}"</h2>
                <vs-label-value :size="size" vertical>
                    <template #label>Label</template>
                    Lorem ipsum dolor sit amet
                </vs-label-value>
            </section>

            <h1 class="mt-8 text-2xl font-bold">VsAccordion sizes</h1>
            <section v-for="size in sizes" :key="`accordion-${size}`" class="flex flex-col gap-2">
                <h2 class="text-lg font-semibold">size = "{{ size }}"</h2>
                <vs-accordion :size="size">
                    <template #title>size = "{{ size }}"</template>
                    <p>아코디언 내용입니다.</p>
                    <p>아코디언 내용입니다.</p>
                    <p>아코디언 내용입니다.</p>
                    <p>아코디언 내용입니다.</p>
                </vs-accordion>
            </section>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Size } from '@/declaration';
import type { VsTableColumnDef, VsTableItem } from '@/components';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl'];

        const columns: VsTableColumnDef[] = [
            { key: 'name', label: 'Name', sortable: true },
            { key: 'role', label: 'Role' },
            { key: 'status', label: 'Status', align: 'center' },
            { key: 'score', label: 'Score', sortable: true, align: 'center' },
        ];

        const items: VsTableItem[] = [
            { name: 'Alice', role: 'Admin', status: 'Active', score: 95 },
            { name: 'Bob', role: 'Editor', status: 'Inactive', score: 20 },
            { name: 'Charlie', role: 'Viewer', status: 'Active', score: 88 },
        ];

        const tabs = ['Home', 'Profile', 'Settings', 'Messages'];

        return { sizes, columns, items, tabs };
    },
});
</script>
