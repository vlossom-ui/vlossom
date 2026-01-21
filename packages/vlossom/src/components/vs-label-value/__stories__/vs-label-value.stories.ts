import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsLabelValue from './../VsLabelValue.vue';
import type { VsLabelValueStyleSet } from '../types';
import { LOREM_IPSUM } from '@/storybook';

const meta: Meta<typeof VsLabelValue> = {
    title: 'Components/Base Components/VsLabelValue',
    component: VsLabelValue,
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            const preDefinedStyleSet: VsLabelValueStyleSet = {
                variables: {
                    border: '2px solid #3b82f6',
                    borderRadius: '12px',
                    label: {
                        backgroundColor: '#dbeafe',
                        fontColor: '#1e40af',
                        padding: '1rem 1.5rem',
                    },
                    value: {
                        backgroundColor: '#f8fafc',
                        fontColor: '#334155',
                        padding: '1rem 1.5rem',
                    },
                },
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsLabelValue: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: `
            <vs-label-value v-bind="args">
                <template #label>{{ args.labelText || '레이블' }}</template>
                {{ args.valueText || '${LOREM_IPSUM}' }}
            </vs-label-value>
        `,
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        dense: {
            control: 'boolean',
            description: '압축된 스타일 적용',
        },
        primary: {
            control: 'boolean',
            description: '강조 스타일 적용',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsLabelValue>;

export const Default: Story = {
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            return { args };
        },
        template: `
            <vs-label-value v-bind="args">
                <template #label>Label</template>
                ${LOREM_IPSUM}
            </vs-label-value>
        `,
    }),
};

export const Primary: Story = {
    args: {
        primary: true,
    },
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <vs-label-value v-bind="args">
                    <template #label>Primary</template>
                    ${LOREM_IPSUM}
                </vs-label-value>
                ${getColorSchemeTemplate(`
                    <vs-label-value v-bind="args" color-scheme="{{ color }}">
                        <template #label>{{ color }} Theme</template>
                        ${LOREM_IPSUM}
                    </vs-label-value>
                `)}
            </div>
        `,
    }),
};

export const Dense: Story = {
    args: {
        dense: true,
    },
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            return { args };
        },
        template: `
            <vs-label-value v-bind="args">
                <template #label>Dense</template>
                ${LOREM_IPSUM}
            </vs-label-value>
        `,
    }),
};

export const LongContent: Story = {
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            return { args };
        },
        template: `
            <div style="max-width: 400px;">
                <vs-label-value v-bind="args">
                    <template #label>Long Content</template>
                    ${LOREM_IPSUM}
                </vs-label-value>
            </div>
        `,
    }),
};

export const ColorScheme: Story = {
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${getColorSchemeTemplate(`
                    <vs-label-value v-bind="args" color-scheme="{{ color }}">
                        <template #label>{{ color }} Theme</template>
                        ${LOREM_IPSUM}
                    </vs-label-value>
                `)}
            </div>
        `,
    }),
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const StyleSet: Story = {
    args: {
        styleSet: {
            variables: {
                border: '2px solid #10b981',
                borderRadius: '8px',
                label: {
                    backgroundColor: '#a1e224',
                    fontColor: '#065f46',
                    padding: '0.75rem 1rem',
                },
                value: {
                    backgroundColor: '#ecfdf5',
                    fontColor: '#047857',
                    padding: '0.75rem 1rem',
                },
            },
            component: {
                opacity: 0.95,
            },
        },
    },
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            return { args };
        },
        template: `
            <vs-label-value v-bind="args">
                <template #label>Custom Style</template>
                ${LOREM_IPSUM}
            </vs-label-value>
        `,
    }),
};
