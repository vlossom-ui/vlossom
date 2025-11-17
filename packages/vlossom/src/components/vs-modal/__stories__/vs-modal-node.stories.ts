import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsModalNode from './../VsModalNode.vue';
import type { VsModalNodeStyleSet } from '../types';

const meta: Meta<typeof VsModalNode> = {
    title: 'Components/Layout Components/VsModalNode',
    component: VsModalNode,
    parameters: {
        docs: {
            description: {
                component:
                    'VsModalNode는 개별 모달 노드를 렌더링하는 컴포넌트입니다. ' +
                    'dimmed 배경, 포커스 트랩, 스크롤 관리 등을 제공하며, ' +
                    '크기 설정, 색상 테마, 커스텀 스타일 등을 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsModalNode },
        setup() {
            const preDefinedStyleSet: VsModalNodeStyleSet = {
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontColor: '#333333',
                padding: '2rem',
                width: '500px',
                height: '400px',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsModalNode: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: `
            <div style="position: relative; width: 100%; height: 600px; background: #f5f5f5; border: 1px dashed #ccc;">
                <vs-modal-node v-bind="args">
                    <div>
                        <h2 style="margin: 0 0 1rem 0;">모달 제목</h2>
                        <p>모달 내용입니다. 이 컴포넌트는 모달 노드를 렌더링합니다.</p>
                    </div>
                </vs-modal-node>
            </div>
        `,
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
            description: '모달 크기 설정',
        },
        escClose: {
            control: 'boolean',
            description: 'ESC 키로 모달 닫기 기능 활성화 여부',
        },
        dimClose: {
            control: 'boolean',
            description: 'dimmed 영역 클릭 시 모달 닫기 여부',
        },
        dimmed: {
            control: 'boolean',
            description: 'dimmed 배경 표시 여부',
        },
    },
    args: {
        escClose: true,
        dimClose: false,
        dimmed: false,
        size: 'md',
    },
};

export default meta;
type Story = StoryObj<typeof VsModalNode>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 모달 노드입니다. 중간 크기(md)로 표시됩니다.',
            },
        },
    },
};

export const WithDimmed: Story = {
    parameters: {
        docs: {
            description: {
                story: 'dimmed 배경이 있는 모달입니다. dimClose가 true일 때 dimmed 영역을 클릭하면 닫힙니다.',
            },
        },
    },
    args: {
        dimmed: true,
        dimClose: true,
    },
    render: (args: any) => ({
        components: { VsModalNode },
        setup() {
            function handleClose() {
                console.log('Modal closed');
            }
            return { args, handleClose };
        },
        template: `
            <div style="position: relative; width: 100%; height: 600px; background: #f5f5f5; border: 1px dashed #ccc;">
                <vs-modal-node v-bind="args">
                    <div>
                        <h2 style="margin: 0 0 1rem 0;">Dimmed 모달</h2>
                        <p>dimmed 배경이 있는 모달입니다. dimmed 영역을 클릭하면 닫힙니다.</p>
                    </div>
                </vs-modal-node>
            </div>
        `,
    }),
};

