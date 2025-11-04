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
        colorScheme,
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
            description: 'Textarea 상태',
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
            description: '최대 글자 수',
        },
        min: {
            control: 'number',
            description: '최소 글자 수',
        },
        small: {
            control: 'boolean',
            description: '작은 크기',
        },
        styleSet: {
            control: 'object',
            description: '커스텀 스타일 객체',
        },
        autocomplete: {
            control: 'boolean',
            description: '자동완성 활성화',
        },
        id: {
            control: 'text',
            description: 'Textarea ID',
        },
        name: {
            control: 'text',
            description: 'Textarea name 속성',
        },
        width: {
            control: 'text',
            description: 'Textarea 너비 (string | number | Breakpoints)',
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

export const Required: Story = {
    parameters: {
        docs: {
            description: {
                story: '필수 입력 필드입니다. 라벨에 별표(*)가 표시됩니다.',
            },
        },
    },
    args: {
        label: '필수 입력 항목',
        placeholder: '이 항목은 필수입니다',
        required: true,
    },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: '비활성화된 텍스트 영역입니다. 사용자가 입력할 수 없습니다.',
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
                story: '읽기 전용 텍스트 영역입니다. 값을 볼 수는 있지만 수정할 수 없습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextarea },
        setup() {
            const value = ref('읽기 전용 내용입니다.\n여러 줄의 텍스트를 볼 수 있지만\n수정할 수는 없습니다.');
            return { args, value };
        },
        template: '<vs-textarea v-bind="args" v-model="value" />',
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
                story: '작은 크기의 텍스트 영역입니다.',
            },
        },
    },
    args: {
        label: '작은 크기',
        placeholder: '작은 텍스트 영역',
        small: true,
    },
};

export const State: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'state prop을 사용하여 텍스트 영역의 상태를 표시할 수 있습니다. ' +
                    'idle, success, error, info, warning 상태를 지원합니다.',
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
                <vs-textarea v-bind="args" v-model="idleValue" state="idle" label="Idle" placeholder="기본 상태" />
                <vs-textarea v-bind="args" v-model="successValue" state="success" label="Success" placeholder="성공 상태" />
                <vs-textarea v-bind="args" v-model="errorValue" state="error" label="Error" placeholder="에러 상태" />
                <vs-textarea v-bind="args" v-model="infoValue" state="info" label="Info" placeholder="정보 상태" />
                <vs-textarea v-bind="args" v-model="warningValue" state="warning" label="Warning" placeholder="경고 상태" />
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
        components: { VsTextarea },
        setup() {
            const capitalizeValue = ref('');
            const upperValue = ref('');
            const lowerValue = ref('');
            return { args, capitalizeValue, upperValue, lowerValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-textarea v-bind="args" v-model.capitalize="capitalizeValue" label="Capitalize" placeholder="첫 글자만 대문자로" />
                <vs-textarea v-bind="args" v-model.upper="upperValue" label="Upper" placeholder="전체 대문자로" />
                <vs-textarea v-bind="args" v-model.lower="lowerValue" label="Lower" placeholder="전체 소문자로" />
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
                    '다양한 색상 테마가 적용된 텍스트 영역들입니다. ' +
                    'colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
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
                    <vs-textarea v-bind="args" color-scheme="{{ color }}" label="{{ color }}" placeholder="{{ color }} 입력" />
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 텍스트 영역입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
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
            backgroundColor: '#f0f8ff',
            border: '2px solid #1e88e5',
            borderRadius: '12px',
            fontColor: '#1565c0',
            fontSize: '1.1rem',
            height: '10rem',
            padding: '0.75rem 1rem',
        },
    },
};

export const MaxMinLength: Story = {
    parameters: {
        docs: {
            description: {
                story: 'min/max 속성으로 글자 수 범위를 제한할 수 있습니다. 유효성 검사 시 체크됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextarea },
        setup() {
            const text = ref('');
            return { args, text };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-textarea v-bind="args" v-model="text" label="글자 수 제한 (10-100자)" placeholder="내용 입력" :min="10" :max="100" />
                <div style="padding: 1rem; background: #f5f5f5; border-radius: 0.5rem;">
                    글자 수: {{ text.length }} / 100
                </div>
            </div>
        `,
    }),
};
