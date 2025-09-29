import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, colorScheme } from '@/storybook';
import VsProgress from './../VsProgress.vue';

const meta: Meta<typeof VsProgress> = {
    title: 'Chromatic/Base Components/VsProgress',
    component: VsProgress,
    parameters: {
        chromatic: chromaticParameters.theme,
    },
    argTypes: {
        colorScheme,
        max: {
            control: 'number',
            description: '진행률 바의 최대값',
        },
        value: {
            control: 'number',
            description: '현재 진행값',
        },
        label: {
            control: 'text',
            description: '진행률 바에 표시할 라벨 텍스트',
        },
    },
    render: (args: any) => ({
        components: { VsProgress },
        setup() {
            return { args };
        },
        template: `
            <vs-progress v-bind="args" />
        `,
    }),
};

export default meta;
type Story = StoryObj<typeof VsProgress>;

export const Default: Story = {
    args: {
        value: 0.5,
        label: 'Progress Label',
        styleSet: {},
    },
};
