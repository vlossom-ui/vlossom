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
];

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
        columns: null,
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
                story: 'App.vue에 작성된 다양한 슬롯 예제를 그대로 재현한 스토리입니다.',
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
