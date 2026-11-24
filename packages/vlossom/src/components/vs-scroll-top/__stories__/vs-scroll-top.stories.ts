import { getColorSchemeTemplate } from '@/storybook';
import VsScrollTop from './../VsScrollTop.vue';
import VsButton from '@/components/vs-button/VsButton.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

const scrollAreaTemplate = (content: string) => `
    <div style="position: relative;">
        <div id="scroll-area" style="height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 1rem;">
            <p v-for="i in 50" :key="i">Line {{ i }}</p>
        </div>
        ${content}
    </div>
`;

const meta: Meta<typeof VsScrollTop> = {
    title: 'Components/Base Components/VsScrollTop',
    component: VsScrollTop,
    render: (args: any) => ({
        components: { VsScrollTop },
        setup() {
            return { args };
        },
        template: scrollAreaTemplate('<vs-scroll-top v-bind="args" />'),
    }),
    tags: ['autodocs'],
    args: {
        target: '#scroll-area',
    },
};

export default meta;
type Story = StoryObj<typeof VsScrollTop>;

export const Default: Story = {};

export const Threshold: Story = {
    args: {
        threshold: 0,
    },
};

export const ColorScheme: Story = {
    args: {
        target: '',
        threshold: 0,
    },
    render: (args: any) => ({
        components: { VsScrollTop },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <div style="position: relative; width: 4rem; height: 4rem;">
                        <vs-scroll-top v-bind="args" color-scheme="{{ color }}" :style-set="{ right: 0, bottom: 0 }" />
                    </div>
                `)}
            </div>
        `,
    }),
};

export const Primary: Story = {
    args: {
        primary: true,
    },
};

export const Outline: Story = {
    args: {
        outline: true,
    },
};

export const Ghost: Story = {
    args: {
        ghost: true,
    },
};

export const Size: Story = {
    args: {
        size: 'lg',
    },
};

export const NoAnimation: Story = {
    args: {
        noAnimation: true,
    },
};

export const CustomButton: Story = {
    render: (args: any) => ({
        components: { VsScrollTop, VsButton },
        setup() {
            return { args };
        },
        template: scrollAreaTemplate(`
            <vs-scroll-top v-bind="args" v-slot="{ scrollToTop }">
                <vs-button outline aria-label="Scroll to top" @click="scrollToTop">TOP</vs-button>
            </vs-scroll-top>
        `),
    }),
};

export const StyleSet: Story = {
    args: {
        styleSet: {
            right: 'auto',
            left: '1rem',
            bottom: '1rem',
            $button: {
                borderRadius: '50%',
                width: '3rem',
                height: '3rem',
            },
        },
    },
};
