import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { VsTable } from '@/components';

const meta: Meta<typeof VsTable> = {
    title: 'Chromatic/Base Components/VsTable',
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
};

export default meta;
type Story = StoryObj<typeof VsTable>;

export const Default: Story = {};
