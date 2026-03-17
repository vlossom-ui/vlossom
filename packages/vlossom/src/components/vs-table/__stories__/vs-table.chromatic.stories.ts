import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import { chromaticParameters } from '@/storybook';
import { VsTable, VsInput } from '@/components';

type RowOption = { selectable?: boolean | ((item: any) => boolean) };

const baseColumns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'metadata.email', label: 'Email' },
];

const sortableColumns = baseColumns.map((column) => ({
    ...column,
    sortable: true,
}));

const baseItems = [
    { id: '1', name: 'John', age: 30, metadata: { email: 'john@example.com' } },
    { id: '2', name: 'Jane', age: 25, metadata: { email: 'jane@example.com' } },
    { id: '3', name: 'Jim', age: 35, metadata: { email: 'jim@example.com' } },
];

const customSelectableRow: RowOption = { selectable: (item: any) => item.name !== 'Jane' };

const paginationItems = Array.from({ length: 120 }, (_, i) => ({
    id: `${i}`,
    name: `User ${i + 1}`,
    age: 20 + (i % 40),
    metadata: { email: `user${i + 1}@example.com` },
}));

const meta: Meta<typeof VsTable> = {
    title: 'Chromatic/Base Components/VsTable',
    component: VsTable,
    parameters: {
        chromatic: chromaticParameters.theme,
        docs: {
            description: {
                component: '다양한 상태를 한 화면에 배치해 시각 리그레션을 검증합니다.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const VisualRegressionMatrix: Story = {
    parameters: {
        chromatic: chromaticParameters.theme,
        docs: {
            description: {
                story: '대표 상태(기본/선택/커스텀 선택/빈 데이터/null 컬럼/문자열 컬럼/커스텀 슬롯)를 한 번에 스냅샷합니다.',
            },
        },
    },
    render: () => ({
        components: { VsTable, VsInput },
        setup() {
            const oddRowIndexes = computed(() => baseItems.map((_item, idx) => idx).filter((idx) => idx % 2 === 0));
            const janesEmailEditingMode = ref(false);
            const toggleJaneEmailEditingMode = () => {
                janesEmailEditingMode.value = !janesEmailEditingMode.value;
            };
            const expandable = (item: any) => Number(item.age) >= 30;

            return {
                baseColumns,
                baseItems,
                customSelectableRow,
                sortableColumns,
                paginationItems,
                oddRowIndexes,
                janesEmailEditingMode,
                toggleJaneEmailEditingMode,
                expandable,
            };
        },
        template: `
            <div class="chromatic-wrapper" style="display: flex; flex-direction: column; gap: 2rem; padding: 1rem;">
                <section class="chromatic-section">
                    <h3>기본 테이블</h3>
                    <vs-table :columns="baseColumns" :items="baseItems" />
                </section>

                <section class="chromatic-section">
                    <h3>아이템 없음 (헤더만 표시)</h3>
                    <vs-table :columns="baseColumns" :items="[]" />
                </section>

                <section class="chromatic-section">
                    <h3>컬럼/아이템 모두 없음</h3>
                    <vs-table :items="[]" />
                </section>

                <section class="chromatic-section">
                    <h3>컬럼이 null인 경우 (아이템 키 기반 생성)</h3>
                    <vs-table :columns="null" :items="baseItems" />
                </section>

                <section class="chromatic-section">
                    <h3>문자열 컬럼</h3>
                    <vs-table :columns="baseColumns.map((c) => c.key)" :items="baseItems" />
                </section>

                <section class="chromatic-section">
                    <h3>선택 가능 행 (전체 선택 토글)</h3>
                    <vs-table :columns="baseColumns" :items="baseItems" selectable />
                </section>

                <section class="chromatic-section">
                    <h3>커스텀 선택 조건 (Jane 제외)</h3>
                    <vs-table :columns="baseColumns" :items="baseItems" :selectable="customSelectableRow.selectable" />
                </section>

                <section class="chromatic-section">
                    <h3>선택 슬롯 커스텀</h3>
                    <vs-table :columns="baseColumns" :items="baseItems" selectable>
                        <template #select="{ rowIdx }">
                            <span class="text-xs text-slate-500">Row {{ rowIdx + 1 }}</span>
                        </template>
                    </vs-table>
                </section>

                <section class="chromatic-section">
                    <h3>정렬 가능한 컬럼</h3>
                    <vs-table :columns="sortableColumns" :items="[...baseItems].reverse()" />
                </section>

                <section class="chromatic-section">
                    <h3>검색 (이메일 컬럼 제외)</h3>
                    <vs-table
                        :columns="[
                            { key: 'name', label: 'Name' },
                            { key: 'age', label: 'Age' },
                            { key: 'metadata.email', label: 'Email', skipSearch: true },
                        ]"
                        :items="baseItems"
                        :search="{ placeholder: 'Search by name', useCaseSensitive: false, useRegex: true }"
                    />
                </section>

                <section class="chromatic-section">
                    <h3>페이지네이션 기본</h3>
                    <vs-table :columns="sortableColumns" :items="paginationItems" pagination />
                </section>

                <section class="chromatic-section">
                    <h3>페이지네이션 커스텀 (edge 버튼 + showingLength 5)</h3>
                    <vs-table
                        :columns="sortableColumns"
                        :items="paginationItems"
                        :pagination="{
                            pageSize: 20,
                            pageSizeOptions: [
                                { label: '10 items', value: 10 },
                                { label: '20 items', value: 20 },
                                { label: '50 items', value: 50 }
                            ],
                            showingLength: 5,
                            edgeButtons: true,
                            showTotal: true
                        }"
                            />
                </section>

                <section class="chromatic-section">
                    <h3>행 확장</h3>
                    <vs-table :columns="baseColumns" :items="baseItems" :expandable="expandable">
                        <template #expand="{ item, rowIdx }">
                            <div class="p-3 bg-slate-50 rounded">
                                <p class="font-semibold">확장 영역 (row {{ rowIdx }})</p>
                                <p class="text-sm text-slate-600">{{ item.metadata.email }}</p>
                            </div>
                        </template>
                    </vs-table>
                </section>

                <section class="chromatic-section">
                    <h3>커스텀 슬롯</h3>
                    <vs-table :columns="baseColumns" :items="baseItems">
                        <template #caption>
                            <span class="font-bold text-blue-500">Custom Caption</span>
                        </template>

                        <template #header="{ value }">
                            <span class="bg-yellow-300 font-semibold">
                                {{ value }}
                            </span>
                        </template>

                        <template #header-name="{ value }">
                            <span class="flex items-center gap-2 text-amber-700">
                                {{ value }} <span class="text-xs font-semibold">custom</span>
                            </span>
                        </template>

                        <template #body="{ item }">
                            <span class="bg-green-100 font-semibold">
                                {{ item.name }}
                            </span>
                        </template>

                        <template #body-name-item-1="{ item }">
                            <span class="font-semibold text-red-500">Custom Body {{ item.name }}</span>
                        </template>

                        <template v-for="idx in oddRowIndexes" :key="idx" #[\`body-row\${idx}\`]="{ item }">
                            <span class="bg-purple-300 font-semibold text-purple-700">Custom Body Row - {{ item.name }}</span>
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
                    </vs-table>
                </section>

                <section class="chromatic-section">
                    <h3>행별 state (UI 상태)</h3>
                    <vs-table
                        :columns="baseColumns"
                        :items="baseItems.map((item, i) =>
                            ({ ...item, status: ['success', 'warning', 'error', 'info'][i % 4] }))"
                        :state="(item) => item.status"
                    />
                </section>

                <section class="chromatic-section">
                    <h3>로딩 상태</h3>
                    <vs-table :columns="baseColumns" :items="baseItems" pagination loading search />
                </section>
            </div>
        `,
    }),
};
