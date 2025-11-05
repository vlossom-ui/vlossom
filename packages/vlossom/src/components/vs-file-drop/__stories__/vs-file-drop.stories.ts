import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import VsFileDrop from './../VsFileDrop.vue';
import VsContainer from '@/components/vs-container/VsContainer.vue';
import { useVlossom } from '@/framework';
import type { VsFileDropStyleSet } from './../types';

const meta: Meta<typeof VsFileDrop> = {
    title: 'Components/Input Components/VsFileDrop',
    component: VsFileDrop,
    parameters: {
        docs: {
            description: {
                component:
                    'VsFileDrop은 파일을 드래그 앤 드롭하거나 클릭하여 업로드할 수 있는 컴포넌트입니다. ' +
                    'accept 속성으로 파일 타입을 제한하고, min/max로 파일 개수를 제한할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const files = ref<File[] | null>(null);

            const preDefinedStyleSet: VsFileDropStyleSet = {
                border: '2px dashed #1e88e5',
                borderRadius: '12px',
                dragBackgroundColor: '#e3f2fd',
                padding: '2rem',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsFileDrop: { ...preDefinedStyleSet } },
            };

            return { args, files };
        },
        template: '<vs-file-drop v-bind="args" v-model="files" />',
    }),
    tags: ['autodocs'],
    args: {
        placeholder: '파일을 드래그하거나 클릭하여 업로드하세요',
        label: 'File Drop',
    },
    argTypes: {
        // Model
        modelValue: {
            control: false,
            description: 'v-model 값 (File[] | null)',
            table: { category: 'Model' },
        },
        changed: {
            control: 'boolean',
            description: '값이 변경되었는지 여부 (v-model:changed)',
            table: { category: 'Model' },
        },
        valid: {
            control: 'boolean',
            description: '검증 통과 여부 (v-model:valid)',
            table: { category: 'Model' },
        },

        // FileDrop 속성
        placeholder: {
            control: 'text',
            description: '플레이스홀더 텍스트',
            table: { category: 'FileDrop Props' },
        },
        accept: {
            control: 'text',
            description: '허용할 파일 타입 (예: ".png,.jpg,.pdf")',
            table: { category: 'FileDrop Props' },
        },
        height: {
            control: 'text',
            description: '컴포넌트 높이 (string | number | Breakpoints)',
            table: { category: 'FileDrop Props', defaultValue: { summary: 'auto' } },
        },

        // 공통 Props
        colorScheme,
        label: {
            control: 'text',
            description: '라벨 텍스트',
            table: { category: 'Common Props' },
        },
        noLabel: {
            control: 'boolean',
            description: '라벨 숨김',
            table: { category: 'Common Props' },
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
            table: { category: 'Common Props' },
        },
        readonly: {
            control: 'boolean',
            description: '읽기 전용 상태',
            table: { category: 'Common Props' },
        },
        hidden: {
            control: 'boolean',
            description: '숨김 상태',
            table: { category: 'Common Props' },
        },
        required: {
            control: 'boolean',
            description: '필수 입력 여부',
            table: { category: 'Common Props' },
        },
        small: {
            control: 'boolean',
            description: '작은 크기',
            table: { category: 'Common Props' },
        },
        state: {
            control: 'select',
            options: ['idle', 'success', 'error', 'info', 'warning'],
            description: 'FileDrop 상태',
            table: { category: 'Common Props', defaultValue: { summary: 'idle' } },
        },

        // Validation
        min: {
            control: 'number',
            description: '최소 파일 개수',
            table: { category: 'Validation' },
        },
        max: {
            control: 'number',
            description: '최대 파일 개수',
            table: { category: 'Validation' },
        },
        rules: {
            control: 'object',
            description: '검증 규칙 배열',
            table: { category: 'Validation' },
        },
        noDefaultRules: {
            control: 'boolean',
            description: '기본 검증 규칙 비활성화',
            table: { category: 'Validation' },
        },

        // Message
        messages: {
            control: 'object',
            description: '메시지 배열',
            table: { category: 'Message' },
        },
        noMessages: {
            control: 'boolean',
            description: '메시지 영역 숨김',
            table: { category: 'Message' },
        },

        // Layout
        width: {
            control: 'text',
            description: 'FileDrop 너비 (string | number | Breakpoints)',
            table: { category: 'Layout' },
        },
        grid: {
            control: 'text',
            description: 'Grid 설정 (string | number | Breakpoints)',
            table: { category: 'Layout' },
        },

        // Style
        styleSet: {
            control: 'object',
            description: '커스텀 스타일 객체',
            table: { category: 'Style' },
        },

        // Native HTML
        id: {
            control: 'text',
            description: 'Input ID',
            table: { category: 'Native Props' },
        },
        name: {
            control: 'text',
            description: 'Input name 속성',
            table: { category: 'Native Props' },
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsFileDrop>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 파일 드롭 컴포넌트입니다. 드래그 앤 드롭 또는 클릭하여 파일을 업로드할 수 있습니다.',
            },
        },
    },
};

