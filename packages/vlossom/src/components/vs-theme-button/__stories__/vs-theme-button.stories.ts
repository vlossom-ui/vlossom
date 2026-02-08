import { getColorSchemeTemplate } from '@/storybook';
import VsThemeButton from './../VsThemeButton.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof VsThemeButton> = {
    title: 'Components/Base Components/VsThemeButton',
    component: VsThemeButton,
    render: (args: any) => ({
        components: { VsThemeButton },
        setup() {
            return { args };
        },
        template: '<vs-theme-button v-bind="args"/>',
    }),
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VsThemeButton>;

export const Default: Story = {};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 버튼들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsThemeButton },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-theme-button v-bind="args" color-scheme="{{ color }}">{{ color }}</vs-theme-button>
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    args: {
        styleSet: {
            variables: {
                width: '3rem',
                iconColor: '#B95C50',
            },
            button: {
                component: {
                    backgroundColor: '#DEB3AD',
                    borderRadius: '1rem',
                },
            },
        },
    },
};
