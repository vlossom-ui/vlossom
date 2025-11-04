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
        colorScheme,
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
            description: 'Input 타입',
        },
        placeholder: {
            control: 'text',
            description: '플레이스홀더 텍스트',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
        },
        readonly: {
            control: 'boolean',
            description: '읽기 전용 상태',
        },
        hidden: {
            control: 'boolean',
            description: '숨김 상태',
        },
        required: {
            control: 'boolean',
            description: '필수 입력 여부',
        },
        state: {
            control: 'select',
            options: ['error', 'idle', 'success', 'info', 'warning'],
            description: 'Input 상태',
        },
        label: {
            control: 'text',
            description: '라벨 텍스트',
        },
        noLabel: {
            control: 'boolean',
            description: '라벨 숨김',
        },
        messages: {
            control: 'object',
            description: '메시지 배열',
        },
        noMessages: {
            control: 'boolean',
            description: '메시지 영역 숨김',
        },
        rules: {
            control: 'object',
            description: '검증 규칙 배열',
        },
        noDefaultRules: {
            control: 'boolean',
            description: '기본 검증 규칙 비활성화',
        },
        max: {
            control: 'number',
            description: '최대값 (number 타입에서 사용)',
        },
        min: {
            control: 'number',
            description: '최소값 (number 타입에서 사용)',
        },
        small: {
            control: 'boolean',
            description: '작은 크기',
        },
        styleSet: {
            control: 'object',
            description: '커스텀 스타일 객체',
        },
        noClear: {
            control: 'boolean',
            description: 'clear 버튼 숨김',
        },
        autocomplete: {
            control: 'boolean',
            description: '자동완성 활성화',
        },
        id: {
            control: 'text',
            description: 'Input ID',
        },
        name: {
            control: 'text',
            description: 'Input name 속성',
        },
        width: {
            control: 'text',
            description: 'Input 너비 (string | number | Breakpoints)',
        },
        grid: {
            control: 'text',
            description: 'Grid 설정 (string | number | Breakpoints)',
        },
        modelValue: {
            control: 'text',
            description: 'v-model 값',
        },
        modelModifiers: {
            control: 'object',
            description: 'v-model modifiers (capitalize, upper, lower)',
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

export const Required: Story = {
    parameters: {
        docs: {
            description: {
                story: '필수 입력 필드입니다. 라벨에 별표(*)가 표시됩니다.',
            },
        },
    },
    args: {
        label: '이메일',
        placeholder: 'email@example.com',
        type: 'email',
        required: true,
    },
};

export const Types: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 input 타입을 지원합니다. text, email, password, number, tel, url, search 등을 사용할 수 있습니다.',
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
            return { args, textValue, emailValue, passwordValue, numberValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input v-bind="args" v-model="textValue" type="text" label="Text" placeholder="텍스트 입력" />
                <vs-input v-bind="args" v-model="emailValue" type="email" label="Email" placeholder="email@example.com" />
                <vs-input v-bind="args" v-model="passwordValue" type="password" label="Password" placeholder="비밀번호" />
                <vs-input v-bind="args" v-model="numberValue" type="number" label="Number" placeholder="숫자 입력" />
            </div>
        `,
    }),
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: '비활성화된 입력 필드입니다. 사용자가 입력할 수 없습니다.',
            },
        },
    },
    args: {
        label: '비활성화',
        placeholder: '입력할 수 없습니다',
        disabled: true,
    },
};

export const Readonly: Story = {
    parameters: {
        docs: {
            description: {
                story: '읽기 전용 입력 필드입니다. 값을 볼 수는 있지만 수정할 수 없습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            const value = ref('읽기 전용 값');
            return { args, value };
        },
        template: '<vs-input v-bind="args" v-model="value" />',
    }),
    args: {
        label: '읽기 전용',
        readonly: true,
    },
};

export const Small: Story = {
    parameters: {
        docs: {
            description: {
                story: '작은 크기의 입력 필드입니다.',
            },
        },
    },
    args: {
        label: '작은 크기',
        placeholder: '작은 입력 필드',
        small: true,
    },
};

export const State: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'state prop을 사용하여 입력 필드의 상태를 표시할 수 있습니다. ' +
                    'idle, success, error, info, warning 상태를 지원합니다.',
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
                <vs-input v-bind="args" v-model="idleValue" state="idle" label="Idle" placeholder="기본 상태" />
                <vs-input v-bind="args" v-model="successValue" state="success" label="Success" placeholder="성공 상태" />
                <vs-input v-bind="args" v-model="errorValue" state="error" label="Error" placeholder="에러 상태" />
                <vs-input v-bind="args" v-model="infoValue" state="info" label="Info" placeholder="정보 상태" />
                <vs-input v-bind="args" v-model="warningValue" state="warning" label="Warning" placeholder="경고 상태" />
            </div>
        `,
    }),
};

