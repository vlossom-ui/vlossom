import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import { colorScheme } from '@/storybook';
import VsTable from './../VsTable.vue';
import VsInput from '../../vs-input/VsInput.vue';
import type { Item } from '../types';

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
    { name: 'John', age: 30, metadata: { email: 'john@example.com' }, id: '1' },
    { name: 'Jane', age: 25, metadata: { email: 'jane@example.com' }, id: '2' },
    { name: 'Jim', age: 35, metadata: { email: 'jim@example.com' }, id: '3' },
    { name: 'Allison', age: 28, metadata: { email: 'ally@example.com' }, id: '4' },
];

const paginationItems = Array.from({ length: 120 }, (_, i) => ({
    id: `${i}`,
    name: `User ${i + 1}`,
    age: 20 + (i % 50),
    metadata: { email: `user${i + 1}@example.com` },
}));

const meta: Meta<typeof VsTable> = {
    title: 'Components/Base Components/VsTable',
    component: VsTable,
    parameters: {
        docs: {
            description: {
                component:
                    'VsTable은 컬럼 정의와 아이템을 기반으로 데이터를 렌더링하며, 슬롯을 통해 헤더/바디를 자유롭게 커스텀할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTable },
        setup() {
            return { args };
        },
        template: '<vs-table v-bind="args" />',
    }),
    args: {
        columns: baseColumns,
        items: baseItems,
    },
    tags: ['autodocs'],
    argTypes: {
        columns: {
            control: { type: 'object' },
            description: '테이블 컬럼 정의입니다.',
        },
        items: {
            control: { type: 'object' },
            description: '테이블 렌더링 대상 아이템입니다.',
        },
        search: {
            control: { type: 'object' },
            description: '검색 입력 표시 여부 및 옵션(`useCaseSensitive`, `useRegex`).',
        },
        pagination: {
            control: { type: 'object' },
            description: '페이지네이션 활성화 여부 및 옵션. 기본 pageSize=50, showTotal=true.',
        },
        expandable: {
            control: { type: 'boolean' },
            description: '행 확장을 활성화하거나 조건부 함수로 제어합니다.',
        },
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 컬럼/아이템으로 테이블을 렌더링합니다.',
            },
        },
    },
};
export const NoItemsWithHeader: Story = {
    args: {
        columns: baseColumns,
        items: [],
    },
    parameters: {
        docs: {
            description: {
                story: '컬럼은 있고 아이템이 없을 때 헤더만 표시되고 바디는 비어 있습니다.',
            },
        },
    },
};

export const NoColumnsAndItems: Story = {
    args: {
        columns: [],
        items: [],
    },
    parameters: {
        docs: {
            description: {
                story: '컬럼과 아이템이 모두 없을 때 비어 있는 테이블 상태를 보여줍니다.',
            },
        },
    },
};

export const NullColumns: Story = {
    args: {
        columns: [],
        items: baseItems,
    },
    parameters: {
        docs: {
            description: {
                story: 'columns가 null일 때 아이템의 키를 기반으로 컬럼이 구성되는 기본 동작을 확인합니다.',
            },
        },
    },
};

export const StringColumns: Story = {
    args: {
        columns: baseColumns.map((column) => column.key),
        items: baseItems,
    },
    parameters: {
        docs: {
            description: {
                story: '컬럼을 문자열 배열로 전달해 자동 라벨링되는 케이스를 확인합니다.',
            },
        },
    },
};

