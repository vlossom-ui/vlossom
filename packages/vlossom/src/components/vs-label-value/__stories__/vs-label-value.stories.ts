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
                },
                label: {
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '1rem 1.5rem',
                },
                value: {
                    backgroundColor: '#f8fafc',
                    color: '#334155',
                    padding: '1rem 1.5rem',
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
        vertical: {
            control: 'boolean',
            description: '레이블-값을 항상 세로 배치',
        },
        responsive: {
            control: 'boolean',
            description: '컨테이너 768px 이하에서 세로 배치로 전환',
        },
        width: {
            control: 'text',
            description: '컴포넌트 너비 (예: 400px)',
        },
        grid: {
            control: { type: 'number', min: 1, max: 12 },
            description: '12 그리드 시스템 기반 너비 (1~12)',
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

export const Vertical: Story = {
    args: {
        vertical: true,
    },
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            return { args };
        },
        template: `
            <vs-label-value v-bind="args">
                <template #label>Vertical Layout</template>
                레이블이 위, 값이 아래로 배치됩니다.
            </vs-label-value>
        `,
    }),
};

export const Responsive: Story = {
    args: {
        responsive: true,
    },
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            return { args };
        },
        template: `
            <div style="container-type: inline-size; width: 100%;">
                <vs-label-value v-bind="args">
                    <template #label>Responsive Vertical</template>
                    ${LOREM_IPSUM}
                </vs-label-value>
            </div>
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
            },
            label: {
                backgroundColor: '#a1e224',
                color: '#065f46',
                padding: '0.75rem 1rem',
            },
            value: {
                backgroundColor: '#ecfdf5',
                color: '#047857',
                padding: '0.75rem 1rem',
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

export const GridLayout: Story = {
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            return { args };
        },
        template: `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <vs-label-value>
                    <template #label>Email</template>
                    john@example.com
                </vs-label-value>
                <vs-label-value>
                    <template #label>Phone</template>
                    010-1234-5678
                </vs-label-value>
                <vs-label-value>
                    <template #label>Address</template>
                    Seoul, Korea
                </vs-label-value>
                <vs-label-value>
                    <template #label>Company</template>
                    Vlossom Inc.
                </vs-label-value>
            </div>
        `,
    }),
};
