import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme } from '@/storybook';
import VsTable from './../VsTable.vue';
import type { VsTableItem } from './../types';

const baseColumns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'metadata.email', label: 'Email' },
];

const sortableColumns = baseColumns.map((column) => ({ ...column, sortable: true }));

const baseItems = [
    { id: '1', name: 'John', age: 30, metadata: { email: 'john@example.com' } },
    { id: '2', name: 'Jane', age: 25, metadata: { email: 'jane@example.com' } },
    { id: '3', name: 'Jim', age: 35, metadata: { email: 'jim@example.com' } },
    { id: '4', name: 'Allison', age: 28, metadata: { email: 'ally@example.com' } },
];

const paginationItems = Array.from({ length: 120 }, (_, index) => ({
    id: `${index}`,
    name: `User ${index + 1}`,
    age: 20 + (index % 50),
    metadata: { email: `user${index + 1}@example.com` },
}));

const meta: Meta<typeof VsTable> = {
    title: 'Components/Base Components/VsTable',
    component: VsTable,
    parameters: {
        docs: {
            description: {
                component:
                    'VsTable는 컬럼 정의와 아이템을 기반으로 데이터를 렌더링하며, 슬롯을 통해 헤더/바디를 자유롭게 커스텀할 수 있습니다. ' +
                    '검색 · 정렬 · 드래그가 반영된 아이템은 `v-model:paged-items` / `v-model:total-items`로 가져옵니다.',
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
        itemKey: {
            control: { type: 'text' },
            description: '행을 식별할 키입니다. 아이템 객체가 교체돼도 선택/확장 상태와 DOM이 유지됩니다.',
        },
        search: {
            control: { type: 'object' },
            description: '검색 입력 표시 여부 및 옵션(`useCaseSensitive`, `useRegex`, `extraKeys`).',
        },
        pagination: {
            control: { type: 'object' },
            description: '페이지네이션 활성화 여부 및 옵션. 기본 pageSize=50, showTotal=true.',
        },
        expandable: {
            control: { type: 'boolean' },
            description:
                '행 확장을 활성화하거나 조건부 함수로 제어합니다. 기본값은 `true`이지만, 확장 UI는 `expand` 슬롯이 제공된 경우에만 렌더링됩니다.',
        },
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
            description: '테이블 크기 (셀 패딩 · 폰트 · expand handle · sort icon에 반영)',
        },
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
    parameters: {
        docs: { description: { story: '기본 컬럼/아이템으로 테이블을 렌더링합니다.' } },
    },
};

export const NoItemsWithHeader: Story = {
    args: { items: [] },
    parameters: {
        docs: { description: { story: '컬럼은 있고 아이템이 없을 때 헤더만 표시되고 바디는 비어 있습니다.' } },
    },
};

export const NoColumnsAndItems: Story = {
    args: { columns: [], items: [] },
    parameters: {
        docs: { description: { story: '컬럼과 아이템이 모두 없을 때의 빈 테이블 상태입니다.' } },
    },
};

export const ColumnsFromItems: Story = {
    args: { columns: [], items: baseItems },
    parameters: {
        docs: { description: { story: 'columns가 비어 있으면 첫 아이템의 키를 기반으로 컬럼이 구성됩니다.' } },
    },
};

export const StringColumns: Story = {
    args: { columns: baseColumns.map((column) => column.key), items: baseItems },
    parameters: {
        docs: { description: { story: '컬럼을 문자열 배열로 전달하면 key와 label이 동일하게 구성됩니다.' } },
    },
};

export const CustomSlots: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            return { columns: baseColumns, items: baseItems };
        },
        template: `
            <vs-table :columns="columns" :items="items">
                <template #caption>
                    <span class="font-bold text-blue-500">Custom Caption</span>
                </template>
                <template #header-name="{ value }">
                    <span class="font-bold text-blue-500">{{ value }}</span>
                </template>
                <template #item-name="{ item }">
                    <span class="font-bold">{{ item.name }}</span>
                </template>
                <template #item-col1="{ value }">
                    <span class="text-gray-500">{{ value }}세</span>
                </template>
            </vs-table>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story:
                    '헤더는 `header-`, 바디는 `item-` 접두사를 쓰고 `-${colKey}` → `-col{colIdx}-row{rowIdx}` → ' +
                    '`-row{rowIdx}` → `-col{colIdx}` → 접두사 단독 순으로 매칭됩니다.',
            },
        },
    },
};

export const Selectable: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const selectedItems = ref<VsTableItem[]>([]);
            const selectable = (item: VsTableItem) => item.name !== 'Jim';
            return { columns: baseColumns, items: baseItems, selectedItems, selectable };
        },
        template: `
            <div>
                <vs-table
                    :columns="columns"
                    :items="items"
                    :selectable="selectable"
                    item-key="id"
                    v-model:selected-items="selectedItems"
                />
                <p class="mt-2 text-sm">Selected: {{ selectedItems.map((item) => item.name).join(', ') || '-' }}</p>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'selectable을 true 또는 함수로 전달해 선택 가능한 행만 체크박스를 노출합니다.',
            },
        },
    },
};

