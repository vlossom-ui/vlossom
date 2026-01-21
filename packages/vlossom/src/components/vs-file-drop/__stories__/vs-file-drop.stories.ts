import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import {
    colorScheme,
    getColorSchemeTemplate,
    chromaticParameters,
    inputPropsArgTypes,
    minMaxArgTypes,
    responsiveArgTypes,
    styleArgTypes,
} from '@/storybook';
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
        colorScheme,
        ...inputPropsArgTypes,
        ...minMaxArgTypes,
        ...responsiveArgTypes,
        ...styleArgTypes,
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
            const imageFiles = ref<File[]>([]);
            const documentFiles = ref<File[]>([]);
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

export const SingleFileUpload: Story = {
    parameters: {
        docs: {
            description: {
                story: 'multiple prop을 false로 설정하면 단일 파일만 업로드할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const singleFile = ref<File[]>([]);
            const multipleFiles = ref<File[]>([]);
            return { args, singleFile, multipleFiles };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-file-drop 
                    v-model="singleFile" 
                    label="단일 파일 업로드" 
                    placeholder="1개의 파일만 업로드 가능" 
                />
                
                <vs-file-drop 
                    v-model="multipleFiles" 
                    label="다중 파일 업로드" 
                    placeholder="여러 파일 업로드 가능" 
                    multiple
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
            const normalFiles = ref<File[]>([]);
            const disabledFiles = ref<File[]>([]);
            const readonlyFiles = ref<File[]>([]);
            const requiredFiles = ref<File[]>([]);
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
            const idleFiles = ref<File[]>([]);
            const successFiles = ref<File[]>([]);
            const errorFiles = ref<File[]>([]);
            const infoFiles = ref<File[]>([]);
            const warningFiles = ref<File[]>([]);
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
            const oneFile = ref<File[]>([]);
            const multipleFiles = ref<File[]>([]);
            const requiredFiles = ref<File[]>([]);
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

export const Messages: Story = {
    parameters: {
        docs: {
            description: {
                story: 'messages prop을 사용하여 사용자에게 피드백 메시지를 표시할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            const successFiles = ref<File[]>([]);
            const errorFiles = ref<File[]>([]);
            const warningFiles = ref<File[]>([]);
            const infoFiles = ref<File[]>([]);
            return { args, successFiles, errorFiles, warningFiles, infoFiles };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-file-drop 
                    v-model="successFiles" 
                    label="Success Message" 
                    placeholder="파일 업로드"
                    :messages="[{ state: 'success', text: '파일이 성공적으로 업로드되었습니다.' }]" 
                />
                
                <vs-file-drop 
                    v-model="errorFiles" 
                    label="Error Message" 
                    placeholder="파일 업로드"
                    :messages="[{ state: 'error', text: '파일 업로드에 실패했습니다.' }]" 
                />
                
                <vs-file-drop 
                    v-model="warningFiles" 
                    label="Warning Message" 
                    placeholder="파일 업로드"
                    :messages="[{ state: 'warning', text: '파일 크기가 너무 큽니다.' }]" 
                />
                
                <vs-file-drop 
                    v-model="infoFiles" 
                    label="Info Message" 
                    placeholder="파일 업로드"
                    :messages="[{ state: 'info', text: '참고: 최대 10MB까지 업로드 가능합니다.' }]" 
                />
                
                <vs-file-drop 
                    v-model="successFiles" 
                    label="Multiple Messages" 
                    placeholder="파일 업로드"
                    :messages="[
                        { state: 'success', text: '업로드 완료' },
                        { state: 'info', text: '파일이 자동으로 저장됩니다.' }
                    ]" 
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
            const files = ref<File[]>([]);
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
            const files1 = ref<File[]>([]);
            const files2 = ref<File[]>([]);
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
            const files = ref<File[]>([]);
            return { args, files };
        },
        template: '<vs-file-drop v-bind="args" v-model="files" />',
    }),
    args: {
        label: '커스텀 스타일',
        placeholder: '커스텀 파일 드롭',
        styleSet: {
            variables: {
                dragBackgroundColor: '#ffccbc',
                padding: '2rem',
            },
            component: {
                border: '2px dashed #ff5722',
                borderRadius: '16px',
                backgroundColor: '#ffebee',
            },
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
            const files = ref<File[]>([]);
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
