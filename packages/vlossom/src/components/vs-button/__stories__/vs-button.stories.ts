import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsButton from './../VsButton.vue';
import type { VsButtonStyleSet } from './../types';

const meta: Meta<typeof VsButton> = {
    title: 'Components/Base Components/VsButton',
    component: VsButton,
    parameters: {
        docs: {
            description: {
                component: 'VsButton은 다양한 스타일과 상태를 지원하는 버튼 컴포넌트입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsButton },
        setup() {
            const preDefinedStyleSet: VsButtonStyleSet = {
                backgroundColor: '#1e88e5',
                border: '2px solid #1e88e5',
                borderRadius: '8px',
                fontColor: '#fff',
                fontSize: '1rem',
                fontWeight: '600',
                height: '3rem',
                padding: '0 1.5rem',
                width: 'auto',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsButton: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-button v-bind="args">Button</vs-button>',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        circle: {
            control: 'boolean',
            description: '원형 버튼 스타일',
        },
        disabled: {
            control: 'boolean',
            description: '버튼 비활성화',
        },
        ghost: {
            control: 'boolean',
            description: '고스트 스타일 (투명 배경)',
        },
        large: {
            control: 'boolean',
            description: '큰 크기',
        },
        loading: {
            control: 'boolean',
            description: '로딩 상태',
        },
        outline: {
            control: 'boolean',
            description: '아웃라인 스타일',
        },
        primary: {
            control: 'boolean',
            description: '강조 스타일',
        },
        responsive: {
            control: 'boolean',
            description: '반응형 디자인',
        },
        small: {
            control: 'boolean',
            description: '작은 크기',
        },
        type: {
            control: 'select',
            options: ['button', 'submit', 'reset'],
            description: 'HTML 버튼 타입',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsButton>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 버튼입니다. 기본적인 스타일과 기능을 제공합니다.',
            },
        },
    },
};

export const Primary: Story = {
    parameters: {
        docs: {
            description: {
                story: '주요 액션을 나타내는 primary 스타일 버튼입니다.',
            },
        },
    },
    args: {
        primary: true,
    },
};

export const Outline: Story = {
    parameters: {
        docs: {
            description: {
                story: '테두리만 있는 outline 스타일 버튼입니다.',
            },
        },
    },
    args: {
        outline: true,
    },
};

export const Ghost: Story = {
    parameters: {
        docs: {
            description: {
                story: '투명한 배경의 ghost 스타일 버튼입니다.',
            },
        },
    },
    args: {
        ghost: true,
    },
};

export const Circle: Story = {
    parameters: {
        docs: {
            description: {
                story: '원형 모양의 버튼입니다. 아이콘 버튼에 적합합니다.',
            },
        },
    },
    args: {
        circle: true,
    },
    render: (args: any) => ({
        components: { VsButton },
        setup() {
            return { args };
        },
        template: '<vs-button v-bind="args">X</vs-button>',
    }),
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 크기의 버튼들입니다. small, 기본, large 크기를 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsButton },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; gap: 1rem; align-items: center;">
                <vs-button v-bind="args" small>small</vs-button>
                <vs-button v-bind="args">default</vs-button>
                <vs-button v-bind="args" large>large</vs-button>
            </div>
        `,
    }),
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: '비활성화된 버튼입니다. 클릭할 수 없으며 시각적으로도 구분됩니다.',
            },
        },
    },
    args: {
        disabled: true,
    },
};

export const Loading: Story = {
    parameters: {
        docs: {
            description: {
                story: '로딩 상태의 버튼입니다. 내부에 로딩 스피너가 표시됩니다.',
            },
        },
    },
    args: {
        loading: true,
    },
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 버튼들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsButton },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-button v-bind="args" color-scheme="{{ color }}">{{ color }}</vs-button>
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 버튼입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsButton },
        setup() {
            return { args };
        },
        template: '<vs-button v-bind="args">커스텀 버튼</vs-button>',
    }),
    args: {
        styleSet: {
            backgroundColor: '#e188e5',
            border: '2px solid #e188e5',
            borderRadius: '12px',
            fontColor: '#fff',
            fontSize: '1.2rem',
            fontWeight: '700',
            height: '4rem',
            padding: '0 2rem',
            width: 'auto',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 버튼입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myStyleSet',
    },
};

export const Responsive: Story = {
    parameters: {
        docs: {
            description: {
                story: '반응형 디자인이 적용된 버튼입니다. 화면 크기에 따라 자동으로 스타일이 조정됩니다. (container query 사용)',
            },
        },
    },
    args: {
        responsive: true,
    },
};
