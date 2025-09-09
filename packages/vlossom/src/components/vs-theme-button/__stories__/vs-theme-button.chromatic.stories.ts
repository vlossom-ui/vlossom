import VsThemeButton from './../VsThemeButton.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, getColorSchemeTemplate } from '@/storybook';

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
        template: `
            ${getColorSchemeTemplate(`
                <vs-theme-button v-bind="args" color-scheme="{{ color }}" />
            `)}
        `,
    }),
};

export default meta;
type Story = StoryObj<typeof VsThemeButton>;

export const Default: Story = {};
