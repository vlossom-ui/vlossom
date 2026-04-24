import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsBlock from '@/components/vs-block/VsBlock.vue';
import VsGrid from '@/components/vs-grid/VsGrid.vue';
import type { VsBlockStyleSet } from './../types';

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
                variables: {
                    border: '1px solid #e9ecef',
                },
                component: {
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    color: '#495057',
                },
                title: {
                    backgroundColor: '#f8f9fa',
                    color: '#212529',
                    padding: '1.5rem',
                },
            };

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
            variables: {
                border: '2px solid #2196f3',
            },
            component: {
                backgroundColor: '#e3f2fd',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                color: '#1565c0',
            },
            title: {
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '2rem',
            },
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

export const HeightVariations: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 높이 설정의 블록들입니다. height prop을 사용하여 원하는 높이로 조정할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBlock },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; gap: 1rem;">
                <vs-block v-bind="args" height="300px" width="200px">
                    <template #title>고정 높이 (300px)</template>
                    고정된 높이로 설정된 블록입니다. 스크롤이 생깁니다.
                </vs-block>

                <vs-block v-bind="args" height="400" width="200px">
                    <template #title>숫자 높이 (400)</template>
                    숫자로 높이를 설정하면 자동으로 px 단위가 적용됩니다.
                </vs-block>

                <vs-block v-bind="args" width="200px">
                    <template #title>자동 높이</template>
                    height를 지정하지 않으면 콘텐츠에 맞게 자동으로 높이가 조정됩니다.
                </vs-block>
            </div>
        `,
    }),
};

export const StyleCustomization: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 스타일 커스터마이징 예제입니다. variables, component, title, content 영역을 각각 커스터마이징할 수 있습니다.',
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
                <vs-block :style-set="{ variables: { border: '3px dashed #9c27b0' }, component: { borderRadius: '16px' } }">
                    <template #title>Border 커스텀</template>
                    border 변수로 테두리 스타일을 변경할 수 있습니다.
                </vs-block>

                <vs-block :style-set="{ title: { backgroundColor: '#4caf50', color: '#fff', fontWeight: '700', padding: '1.5rem' } }">
                    <template #title>Title 영역 커스텀</template>
                    title 영역의 배경색, 글자색, 패딩 등을 변경할 수 있습니다.
                </vs-block>

                <vs-block :style-set="{ content: { backgroundColor: '#fff3e0', padding: '2rem', fontSize: '1.1rem' } }">
                    <template #title>Content 영역 커스텀</template>
                    content 영역의 배경색, 패딩, 폰트 크기 등을 변경할 수 있습니다.
                </vs-block>

                <vs-block :style-set="{ variables: { border: '2px solid #ff5722' }, component: { backgroundColor: '#ffebee', borderRadius: '20px', boxShadow: '0 8px 16px rgba(244, 67, 54, 0.2)' }, title: { backgroundColor: '#ff5722', color: '#fff', padding: '1rem 2rem' }, content: { padding: '2rem', lineHeight: '1.8' } }">
                    <template #title>종합 커스텀</template>
                    모든 영역을 동시에 커스터마이징하여 완전히 새로운 디자인을 만들 수 있습니다.
                </vs-block>
            </div>
        `,
    }),
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