export const CustomSlots: Story = {
    render: () => ({
        components: { VsTable, VsInput },
        setup() {
            const oddRowIndexes = computed(() => baseItems.map((_item, idx) => idx).filter((idx) => idx % 2 === 0));
            const janesEmailEditingMode = ref(false);

            const toggleJaneEmailEditingMode = () => {
                janesEmailEditingMode.value = !janesEmailEditingMode.value;
            };

            return {
                columns: baseColumns,
                items: baseItems,
                oddRowIndexes,
                janesEmailEditingMode,
                toggleJaneEmailEditingMode,
            };
        },
        template: `
            <vs-table :columns="columns" :items="items">
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
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: '다양한 커스텀 슬롯 예제를 확인할 수 있습니다.',
            },
        },
    },
};

export const Selectable: Story = {
    args: {
        columns: baseColumns,
        items: baseItems,
        selectable: (item: Item) => item.name !== 'Jim',
    },
    parameters: {
        docs: {
            description: {
                story: 'selectable을 true/함수로 전달해 선택 가능한 행만 체크박스를 노출하고, 전체 선택 상태를 확인합니다.',
            },
        },
    },
};

export const SortableColumns: Story = {
    args: {
        columns: sortableColumns,
        items: [...baseItems].reverse(),
    },
    parameters: {
        docs: {
            description: {
                story: 'sortable 컬럼을 지정하면 헤더 아이콘을 클릭해 ASC/DESC/해제 순으로 정렬을 토글할 수 있습니다.',
            },
        },
    },
};

export const Searchable: Story = {
    args: {
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'age', label: 'Age' },
            { key: 'metadata.email', label: 'Email', skipSearch: true },
        ],
        items: baseItems,
        search: { placeholder: 'Search name only', useRegex: true, useCaseSensitive: false },
    },
    parameters: {
        docs: {
            description: {
                story: 'search prop을 켜면 검색 입력이 표시되고, `skipSearch`가 설정된 컬럼은 검색 대상에서 제외됩니다.',
            },
        },
    },
};

export const Expandable: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const items = baseItems.map((item) => ({
                ...item,
                description: `${item.name} 상세 정보`,
            }));
            const expandable = (item: Item) => Number(item.age) >= 30;
            return { columns: baseColumns, items, expandable };
        },
        template: `
            <vs-table :columns="columns" :items="items" :expandable="expandable">
                <template #expand="{ cells, rowIdx }">
                    <div class="p-3 bg-slate-50 rounded">
                        <p class="font-semibold">확장 영역 (row {{ rowIdx }})</p>
                        <p class="text-sm text-slate-600">
                            {{ cells[0].item.description }} - {{ cells[0].item.metadata.email }}
                        </p>
                    </div>
                </template>
            </vs-table>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'expandable을 켜면 행마다 확장 버튼이 노출되며, expand 슬롯으로 확장 영역을 커스텀합니다.',
            },
        },
    },
};

export const StickyHeader: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const items = Array.from({ length: 40 }).map((_, idx) => ({
                id: `${idx + 1}`,
                name: `User ${idx + 1}`,
                age: 20 + (idx % 30),
                metadata: { email: `user${idx + 1}@example.com` },
            }));
            return { columns: baseColumns, items };
        },
        template: `
            <div style="height: 360px; overflow: auto; border: 1px solid #e5e7eb; padding: 8px;">
                <vs-table :columns="columns" :items="items" stickyHeader />
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'stickyHeader를 켜고 스크롤 시 헤더가 상단에 고정되는 동작을 확인합니다',
            },
        },
    },
};

export const Responsive: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const items = Array.from({ length: 6 }).map((_, idx) => ({
                id: `${idx + 1}`,
                name: `User ${idx + 1}`,
                order: (idx % 5) + 1,
                checked: idx % 2 === 0,
                created: `2021-0${(idx % 9) + 1}-0${(idx % 3) + 1}`,
                desc: 'Lorem ipsum has been the industry',
            }));
            return { columns: ['id', 'name', 'order', 'checked', 'created', 'desc'], items };
        },
        template: `
            <div style="max-width: 720px; border: 1px solid #e5e7eb; padding: 8px;">
                <p class="text-sm text-slate-600 mb-2">브라우저 폭을 줄이면 카드형으로 변합니다.</p>
                <vs-table :columns="columns" :items="items" responsive />
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'responsive를 true로 켠 상태에서 좁은 화면에서 카드형(모바일) 테이블 레이아웃을 확인합니다.',
            },
        },
    },
};

export const WithPagination: Story = {
    args: {
        columns: sortableColumns,
        items: Array.from({ length: 150 }, (_, i) => ({
            id: `${i}`,
            name: `User ${i + 1}`,
            age: 20 + (i % 50),
            metadata: { email: `user${i + 1}@example.com` },
        })),
        pagination: true,
    },
    parameters: {
        docs: {
            description: {
                story: '150개 아이템에 대해 페이지네이션을 적용합니다. 기본 페이지 크기는 50입니다.',
            },
        },
    },
};

