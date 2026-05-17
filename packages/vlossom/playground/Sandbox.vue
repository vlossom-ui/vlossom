<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <div class="sandbox flex flex-col gap-8 p-6">
            <h1 class="text-2xl font-bold">useIndexSelector behavior matrix</h1>
            <p class="text-sm text-gray-500">
                Out-of-range → selectedIndex가 -1 (선택 없음). Disabled → 현재 선택은 유지되고 새 선택은 무시됨 (no-op).
            </p>

            <!-- VsPagination -->
            <section class="flex flex-col gap-3">
                <h2 class="text-xl font-semibold">VsPagination</h2>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">1. 정상</h3>
                    <vs-pagination v-model="pagPage" :length="5" />
                    <div class="text-sm text-gray-600">v-model page: {{ pagPage }}</div>
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">2. Out-of-range (length=5, modelValue=10)</h3>
                    <vs-pagination v-model="pagOorPage" :length="5" />
                    <div class="text-sm text-gray-600">v-model page: {{ pagOorPage }} (→ -1 = 선택 없음)</div>
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">3. Disabled=true (page=2 유지, 클릭 no-op)</h3>
                    <vs-pagination v-model="pagDisabledPage" :length="5" disabled />
                    <div class="text-sm text-gray-600">v-model page: {{ pagDisabledPage }} (클릭해도 변경 안 됨)</div>
                </div>
            </section>

            <!-- VsTabs -->
            <section class="flex flex-col gap-3">
                <h2 class="text-xl font-semibold">VsTabs</h2>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">1. 정상</h3>
                    <vs-tabs v-model="tabsIndex" :tabs="tabs" />
                    <div class="text-sm text-gray-600">v-model index: {{ tabsIndex }}</div>
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">2. Out-of-range (3 tabs, modelValue=10)</h3>
                    <vs-tabs v-model="tabsOorIndex" :tabs="tabs" />
                    <div class="text-sm text-gray-600">v-model index: {{ tabsOorIndex }} (→ -1 = 선택 없음)</div>
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">3. Per-item disabled (Tab 2 비활성, 클릭 no-op)</h3>
                    <vs-tabs v-model="tabsPerDisabledIndex" :tabs="tabs" :disabled="disableSecond" />
                    <div class="text-sm text-gray-600">
                        v-model index: {{ tabsPerDisabledIndex }} (Tab 2 클릭 시 현재 선택 유지)
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">4. Disabled=true (전체 비활성, modelValue=1 유지)</h3>
                    <vs-tabs v-model="tabsAllDisabledIndex" :tabs="tabs" disabled />
                    <div class="text-sm text-gray-600">
                        v-model index: {{ tabsAllDisabledIndex }} (Tab 2 선택 유지, 클릭 no-op)
                    </div>
                </div>
            </section>

            <!-- VsSteps -->
            <section class="flex flex-col gap-3">
                <h2 class="text-xl font-semibold">VsSteps</h2>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">1. 정상</h3>
                    <vs-steps v-model="stepsIndex" :steps="steps" />
                    <div class="text-sm text-gray-600">v-model index: {{ stepsIndex }}</div>
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">2. Out-of-range (3 steps, modelValue=10)</h3>
                    <vs-steps v-model="stepsOorIndex" :steps="steps" />
                    <div class="text-sm text-gray-600">v-model index: {{ stepsOorIndex }} (→ -1 = 선택 없음)</div>
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">3. Per-item disabled (Step 2 비활성, 클릭 no-op)</h3>
                    <vs-steps v-model="stepsPerDisabledIndex" :steps="steps" :disabled="disableSecond" />
                    <div class="text-sm text-gray-600">
                        v-model index: {{ stepsPerDisabledIndex }} (Step 2 클릭 시 현재 선택 유지)
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-medium">4. Disabled=true (전체 비활성, modelValue=1 유지)</h3>
                    <vs-steps v-model="stepsAllDisabledIndex" :steps="steps" disabled />
                    <div class="text-sm text-gray-600">
                        v-model index: {{ stepsAllDisabledIndex }} (Step 2 선택 유지, 클릭 no-op)
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
        const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
        const steps = ['Step 1', 'Step 2', 'Step 3'];

        // VsPagination
        const pagPage = ref(2);
        const pagOorPage = ref(10);
        const pagDisabledPage = ref(2);

        // VsTabs
        const tabsIndex = ref(0);
        const tabsOorIndex = ref(10);
        const tabsPerDisabledIndex = ref(0);
        const tabsAllDisabledIndex = ref(1);

        // VsSteps
        const stepsIndex = ref(0);
        const stepsOorIndex = ref(10);
        const stepsPerDisabledIndex = ref(0);
        const stepsAllDisabledIndex = ref(1);

        const disableSecond = (_item: string, index: number) => index === 1;

        return {
            tabs,
            steps,
            pagPage,
            pagOorPage,
            pagDisabledPage,
            tabsIndex,
            tabsOorIndex,
            tabsPerDisabledIndex,
            tabsAllDisabledIndex,
            stepsIndex,
            stepsOorIndex,
            stepsPerDisabledIndex,
            stepsAllDisabledIndex,
            disableSecond,
        };
    },
});
</script>