export const SortableColumns: Story = {
    args: { columns: sortableColumns, items: [...baseItems].reverse() },
    parameters: {
        docs: {
            description: {
                story: 'sortable 컬럼은 헤더 아이콘 클릭으로 오름차순 → 내림차순 → 해제 순으로 토글됩니다.',
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
        search: { placeholder: 'Search name/age', useRegex: true, useCaseSensitive: false },
    },
    parameters: {
        docs: {
            description: {
                story:
                    '검색은 렌더링된 셀 값을 대상으로 동작합니다. `skipSearch`가 설정된 Email 컬럼은 ' +
                    '화면에 보이지만 검색 대상에서 제외됩니다.',
            },
        },
    },
};

export const SearchExtraKeys: Story = {
    args: {
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'age', label: 'Age' },
        ],
        items: baseItems.map((item, index) => ({
            ...item,
            department: index % 2 === 0 ? 'Engineering' : 'Design',
        })),
        search: { placeholder: 'Try "Design"', extraKeys: ['department'] },
    },
    parameters: {
        docs: {
            description: {
                story: '`search.extraKeys`에 지정한 키는 컬럼으로 렌더링되지 않아도 검색 대상에 포함됩니다.',
            },
        },
    },
};

export const Expandable: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const items = baseItems.map((item) => ({ ...item, description: `${item.name} 상세 정보` }));
            const expandable = (item: VsTableItem) => Number(item.age) >= 30;
            return { columns: baseColumns, items, expandable };
        },
        template: `
            <vs-table :columns="columns" :items="items" :expandable="expandable" item-key="id">
                <template #expand="{ item }">
                    <div class="p-4">{{ item.description }}</div>
                </template>
            </vs-table>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: '확장 UI는 `expand` 슬롯이 있을 때만 렌더링되고, expandable 함수로 행별 제어가 가능합니다.',
            },
        },
    },
};

export const Empty: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            return { columns: baseColumns };
        },
        template: `
            <vs-table :columns="columns" :items="[]">
                <template #empty>
                    <div class="p-4">조건에 맞는 결과가 없습니다.</div>
                </template>
            </vs-table>
        `,
    }),
    parameters: {
        docs: { description: { story: 'empty 슬롯으로 기본 NO DATA 자리표시자를 대체합니다.' } },
    },
};

export const Loading: Story = {
    args: { items: baseItems, loading: true, search: true, pagination: true },
    parameters: {
        docs: { description: { story: 'loading이면 셀이 스켈레톤으로 바뀌고 검색/페이지네이션이 비활성화됩니다.' } },
    },
};

export const ColumnWidth: Story = {
    args: {
        columns: [
            { key: 'name', label: 'Name', width: '10rem' },
            { key: 'age', label: 'Age', minWidth: '4rem', maxWidth: '6rem', align: 'center' },
            { key: 'metadata.email', label: 'Email' },
        ],
        items: baseItems,
    },
    parameters: {
        docs: { description: { story: 'width / minWidth / maxWidth는 grid 트랙으로 변환됩니다.' } },
    },
};

export const StickyHeader: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            return { columns: baseColumns, items: paginationItems.slice(0, 40) };
        },
        template: `
            <div style="height: 20rem; overflow: auto">
                <vs-table :columns="columns" :items="items" sticky-header item-key="id" />
            </div>
        `,
    }),
    parameters: {
        docs: { description: { story: '스크롤로 헤더가 화면에서 벗어나면 고정 헤더가 나타납니다.' } },
    },
};

export const Sizes: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            return { columns: baseColumns, items: baseItems, sizes: ['xs', 'sm', 'md', 'lg', 'xl'] };
        },
        template: `
            <div class="flex flex-col gap-6">
                <div v-for="size in sizes" :key="size">
                    <h4 class="mb-2 text-sm">{{ size }}</h4>
                    <vs-table :columns="columns" :items="items" :size="size" />
                </div>
            </div>
        `,
    }),
};

export const Responsive: Story = {
    args: { columns: baseColumns, items: baseItems, responsive: true },
    parameters: {
        docs: { description: { story: '좁은 화면에서는 컬럼을 세로로 쌓아 label과 값을 나란히 보여줍니다.' } },
    },
};

export const WithPagination: Story = {
    args: { columns: baseColumns, items: paginationItems, pagination: true },
};

export const WithCustomPagination: Story = {
    args: {
        columns: baseColumns,
        items: paginationItems,
        pagination: {
            pageSizeOptions: [
                { label: '5개씩', value: 5 },
                { label: '10개씩', value: 10 },
            ],
            showingLength: 5,
            edgeButtons: true,
        },
    },
};

export const WithSearchSortPagination: Story = {
    args: { columns: sortableColumns, items: paginationItems, search: true, pagination: true },
    parameters: {
        docs: { description: { story: '검색 → 정렬 → 페이지네이션 순으로 적용됩니다.' } },
    },
};

export const ServerMode: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const page = ref(0);
            const pageSize = ref(10);
            const items = ref<VsTableItem[]>(paginationItems.slice(0, 10));
            const loading = ref(false);

            const fetchData = (nextPage: number, nextPageSize: number) => {
                loading.value = true;
                setTimeout(() => {
                    items.value = paginationItems.slice(nextPage * nextPageSize, (nextPage + 1) * nextPageSize);
                    loading.value = false;
                }, 300);
            };

            return { columns: baseColumns, items, page, pageSize, loading, fetchData };
        },
        template: `
            <vs-table
                :columns="columns"
                :items="items"
                :loading="loading"
                server-mode
                item-key="id"
                :pagination="{ totalItemCount: 120 }"
                v-model:page="page"
                v-model:page-size="pageSize"
                @paginate="fetchData"
            />
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'server-mode에서는 클라이언트 페이징을 하지 않고, paginate 이벤트로 받은 페이지 데이터를 그대로 렌더링합니다.',
            },
        },
    },
};

