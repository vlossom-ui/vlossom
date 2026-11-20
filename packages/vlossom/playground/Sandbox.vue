<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <template #title>
            <h1>Index correction (#767, #768)</h1>
        </template>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem]">
            <div class="flex flex-col gap-10">
                <section>
                    <h2 class="mb-2 text-xl">VsTable (#767)</h2>
                    <p class="mb-2 text-sm">
                        3페이지로 이동한 뒤 items를 줄여 보세요. page가 가장 가까운 페이지로 바뀌어야 합니다.
                    </p>
                    <div class="mb-2 flex flex-wrap gap-2">
                        <vs-button v-for="count in [25, 15, 5, 0]" :key="count" size="sm" @click="setTableItems(count)">
                            items {{ count }}
                        </vs-button>
                        <vs-button size="sm" @click="tableLoading = !tableLoading">
                            loading: {{ tableLoading }}
                        </vs-button>
                    </div>
                    <p class="mb-2">page: {{ tablePage }} / items: {{ tableItems.length }}</p>
                    <vs-table
                        v-model:page="tablePage"
                        :columns="['name', 'age']"
                        :items="tableItems"
                        :page-size="10"
                        :loading="tableLoading"
                        pagination
                        @update:page="log('VsTable update:page', $event)"
                    />
                </section>

                <section>
                    <h2 class="mb-2 text-xl">VsPagination</h2>
                    <div class="mb-2 flex flex-wrap gap-2">
                        <vs-button size="sm" @click="paginationLength = Math.max(1, paginationLength - 1)">
                            length -1
                        </vs-button>
                        <vs-button size="sm" @click="paginationLength++">length +1</vs-button>
                        <vs-button size="sm" @click="paginationPage = 9">modelValue = 9</vs-button>
                        <vs-button size="sm" @click="paginationDisabled = !paginationDisabled">
                            disabled: {{ paginationDisabled }}
                        </vs-button>
                    </div>
                    <p class="mb-2">modelValue: {{ paginationPage }} / length: {{ paginationLength }}</p>
                    <vs-pagination
                        v-model="paginationPage"
                        :length="paginationLength"
                        :disabled="paginationDisabled"
                        edge-buttons
                        @change="log('VsPagination change', $event)"
                    />
                </section>

                <section>
                    <h2 class="mb-2 text-xl">VsTabs (#768)</h2>
                    <p class="mb-2 text-sm">
                        빈 tabs, v-model 1로 시작합니다. 불러온 뒤 두 번째 탭이 선택되어야 합니다.
                    </p>
                    <div class="mb-2 flex flex-wrap gap-2">
                        <vs-button size="sm" @click="loadTabs">tabs 불러오기 (0.5초 뒤)</vs-button>
                        <vs-button size="sm" @click="tabs = []">tabs 비우기</vs-button>
                        <vs-button size="sm" @click="tabs = tabs.slice(0, -1)">마지막 탭 제거</vs-button>
                        <vs-button size="sm" @click="toggleSelectedTabDisabled">
                            선택된 탭 disabled 토글 ({{ disabledTabIndex ?? '-' }})
                        </vs-button>
                        <vs-button size="sm" @click="tabsAllDisabled = !tabsAllDisabled">
                            전체 disabled: {{ tabsAllDisabled }}
                        </vs-button>
                    </div>
                    <p class="mb-2">v-model: {{ tabIndex }} / tabs: {{ tabs.length }}</p>
                    <vs-tabs
                        v-model="tabIndex"
                        :tabs
                        :disabled="tabsAllDisabled || isTabDisabled"
                        @change="log('VsTabs change', $event)"
                    />
                </section>

                <section>
                    <h2 class="mb-2 text-xl">VsSteps (#768)</h2>
                    <p class="mb-2 text-sm">
                        전체 disabled에서 modelValue를 5로 바꾸면 값이 유지되고 진행 바는 100%에서 멈춰야 합니다.
                    </p>
                    <div class="mb-2 flex flex-wrap gap-2">
                        <vs-button size="sm" @click="loadSteps">steps 불러오기 (0.5초 뒤)</vs-button>
                        <vs-button size="sm" @click="steps = []">steps 비우기</vs-button>
                        <vs-button size="sm" @click="steps = steps.slice(0, -1)">마지막 step 제거</vs-button>
                        <vs-button size="sm" @click="stepsAllDisabled = !stepsAllDisabled">
                            전체 disabled: {{ stepsAllDisabled }}
                        </vs-button>
                        <vs-button size="sm" @click="stepIndex = 5">modelValue = 5</vs-button>
                    </div>
                    <p class="mb-2">v-model: {{ stepIndex }} / steps: {{ steps.length }}</p>
                    <vs-steps
                        v-model="stepIndex"
                        :steps
                        :disabled="stepsAllDisabled"
                        @change="log('VsSteps change', $event)"
                    />
                </section>
            </div>

            <aside>
                <div class="mb-2 flex items-center justify-between">
                    <h2 class="text-xl">emit log</h2>
                    <vs-button size="xs" @click="logs = []">clear</vs-button>
                </div>
                <ol class="text-sm">
                    <li v-for="(line, index) in logs" :key="index">{{ line }}</li>
                </ol>
            </aside>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

function createItems(count: number) {
    return Array.from({ length: count }, (_, index) => ({ name: `User ${index}`, age: 20 + index }));
}

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const logs = ref<string[]>([]);

        function log(source: string, value: number) {
            const time = new Date().toLocaleTimeString();
            logs.value = [`${time} ${source}: ${value}`, ...logs.value].slice(0, 30);
        }

        const tableItems = ref(createItems(25));
        const tablePage = ref(0);
        const tableLoading = ref(false);

        function setTableItems(count: number) {
            tableItems.value = createItems(count);
        }

        const paginationPage = ref(4);
        const paginationLength = ref(5);
        const paginationDisabled = ref(false);

        const tabs = ref<string[]>([]);
        const tabIndex = ref(1);
        const tabsAllDisabled = ref(false);
        const disabledTabIndex = ref<number | null>(null);

        function isTabDisabled(_: string, index: number) {
            return index === disabledTabIndex.value;
        }

        function toggleSelectedTabDisabled() {
            disabledTabIndex.value = disabledTabIndex.value === null ? tabIndex.value : null;
        }

        function loadTabs() {
            setTimeout(() => (tabs.value = ['A', 'B', 'C', 'D']), 500);
        }

        const steps = ref<string[]>([]);
        const stepIndex = ref(1);
        const stepsAllDisabled = ref(false);

        function loadSteps() {
            setTimeout(() => (steps.value = ['기안', '팀장', '실장', '본부장']), 500);
        }

        return {
            logs,
            log,
            tableItems,
            tablePage,
            tableLoading,
            setTableItems,
            paginationPage,
            paginationLength,
            paginationDisabled,
            tabs,
            tabIndex,
            tabsAllDisabled,
            disabledTabIndex,
            isTabDisabled,
            toggleSelectedTabDisabled,
            loadTabs,
            steps,
            stepIndex,
            stepsAllDisabled,
            loadSteps,
        };
    },
});
</script>
