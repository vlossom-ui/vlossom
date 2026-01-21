import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsTooltip from './../VsTooltip.vue';
import VsButton from '../../vs-button/VsButton.vue';
import type { VsTooltipStyleSet } from './../types';

const meta: Meta<typeof VsTooltip> = {
    title: 'Components/Base Components/VsTooltip',
    component: VsTooltip,
    parameters: {
        docs: {
            description: {
                component: 'VsTooltip은 다양한 트리거 방식과 위치를 지원하는 툴팁 컴포넌트입니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        target: {
            control: 'text',
            description: '툴팁을 표시할 대상 요소의 selector',
        },
        colorScheme,
        align: {
            control: 'select',
            options: ['start', 'center', 'end'],
            description: '툴팁의 정렬 방식',
        },
        clickable: {
            control: 'boolean',
            description: '클릭으로 툴팁 열기/닫기',
        },
        contentsHover: {
            control: 'boolean',
            description: '툴팁 내용에 호버 가능',
        },
        disabled: {
            control: 'boolean',
            description: '툴팁 비활성화',
        },
        enterDelay: {
            control: { type: 'number', min: 0, max: 2000, step: 100 },
            description: '툴팁 표시 지연 시간 (ms)',
        },
        escClose: {
            control: 'boolean',
            description: 'ESC 키로 툴팁 닫기',
        },
        leaveDelay: {
            control: { type: 'number', min: 0, max: 2000, step: 100 },
            description: '툴팁 숨김 지연 시간 (ms)',
        },
        margin: {
            control: 'text',
            description: '툴팁과 트리거 요소 간의 간격',
        },
        noAnimation: {
            control: 'boolean',
            description: '애니메이션 비활성화',
        },
        placement: {
            control: 'select',
            options: ['top', 'right', 'bottom', 'left'],
            description: '툴팁 표시 위치',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsTooltip>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 툴팁입니다. 마우스 호버 시 툴팁이 표시됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <vs-button id="tooltip-trigger-default">Hover me</vs-button>
            <vs-tooltip v-bind="args" target="#tooltip-trigger-default">
                <span>This is a tooltip</span>
            </vs-tooltip>
        `,
    }),
};

export const Clickable: Story = {
    parameters: {
        docs: {
            description: {
                story: '클릭으로 열고 닫을 수 있는 툴팁입니다. clickable prop을 사용합니다.',
            },
        },
    },
    args: {
        clickable: true,
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <vs-button id="tooltip-trigger-clickable">Click me</vs-button>
            <vs-tooltip v-bind="args" target="#tooltip-trigger-clickable">
                <span>Click to toggle tooltip</span>
            </vs-tooltip>
        `,
    }),
};

export const ContentsHover: Story = {
    parameters: {
        docs: {
            description: {
                story: '툴팁 내용에도 호버할 수 있는 툴팁입니다. contentsHover prop을 사용합니다.',
            },
        },
    },
    args: {
        contentsHover: true,
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <vs-button id="tooltip-trigger-contents-hover">Hover me</vs-button>
            <vs-tooltip v-bind="args" target="#tooltip-trigger-contents-hover">
                <span>You can hover over this tooltip content</span>
            </vs-tooltip>
        `,
    }),
};

export const ClickableAndContentsHover: Story = {
    parameters: {
        docs: {
            description: {
                story: '클릭으로 열고 툴팁 내용에도 호버할 수 있는 툴팁입니다. clickable과 contentsHover를 함께 사용합니다.',
            },
        },
    },
    args: {
        align: 'start',
        placement: 'right',
        clickable: true,
        contentsHover: true,
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <vs-button id="tooltip-trigger-click-hover">Click and hover</vs-button>
            <vs-tooltip v-bind="args" target="#tooltip-trigger-click-hover">
                <span>Click to open and hover over this content</span>
            </vs-tooltip>
        `,
    }),
};

