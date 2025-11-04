import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsFileDrop from './../VsFileDrop.vue';
import VsContainer from '@/components/vs-container/VsContainer.vue';
import type { VsFileDropStyleSet } from './../types';

const meta: Meta<typeof VsFileDrop> = {
    title: 'Components/Input Components/VsFileDrop',
    component: VsFileDrop,
    parameters: {
        docs: {
            description: {
                component: 'VsFileDrop은 파일을 드래그 앤 드롭하거나 클릭하여 업로드할 수 있는 컴포넌트입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const preDefinedStyleSet: VsFileDropStyleSet = {
                border: '2px dashed #1e88e5',
                borderRadius: '12px',
                dragBackgroundColor: '#e3f2fd',
                padding: '2rem',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsFileDrop: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-file-drop v-bind="args" />',
    }),
    tags: ['autodocs'],
    args: {
        placeholder: '파일을 드래그하거나 클릭하여 업로드하세요',
        label: 'File Drop',
    },
    argTypes: {
        colorScheme,
        accept: {
            control: 'text',
            description: '허용할 파일 타입',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
        },
        multiple: {
            control: 'boolean',
            description: '다중 파일 업로드 허용',
        },
        readonly: {
            control: 'boolean',
            description: '읽기 전용',
        },
        required: {
            control: 'boolean',
            description: '필수 입력',
        },
        small: {
            control: 'boolean',
            description: '작은 크기',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsFileDrop>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 파일 드롭 컴포넌트입니다.',
            },
        },
    },
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 파일 드롭 컴포넌트입니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${getColorSchemeTemplate(`
                    <vs-file-drop v-bind="args" color-scheme="{{ color }}" :label="'File Drop ({{ color }})'"/>
                `)}
            </div>
        `,
    }),
};

export const Accept: Story = {
    parameters: {
        docs: {
            description: {
                story: 'accept 속성을 사용하여 특정 파일 타입만 허용할 수 있습니다.',
            },
        },
    },
    args: {
        accept: '.png,.jpg,.jpeg',
        placeholder: 'PNG, JPG, JPEG 파일만 업로드 가능합니다',
    },
};

export const Multiple: Story = {
    parameters: {
        docs: {
            description: {
                story: 'multiple 속성으로 여러 파일을 동시에 업로드할 수 있습니다.',
            },
        },
    },
    args: {
        multiple: true,
    },
};

export const Single: Story = {
    parameters: {
        docs: {
            description: {
                story: 'multiple을 false로 설정하면 하나의 파일만 업로드할 수 있습니다.',
            },
        },
    },
    args: {
        multiple: false,
        placeholder: '파일 하나만 선택 가능합니다',
    },
};

export const Small: Story = {
    parameters: {
        docs: {
            description: {
                story: '작은 크기의 파일 드롭 컴포넌트입니다.',
            },
        },
    },
    args: {
        small: true,
    },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: '비활성화된 상태의 파일 드롭 컴포넌트입니다.',
            },
        },
    },
    args: {
        disabled: true,
    },
};

export const Readonly: Story = {
    parameters: {
        docs: {
            description: {
                story: '읽기 전용 상태의 파일 드롭 컴포넌트입니다.',
            },
        },
    },
    args: {
        readonly: true,
    },
};

export const Required: Story = {
    parameters: {
        docs: {
            description: {
                story: '필수 입력 필드로 표시되는 파일 드롭 컴포넌트입니다.',
            },
        },
    },
    args: {
        required: true,
    },
};

export const Label: Story = {
    parameters: {
        docs: {
            description: {
                story: '레이블이 있는 파일 드롭 컴포넌트입니다.',
            },
        },
    },
    args: {
        label: '첨부 파일',
    },
};

export const Messages: Story = {
    parameters: {
        docs: {
            description: {
                story: '메시지를 표시하는 파일 드롭 컴포넌트입니다.',
            },
        },
    },
    args: {
        messages: [{ state: 'success', text: '파일이 성공적으로 업로드되었습니다' }],
    },
};

export const Grid: Story = {
    parameters: {
        docs: {
            description: {
                story: '그리드 레이아웃에서 사용되는 파일 드롭 컴포넌트입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop, VsContainer },
        setup() {
            return { args };
        },
        template: `
            <vs-container grid>
                <vs-file-drop v-bind="args" :grid="{ sm: 12, md: 6 }" />
                <vs-file-drop v-bind="args" :grid="{ sm: 12, md: 6 }" />
            </vs-container>
        `,
    }),
    args: {
        label: 'File Upload',
    },
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 파일 드롭 컴포넌트입니다.',
            },
        },
    },
    args: {
        styleSet: {
            border: '2px dashed #ff5722',
            borderRadius: '16px',
            backgroundColor: '#ffebee',
            dragBackgroundColor: '#ffccbc',
            padding: '2rem',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 파일 드롭 컴포넌트입니다.',
            },
        },
    },
    args: {
        styleSet: 'myStyleSet',
    },
};

