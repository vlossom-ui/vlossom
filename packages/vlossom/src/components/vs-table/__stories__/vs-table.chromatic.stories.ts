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

const baseItems = [
    { name: 'John', age: 30, metadata: { email: 'john@example.com' } },
    { name: 'Jane', age: 25, metadata: { email: 'jane@example.com' } },
    { name: 'Jim', age: 35, metadata: { email: 'jim@example.com' } },
];

const selectableRow: RowOption = { selectable: true };
const customSelectableRow: RowOption = { selectable: (item: any) => item.name !== 'Jane' };

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

            return {
                baseColumns,
                baseItems,
                selectableRow,
                customSelectableRow,
                oddRowIndexes,
                janesEmailEditingMode,
                toggleJaneEmailEditingMode,
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
                    <h3>커스텀 슬롯</h3>
                    <vs-table :columns="baseColumns" :items="baseItems">
                        <template #caption>
                            <span class="font-bold text-blue-500">Custom Caption</span>
                        </template>

                        <template #header="{ header }">
                            <span class="bg-yellow-300 font-semibold">
                                {{ header.value }}
                            </span>
                        </template>

                        <template #header-name="{ header }">
                            <span class="flex items-center gap-2 text-amber-700">
                                {{ header.value }} <span class="text-xs font-semibold">custom</span>
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
            </div>
        `,
    }),
};
