import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VsTable from './../VsTable.vue';

const meta: Meta<typeof VsTable> = {
    title: 'Components/Base Components/VsTable',
    component: VsTable,
    parameters: {
        docs: {
            description: {
                component: 'VsTable is a component that displays a table of data.',
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
    tags: ['autodocs'],
    argTypes: {
        headers: {
            control: { type: 'object' },
            description: 'The headers of the table.',
        },
        items: {
            control: { type: 'object' },
            description: 'The items of the table.',
        },
        stickyHeader: {
            control: 'boolean',
            description: 'The sticky header of the table.',
        },
        dense: {
            control: 'boolean',
            description: 'The dense header of the table.',
        },
        responsive: {
            control: 'boolean',
            description: 'The responsive header of the table.',
        },
        primary: {
            control: 'boolean',
            description: 'The primary header of the table.',
        },
        loading: {
            control: 'boolean',
            description: 'The loading header of the table.',
        },
        selectable: {
            control: 'boolean',
            description: 'The selectable header of the table.',
        },
        expandable: {
            control: 'boolean',
            description: 'The expandable header of the table.',
        },
        state: {
            control: 'select',
            description: 'The state of the table.',
        },
        search: {
            control: 'boolean',
            description: 'The search header of the table.',
        },
        searchPlaceholder: {
            control: 'text',
            description: 'The search placeholder of the table.',
        },
        searchableKeys: {
            control: 'object',
            description: 'The searchable keys of the table.',
        },
        searchCaseSensitive: {
            control: 'boolean',
            description: 'The search case sensitive of the table.',
        },
        searchRegex: {
            control: 'boolean',
            description: 'The search regex of the table.',
        },
        pagination: {
            control: 'boolean',
            description: 'The pagination of the table.',
        },
        paginationOptions: {
            control: 'object',
            description: 'The pagination options of the table.',
        },
        paginationTotalLength: {
            control: 'number',
            description: 'The pagination total length of the table.',
        },
        paginationEdgeButtons: {
            control: 'boolean',
            description: 'The pagination edge buttons of the table.',
        },
        draggable: {
            control: 'boolean',
            description: 'The draggable of the table.',
        },
        selectedItems: {
            control: 'object',
            description: 'The selected items of the table.',
        },
        pagedItems: {
            control: 'object',
            description: 'The paged items of the table.',
        },
        itemsPerPage: {
            control: 'number',
            description: 'The items per page of the table.',
        },
        currentItems: {
            control: 'object',
            description: 'The current items of the table.',
        },
        page: {
            control: 'number',
            description: 'The page of the table.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsTable>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 테이블입니다. 데이터를 표시합니다.',
            },
        },
    },
};
