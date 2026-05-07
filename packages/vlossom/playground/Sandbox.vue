<template>
    <vs-page class="mb-8" :style-set="{ $component: { padding: '0' } }">
        <div class="sandbox flex flex-col gap-8">
            <h1 class="text-2xl font-bold">Sandbox</h1>

            <section class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold">VsTabs — Horizontal</h2>
                <vs-tabs v-model="horizontalTab" :tabs="tabs" />
                <div class="rounded border border-gray-300 p-4 text-sm dark:border-gray-600">
                    Selected: {{ tabs[horizontalTab] }} (index {{ horizontalTab }})
                </div>
            </section>

            <section class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold">VsTabs — Vertical</h2>
                <div class="flex items-stretch gap-4" style="height: 240px">
                    <vs-tabs v-model="verticalTab" :tabs="tabs" vertical />
                    <div class="flex flex-1 items-center justify-center rounded border border-gray-300 p-4 text-sm dark:border-gray-600">
                        Selected: {{ tabs[verticalTab] }} (index {{ verticalTab }})
                    </div>
                </div>
            </section>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const tabs = ['Overview', 'Details', 'Settings', 'Activity'];
        const horizontalTab = ref(0);
        const verticalTab = ref(0);

        return {
            tabs,
            horizontalTab,
            verticalTab,
        };
    },
});
</script>
