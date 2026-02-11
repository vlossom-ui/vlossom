import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import VsTextarea from './../VsTextarea.vue';

const meta: Meta<typeof VsTextarea> = {
    title: 'Components/Input Components/VsTextarea',
    component: VsTextarea,
    parameters: {
        docs: {
            description: {
                component:
                    'VsTextarea는 여러 줄의 텍스트를 입력할 수 있는 텍스트 영역 컴포넌트입니다. ' +
                    '문자열 수정자(modifiers)를 통해 입력값을 자동으로 변환할 수 있으며, ' +
                    'min/max를 통해 글자 수를 제한할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextarea },
        setup() {
            const textareaValue = ref('');
            return { args, textareaValue };
        },
        template: '<vs-textarea v-bind="args" v-model="textareaValue" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        // Model
        modelValue: {
            control: 'text',
            description: 'v-model 값 (string)',
            table: { category: 'Model' },
        },
        modelModifiers: {
            control: 'object',
            description: 'v-model modifiers (capitalize, upper, lower)',
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

        // Textarea 속성
        placeholder: {
            control: 'text',
            description: '플레이스홀더 텍스트',
            table: { category: 'Textarea Props' },
        },
        autocomplete: {
            control: 'boolean',
            description: '자동완성 활성화',
            table: { category: 'Textarea Props' },
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
        state: {
            control: 'select',
            options: ['idle', 'success', 'error', 'info', 'warning'],
            description: 'Textarea 상태',
            table: { category: 'Common Props', defaultValue: { summary: 'idle' } },
        },

        // Validation
        min: {
            control: 'number',
            description: '최소 글자 수',
            table: { category: 'Validation' },
        },
        max: {
            control: 'number',
            description: '최대 글자 수',
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
            description: 'Textarea 너비 (string | number | Breakpoints)',
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
            description: 'Textarea ID',
            table: { category: 'Native Props' },
        },
        name: {
            control: 'text',
            description: 'Textarea name 속성',
            table: { category: 'Native Props' },
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsTextarea>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 텍스트 영역입니다.',
            },
        },
    },
    args: {
        placeholder: '내용을 입력하세요...',
    },
};

export const WithLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: '라벨이 있는 텍스트 영역입니다.',
            },
        },
    },
    args: {
        label: '설명',
        placeholder: '설명을 입력하세요',
    },
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
        components: { VsTextarea },
        setup() {
            const normalValue = ref('normal');
            const disabledValue = ref('disabled');
            const readonlyValue = ref('readonly value\nmulti line text');
            const requiredValue = ref('');
            return { args, normalValue, disabledValue, readonlyValue, requiredValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-textarea v-model="normalValue" label="Normal" />
                <vs-textarea v-model="disabledValue" label="Disabled" disabled />
                <vs-textarea v-model="readonlyValue" label="Readonly" readonly />
                <vs-textarea v-model="requiredValue" label="Required" placeholder="필수 입력" required />
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
        components: { VsTextarea },
        setup() {
            const idleValue = ref('');
            const successValue = ref('성공적으로 입력되었습니다');
            const errorValue = ref('잘못된 입력입니다');
            const infoValue = ref('정보 메시지');
            const warningValue = ref('주의가 필요합니다');
            return { args, idleValue, successValue, errorValue, infoValue, warningValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-textarea v-model="idleValue" state="idle" label="Idle" placeholder="기본 상태" />
                <vs-textarea v-model="successValue" state="success" label="Success" />
                <vs-textarea v-model="errorValue" state="error" label="Error" />
                <vs-textarea v-model="infoValue" state="info" label="Info" />
                <vs-textarea v-model="warningValue" state="warning" label="Warning" />
            </div>
        `,
    }),
};

export const ValidationRules: Story = {
    parameters: {
        docs: {
            description: {
                story: 'min/max를 사용하여 글자 수를 제한할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextarea },
        setup() {
            const textValue = ref('');
            const requiredValue = ref('');
            return { args, textValue, requiredValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-textarea v-model="textValue" label="글자 수 제한 (10-100자)" placeholder="내용 입력" :min="10" :max="100" />
                <div style="padding: 0.75rem; background: #f5f5f5; border-radius: 0.5rem;">
                    글자 수: {{ textValue.length }} / 100
                </div>
                
                <vs-textarea v-model="requiredValue" label="Required" placeholder="필수 입력" required />
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
        components: { VsTextarea },
        setup() {
            const successValue = ref('성공');
            const errorValue = ref('에러');
            const warningValue = ref('경고');
            const infoValue = ref('정보');
            return { args, successValue, errorValue, warningValue, infoValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-textarea 
                    v-model="successValue" 
                    label="Success Message" 
                    :messages="[{ state: 'success', text: '입력이 성공적으로 완료되었습니다.' }]" 
                />
                
                <vs-textarea 
                    v-model="errorValue" 
                    label="Error Message" 
                    :messages="[{ state: 'error', text: '올바른 형식이 아닙니다.' }]" 
                />
                
                <vs-textarea 
                    v-model="warningValue" 
                    label="Warning Message" 
                    :messages="[{ state: 'warning', text: '이 값은 권장되지 않습니다.' }]" 
                />
                
                <vs-textarea 
                    v-model="infoValue" 
                    label="Info Message" 
                    :messages="[{ state: 'info', text: '참고: 이 필드는 선택사항입니다.' }]" 
                />
                
                <vs-textarea 
                    v-model="successValue" 
                    label="Multiple Messages" 
                    :messages="[
                        { state: 'success', text: '첫 번째 메시지' },
                        { state: 'info', text: '두 번째 메시지' }
                    ]" 
                />
            </div>
        `,
    }),
};

export const StringModifiers: Story = {
    parameters: {
        docs: {
            description: {
                story: 'v-model에 modifiers를 사용하여 입력값을 자동으로 변환할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextarea },
        setup() {
            const capitalizeValue = ref('');
            const upperValue = ref('');
            const lowerValue = ref('');
            return { args, capitalizeValue, upperValue, lowerValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-textarea v-model.capitalize="capitalizeValue" label="Capitalize" placeholder="첫 글자만 대문자로" />
                <vs-textarea v-model.upper="upperValue" label="Upper" placeholder="전체 대문자로" />
                <vs-textarea v-model.lower="lowerValue" label="Lower" placeholder="전체 소문자로" />
                <div style="padding: 1rem; background: #f5f5f5; border-radius: 0.5rem;">
                    <div><strong>Capitalize:</strong> {{ capitalizeValue }}</div>
                    <div><strong>Upper:</strong> {{ upperValue }}</div>
                    <div><strong>Lower:</strong> {{ lowerValue }}</div>
                </div>
            </div>
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
        components: { VsTextarea },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-textarea color-scheme="{{ color }}" label="{{ color }}" placeholder="{{ color }} 입력" />
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
        components: { VsTextarea },
        setup() {
            const value = ref('');
            return { args, value };
        },
        template: '<vs-textarea v-bind="args" v-model="value" />',
    }),
    args: {
        label: '커스텀 스타일',
        placeholder: '커스텀 텍스트 영역',
        styleSet: {
            textarea: {
                backgroundColor: '#f0f8ff',
                border: '2px solid #1e88e5',
                borderRadius: '12px',
                color: '#1565c0',
                fontSize: '1.1rem',
                minHeight: '10rem',
                padding: '0.75rem 1rem',
            },
        },
    },
};