export const WithLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: '라벨이 있는 파일 드롭 컴포넌트입니다.',
            },
        },
    },
    args: {
        label: '첨부 파일',
    },
};

export const AcceptFileTypes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'accept 속성으로 특정 파일 타입만 허용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const imageFiles = ref<File[] | null>(null);
            const documentFiles = ref<File[] | null>(null);
            return { args, imageFiles, documentFiles };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-file-drop 
                    v-model="imageFiles" 
                    label="이미지 파일만" 
                    placeholder="PNG, JPG, GIF 파일만 업로드 가능" 
                    accept=".png,.jpg,.jpeg,.gif"
                />
                
                <vs-file-drop 
                    v-model="documentFiles" 
                    label="문서 파일만" 
                    placeholder="PDF, DOCX 파일만 업로드 가능" 
                    accept=".pdf,.docx,.doc"
                />
            </div>
        `,
    }),
};

export const States: Story = {
    parameters: {
        docs: {
            description: {
                story: 'disabled, readonly 등의 상태를 표현할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const normalFiles = ref<File[] | null>(null);
            const disabledFiles = ref<File[] | null>(null);
            const readonlyFiles = ref<File[] | null>(null);
            const requiredFiles = ref<File[] | null>(null);
            return { args, normalFiles, disabledFiles, readonlyFiles, requiredFiles };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-file-drop v-model="normalFiles" label="Normal" placeholder="파일 업로드" />
                <vs-file-drop v-model="disabledFiles" label="Disabled" placeholder="비활성화" disabled />
                <vs-file-drop v-model="readonlyFiles" label="Readonly" placeholder="읽기 전용" readonly />
                <vs-file-drop v-model="requiredFiles" label="Required" placeholder="필수 입력" required />
            </div>
        `,
    }),
};

