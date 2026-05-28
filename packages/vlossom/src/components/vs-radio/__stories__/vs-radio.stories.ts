import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, colorScheme, getColorSchemeTemplate } from '@/storybook';

import VsContainer from '@/components/vs-container/VsContainer.vue';
import VsRadio from './../VsRadio.vue';
import { useTemplateRef } from 'vue';

const meta: Meta<typeof VsRadio> = {
    title: 'Components/Input Components/VsRadio',
    component: VsRadio,
    render: (args: any) => ({
        components: { VsRadio },
        setup() {
            return { args };
        },
        template: '<vs-radio v-bind="args" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
            description: '라디오 크기 (크기 · 라벨 폰트)',
            table: { defaultValue: { summary: 'md' } },
        },
    },
    args: {
        radioLabel: 'Radio Input',
        noMessages: true,
        name: 'test',
        radioValue: 'test',
    },
};

export default meta;
type Story = StoryObj<typeof VsRadio>;

export const Default: Story = {};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'size prop으로 라디오 크기와 라벨 폰트를 한꺼번에 조절합니다.',
            },
        },
    },
    render: () => ({
        components: { VsRadio },
        setup() {
            const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
            return { sizes };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div v-for="size in sizes" :key="size">
                    <p style="margin: 0 0 0.5rem; font-weight: 600;">size = "{{ size }}"</p>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <vs-radio :size="size" :name="'radio-' + size" radio-value="a" radio-label="Option A" checked />
                        <vs-radio :size="size" :name="'radio-' + size" radio-value="b" radio-label="Option B" />
                        <vs-radio :size="size" :name="'radio-' + size" radio-value="c" radio-label="Disabled" disabled />
                    </div>
                </div>
            </div>
        `,
    }),
};

export const ColorScheme: Story = {
    render: (args: any) => ({
        components: { VsRadio },
        setup() {
            return { args };
        },
        template: `
            <div>
                ${getColorSchemeTemplate(`
                    <vs-radio v-bind="args"
                        color-scheme="{{ color }}"
                        name="color"
                        radio-value="{{ color }}"
                        radio-label="Radio ({{ color }})"
                    />
                `)}
            </div>
        `,
    }),
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const State: Story = {
    render: (args: any) => ({
        components: { VsRadio },
        setup() {
            const states = ['success', 'info', 'error', 'warning'];
            return { args, states };
        },
        template: `
            <div>
                <vs-radio v-for="state in states" :key="state" v-bind="args" :label="\`State (\${state})\`" :state="state" :radio-value="state" :radio-label="state" style="marginBottom: 16px" />
            </div>
        `,
    }),
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const Label: Story = {
    args: {
        label: 'Label',
    },
};

export const Messages: Story = {
    args: {
        messages: [{ state: 'info', text: 'This is info message' }],
        noMessages: false,
    },
};

export const Readonly: Story = {
    args: {
        readonly: true,
    },
};

export const BeforeChange: Story = {
    args: {
        beforeChange: async (from: any, to: any, optionValue: any) => {
            alert(`beforeChange called: from=${from}, to=${to}, value=${optionValue}`);
            return true;
        },
    },
};

export const Required: Story = {
    render: (args: any) => ({
        components: { VsRadio },
        setup() {
            const radioRef = useTemplateRef('radioRef');

            function validate() {
                (radioRef.value as any).validate();
            }

            return { args, validate, radioRef };
        },
        template: `<div>
            <vs-radio ref="radioRef" v-bind="args" name="required" label="Radio (required)" required style="margin-bottom: 16px" />
            <vs-button @click="validate">Validate</vs-button>
        </div>`,
    }),
};

export const Width: Story = {
    render: (args: any) => ({
        components: { VsRadio, VsContainer },
        setup() {
            return { args };
        },
        template: `
            <vs-container>
                <vs-radio v-bind="args" name="width" radio-value="test1" />
                <vs-radio v-bind="args" name="width" radio-value="test2" />
            </vs-container>
        `,
    }),
    args: {
        width: { sm: '200px', md: '300px', lg: '400px', xl: '500px' },
    },
};

export const Grid: Story = {
    render: (args: any) => ({
        components: { VsRadio, VsContainer },
        setup() {
            return { args };
        },
        template: `
            <vs-grid>
                <vs-radio v-bind="args" name="grid" />
                <vs-radio v-bind="args" name="grid" />
                <vs-radio v-bind="args" name="grid" />
                <vs-radio v-bind="args" name="grid" />
            </vs-grid>
        `,
    }),
    args: {
        grid: { md: 4, lg: 3 },
    },
};

export const StyleSet: Story = {
    args: {
        styleSet: {
            $radioColor: '#ac77c8',
            $radioSize: '1.5rem',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    args: {
        styleSet: 'myStyleSet',
    },
};
