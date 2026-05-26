import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { ref } from 'vue';

import { VsForm, VsButton } from '@/components';
import VsDatePicker from './../VsDatePicker.vue';

const meta: Meta<typeof VsDatePicker> = {
    title: 'Components/Input Components/VsDatePicker',
    component: VsDatePicker,
    parameters: {
        docs: {
            description: {
                component:
                    'VsDatePicker는 네이티브 input 기반 4종 타입(date, datetime-local, time, month)을 지원하는 ' +
                    'date picker 컴포넌트입니다. modelValue는 type에 따라 결정되는 format-validated 문자열입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsDatePicker },
        setup() {
            const value = ref<string>('');
            return { args, value };
        },
        template: '<vs-date-picker v-bind="args" v-model="value" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        modelValue: {
            control: 'text',
            description: 'v-model 값 (format-validated string)',
            table: { category: 'Model' },
        },
        type: {
            control: 'select',
            options: ['date', 'datetime-local', 'time', 'month'],
            description: 'Input 타입 (modelValue format 도 함께 결정)',
            table: { category: 'Input Props', defaultValue: { summary: 'date' } },
        },
        placeholder: {
            control: 'text',
            description: '플레이스홀더 텍스트',
            table: { category: 'Input Props' },
        },
        noClear: {
            control: 'boolean',
            description: 'clear 버튼 숨김',
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
        min: {
            control: 'text',
            description: '최소 유효 값 (string)',
            table: { category: 'Validation' },
        },
        max: {
            control: 'text',
            description: '최대 유효 값 (string)',
            table: { category: 'Validation' },
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
type Story = StoryObj<typeof VsDatePicker>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 날짜 선택 필드입니다 (type=date).',
            },
        },
    },
    args: {
        label: '날짜',
    },
};

export const Types: Story = {
    parameters: {
        docs: {
            description: {
                story: '4종 타입 (date, datetime-local, time, month) 모두 네이티브 input을 사용합니다.',
            },
        },
    },
    render: () => ({
        components: { VsDatePicker },
        setup() {
            const date = ref<string>('');
            const datetime = ref<string>('');
            const time = ref<string>('');
            const month = ref<string>('');
            return { date, datetime, time, month };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-date-picker v-model="date" type="date" label="Date" />
                <vs-date-picker v-model="datetime" type="datetime-local" label="Datetime-local" />
                <vs-date-picker v-model="time" type="time" label="Time" />
                <vs-date-picker v-model="month" type="month" label="Month" />
            </div>
        `,
    }),
};

export const WithLabel: Story = {
    args: {
        label: '시작일',
        placeholder: '날짜를 선택하세요',
    },
};

export const MinMax: Story = {
    parameters: {
        docs: {
            description: {
                story: 'min/max는 string 이며 native input attribute 가 아닌 Vlossom validation rule 로 검증됩니다.',
            },
        },
    },
    args: {
        label: '2026년 내 선택',
        min: '2026-01-01',
        max: '2026-12-31',
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
        label: '필수',
        required: true,
    },
};

export const DisabledReadonly: Story = {
    render: () => ({
        components: { VsDatePicker },
        setup() {
            const v = ref<string>('2026-05-18');
            return { v };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-date-picker v-model="v" label="Disabled" disabled />
                <vs-date-picker v-model="v" label="Readonly" readonly />
            </div>
        `,
    }),
};

export const WithMessages: Story = {
    args: {
        label: 'With external messages',
        messages: [{ state: 'info', text: '날짜를 신중히 선택하세요' }],
    },
};

export const WithStyleSet: Story = {
    args: {
        label: '커스텀 스타일',
        styleSet: {
            $input: {
                borderRadius: '12px',
                borderColor: '#1e88e5',
                $input: { fontSize: '1rem', fontWeight: '600' },
            },
        },
    },
};

export const DarkMode: Story = {
    parameters: {
        chromatic: chromaticParameters.theme,
    },
    render: () => ({
        components: { VsDatePicker },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-date-picker color-scheme="{{ color }}" label="{{ color }}" />
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
        components: { VsDatePicker, VsForm, VsButton },
        setup() {
            const formRef = ref();
            const date = ref<string>('');
            async function onSubmit() {
                const valid = await formRef.value?.validate();
                alert(valid ? `Valid: ${date.value}` : 'Invalid');
            }
            return { formRef, date, onSubmit };
        },
        template: `
            <vs-form ref="formRef">
                <vs-date-picker v-model="date" type="date" label="필수 날짜" required />
                <vs-button @click="onSubmit" style="margin-top: 1rem;">Submit</vs-button>
            </vs-form>
        `,
    }),
};
