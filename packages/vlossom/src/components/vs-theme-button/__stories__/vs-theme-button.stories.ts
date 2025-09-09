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

export const StyleSet: Story = {
    args: {
        styleSet: {
            toggle: {
                backgroundColor: '#DEB3AD',
                borderRadius: '1rem',
                width: '3rem',
            },
            iconColor: '#B95C50',
        },
    },
};
