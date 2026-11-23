<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <template #title>
            <h1>Hello, Sandbox</h1>
        </template>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">1. Placement (v-model:size)</h2>
            <p class="mb-3 text-sm">Drag the inner edge of each drawer. The bound size is shown below.</p>
            <div class="mb-3 flex flex-wrap gap-2">
                <vs-button
                    v-for="placement in placements"
                    :key="placement"
                    small
                    :primary="openPlacements[placement]"
                    @click="openPlacements[placement] = !openPlacements[placement]"
                >
                    {{ placement }}: {{ placementSizes[placement] }}
                </vs-button>
            </div>
            <div class="relative h-96 overflow-hidden rounded border border-gray-300">
                <vs-drawer
                    v-for="placement in placements"
                    :key="placement"
                    v-model="openPlacements[placement]"
                    v-model:size="placementSizes[placement]"
                    :placement
                    resizable
                >
                    <div class="p-4 text-sm">{{ placement }} drawer</div>
                </vs-drawer>
            </div>
        </section>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">2. minSize / maxSize</h2>
            <p class="mb-3 text-sm">Width is limited between 120px and 60%. Current: {{ limitedSize }}</p>
            <div class="relative h-64 overflow-hidden rounded border border-gray-300">
                <vs-drawer v-model:size="limitedSize" open resizable min-size="120px" max-size="60%">
                    <div class="p-4 text-sm">120px ~ 60%</div>
                </vs-drawer>
                <vs-drawer open placement="bottom" size="xs" resizable min-size="2rem" max-size="md">
                    <div class="p-4 text-sm">2rem ~ md (40%), size prop only (no v-model:size)</div>
                </vs-drawer>
            </div>
        </section>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">3. VsLayout + pushContainer</h2>
            <p class="mb-3 text-sm">The container padding follows the drawer while dragging.</p>
            <vs-layout class="h-80 overflow-hidden rounded border border-gray-300">
                <vs-drawer v-model="layoutLeftOpen" layout push-container placement="left" size="200px" resizable>
                    <div class="p-4 text-sm">Pushed left</div>
                </vs-drawer>
                <vs-drawer
                    v-model="layoutRightOpen"
                    layout
                    push-container
                    placement="right"
                    size="180px"
                    resizable
                    min-size="100px"
                    max-size="50%"
                >
                    <div class="p-4 text-sm">Pushed right (100px ~ 50%)</div>
                </vs-drawer>
                <vs-container layout>
                    <div class="flex h-full flex-col gap-2 p-4">
                        <div class="flex gap-2">
                            <vs-button small @click="layoutLeftOpen = !layoutLeftOpen">Toggle left</vs-button>
                            <vs-button small @click="layoutRightOpen = !layoutRightOpen">Toggle right</vs-button>
                        </div>
                        <p class="text-sm">Container content</p>
                    </div>
                </vs-container>
            </vs-layout>
        </section>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">4. Fixed + dimmed</h2>
            <vs-button small @click="fixedOpen = true">Open fixed right drawer</vs-button>
            <vs-drawer
                v-model="fixedOpen"
                position="fixed"
                placement="right"
                size="sm"
                resizable
                min-size="240px"
                dimmed
                dim-close
                esc-close
            >
                <template #header>
                    <div class="p-4 font-bold">Fixed drawer</div>
                </template>
                <div class="p-4 text-sm">Resize from the left edge. Click the dimmed area or press Esc to close.</div>
                <template #footer>
                    <div class="p-4">
                        <vs-button small @click="fixedOpen = false">Close</vs-button>
                    </div>
                </template>
            </vs-drawer>
        </section>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import type { DrawerPlacement, SizeProp } from '@/declaration';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const placements: DrawerPlacement[] = ['left', 'right', 'top', 'bottom'];
        const openPlacements = reactive<Record<DrawerPlacement, boolean>>({
            left: true,
            right: false,
            top: false,
            bottom: false,
        });
        const placementSizes = reactive<Record<DrawerPlacement, SizeProp>>({
            left: '240px',
            right: '240px',
            top: '120px',
            bottom: '120px',
        });

        const limitedSize = ref<SizeProp>('200px');
        const layoutLeftOpen = ref(true);
        const layoutRightOpen = ref(true);
        const fixedOpen = ref(false);

        return {
            placements,
            openPlacements,
            placementSizes,
            limitedSize,
            layoutLeftOpen,
            layoutRightOpen,
            fixedOpen,
        };
    },
});
</script>
