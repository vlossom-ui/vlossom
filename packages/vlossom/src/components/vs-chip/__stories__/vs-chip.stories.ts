import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsChip from './../VsChip.vue';
import type { VsChipStyleSet } from './../types';

const meta: Meta<typeof VsChip> = {
    title: 'Components/Base Components/VsChip',
    component: VsChip,
    parameters: {
        docs: {
            description: {
                component: 'VsChip은 작은 정보나 태그를 표시하는 칩 컴포넌트입니다. 아이콘과 닫기 버튼을 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsChip },
        setup() {
            const preDefinedStyleSet: VsChipStyleSet = {
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196f3',
                borderRadius: '16px',
                fontColor: '#1976d2',
                height: '2rem',
                padding: '0 0.75rem',
                width: 'auto',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsChip: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-chip v-bind="args">Chip</vs-chip>',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        closable: {
            control: 'boolean',
            description: '닫기 버튼 표시 여부',
        },
        small: {
            control: 'boolean',
            description: '작은 크기',
        },
        primary: {
            control: 'boolean',
            description: '강조 스타일',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsChip>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 칩입니다. 기본적인 스타일과 기능을 제공합니다.',
            },
        },
    },
};

export const WithIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: '아이콘이 포함된 칩입니다. icon slot을 사용하여 아이콘을 추가할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsChip },
        setup() {
            return { args };
        },
        template: `
            <vs-chip v-bind="args">
                <template #icon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                </template>
                Success
            </vs-chip>
        `,
    }),
};

export const Closable: Story = {
    parameters: {
        docs: {
            description: {
                story: '닫기 버튼이 있는 칩입니다. closable prop을 true로 설정하면 닫기 버튼이 표시됩니다.',
            },
        },
    },
    args: {
        closable: true,
    },
};

export const Primary: Story = {
    parameters: {
        docs: {
            description: {
                story: '주요 정보를 나타내는 primary 스타일 칩입니다.',
            },
        },
    },
    args: {
        primary: true,
    },
};

export const Small: Story = {
    parameters: {
        docs: {
            description: {
                story: '작은 크기의 칩입니다. small prop을 사용하여 더 작은 크기로 표시할 수 있습니다.',
            },
        },
    },
    args: {
        small: true,
    },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 크기의 칩들입니다. 기본 크기와 small 크기를 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsChip },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <vs-chip v-bind="args" small>small</vs-chip>
                <vs-chip v-bind="args">default</vs-chip>
            </div>
        `,
    }),
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 칩들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsChip },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-chip v-bind="args" color-scheme="{{ color }}">{{ color }}</vs-chip>
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 칩입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsChip },
        setup() {
            return { args };
        },
        template: '<vs-chip v-bind="args">커스텀 칩</vs-chip>',
    }),
    args: {
        styleSet: {
            backgroundColor: '#f3e5f5',
            border: '2px solid #9c27b0',
            borderRadius: '20px',
            fontColor: '#7b1fa2',
            height: '2.5rem',
            opacity: 0.8,
            padding: '0 1rem',
            width: 'auto',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 칩입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myStyleSet',
    },
};
