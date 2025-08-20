import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsDivider from './../VsDivider.vue';

const meta: Meta<typeof VsDivider> = {
    title: 'Chromatic/Base Components/VsDivider',
    component: VsDivider,
    render: (args: any) => ({
        components: { VsDivider },
        setup() {
            return { args };
        },
        template: `
            <div class="h-10 w-[769px]">
                <vs-divider v-bind="args"/>
                <vs-divider v-bind="args" vertical/>
            </div>
        `,
    }),
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsDivider>;

export const Default: Story = {};
