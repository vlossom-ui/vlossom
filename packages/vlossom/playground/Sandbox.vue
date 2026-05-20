<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <div class="sandbox flex flex-col gap-6 p-6">
            <h1>Sandbox</h1>
            <section class="flex flex-col gap-3">
                <h2>Close Icons</h2>
                <div class="flex flex-wrap items-center gap-3">
                    <vs-chip closable>Closable Chip</vs-chip>
                    <vs-input v-model="inputValue" label="Input" />
                    <vs-select v-model="selectedFruit" label="Select" :options="fruitOptions" />
                    <vs-toast :auto-close="false" primary>Toast close icon</vs-toast>
                </div>
            </section>

            <section class="flex flex-col gap-3">
                <h2>Select / File / Theme Icons</h2>
                <div class="grid grid-cols-2 gap-3">
                    <vs-select
                        v-model="selectedFruits"
                        label="Multiple Select"
                        :options="fruitOptions"
                        multiple
                        closable-chips
                    />
                    <vs-file-drop v-model="fileDropValue" label="File Drop" placeholder="Drop files here" />
                </div>
                <vs-theme-button />
            </section>

            <section class="flex flex-col gap-3">
                <h2>Message Icons</h2>
                <vs-message state="idle" text="Idle message" />
                <vs-message state="info" text="Info message" />
                <vs-message state="success" text="Success message" />
                <vs-message state="warning" text="Warning message" />
                <vs-message state="error" text="Error message" />
            </section>

            <section class="flex flex-col gap-3">
                <h2>Pagination / Tabs / Text Wrap Icons</h2>
                <vs-pagination v-model="page" :length="10" :showing-length="5" edge-buttons />
                <div class="w-60">
                    <vs-tabs :tabs="tabs" />
                    <vs-tabs :tabs="tabs" dense />
                </div>
                <vs-text-wrap copy link="https://vlossom.dev">Copy and link icon text</vs-text-wrap>
            </section>

            <section class="flex flex-col gap-3">
                <h2>Table Icons</h2>
                <vs-table :columns="tableColumns" :items="tableItems" draggable :expandable="isExpandable">
                    <template #expand="{ item }">
                        <div class="rounded bg-slate-50 p-3">
                            {{ item.description }}
                        </div>
                    </template>
                </vs-table>
                <vs-table :columns="tableColumns" :items="emptyTableItems" />
            </section>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';

interface SandboxTableItem {
    id: string;
    name: string;
    age: number;
    email: string;
    description: string;
}

interface SandboxTableColumn {
    key: keyof SandboxTableItem;
    label: string;
    sortable?: boolean;
}

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const inputValue: Ref<string> = ref('Clear icon');
        const selectedFruit: Ref<string | null> = ref('Apple');
        const selectedFruits: Ref<string[]> = ref(['Apple', 'Banana']);
        const fileDropValue: Ref<File[] | undefined> = ref();
        const page: Ref<number> = ref(0);

        const fruitOptions = ['Apple', 'Banana', 'Orange', 'Mango'];
        const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
        const tableColumns: SandboxTableColumn[] = [
            { key: 'name', label: 'Name', sortable: true },
            { key: 'age', label: 'Age', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
        ];
        const tableItems: SandboxTableItem[] = [
            {
                id: '1',
                name: 'John',
                age: 30,
                email: 'john@example.com',
                description: 'John detail row',
            },
            {
                id: '2',
                name: 'Jane',
                age: 25,
                email: 'jane@example.com',
                description: 'Jane detail row',
            },
        ];
        const emptyTableItems: SandboxTableItem[] = [];

        function isExpandable(item: SandboxTableItem) {
            return item.age >= 30;
        }

        return {
            inputValue,
            selectedFruit,
            selectedFruits,
            fileDropValue,
            page,
            fruitOptions,
            tabs,
            tableColumns,
            tableItems,
            emptyTableItems,
            isExpandable,
        };
    },
});
</script>
