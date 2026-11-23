import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate } from '@/storybook';
import { useVlossom } from '@/framework';
import VsModalNode from './../VsModalNode.vue';
import type { VsModalNodeStyleSet } from './../types';

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
                color: '#333333',
                width: '500px',
                height: '400px',
                $content: { padding: '2rem' },
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
        draggable: {
            control: 'boolean',
            description: '상단 중앙의 그립 핸들을 드래그해 모달을 옮길 수 있는지 여부',
        },
        scrollLock: {
            control: 'boolean',
            description: '모달이 열려 있는 동안 스크롤 잠금 여부. CSS 선택자를 전달하면 해당 요소를 잠급니다.',
        },
    },
    args: {
        escClose: true,
        dimClose: false,
        dimmed: false,
        draggable: false,
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

export const Draggable: Story = {
    parameters: {
        docs: {
            description: {
                story: '상단 중앙의 그립 핸들을 마우스나 터치로 드래그하면 컨테이너 안에서 모달을 옮길 수 있습니다. 핸들은 포커스를 받지 않습니다.',
            },
        },
    },
    args: {
        draggable: true,
        size: 'sm',
    },
    render: (args: any) => ({
        components: { VsModalNode },
        setup() {
            return { args };
        },
        template: `
            <div style="position: relative; width: 100%; height: 600px; background: #f5f5f5; border: 1px dashed #ccc;">
                <vs-modal-node v-bind="args">
                    <div>
                        <h2 style="margin: 0 0 1rem 0;">드래그 가능한 모달</h2>
                        <p>상단 핸들을 잡고 옮겨 보세요. 점선 영역 밖으로는 나가지 않습니다.</p>
                    </div>
                </vs-modal-node>
            </div>
        `,
    }),
};

export const DraggableWithScroll: Story = {
    parameters: {
        docs: {
            description: {
                story: '콘텐츠가 높이를 넘어 스크롤되어도 핸들은 상단에 고정됩니다.',
            },
        },
    },
    args: {
        draggable: true,
        dimmed: true,
        size: { width: 'sm', height: '300px' },
    },
    render: (args: any) => ({
        components: { VsModalNode },
        setup() {
            return { args };
        },
        template: `
            <div style="position: relative; width: 100%; height: 600px; background: #f5f5f5; border: 1px dashed #ccc;">
                <vs-modal-node v-bind="args">
                    <div>
                        <h2 style="margin: 0 0 1rem 0;">스크롤 + 드래그</h2>
                        <p v-for="line in 30" :key="line">스크롤되는 콘텐츠 {{ line }}</p>
                    </div>
                </vs-modal-node>
            </div>
        `,
    }),
};

export const DifferentSizes: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 크기의 모달입니다. xs, sm, md, lg, xl 크기는 너비만 설정하며, 높이는 콘텐츠에 맞춰집니다.',
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
            const lines = [1, 4, 8, 16, 40];

            return { args, handleClose, sizes, lines };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <div v-for="(size, index) in sizes" :key="size" style="position: relative; width: 100%; height: 400px; background: #f5f5f5; border: 1px dashed #ccc;">
                    <vs-modal-node v-bind="args" :size="size">
                        <div>
                            <h3 style="margin: 0 0 0.5rem 0;">{{ size.toUpperCase() }} 크기 모달</h3>
                            <p v-for="line in lines[index]" :key="line">이 모달은 {{ size }} 너비로 설정되었습니다. ({{ line }})</p>
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
                story: '인라인 스타일 객체를 사용한 커스텀 모달입니다. 루트는 모달 박스에, $content는 스크롤되는 콘텐츠 영역(기본 padding 포함)에 적용됩니다.',
            },
        },
    },
    args: {
        styleSet: {
            backgroundColor: '#f8f9fa',
            border: '2px solid #1e88e5',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
            color: '#1e88e5',
            width: '550px',
            height: '450px',
            $content: { padding: '2rem' },
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