export const WithCustomPagination: Story = {
    args: {
        columns: sortableColumns,
        items: Array.from({ length: 100 }, (_, i) => ({
            id: `${i}`,
            name: `User ${i + 1}`,
            age: 20 + (i % 50),
            metadata: { email: `user${i + 1}@example.com` },
        })),
        pageSize: 25,
        pagination: {
            pageSizeOptions: [
                { label: '10 items', value: 10 },
                { label: '25 items', value: 25 },
                { label: '50 items', value: 50 },
            ],
            showingLength: 5,
            edgeButtons: true,
        },
    },
    parameters: {
        docs: {
            description: {
                story: '커스텀 페이지네이션 옵션을 적용합니다. 페이지 크기 25, 표시할 페이지 버튼 수 5, 첫/마지막 버튼 활성화.',
            },
        },
    },
};

export const PaginationWithEvent: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const currentPage = ref(0);
            const currentPageSize = ref(20);

            const onPageChange = (page: number, pageSize: number) => {
                currentPage.value = page;
                currentPageSize.value = pageSize;
            };

            return {
                columns: sortableColumns,
                items: paginationItems,
                currentPage,
                currentPageSize,
                onPageChange,
            };
        },
        template: `
            <div class="space-y-2">
                <vs-table
                    :columns="columns"
                    :items="items"
                    :page-size="currentPageSize"
                    :pagination="{
                        pageSizeOptions: [
                            { label: '10 items', value: 10 },
                            { label: '20 items', value: 20 },
                            { label: '50 items', value: 50 }
                        ],
                        showingLength: 5,
                        edgeButtons: true,
                        showTotal: true
                    }"
                    @page-change="onPageChange"
                />
                <p class="text-sm text-slate-600">
                    현재 페이지: {{ currentPage + 1 }} / 페이지 크기: {{ currentPageSize }}
                </p>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'page-change 이벤트를 통해 현재 페이지 인덱스와 페이지 크기를 동기화하는 예제입니다.',
            },
        },
    },
};

export const WithSearchSortPagination: Story = {
    args: {
        columns: sortableColumns,
        items: Array.from({ length: 200 }, (_, i) => ({
            id: `${i}`,
            name: i % 2 === 0 ? `Alice ${i + 1}` : `Bob ${i + 1}`,
            age: 20 + (i % 50),
            metadata: { email: `user${i + 1}@example.com` },
        })),
        search: true,
        pageSize: 20,
        pagination: true,
    },
    parameters: {
        docs: {
            description: {
                story: '검색, 정렬, 페이지네이션이 모두 활성화된 테이블입니다. 검색이나 정렬 변경 시 자동으로 첫 페이지로 리셋됩니다.',
            },
        },
    },
};

export const Loading: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const isLoading = ref(true);

            // 3초 후 데이터 로드 시뮬레이션
            setTimeout(() => {
                isLoading.value = false;
            }, 3000);

            return { isLoading, baseColumns, baseItems };
        },
        template: `
            <div>
                <p class="text-sm text-slate-600 mb-2">3초 후 데이터가 로드됩니다.</p>
                <vs-table
                    :columns="baseColumns"
                    :items="baseItems"
                    :loading="isLoading"
                    search
                />
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'loading이 true일 때 스켈레톤 UI가 표시되고, 검색 입력이 비활성화됩니다. 3초 후 실제 데이터로 전환됩니다.',
            },
        },
    },
};

export const Draggable: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const items = ref([...baseItems]);

            const onDrag = (event: any) => {
                console.log('Drag event:', {
                    oldIndex: event.oldIndex,
                    newIndex: event.newIndex,
                    from: event.from,
                    to: event.to,
                });
            };

            return { columns: baseColumns, items, onDrag };
        },
        template: `
            <div>
                <p class="text-sm text-slate-600 mb-2">행을 드래그해 순서를 변경할 수 있습니다. 콘솔에서 이벤트를 확인하세요.</p>
                <vs-table
                    :columns="columns"
                    :items="items"
                    draggable
                    @drag="onDrag"
                />
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: `draggable을 true로 설정하면 행을 드래그하여 순서를 변경할 수 있습니다.
                        drag 이벤트를 통해 oldIndex, newIndex 등의 정보를 받을 수 있습니다.`,
            },
        },
    },
};
