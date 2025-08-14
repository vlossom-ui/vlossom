import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsSkeleton from './../VsSkeleton.vue';

const meta: Meta<typeof VsSkeleton> = {
    title: 'Chromatic/Base Components/VsSkeleton',
    component: VsSkeleton,
    render: (args: any) => ({
        components: { VsSkeleton },
        setup() {
            return { args };
        },
        template: `
            <div class="w-[200px] h-[200px]">
                <vs-skeleton v-bind="args" />
            </div>`,
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
