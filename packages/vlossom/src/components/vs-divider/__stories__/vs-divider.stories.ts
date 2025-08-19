import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, colorScheme, getColorSchemeTemplate } from '@/storybook';
import VsDivider from './../VsDivider.vue';

const meta: Meta<typeof VsDivider> = {
    title: 'Components/Base Components/VsDivider',
    component: VsDivider,
    render: (args: any) => ({
        components: { VsDivider },
        setup() {
            return { args };
        },
        template: '<vs-divider v-bind="args"/>',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsDivider>;

export const Default: Story = {
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const ColorScheme: Story = {
    render: (args: any) => ({
        components: { VsDivider },
        setup() {
            return { args };
        },
        template: `
            <div class="hello">
                ${getColorSchemeTemplate('{{color}}<vs-divider v-bind="args" color-scheme="{{ color }}" />')}
            </div>
        `,
    }),
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const Vertical: Story = {
    args: {
        vertical: true,
    },
    render: (args: any) => ({
        components: { VsDivider },
        setup() {
            return { args };
        },
        template: `
            <div class="h-10">
                <vs-divider v-bind="args" />
                <vs-divider v-bind="args" />
                <vs-divider v-bind="args" />
            </div>
        `,
    }),
};

export const VerticalWithMobileFull: Story = {
    args: {
        styleSet: {
            vertical: {
                height: '40px',
            },
        },
        vertical: true,
        responsive: true,
    },
    render: (args: any) => ({
        components: { VsDivider },
        setup() {
            return { args };
        },
        template: `
            <vs-grid>
                <vs-divider v-bind="args" />
                <vs-divider v-bind="args" />
                <vs-divider v-bind="args" />
            </vs-grid>
        `,
    }),
    parameters: {
        chromatic: chromaticParameters.mobile,
    },
};

export const VerticalWithStyleSet: Story = {
    args: {
        styleSet: {
            border: '1px dashed red',
            vertical: {
                height: '4rem',
            },
        },
        vertical: true,
    },
};

export const StyleSet: Story = {
    args: {
        styleSet: { border: '3px dashed #2d9596' },
    },
};