export const WithActions: Story = {
    parameters: {
        docs: {
            description: {
                story: 'actions 슬롯이 있는 모달입니다. actions 슬롯에 버튼 등을 추가할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsModalNode },
        setup() {
            function handleClose() {
                console.log('Action clicked');
            }
            return { args, handleClose };
        },
        template: `
            <div style="position: relative; width: 100%; height: 600px; background: #f5f5f5; border: 1px dashed #ccc;">
                <vs-modal-node v-bind="args">
                    <div>
                        <h2 style="margin: 0 0 1rem 0;">Actions 모달</h2>
                        <p>actions 슬롯이 있는 모달입니다. actions 슬롯에 버튼을 추가할 수 있습니다.</p>
                    </div>
                    <template #actions>
                        <div class='w-full flex justify-center gap-2'>
                            <vs-button @click="handleClose">Cancel</vs-button>
                            <vs-button primary @click="handleClose">OK</vs-button>
                        </div>
                    </template>
                </vs-modal-node>
            </div>
        `,
    }),
};

export const DifferentSizes: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 크기의 모달입니다. xs, sm, md, lg, xl 크기를 선택할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsModalNode },
        setup() {
            function handleClose() {
                console.log('Modal closed');
            }

            const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

            return { args, handleClose, sizes };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <div v-for="size in sizes" :key="size" style="position: relative; width: 100%; height: 400px; background: #f5f5f5; border: 1px dashed #ccc;">
                    <vs-modal-node v-bind="args" :size="size">
                        <div>
                            <h3 style="margin: 0 0 0.5rem 0;">{{ size.toUpperCase() }} 크기 모달</h3>
                            <p>이 모달은 {{ size }} 크기로 설정되었습니다.</p>
                        </div>
                    </vs-modal-node>
                </div>
            </div>
        `,
    }),
};

export const CustomSize: Story = {
    parameters: {
        docs: {
            description: {
                story: '커스텀 크기가 설정된 모달입니다. width와 height를 직접 지정할 수 있습니다.',
            },
        },
    },
    args: {
        size: { width: '600px', height: '500px' },
    },
    render: (args: any) => ({
        components: { VsModalNode },
        setup() {
            function handleClose() {
                console.log('Modal closed');
            }
            return { args, handleClose };
        },
        template: `
            <div style="position: relative; width: 100%; height: 600px; background: #f5f5f5; border: 1px dashed #ccc;">
                <vs-modal-node v-bind="args">
                    <div>
                        <h2 style="margin: 0 0 1rem 0;">커스텀 크기 모달</h2>
                        <p>이 모달은 600px x 500px 크기로 설정되었습니다.</p>
                    </div>
                </vs-modal-node>
            </div>
        `,
    }),
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 모달들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsModalNode },
        setup() {
            function handleClose() {
                console.log('Modal closed');
            }

            return { args, handleClose };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                ${getColorSchemeTemplate(`
                    <div style="position: relative; width: 100%; height: 400px; background: #f5f5f5; border: 1px dashed #ccc;">
                        <vs-modal-node v-bind="args" color-scheme="{{ color }}">
                            <div>
                                <h3 style="margin: 0 0 0.5rem 0;">{{ color }} 색상 테마 모달</h3>
                                <p>이 모달은 {{ color }} 색상 테마가 적용되었습니다.</p>
                            </div>
                        </vs-modal-node>
                    </div>
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 모달입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    args: {
        styleSet: {
            backgroundColor: '#f8f9fa',
            border: '2px solid #1e88e5',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
            fontColor: '#1e88e5',
            padding: '2rem',
            width: '550px',
            height: '450px',
        },
    },
    render: (args: any) => ({
        components: { VsModalNode },
        setup() {
            function handleClose() {
                console.log('Modal closed');
            }
            return { args, handleClose };
        },
        template: `
            <div style="position: relative; width: 100%; height: 600px; background: #f5f5f5; border: 1px dashed #ccc;">
                <vs-modal-node v-bind="args">
                    <div>
                        <h2 style="margin: 0 0 1rem 0;">커스텀 스타일 모달</h2>
                        <p>이 모달은 커스텀 스타일이 적용되었습니다.</p>
                    </div>
                </vs-modal-node>
            </div>
        `,
    }),
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 모달입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myStyleSet',
    },
    render: (args: any) => ({
        components: { VsModalNode },
        setup() {
            function handleClose() {
                console.log('Modal closed');
            }
            return { args, handleClose };
        },
        template: `
            <div style="position: relative; width: 100%; height: 600px; background: #f5f5f5; border: 1px dashed #ccc;">
                <vs-modal-node v-bind="args">
                    <div>
                        <h2 style="margin: 0 0 1rem 0;">미리 정의된 스타일 모달</h2>
                        <p>이 모달은 미리 정의된 스타일 세트를 사용합니다.</p>
                    </div>
                </vs-modal-node>
            </div>
        `,
    }),
};
