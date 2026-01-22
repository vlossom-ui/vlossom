import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import VsInput from './../VsInput.vue';

const meta: Meta<typeof VsInput> = {
    title: 'Components/Input Components/VsInput',
    component: VsInput,
    parameters: {
        docs: {
            description: {
                component:
                    'VsInput은 다양한 타입과 검증 기능을 지원하는 입력 컴포넌트입니다. ' +
                    'text, email, password, number 등 다양한 input 타입을 지원하며, ' +
                    '문자열 수정자(modifiers)를 통해 입력값을 자동으로 변환할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            const inputValue = ref('');
            return { args, inputValue };
        },
        template: '<vs-input v-bind="args" v-model="inputValue" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        // Model
        modelValue: {
            control: 'text',
            description: 'v-model 값 (string | number | null)',
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

        // Input 속성
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
            description: 'Input 타입',
            table: { category: 'Input Props', defaultValue: { summary: 'text' } },
        },
        placeholder: {
            control: 'text',
            description: '플레이스홀더 텍스트',
            table: { category: 'Input Props' },
        },
        autocomplete: {
            control: 'boolean',
            description: '자동완성 활성화',
            table: { category: 'Input Props' },
        },
        noClear: {
            control: 'boolean',
            description: 'clear 버튼 숨김',
            table: { category: 'Input Props' },
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
            description: 'Input 상태',
            table: { category: 'Common Props', defaultValue: { summary: 'idle' } },
        },

        // Validation
        min: {
            control: 'number',
            description: '최소값/길이 (number 타입: 값, 그 외: 길이)',
            table: { category: 'Validation' },
        },
        max: {
            control: 'number',
            description: '최대값/길이 (number 타입: 값, 그 외: 길이)',
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
            description: 'Input 너비 (string | number | Breakpoints)',
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
type Story = StoryObj<typeof VsInput>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 텍스트 입력 필드입니다.',
            },
        },
    },
    args: {
        placeholder: '텍스트를 입력하세요',
    },
};

export const WithLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: '라벨이 있는 입력 필드입니다.',
            },
        },
    },
    args: {
        label: '이름',
        placeholder: '이름을 입력하세요',
    },
};

