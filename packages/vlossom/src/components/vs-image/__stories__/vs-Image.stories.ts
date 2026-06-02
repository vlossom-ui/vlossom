import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters } from '@/storybook/parameters';
import { src, fallbackSrc, lazySrc, brokenSrc } from './constants';
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
        src: brokenSrc,
        fallback: fallbackSrc,
    },
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const FallbackSlot: Story = {
    render: (args: any) => ({
        components: { VsImage },
        setup() {
            return { args };
        },
        template: `
            <vs-image v-bind="args">
                <template #fallback>
                    <div
                        style="display:flex; width:100%; height:100%; align-items:center; justify-content:center; border:1px solid #93c5fd; border-radius:4px; background-color:#eff6ff; color:#2563eb;"
                    >
                        fallback slot
                    </div>
                </template>
            </vs-image>
        `,
    }),
    args: {
        src: brokenSrc,
        width: '200px',
        height: '200px',
    },
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const FallbackPriority: Story = {
    render: (args: any) => ({
        components: { VsImage },
        setup() {
            return { args };
        },
        template: `
            <vs-image v-bind="args">
                <template #fallback>
                    <div
                        style="display:flex; width:100%; height:100%; align-items:center; justify-content:center; border:1px solid #fca5a5; border-radius:4px; background-color:#fef2f2; color:#dc2626;"
                    >
                        This slot should not be displayed
                    </div>
                </template>
            </vs-image>
        `,
    }),
    args: {
        src: brokenSrc,
        fallback: fallbackSrc,
        width: '200px',
        height: '200px',
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
        width: '300px',
        height: '300px',
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
        width: '200px',
        height: '200px',
        styleSet: {
            $skeleton: {
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
            },
        },
    },
};

export const PreDefinedStyleSet: Story = {
    args: {
        styleSet: 'myStyleSet',
    },
};
