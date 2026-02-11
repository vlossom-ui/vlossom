import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VsMessage from './../VsMessage.vue';

const meta: Meta<typeof VsMessage> = {
    title: 'Components/Base Components/VsMessage',
    component: VsMessage,
    parameters: {
        docs: {
            description: {
                component:
                    'VsMessage는 다양한 상태와 메시지를 표시하는 컴포넌트입니다. info, success, warning, error 상태를 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsMessage },
        setup() {
            return { args };
        },
        template: '<vs-message v-bind="args" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        state: {
            control: 'select',
            options: ['idle', 'info', 'success', 'warning', 'error'],
            description: '메시지의 상태',
        },
        text: {
            control: 'text',
            description: '표시할 메시지 텍스트',
        },
        styleSet: {
            control: 'object',
            description: '커스텀 스타일 설정 (size 등)',
            table: {
                type: { summary: 'VsMessageStyleSet | string' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsMessage>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 메시지입니다. 기본적인 스타일과 기능을 제공합니다.',
            },
        },
    },
    args: {
        text: '기본 메시지입니다.',
    },
};

export const States: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 상태의 메시지들입니다. idle, info, success, warning, error 상태를 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsMessage },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-message v-bind="args" state="idle" text="기본 메시지입니다." />
                <vs-message v-bind="args" state="info" text="정보 메시지입니다." />
                <vs-message v-bind="args" state="success" text="성공적으로 완료되었습니다." />
                <vs-message v-bind="args" state="warning" text="주의가 필요합니다." />
                <vs-message v-bind="args" state="error" text="오류가 발생했습니다." />
            </div>
        `,
    }),
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 크기의 메시지들입니다. styleSet의 size를 사용하여 크기를 조정할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsMessage },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-message v-bind="args" :style-set="{ variables: { size: '0.75rem' } }" text="XS 메시지" />
                <vs-message v-bind="args" :style-set="{ variables: { size: '0.875rem' } }" text="SM 메시지" />
                <vs-message v-bind="args" text="기본 메시지" />
                <vs-message v-bind="args" :style-set="{ variables: { size: '1.25rem' } }" text="LG 메시지" />
                <vs-message v-bind="args" :style-set="{ variables: { size: '1.5rem' } }" text="XL 메시지" />
            </div>
        `,
    }),
};

export const PreDefinedStyleSet: Story = {
    args: {
        styleSet: 'myStyleSet',
        text: '사전 정의된 스타일셋',
    },
};
