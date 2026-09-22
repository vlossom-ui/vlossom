<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <template #title>
            <h1>Virtual Scroll Sandbox</h1>
        </template>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">A. Self scroll (flat, 1000 items)</h2>
            <p class="mb-2 text-sm opacity-70">
                The list has a bounded height, so its own inner container scrolls.
                <span id="a-count">rendered: {{ renderedCount('#case-a') }}</span>
            </p>
            <div id="case-a" style="height: 320px">
                <vs-grouped-list ref="listARef" :items="flatItems" @click-item="onClickItem" />
            </div>
            <div class="mt-2 flex gap-2">
                <vs-button id="a-scroll-500" size="sm" @click="scrollToIndex(500)">scrollToItem(500)</vs-button>
                <vs-button id="a-scroll-999" size="sm" @click="scrollToIndex(999)">scrollToItem(999)</vs-button>
            </div>
            <p id="a-clicked" class="mt-2 text-sm">clicked: {{ clickedLabel }}</p>
        </section>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">B. Self scroll (grouped, 1000 items / 10 groups)</h2>
            <div id="case-b" style="height: 320px">
                <vs-grouped-list :items="groupedItems" :group-by="groupBy" />
            </div>
        </section>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">C. Scrollable ancestor</h2>
            <p class="mb-2 text-sm opacity-70">The list is unbounded; the outer box scrolls.</p>
            <div id="case-c" style="height: 320px; overflow: auto">
                <h3 class="p-4">Header above the list</h3>
                <div>
                    <vs-grouped-list :items="flatItems" />
                </div>
            </div>
        </section>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">D. Non-virtual (5 items)</h2>
            <div id="case-d" style="height: 200px">
                <vs-grouped-list :items="smallItems" />
            </div>
        </section>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">E. VsSelect (500 options)</h2>
            <div id="case-e" style="max-width: 320px">
                <vs-select id="select-plain" v-model="selectedOne" :options="manyOptions" label="Pick one" />
            </div>
            <p id="e-value" class="mt-2 text-sm">value: {{ selectedOne ?? '(none)' }}</p>
        </section>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">F. VsSelect (search + select all + multiple, 500 options)</h2>
            <div id="case-f" style="max-width: 320px">
                <vs-select
                    id="select-search"
                    v-model="selectedMany"
                    :options="manyOptions"
                    label="Pick many"
                    multiple
                    select-all
                    search
                />
            </div>
            <p id="f-value" class="mt-2 text-sm">count: {{ selectedMany.length }}</p>
        </section>

        <section class="mb-10">
            <h2 class="mb-2 text-xl font-bold">G. Window scroll (1000 items, unbounded)</h2>
            <p class="mb-2 text-sm opacity-70">Nothing above bounds the height, so the page scrolls.</p>
            <div id="case-g">
                <vs-grouped-list :items="flatItems" />
            </div>
        </section>
    </vs-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useTemplateRef, type TemplateRef } from 'vue';
import type { OptionItem } from '@/declaration';
import type { VsGroupedListRef } from '@/components/vs-grouped-list/types';

function createItems(count: number) {
    return Array.from({ length: count }, (_, i) => ({ id: i, name: `Item ${i}` }));
}

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const listARef: TemplateRef<VsGroupedListRef> = useTemplateRef('listARef');

        const rawFlat = createItems(1000);
        const rawSmall = createItems(5);

        function toOptionItems(raw: { id: number; name: string }[]): OptionItem[] {
            return raw.map((item, index) => ({
                id: `sandbox-${item.id}`,
                item,
                label: item.name,
                value: item.id,
                index,
                disabled: false,
            }));
        }

        const flatItems = computed(() => toOptionItems(rawFlat));
        const smallItems = computed(() => toOptionItems(rawSmall));
        const groupedItems = flatItems;

        const manyOptions = Array.from({ length: 500 }, (_, i) => `Option ${i}`);

        const selectedOne = ref<string | null>(null);
        const selectedMany = ref<string[]>([]);
        const clickedLabel = ref('(none)');

        function groupBy(item: any) {
            return `Group ${Math.floor(item.id / 100)}`;
        }

        function onClickItem(item: any) {
            clickedLabel.value = item.label;
        }

        function scrollToIndex(index: number) {
            listARef.value?.scrollToItem(`sandbox-${index}`);
        }

        // 브라우저에서 눈으로 확인하기 위한 값이라 반응형이 아니어도 된다
        function renderedCount(selector: string) {
            return document.querySelectorAll(`${selector} .vs-grouped-list-item`).length;
        }

        return {
            listARef,
            flatItems,
            smallItems,
            groupedItems,
            manyOptions,
            selectedOne,
            selectedMany,
            clickedLabel,
            groupBy,
            onClickItem,
            scrollToIndex,
            renderedCount,
        };
    },
});
</script>