export const Draggable: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const totalItems = ref<VsTableItem[]>([]);
            return { columns: sortableColumns, items: baseItems, totalItems };
        },
        template: `
            <div>
                <p class="mb-2 text-sm">행을 드래그해 순서를 바꿔보세요. 정렬이 켜져 있어도 드래그할 수 있습니다.</p>
                <vs-table
                    :columns="columns"
                    :items="items"
                    draggable
                    item-key="id"
                    v-model:total-items="totalItems"
                />
                <p class="mt-2 text-sm">현재 순서: {{ totalItems.map((item) => item.name).join(' → ') }}</p>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story:
                    '드래그는 `items`를 바꾸지 않고 화면에 보이는 순서를 재배열합니다. ' +
                    '바뀐 순서는 `v-model:total-items` / `v-model:paged-items`로 가져옵니다.',
            },
        },
    },
};

export const BoundItems: Story = {
    render: () => ({
        components: { VsTable },
        setup() {
            const pagedItems = ref<VsTableItem[]>([]);
            const totalItems = ref<VsTableItem[]>([]);
            const selectedItems = ref<VsTableItem[]>([]);
            return {
                columns: sortableColumns,
                items: paginationItems.slice(0, 20),
                pagedItems,
                totalItems,
                selectedItems,
            };
        },
        template: `
            <div>
                <vs-table
                    :columns="columns"
                    :items="items"
                    item-key="id"
                    selectable
                    search
                    :pagination="{ pageSizeOptions: [{ label: '5개씩', value: 5 }] }"
                    v-model:paged-items="pagedItems"
                    v-model:total-items="totalItems"
                    v-model:selected-items="selectedItems"
                />
                <ul class="mt-2 text-sm">
                    <li>현재 페이지: {{ pagedItems.length }}개</li>
                    <li>검색/정렬 반영 전체: {{ totalItems.length }}개</li>
                    <li>선택: {{ selectedItems.length }}개</li>
                </ul>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: '검색 · 정렬 · 드래그 · 선택 상태가 반영된 아이템을 세 개의 v-model로 가져옵니다.',
            },
        },
    },
};
