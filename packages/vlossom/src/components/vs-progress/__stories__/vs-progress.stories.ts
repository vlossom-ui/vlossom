import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsProgress from './../VsProgress.vue';
import type { VsProgressStyleSet } from '../types';

const meta: Meta<typeof VsProgress> = {
    title: 'Components/Base Components/VsProgress',
    component: VsProgress,
    parameters: {
        docs: {
            description: {
                component:
                    'VsProgress는 작업의 진행 상태를 시각적으로 표시하는 진행률 바 컴포넌트입니다. ' +
                    '사용자에게 작업 완료 정도를 직관적으로 전달하며, 라벨과 함께 정확한 수치 정보도 제공할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsProgress },
        setup() {
            const preDefinedStyleSet: VsProgressStyleSet = {
                width: '20rem',
                height: '1.5rem',
                borderRadius: '8px',
                backgroundColor: '#f0f0f0',
                valueColor: '#1e88e5',
                fontSize: '0.9rem',
                fontWeight: '600',
                fontColor: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsProgress: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-progress v-bind="args" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        max: {
            control: 'number',
            description: '진행률 바의 최대값',
        },
        value: {
            control: 'number',
            description: '현재 진행값',
        },
        label: {
            control: 'text',
            description: '진행률 바에 표시할 라벨 텍스트',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsProgress>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 진행률 바입니다. value와 max prop을 통해 진행 상태를 표시합니다.',
            },
        },
    },
    args: {
        value: 30,
        max: 100,
    },
};

export const WithLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: '라벨이 포함된 진행률 바입니다. label prop을 사용하여 진행 상태에 대한 텍스트 정보를 표시할 수 있습니다.',
            },
        },
    },
    args: {
        value: 65,
        max: 100,
        label: '65%',
    },
};

export const Different_Values: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 진행 상태를 보여주는 진행률 바들입니다. 0%부터 100%까지 각기 다른 진행률을 표시합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsProgress },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-progress v-bind="args" :value="0" label="0%" />
                <vs-progress v-bind="args" :value="25" label="25%" />
                <vs-progress v-bind="args" :value="50" label="50%" />
                <vs-progress v-bind="args" :value="75" label="75%" />
                <vs-progress v-bind="args" :value="100" label="100%" />
            </div>
        `,
    }),
    args: {
        max: 100,
    },
};

export const Custom_Range: Story = {
    parameters: {
        docs: {
            description: {
                story: '사용자 정의 범위를 가진 진행률 바입니다. max prop을 조정하여 100이 아닌 다른 최대값을 설정할 수 있습니다.',
            },
        },
    },
    args: {
        value: 150,
        max: 200,
        label: '150/200',
    },
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 진행률 바들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsProgress },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                ${getColorSchemeTemplate(`
                    <vs-progress v-bind="args" color-scheme="{{ color }}" label="{{ color }}" />
                `)}
            </div>
        `,
    }),
    args: {
        value: 70,
        max: 100,
    },
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 진행률 바입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsProgress },
        setup() {
            return { args };
        },
        template: '<vs-progress v-bind="args" />',
    }),
    args: {
        value: 80,
        max: 100,
        label: '80%',
        styleSet: {
            width: '25rem',
            height: '2rem',
            borderRadius: '12px',
            backgroundColor: '#e0e0e0',
            valueColor: '#e188e5',
            fontSize: '1rem',
            fontWeight: '700',
            fontColor: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 진행률 바입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        value: 45,
        max: 100,
        label: '45%',
        styleSet: 'myStyleSet',
    },
};