export const Size: Story = {
    parameters: {
        docs: {
            description: {
                story: 'small prop으로 작은 크기의 파일 드롭 영역을 만들 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const defaultFiles = ref<File[] | null>(null);
            const smallFiles = ref<File[] | null>(null);
            return { args, defaultFiles, smallFiles };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-file-drop v-model="defaultFiles" label="Default Size" placeholder="기본 크기" />
                <vs-file-drop v-model="smallFiles" label="Small Size" placeholder="작은 크기" small />
            </div>
        `,
    }),
};

export const ValidationStates: Story = {
    parameters: {
        docs: {
            description: {
                story: 'state prop을 사용하여 검증 상태를 시각적으로 표현할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const idleFiles = ref<File[] | null>(null);
            const successFiles = ref<File[] | null>(null);
            const errorFiles = ref<File[] | null>(null);
            const infoFiles = ref<File[] | null>(null);
            const warningFiles = ref<File[] | null>(null);
            return { args, idleFiles, successFiles, errorFiles, infoFiles, warningFiles };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-file-drop v-model="idleFiles" state="idle" label="Idle" placeholder="기본 상태" />
                <vs-file-drop v-model="successFiles" state="success" label="Success" placeholder="성공 상태" />
                <vs-file-drop v-model="errorFiles" state="error" label="Error" placeholder="에러 상태" />
                <vs-file-drop v-model="infoFiles" state="info" label="Info" placeholder="정보 상태" />
                <vs-file-drop v-model="warningFiles" state="warning" label="Warning" placeholder="경고 상태" />
            </div>
        `,
    }),
};

export const ValidationRules: Story = {
    parameters: {
        docs: {
            description: {
                story: 'min/max를 사용하여 파일 개수를 제한할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const oneFile = ref<File[] | null>(null);
            const multipleFiles = ref<File[] | null>(null);
            const requiredFiles = ref<File[] | null>(null);
            return { args, oneFile, multipleFiles, requiredFiles };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-file-drop 
                    v-model="oneFile" 
                    label="단일 파일 (최대 1개)" 
                    placeholder="파일 1개만 업로드 가능" 
                    :max="1"
                />
                
                <vs-file-drop 
                    v-model="multipleFiles" 
                    label="다중 파일 (2-5개)" 
                    placeholder="파일 2-5개 업로드 가능" 
                    :min="2"
                    :max="5"
                />
                
                <vs-file-drop 
                    v-model="requiredFiles" 
                    label="필수 파일" 
                    placeholder="최소 1개 파일 필요" 
                    required
                />
            </div>
        `,
    }),
};

export const CustomSlot: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 슬롯을 사용하여 커스텀 UI를 구현할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const files = ref<File[] | null>(null);
            return { args, files };
        },
        template: `
            <vs-file-drop v-model="files" label="커스텀 UI">
                <template #default="{ dragging }">
                    <div :style="{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '2rem',
                        backgroundColor: dragging ? '#e3f2fd' : '#f5f5f5',
                        border: dragging ? '2px dashed #1e88e5' : '2px dashed #ccc',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                    }">
                        <div style="fontSize: '2rem'">📁</div>
                        <div style="fontWeight: 600; color: '#333'">
                            {{ dragging ? '파일을 놓아주세요' : '여기에 파일을 드래그하세요' }}
                        </div>
                        <div style="fontSize: '0.875rem'; color: '#666'">또는 클릭하여 선택</div>
                    </div>
                </template>
            </vs-file-drop>
        `,
    }),
};

export const Grid: Story = {
    parameters: {
        docs: {
            description: {
                story: 'grid prop을 사용하여 그리드 레이아웃에서 사용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop, VsContainer },
        setup() {
            const files1 = ref<File[] | null>(null);
            const files2 = ref<File[] | null>(null);
            return { args, files1, files2 };
        },
        template: `
            <vs-container grid>
                <vs-file-drop v-model="files1" label="첫 번째 파일" placeholder="파일 업로드" :grid="{ sm: 12, md: 6 }" />
                <vs-file-drop v-model="files2" label="두 번째 파일" placeholder="파일 업로드" :grid="{ sm: 12, md: 6 }" />
            </vs-container>
        `,
    }),
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: 'colorScheme prop을 사용하여 다양한 색상 테마를 적용할 수 있습니다.',
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
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-file-drop color-scheme="{{ color }}" label="{{ color }}" placeholder="{{ color }} 파일 업로드" />
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: 'styleSet prop을 사용하여 커스텀 스타일을 적용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const files = ref<File[] | null>(null);
            return { args, files };
        },
        template: '<vs-file-drop v-bind="args" v-model="files" />',
    }),
    args: {
        label: '커스텀 스타일',
        placeholder: '커스텀 파일 드롭',
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
                story: '미리 정의된 스타일 세트를 사용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const files = ref<File[] | null>(null);
            return { args, files };
        },
        template: '<vs-file-drop v-bind="args" v-model="files" />',
    }),
    args: {
        label: '사전 정의 스타일',
        placeholder: 'myStyleSet 적용',
        styleSet: 'myStyleSet',
    },
};
