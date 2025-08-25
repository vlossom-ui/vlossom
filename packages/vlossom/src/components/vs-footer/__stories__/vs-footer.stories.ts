import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsFooter from './../VsFooter.vue';
import type { VsFooterStyleSet } from './../types';

const meta: Meta<typeof VsFooter> = {
    title: 'Components/Base Components/VsFooter',
    component: VsFooter,
    parameters: {
        docs: {
            description: {
                component:
                    'VsFooter는 페이지나 섹션의 푸터를 나타내는 컴포넌트입니다. vs-bar를 기반으로 하며 레이아웃 시스템과 통합됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFooter },
        setup() {
            const preDefinedStyleSet: VsFooterStyleSet = {
                backgroundColor: '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: '0',
                fontColor: '#fff',
                fontSize: '1.125rem',
                fontWeight: '500',
                height: '4rem',
                padding: '0 1.5rem',
                width: '100%',
                position: 'relative',
                zIndex: 'var(--vs-bar-z-index)',
            } as const;

            useVlossom().styleSet = {
                myFooterStyleSet: { VsFooter: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-footer v-bind="args">Footer Content</vs-footer>',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        height: {
            control: 'text',
            description: '푸터의 높이',
        },
        primary: {
            control: 'boolean',
            description: '주요 푸터 스타일',
        },
        position: {
            control: 'select',
            options: ['relative', 'absolute', 'fixed', 'sticky'],
            description: '푸터의 위치 지정',
        },
        styleSet: {
            control: 'object',
            description: '커스텀 스타일 객체',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsFooter>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 푸터입니다. 기본적인 스타일과 기능을 제공합니다.',
            },
        },
    },
};

export const Primary: Story = {
    parameters: {
        docs: {
            description: {
                story: '주요 푸터를 나타내는 primary 스타일입니다.',
            },
        },
    },
    args: {
        primary: true,
    },
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 푸터들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsFooter },
        setup() {
            const styleSet = {
                padding: '0.5rem',
            };
            return { args, styleSet };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-footer v-bind="args" color-scheme="{{ color }}" :style-set="styleSet">
                        {{ color }} 색상 테마 푸터
                    </vs-footer>
                `)}
                ${getColorSchemeTemplate(`
                    <vs-footer v-bind="args" color-scheme="{{ color }}" :style-set="styleSet" primary>
                        {{ color }} 색상 테마 푸터 (Primary)
                    </vs-footer>
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 푸터입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFooter },
        setup() {
            return { args };
        },
        template: '<vs-footer v-bind="args">커스텀 푸터</vs-footer>',
    }),
    args: {
        styleSet: {
            backgroundColor: '#e188e5',
            border: '2px solid #e188e5',
            borderRadius: '8px',
            fontColor: '#fff',
            fontSize: '1.25rem',
            fontWeight: '600',
            height: '5rem',
            padding: '0 2rem',
            width: '100%',
            position: 'relative',
            zIndex: 'var(--vs-bar-z-index)',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 푸터입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myFooterStyleSet',
    },
};
