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
            radioColor: '#ac77c8',
            radioSize: '1.5rem',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    args: {
        styleSet: 'myStyleSet',
    },
};
