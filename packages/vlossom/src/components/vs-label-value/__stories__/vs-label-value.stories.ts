import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsLabelValue from './../VsLabelValue.vue';
import type { VsLabelValueStyleSet } from '../types';

const meta: Meta<typeof VsLabelValue> = {
    title: 'Components/Base Components/VsLabelValue',
    component: VsLabelValue,
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            const preDefinedStyleSet: VsLabelValueStyleSet = {
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                label: {
                    backgroundColor: '#dbeafe',
                    fontColor: '#1e40af',
                    padding: '1rem 1.5rem',
                    fontWeight: '600',
                },
                value: {
                    backgroundColor: '#f8fafc',
                    fontColor: '#334155',
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
                {{ args.valueText || '값' }}
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
                <template #label>이름</template>
                홍길동
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
            <vs-label-value v-bind="args">
                <template #label>중요한 정보</template>
                이것은 중요한 값입니다
            </vs-label-value>
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
                <template #label>압축된 레이블</template>
                작은 크기의 값
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
                    <template #label>긴 레이블 텍스트</template>
                    이것은 반응형 동작을 테스트하기 위한 긴 값입니다. 화면 크기가 작아지면 세로로 배치됩니다.
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
                        <template #label>{{ color }} 테마</template>
                        {{ color }} 색상 스킴이 적용된 값
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
    },
    render: (args: any) => ({
        components: { VsLabelValue },
        setup() {
            return { args };
        },
        template: `
            <vs-label-value v-bind="args">
                <template #label>커스텀 스타일</template>
                스타일이 적용된 값
            </vs-label-value>
        `,
    }),
};
