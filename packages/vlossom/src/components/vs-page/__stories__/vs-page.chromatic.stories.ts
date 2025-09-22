import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters } from '@/storybook';
import VsPage from './../VsPage.vue';

const meta: Meta<typeof VsPage> = {
    title: 'Chromatic/Layout Components/VsPage',
    component: VsPage,
    parameters: {
        chromatic: chromaticParameters.theme,
    },
    argTypes: {
        title: {
            control: 'text',
            type: 'string',
            description: 'Title slot content',
            table: {
                category: 'slots',
            },
        },
        description: {
            control: 'text',
            type: 'string',
            description: 'Description slot content',
            table: {
                category: 'slots',
            },
        },
        default: {
            control: 'text',
            type: 'string',
            description: 'Default slot content',
            table: {
                category: 'slots',
            },
        },
    } as any,
    args: {
        title: 'Page Title',
        description: 'Page Description',
        default: 'This is Page Content. Page Title and Page Description is added via slot.',
    } as any,
    render: (args: any) => ({
        components: { VsPage },
        setup() {
            return { args };
        },
        template: `
        <vs-page v-bind="args">
            <template #title>{{ args.title }}</template>
            <template #description>{{ args.description }}</template>
            {{ args.default }}
        </vs-page>
    `,
    }),
};

export default meta;
type Story = StoryObj<typeof VsPage>;

export const Default: Story = {
    args: {
        styleSet: {},
    },
};