export const NoClear: Story = {
    parameters: {
        docs: {
            description: {
                story: 'clear 버튼이 없는 입력 필드입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            const value = ref('clear 버튼 없음');
            return { args, value };
        },
        template: '<vs-input v-bind="args" v-model="value" />',
    }),
    args: {
        label: 'Clear 버튼 없음',
        noClear: true,
    },
};

export const WithSlots: Story = {
    parameters: {
        docs: {
            description: {
                story: 'prepend와 append 슬롯을 사용하여 입력 필드 앞뒤에 아이콘이나 텍스트를 추가할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            const searchValue = ref('');
            const priceValue = ref<number | null>(null);
            return { args, searchValue, priceValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input v-bind="args" v-model="searchValue" label="검색" placeholder="검색어 입력">
                    <template #prepend>
                        🔍
                    </template>
                </vs-input>
                <vs-input v-bind="args" v-model="priceValue" type="number" label="가격" placeholder="0">
                    <template #append>
                        <span style="padding: 0 0.5rem;">원</span>
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
                story:
                    'v-model에 modifiers를 사용하여 입력값을 자동으로 변환할 수 있습니다. ' +
                    'capitalize(첫글자 대문자), upper(전체 대문자), lower(전체 소문자)를 지원합니다.',
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
                <vs-input v-bind="args" v-model.capitalize="capitalizeValue" label="Capitalize" placeholder="첫 글자만 대문자로" />
                <vs-input v-bind="args" v-model.upper="upperValue" label="Upper" placeholder="전체 대문자로" />
                <vs-input v-bind="args" v-model.lower="lowerValue" label="Lower" placeholder="전체 소문자로" />
                <div style="padding: 1rem; background: #f5f5f5; border-radius: 0.5rem;">
                    <div>Capitalize: {{ capitalizeValue }}</div>
                    <div>Upper: {{ upperValue }}</div>
                    <div>Lower: {{ lowerValue }}</div>
                </div>
            </div>
        `,
    }),
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '다양한 색상 테마가 적용된 입력 필드들입니다. ' +
                    'colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
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
                    <vs-input v-bind="args" color-scheme="{{ color }}" label="{{ color }}" placeholder="{{ color }} 입력" />
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 입력 필드입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
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
            backgroundColor: '#f0f8ff',
            border: '2px solid #1e88e5',
            borderRadius: '12px',
            fontColor: '#1565c0',
            fontSize: '1.1rem',
            height: '3.5rem',
            padding: '0 1.5rem',
        },
    },
};

export const NumberInput: Story = {
    parameters: {
        docs: {
            description: {
                story: 'number 타입 입력 필드입니다. min/max 속성으로 범위를 제한할 수 있으며, 빈 값은 null로 처리됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            const age = ref<number | null>(null);
            return { args, age };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-input v-bind="args" v-model="age" type="number" label="나이" placeholder="나이 입력" :min="0" :max="120" />
                <div style="padding: 1rem; background: #f5f5f5; border-radius: 0.5rem;">
                    입력된 값: {{ age }} (타입: {{ typeof age }})
                </div>
            </div>
        `,
    }),
};
