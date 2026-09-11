import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate } from '@/storybook';
import { ref } from 'vue';

import { VsForm, VsButton } from '@/components';
import VsFileInput from './../VsFileInput.vue';

const meta: Meta<typeof VsFileInput> = {
    title: 'Components/Input Components/VsFileInput',
    component: VsFileInput,
    parameters: {
        docs: {
            description: {
                component:
                    'VsFileInput은 vs-input 형태의 파일 선택 컴포넌트입니다. ' +
                    '클릭 또는 키보드(Enter/Space)로 파일 다이얼로그를 열고, 선택된 파일을 chip으로 표시합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileInput },
        setup() {
            const files = ref<File[]>([]);
            return { args, files };
        },
        template: '<vs-file-input v-bind="args" v-model="files" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        modelValue: {
            control: false,
            description: 'v-model 값 (File[])',
            table: { category: 'Model' },
        },
        accept: {
            control: 'text',
            description: '허용 파일 타입 (native accept 속성)',
            table: { category: 'Input Props' },
        },
        multiple: {
            control: 'boolean',
            description: '복수 파일 선택 허용',
            table: { category: 'Input Props', defaultValue: { summary: 'false' } },
        },
        directory: {
            control: 'boolean',
            description: '폴더 선택 모드 (webkitdirectory)',
            table: { category: 'Input Props', defaultValue: { summary: 'false' } },
        },
        noClear: {
            control: 'boolean',
            description: 'clear 버튼 숨김',
            table: { category: 'Input Props', defaultValue: { summary: 'false' } },
        },
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
            description: '컴포넌트 크기',
            table: { category: 'Input Props', defaultValue: { summary: 'md' } },
        },
        placeholder: {
            control: 'text',
            description: '플레이스홀더 텍스트',
            table: { category: 'Input Props' },
        },
        colorScheme,
        label: {
            control: 'text',
            description: '라벨 텍스트',
            table: { category: 'Common Props' },
        },
        noLabel: { control: 'boolean', table: { category: 'Common Props' } },
        disabled: { control: 'boolean', table: { category: 'Common Props' } },
        readonly: { control: 'boolean', table: { category: 'Common Props' } },
        hidden: { control: 'boolean', table: { category: 'Common Props' } },
        required: { control: 'boolean', table: { category: 'Common Props' } },
        state: {
            control: 'select',
            options: ['idle', 'success', 'error', 'info', 'warning'],
            table: { category: 'Common Props', defaultValue: { summary: 'idle' } },
        },
        rules: { control: 'object', table: { category: 'Validation' } },
        noDefaultRules: { control: 'boolean', table: { category: 'Validation' } },
        messages: { control: 'object', table: { category: 'Message' } },
        noMessages: { control: 'boolean', table: { category: 'Message' } },
        width: { control: 'text', table: { category: 'Layout' } },
        grid: { control: 'text', table: { category: 'Layout' } },
        styleSet: { control: 'object', table: { category: 'Style' } },
        id: { control: 'text', table: { category: 'Native Props' } },
        name: { control: 'text', table: { category: 'Native Props' } },
    },
};

export default meta;
type Story = StoryObj<typeof VsFileInput>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 파일 선택 필드입니다.',
            },
        },
    },
    args: {
        label: '파일',
        placeholder: '파일을 선택하세요',
    },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'size prop으로 컴포넌트 높이 · 패딩 · 폰트 크기를 한꺼번에 조절합니다.',
            },
        },
    },
    render: () => ({
        components: { VsFileInput },
        setup() {
            const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
            return { sizes };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div v-for="size in sizes" :key="size">
                    <p style="margin: 0 0 0.5rem; font-weight: 600;">size = "{{ size }}"</p>
                    <vs-file-input :size="size" placeholder="파일을 선택하세요" />
                </div>
            </div>
        `,
    }),
};

export const Multiple: Story = {
    parameters: {
        docs: {
            description: {
                story: 'multiple prop으로 복수 파일을 선택할 수 있습니다. 선택된 파일은 각각 chip으로 표시됩니다.',
            },
        },
    },
    args: {
        label: '복수 파일',
        placeholder: '파일을 선택하세요',
        multiple: true,
    },
};

export const Accept: Story = {
    parameters: {
        docs: {
            description: {
                story: 'accept prop으로 허용할 파일 타입을 제한합니다. 브라우저 다이얼로그 필터링과 Vlossom 검증 모두에 적용됩니다.',
            },
        },
    },
    render: () => ({
        components: { VsFileInput },
        setup() {
            const imageFiles = ref<File[]>([]);
            const pdfFiles = ref<File[]>([]);
            return { imageFiles, pdfFiles };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-file-input v-model="imageFiles" label="이미지만" accept="image/*" placeholder="이미지를 선택하세요" multiple />
                <vs-file-input v-model="pdfFiles" label="PDF만" accept=".pdf" placeholder="PDF를 선택하세요" />
            </div>
        `,
    }),
};

export const Directory: Story = {
    parameters: {
        docs: {
            description: {
                story: 'directory prop으로 폴더 전체를 업로드할 수 있습니다 (webkitdirectory).',
            },
        },
    },
    args: {
        label: '폴더 선택',
        placeholder: '폴더를 선택하세요',
        directory: true,
    },
};

export const Required: Story = {
    parameters: {
        docs: {
            description: {
                story: 'required prop은 기본 required 룰을 추가합니다.',
            },
        },
    },
    args: {
        label: '필수 파일',
        placeholder: '파일을 선택하세요',
        required: true,
    },
};

export const DisabledReadonly: Story = {
    render: () => ({
        components: { VsFileInput },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-file-input label="Disabled" placeholder="파일을 선택하세요" disabled />
                <vs-file-input label="Readonly" placeholder="파일을 선택하세요" readonly />
            </div>
        `,
    }),
};

export const WithMessages: Story = {
    args: {
        label: 'With external messages',
        placeholder: '파일을 선택하세요',
        messages: [{ state: 'info', text: '5MB 이하의 파일만 업로드 가능합니다' }],
    },
};

export const WithStyleSet: Story = {
    args: {
        label: '커스텀 스타일',
        placeholder: '파일을 선택하세요',
        styleSet: {
            borderRadius: '12px',
            borderColor: '#1e88e5',
        },
    },
};

export const DarkMode: Story = {
    render: () => ({
        components: { VsFileInput },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-file-input color-scheme="{{ color }}" label="{{ color }}" placeholder="파일을 선택하세요" />
                `)}
            </div>
        `,
    }),
};

export const FormIntegration: Story = {
    parameters: {
        docs: {
            description: {
                story: 'VsForm 내부에서 validate()로 일괄 검증할 수 있습니다.',
            },
        },
    },
    render: () => ({
        components: { VsFileInput, VsForm, VsButton },
        setup() {
            const formRef = ref();
            const files = ref<File[]>([]);
            async function onSubmit() {
                const valid = await formRef.value?.validate();
                alert(valid ? `Valid: ${files.value.map((f) => f.name).join(', ')}` : 'Invalid');
            }
            return { formRef, files, onSubmit };
        },
        template: `
            <vs-form ref="formRef">
                <vs-file-input v-model="files" label="필수 파일" placeholder="파일을 선택하세요" required />
                <vs-button @click="onSubmit" style="margin-top: 1rem;">Submit</vs-button>
            </vs-form>
        `,
    }),
};
