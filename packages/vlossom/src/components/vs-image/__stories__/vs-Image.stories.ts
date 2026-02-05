import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters } from '@/storybook/parameters';
import { src, fallbackSrc, lazySrc } from './constants';
import VsImage from './../VsImage.vue';

const meta: Meta<typeof VsImage> = {
    title: 'Components/Base Components/VsImage',
    component: VsImage,
    render: (args: any) => ({
        components: { VsImage },
        setup() {
            return { args };
        },
        template: '<vs-image v-bind="args"/>',
    }),
    args: {
        src,
    },
    tags: ['autodocs'],
    argTypes: {},
};

export default meta;
type Story = StoryObj<typeof VsImage>;

export const Default: Story = {
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const Fallback: Story = {
    render: (args: any) => ({
        components: { VsImage },
        setup() {
            return { args };
        },
        template: '<vs-image v-bind="args"/>',
    }),
    args: {
        src: '',
        fallback: fallbackSrc,
    },
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const Alt: Story = {
    render: (args: any) => ({
        components: { VsImage },
        setup() {
            return { args };
        },
        template: '<vs-image v-bind="args"/>',
    }),
    args: {
        src: '',
        alt: 'alternative text',
    },
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const Lazy: Story = {
    render: (args: any) => ({
        components: { VsImage },
        setup() {
            return { args };
        },
        template: '<vs-image v-bind="args"/>',
    }),
    args: {
        src: lazySrc,
        lazy: true,
    },
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const StyleSet: Story = {
    args: {
        styleSet: {
            variables: {
                width: '300px',
                height: '300px',
            },
        },
    },
};

export const SkeletonStyleSet: Story = {
    render: (args: any) => ({
        components: { VsImage },
        setup() {
            return { args };
        },
        template: '<vs-image v-bind="args"/>',
    }),
    args: {
        src: lazySrc,
        styleSet: {
            variables: {
                width: '200px',
                height: '200px',
            },
            skeleton: {
                component: {
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e0e0',
                },
            },
        },
    },
};

export const PreDefinedStyleSet: Story = {
    args: {
        styleSet: 'myStyleSet',
    },
};
