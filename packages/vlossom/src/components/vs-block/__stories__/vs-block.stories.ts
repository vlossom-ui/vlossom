import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsBlock from '@/components/vs-block/VsBlock.vue';
import VsGrid from '@/components/vs-grid/VsGrid.vue';
import type { VsBlockStyleSet } from '../types';

const meta: Meta<typeof VsBlock> = {
    title: 'Components/Base Components/VsBlock',
    component: VsBlock,
    parameters: {
        docs: {
            description: {
                component:
                    'VsBlock은 콘텐츠를 구성하고 그룹화하는 블록 컴포넌트입니다.' +
                    '타이틀과 콘텐츠 영역을 제공하며, 다양한 스타일 커스터마이징과 반응형 레이아웃을 지원합니다.',
            },
        },
    },
    argTypes: {
        title: {
            control: 'text',
            type: 'string',
            description: 'Title slot content',
            table: {
                category: 'slots',
            },
        },
        default: {
            control: 'text',
            type: 'string',
            description: 'Default slot content',
            table: {
                category: 'slots',
            },
        },
    } as any,
    args: {
        styleSet: {},
        title: 'Block Title',
        default: 'This is Block Content. Title and Default is added via slot.',
    } as any,
    render: (args: any) => ({
        components: { VsBlock },
        setup() {
            const preDefinedStyleSet: VsBlockStyleSet = {
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '1.5rem',
                title: {
                    fontWeight: '600',
                    fontSize: '1.2rem',
                    fontColor: '#212529',
                    bottomBorder: '1px solid #e9ecef',
                },
                fontColor: '#495057',
                fontSize: '1rem',
                lineHeight: '1.6',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsBlock: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: `
            <vs-block v-bind="args">
                <template #title>{{ args.title }}</template>
                {{ args.default }}
            </vs-block>
        `,
    }),
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VsBlock>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 블록입니다. 타이틀과 콘텐츠 영역을 제공하는 기본적인 블록 컴포넌트입니다.',
            },
        },
    },
};

export const WithoutTitle: Story = {
    parameters: {
        docs: {
            description: {
                story: '타이틀 없는 블록입니다. 콘텐츠만 표시할 때 사용합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBlock },
        setup() {
            return { args };
        },
        template: `
            <vs-block v-bind="args">
                타이틀 없이 콘텐츠만 표시되는 블록입니다.
            </vs-block>
        `,
    }),
};

export const WidthVariations: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 너비 설정의 블록들입니다. width prop을 사용하여 원하는 크기로 조정할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBlock },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-block v-bind="args" width="300px">
                    <template #title>고정 너비 (300px)</template>
                    고정된 너비로 설정된 블록입니다.
                </vs-block>

                <vs-block v-bind="args" width="50%">
                    <template #title>상대 너비 (50%)</template>
                    부모 요소의 50% 너비로 설정된 블록입니다.
                </vs-block>

                <vs-block v-bind="args" width="100%">
                    <template #title>전체 너비 (100%)</template>
                    부모 요소의 전체 너비를 사용하는 블록입니다.
                </vs-block>
            </div>
        `,
    }),
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 블록들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsBlock },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${getColorSchemeTemplate(`
                    <vs-block v-bind="args" color-scheme="{{ color }}">
                        <template #title>{{ color }} 테마</template>
                        {{ color }} 색상 테마가 적용된 블록입니다.
                    </vs-block>
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 블록입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBlock },
        setup() {
            return { args };
        },
        template: `
            <vs-block v-bind="args">
                <template #title>커스텀 스타일 블록</template>
                커스텀 스타일이 적용된 블록입니다. 
                배경색, 테두리, 폰트 등이 커스터마이징 되어 있습니다.
            </vs-block>
        `,
    }),
    args: {
        styleSet: {
            backgroundColor: '#e3f2fd',
            border: '2px solid #2196f3',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
            title: {
                fontWeight: '700',
                fontSize: '1.4rem',
                fontColor: '#1976d2',
                bottomBorder: '2px solid #2196f3',
            },
            fontColor: '#1565c0',
            fontSize: '1.1rem',
            lineHeight: '1.7',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 블록입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myStyleSet',
    },
};

export const Grid: Story = {
    parameters: {
        docs: {
            description: {
                story: '그리드 레이아웃이 활성화된 블록입니다. grid prop을 사용하여 반응형 그리드 레이아웃을 적용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBlock, VsGrid },
        setup() {
            return { args };
        },
        template: `
            <vs-grid grid-size="2" column-gap="16px" row-gap="16px" height="400px">
                <vs-block v-bind="args">
                    <template #title>Grid Block 1</template>
                    그리드 레이아웃에 배치된 첫 번째 블록입니다.
                </vs-block>
                <vs-block v-bind="args">
                    <template #title>Grid Block 2</template>
                    그리드 레이아웃에 배치된 두 번째 블록입니다.
                </vs-block>
                <vs-block v-bind="args">
                    <template #title>Grid Block 3</template>
                    그리드 레이아웃에 배치된 세 번째 블록입니다.
                </vs-block>
                <vs-block v-bind="args">
                    <template #title>Grid Block 4</template>
                    그리드 레이아웃에 배치된 네 번째 블록입니다.
                </vs-block>
                <vs-block grid="2">
                    <template #title>Grid Block 5</template>
                    그리드 레이아웃에 배치된 다섯 번째 블록입니다.
                </vs-block>
            </vs-grid>
        `,
    }),
    args: {
        grid: '1',
    },
};
