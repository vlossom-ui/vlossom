import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsLoading from './../VsLoading.vue';
import type { VsLoadingStyleSet } from '../types';

const meta: Meta<typeof VsLoading> = {
    title: 'Components/Base Components/VsLoading',
    component: VsLoading,
    render: (args: any) => ({
        components: { VsLoading },
        setup() {
            const preDefinedStyleSet: VsLoadingStyleSet = {
                width: '9rem',
                height: '12rem',
                color: 'cyan',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsLoading: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-loading v-bind="args" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        width: {
            control: 'text',
            description: '로딩 컴포넌트의 너비',
        },
        height: {
            control: 'text',
            description: '로딩 컴포넌트의 높이',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsLoading>;

export const Default: Story = {};

export const CustomSize: Story = {
    args: {
        width: '5rem',
        height: '5rem',
    },
};

export const ColorScheme: Story = {
    render: (args: any) => ({
        components: { VsLoading },
        setup() {
            return { args };
        },
        template: `
            <div>
                ${getColorSchemeTemplate(`
                    <vs-loading v-bind="args" style="margin-right: 12px;" color-scheme="{{ color }}" :style="{ marginBottom: '0.4rem' }" />
			   `)}
            </div>
        `,
    }),
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const StyleSet: Story = {
    render: (args: any) => ({
        components: { VsLoading },
        setup() {
            return { args };
        },
        template: '<vs-loading v-bind="args" />',
    }),
    args: {
        styleSet: {
            width: '4rem',
            height: '4rem',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    args: {
        styleSet: 'myStyleSet',
    },
};
