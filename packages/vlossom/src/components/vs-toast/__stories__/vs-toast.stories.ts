import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsToast from './../VsToast.vue';
import type { VsToastStyleSet } from '../types';

const meta: Meta<typeof VsToast> = {
    title: 'Components/Base Components/VsToast',
    component: VsToast,
    parameters: {
        docs: {
            description: {
                component:
                    'VsToast는 토스트 알림 메시지를 표시하는 컴포넌트입니다. ' +
                    '자동 닫기 기능, 색상 테마, 커스텀 스타일 등을 지원하며, ' +
                    '마우스를 올리면 타이머가 일시정지됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsToast },
        setup() {
            const preDefinedStyleSet: VsToastStyleSet = {
                closeButton: {
                    component: {
                        color: '#fff',
                    },
                },
                component: {
                    borderRadius: '8px',
                    padding: '1rem 1.5rem',
                    height: 'auto',
                    backgroundColor: '#1e88e5',
                    border: '2px solid #1e88e5',
                    color: '#fff',
                },
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsToast: { ...preDefinedStyleSet } },
            };

            function handleClose() {
                console.log('Toast closed');
            }

            return { args, handleClose };
        },
        template: '<vs-toast v-bind="args" @close="handleClose">토스트 메시지입니다.</vs-toast>',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        autoClose: {
            control: 'boolean',
            description: '자동 닫기 기능 활성화 여부',
        },
        primary: {
            control: 'boolean',
            description: '주요 스타일 적용 여부',
        },
        timeout: {
            control: 'number',
            description: '자동 닫기 시간 (밀리초), autoClose가 true일 때만 적용',
        },
    },
    args: {
        autoClose: true,
        primary: true,
        timeout: 5000,
    },
};

export default meta;
type Story = StoryObj<typeof VsToast>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 토스트입니다. 5초 후 자동으로 닫히며, 닫기 버튼으로 수동으로도 닫을 수 있습니다.',
            },
        },
    },
};

export const AutoCloseFalse: Story = {
    parameters: {
        docs: {
            description: {
                story: '자동 닫기 기능이 비활성화된 토스트입니다. 닫기 버튼을 클릭해서만 닫을 수 있습니다.',
            },
        },
    },
    args: {
        autoClose: false,
    },
    render: (args: any) => ({
        components: { VsToast },
        setup() {
            function handleClose() {
                console.log('Toast closed');
            }
            return { args, handleClose };
        },
        template: '<vs-toast v-bind="args" @close="handleClose">자동으로 닫히지 않는 메시지입니다.</vs-toast>',
    }),
};

export const CustomTimeout: Story = {
    parameters: {
        docs: {
            description: {
                story: '커스텀 타임아웃이 설정된 토스트입니다. 3초 후 자동으로 닫힙니다.',
            },
        },
    },
    args: {
        timeout: 3000,
    },
    render: (args: any) => ({
        components: { VsToast },
        setup() {
            function handleClose() {
                console.log('Toast closed');
            }
            return { args, handleClose };
        },
        template: '<vs-toast v-bind="args" @close="handleClose">3초 후 자동으로 닫히는 메시지입니다.</vs-toast>',
    }),
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 토스트들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsToast },
        setup() {
            function handleClose() {
                console.log('Toast closed');
            }

            return { args, handleClose };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${getColorSchemeTemplate(`
                    <vs-toast v-bind="args" color-scheme="{{ color }}" @close="handleClose">{{ color }} 색상 테마의 토스트</vs-toast>
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 토스트입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    args: {
        styleSet: {
            closeButton: {
                component: {
                    color: '#fff',
                },
            },
            component: {
                borderRadius: '12px',
                padding: '1.5rem 2rem',
                height: 'auto',
                backgroundColor: '#e188e5',
                border: '2px solid #e188e5',
                color: '#fff',
            },
        },
    },
    render: (args: any) => ({
        components: { VsToast },
        setup() {
            function handleClose() {
                console.log('Toast closed');
            }
            return { args, handleClose };
        },
        template: '<vs-toast v-bind="args" @close="handleClose">커스텀 스타일이 적용된 토스트입니다.</vs-toast>',
    }),
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 토스트입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myStyleSet',
    },
    render: (args: any) => ({
        components: { VsToast },
        setup() {
            function handleClose() {
                console.log('Toast closed');
            }
            return { args, handleClose };
        },
        template:
            '<vs-toast v-bind="args" @close="handleClose">미리 정의된 스타일 세트를 사용한 토스트입니다.</vs-toast>',
    }),
};

export const NonPrimary: Story = {
    parameters: {
        docs: {
            description: {
                story: 'primary 스타일이 적용되지 않은 토스트입니다.',
            },
        },
    },
    args: {
        primary: false,
    },
    render: (args: any) => ({
        components: { VsToast },
        setup() {
            function handleClose() {
                console.log('Toast closed');
            }
            return { args, handleClose };
        },
        template: `<div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-toast v-bind="args" @close="handleClose">primary 스타일이 적용되지 않은 토스트입니다.</vs-toast>
                ${getColorSchemeTemplate(`
                    <vs-toast v-bind="args" color-scheme="{{ color }}" @close="handleClose">{{ color }} 색상 테마의 토스트</vs-toast>
                `)}
            </div>`,
    }),
};