export const InputTypes: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 input 타입을 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            const textValue = ref('');
            const emailValue = ref('');
            const passwordValue = ref('');
            const numberValue = ref<number | null>(null);
            const telValue = ref('');
            const urlValue = ref('');
            return { args, textValue, emailValue, passwordValue, numberValue, telValue, urlValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input v-model="textValue" type="text" label="Text" placeholder="텍스트 입력" />
                <vs-input v-model="emailValue" type="email" label="Email" placeholder="email@example.com" />
                <vs-input v-model="passwordValue" type="password" label="Password" placeholder="비밀번호" />
                <vs-input v-model="numberValue" type="number" label="Number" placeholder="숫자 입력" />
                <vs-input v-model="telValue" type="tel" label="Tel" placeholder="010-0000-0000" />
                <vs-input v-model="urlValue" type="url" label="URL" placeholder="https://example.com" />
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
        components: { VsInput },
        setup() {
            const normalValue = ref('normal');
            const disabledValue = ref('disabled');
            const readonlyValue = ref('readonly');
            const requiredValue = ref('');
            return { args, normalValue, disabledValue, readonlyValue, requiredValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input v-model="normalValue" label="Normal" />
                <vs-input v-model="disabledValue" label="Disabled" disabled />
                <vs-input v-model="readonlyValue" label="Readonly" readonly />
                <vs-input v-model="requiredValue" label="Required" placeholder="필수 입력" required />
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
        components: { VsInput },
        setup() {
            const idleValue = ref('');
            const successValue = ref('입력 성공');
            const errorValue = ref('잘못된 입력');
            const infoValue = ref('정보');
            const warningValue = ref('주의');
            return { args, idleValue, successValue, errorValue, infoValue, warningValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input v-model="idleValue" state="idle" label="Idle" placeholder="기본 상태" />
                <vs-input v-model="successValue" state="success" label="Success" />
                <vs-input v-model="errorValue" state="error" label="Error" />
                <vs-input v-model="infoValue" state="info" label="Info" />
                <vs-input v-model="warningValue" state="warning" label="Warning" />
            </div>
        `,
    }),
};

export const ValidationRules: Story = {
    parameters: {
        docs: {
            description: {
                story: 'min/max를 사용한 검증입니다. number 타입에서는 값의 범위를, 그 외 타입에서는 글자 수를 검증합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            const textValue = ref('');
            const numberValue = ref<number | null>(null);
            const requiredValue = ref('');
            return { args, textValue, numberValue, requiredValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input v-model="textValue" type="text" label="Text (3-10자)" placeholder="3-10자 입력" :min="3" :max="10" />
                <vs-input v-model="numberValue" type="number" label="Number (0-100)" placeholder="0-100 입력" :min="0" :max="100" />
                <vs-input v-model="requiredValue" label="Required" placeholder="필수 입력" required />
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
        components: { VsInput },
        setup() {
            const successValue = ref('성공');
            const errorValue = ref('에러');
            const warningValue = ref('경고');
            const infoValue = ref('정보');
            return { args, successValue, errorValue, warningValue, infoValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input 
                    v-model="successValue" 
                    label="Success Message" 
                    :messages="[{ state: 'success', text: '입력이 성공적으로 완료되었습니다.' }]" 
                />
                
                <vs-input 
                    v-model="errorValue" 
                    label="Error Message" 
                    :messages="[{ state: 'error', text: '올바른 형식이 아닙니다.' }]" 
                />
                
                <vs-input 
                    v-model="warningValue" 
                    label="Warning Message" 
                    :messages="[{ state: 'warning', text: '이 값은 권장되지 않습니다.' }]" 
                />
                
                <vs-input 
                    v-model="infoValue" 
                    label="Info Message" 
                    :messages="[{ state: 'info', text: '참고: 이 필드는 선택사항입니다.' }]" 
                />
                
                <vs-input 
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

export const NoClearButton: Story = {
    parameters: {
        docs: {
            description: {
                story: 'noClear prop을 사용하여 clear 버튼을 숨길 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            const withClear = ref('Clear 버튼 있음');
            const noClear = ref('Clear 버튼 없음');
            return { args, withClear, noClear };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input v-model="withClear" label="With Clear Button" />
                <vs-input v-model="noClear" label="No Clear Button" no-clear />
            </div>
        `,
    }),
};

export const Slots: Story = {
    parameters: {
        docs: {
            description: {
                story: 'prepend와 append 슬롯을 사용하여 입력 필드 앞뒤에 요소를 추가할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            const searchValue = ref('');
            const priceValue = ref<number | null>(null);
            const urlValue = ref('');
            return { args, searchValue, priceValue, urlValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input v-model="searchValue" label="Prepend Slot" placeholder="검색어 입력">
                    <template #prepend>🔍</template>
                </vs-input>
                
                <vs-input v-model="priceValue" type="number" label="Append Slot" placeholder="0">
                    <template #append>
                        <span style="padding: 0 0.5rem;">원</span>
                    </template>
                </vs-input>
                
                <vs-input v-model="urlValue" label="Both Slots" placeholder="URL 입력">
                    <template #prepend>https://</template>
                    <template #append>
                        <span style="padding: 0 0.5rem;">.com</span>
                    </template>
                </vs-input>
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
        components: { VsInput },
        setup() {
            const capitalizeValue = ref('');
            const upperValue = ref('');
            const lowerValue = ref('');
            return { args, capitalizeValue, upperValue, lowerValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input v-model.capitalize="capitalizeValue" label="Capitalize" placeholder="첫 글자만 대문자로" />
                <vs-input v-model.upper="upperValue" label="Upper" placeholder="전체 대문자로" />
                <vs-input v-model.lower="lowerValue" label="Lower" placeholder="전체 소문자로" />
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
        components: { VsInput },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-input color-scheme="{{ color }}" label="{{ color }}" placeholder="{{ color }} 입력" />
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
        components: { VsInput },
        setup() {
            const value = ref('');
            return { args, value };
        },
        template: '<vs-input v-bind="args" v-model="value" />',
    }),
    args: {
        label: '커스텀 스타일',
        placeholder: '커스텀 입력 필드',
        styleSet: {
            variables: {
                fontColor: '#1565c0',
                fontSize: '1.1rem',
                padding: '0 1.5rem',
            },
            component: {
                backgroundColor: '#f0f8ff',
                border: '2px solid #1e88e5',
                borderRadius: '12px',
                height: '3.5rem',
            },
        },
    },
};