export const Placements: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 위치의 툴팁들입니다. top, right, bottom, left 위치를 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem; align-items: center; padding: 4rem;">
                <div style="display: flex; gap: 1rem;">
                    <vs-button id="tooltip-top">Top</vs-button>
                    <vs-tooltip v-bind="args" target="#tooltip-top" placement="top">Top tooltip</vs-tooltip>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <vs-button id="tooltip-left">Left</vs-button>
                    <vs-tooltip v-bind="args" target="#tooltip-left" placement="left">Left tooltip</vs-tooltip>
                    <vs-button id="tooltip-right">Right</vs-button>
                    <vs-tooltip v-bind="args" target="#tooltip-right" placement="right">Right tooltip</vs-tooltip>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <vs-button id="tooltip-bottom">Bottom</vs-button>
                    <vs-tooltip v-bind="args" target="#tooltip-bottom" placement="bottom">Bottom tooltip</vs-tooltip>
                </div>
            </div>
        `,
    }),
};

export const Alignments: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 정렬 방식의 툴팁들입니다. start, center, end 정렬을 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem; align-items: center; padding: 4rem;">
                <div style="display: flex; gap: 1rem;">
                    <vs-button id="tooltip-align-start">Start</vs-button>
                    <vs-tooltip v-bind="args" target="#tooltip-align-start" placement="top" align="start">Start aligned</vs-tooltip>
                    <vs-button id="tooltip-align-center">Center</vs-button>
                    <vs-tooltip v-bind="args" target="#tooltip-align-center" placement="top" align="center">Center aligned</vs-tooltip>
                    <vs-button id="tooltip-align-end">End</vs-button>
                    <vs-tooltip v-bind="args" target="#tooltip-align-end" placement="top" align="end">End aligned</vs-tooltip>
                </div>
            </div>
        `,
    }),
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: '비활성화된 툴팁입니다. 호버해도 툴팁이 표시되지 않습니다.',
            },
        },
    },
    args: {
        disabled: true,
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <vs-button id="tooltip-trigger-disabled">Hover me (disabled)</vs-button>
            <vs-tooltip v-bind="args" target="#tooltip-trigger-disabled">
                <span>This tooltip is disabled</span>
            </vs-tooltip>
        `,
    }),
};

export const NoAnimation: Story = {
    parameters: {
        docs: {
            description: {
                story: '애니메이션이 비활성화된 툴팁입니다. 즉시 나타나고 사라집니다.',
            },
        },
    },
    args: {
        noAnimation: true,
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <vs-button id="tooltip-trigger-no-animation">Hover me (no animation)</vs-button>
            <vs-tooltip v-bind="args" target="#tooltip-trigger-no-animation">
                <span>This tooltip has no animation</span>
            </vs-tooltip>
        `,
    }),
};

export const Delays: Story = {
    parameters: {
        docs: {
            description: {
                story: '지연 시간이 설정된 툴팁입니다. enterDelay와 leaveDelay를 조정할 수 있습니다.',
            },
        },
    },
    args: {
        enterDelay: 500,
        leaveDelay: 300,
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; gap: 1rem;">
                <vs-button id="tooltip-delayed">Delayed tooltip</vs-button>
                <vs-tooltip v-bind="args" target="#tooltip-delayed">
                    <span>This tooltip has delays</span>
                </vs-tooltip>
            </div>
        `,
    }),
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 툴팁들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-button id="tooltip-color-{{ color }}">{{ color }}</vs-button>
                    <vs-tooltip v-bind="args" target="#tooltip-color-{{ color }}" color-scheme="{{ color }}">{{ color }} tooltip</vs-tooltip>
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 툴팁입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            return { args };
        },
        template: `
            <vs-button id="tooltip-custom">Custom tooltip</vs-button>
            <vs-tooltip v-bind="args" target="#tooltip-custom">
                <span>Custom styled tooltip</span>
            </vs-tooltip>
        `,
    }),
    args: {
        styleSet: {
            variables: {
                backgroundColor: '#e188e5',
                border: '2px solid #e188e5',
                borderRadius: '12px',
                padding: '0.8rem 1.2rem',
                width: '300px',
                height: '100px',
                arrowColor: '#e188e5',
                arrowSize: '0.5rem',
            },
        },
        align: 'start',
        placement: 'right',
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 툴팁입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myStyleSet',
    },
    render: (args: any) => ({
        components: { VsTooltip, VsButton },
        setup() {
            const preDefinedStyleSet: VsTooltipStyleSet = {
                variables: {
                    backgroundColor: '#1e88e5',
                    border: '2px solid #1e88e5',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    arrowColor: '#1e88e5',
                    arrowSize: '0.4rem',
                },
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsTooltip: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: `
            <vs-button id="tooltip-trigger-predefined">Hover me</vs-button>
            <vs-tooltip v-bind="args" target="#tooltip-trigger-predefined">
                <span>This tooltip uses predefined style set</span>
            </vs-tooltip>
        `,
    }),
};
