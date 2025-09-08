import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters } from '@/storybook';
import VsThemeButton from '../VsThemeButton.vue';

const meta: Meta<typeof VsThemeButton> = {
    title: 'Chromatic/Base Components/VsThemeButton',
    component: VsThemeButton,
    parameters: {
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsThemeButton },
        setup() {
            return { args };
        },
        template: '<vs-theme-button v-bind="args">Theme Button</vs-theme-button>',
    }),
};

export default meta;
type Story = StoryObj<typeof VsThemeButton>;

export const Default: Story = {};
