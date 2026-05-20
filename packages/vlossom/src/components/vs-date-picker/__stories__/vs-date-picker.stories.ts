import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import VsDatePicker from './../VsDatePicker.vue';
import VsForm from '@/components/vs-form/VsForm.vue';
import VsButton from '@/components/vs-button/VsButton.vue';

const meta: Meta<typeof VsDatePicker> = {
    title: 'Components/Input Components/VsDatePicker',
    component: VsDatePicker,
    parameters: {
        docs: {
            description: {
                component:
                    'VsDatePicker는 네이티브 input 기반 4종 타입(date, datetime-local, time, month)을 지원하는 ' +
                    'date picker 컴포넌트입니다. 선택적 timezone select 통합을 제공하며, modelValue는 항상 UTC instant입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsDatePicker },
        setup() {
            const value = ref<Date | null>(null);
            return { args, value };
        },
        template: '<vs-date-picker v-bind="args" v-model="value" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        modelValue: {
            control: 'date',
            description: 'v-model 값 (Date | null, UTC instant)',
            table: { category: 'Model' },
        },
        type: {
            control: 'select',
            options: ['date', 'datetime-local', 'time', 'month'],
            description: 'Input 타입',
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
        timezone: {
            control: 'boolean',
            description: 'timezone select 활성화',
            table: { category: 'Timezone', defaultValue: { summary: 'false' } },
        },
        timezoneOptions: {
            control: 'object',
            description: 'timezone select 옵션 배열 (첫번째 = 초기값)',
            table: { category: 'Timezone' },
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
            control: 'date',
            description: '최소 선택 가능 Date',
            table: { category: 'Validation' },
        },
        max: {
            control: 'date',
            description: '최대 선택 가능 Date',
            table: { category: 'Validation' },
        },
        disabledDates: {
            control: 'object',
            description: '선택 차단 Date 배열',
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
            const date = ref<Date | null>(null);
            const datetime = ref<Date | null>(null);
            const time = ref<Date | null>(null);
            const month = ref<Date | null>(null);
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
                story: 'min/max는 Date 객체이며 native input attribute가 아닌 Vlossom validation rule로 검증됩니다.',
            },
        },
    },
    args: {
        label: '2026년 내 선택',
        min: new Date('2026-01-01T00:00:00Z'),
        max: new Date('2026-12-31T00:00:00Z'),
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
            const v = ref<Date | null>(new Date('2026-05-18T00:00:00Z'));
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
            const date = ref<Date | null>(null);
            async function onSubmit() {
                const valid = await formRef.value?.validate();
                alert(valid ? `Valid: ${date.value?.toISOString()}` : 'Invalid');
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

export const WithTimezone: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'timezone prop을 켜면 인라인 timezone select가 렌더됩니다. ' +
                    '기본 12개 IANA 옵션을 사용하며 초기값은 timezoneOptions[0].value (Etc/UTC).',
            },
        },
    },
    args: {
        type: 'datetime-local',
        label: 'Datetime + Timezone',
        timezone: true,
    },
};

export const WithCustomTimezoneOptions: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '사용자 정의 timezoneOptions를 전달하면 첫번째 옵션이 초기 timezone이 됩니다.',
            },
        },
    },
    args: {
        type: 'datetime-local',
        label: 'Asia 권역만',
        timezone: true,
        timezoneOptions: [
            { value: 'Asia/Seoul', label: '서울 (UTC+09:00)' },
            { value: 'Asia/Tokyo', label: '도쿄 (UTC+09:00)' },
            { value: 'Asia/Shanghai', label: '상하이 (UTC+08:00)' },
            { value: 'Asia/Kolkata', label: '콜카타 (UTC+05:30)' },
            { value: 'Asia/Dubai', label: '두바이 (UTC+04:00)' },
        ],
    },
};

export const TimezoneChangeBehavior: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'timezone 변경 시 wall-clock(화면에 보이는 시각)은 유지되고 UTC가 재계산됩니다. ' +
                    '예: Seoul 15:30 → Tokyo 변경 시 wall-clock은 15:30 유지, UTC는 06:30으로 유지(둘 다 동일 offset)되지만, ' +
                    'New York로 변경하면 UTC가 19:30 (전일)로 재계산됩니다.',
            },
        },
    },
    render: () => ({
        components: { VsDatePicker },
        setup() {
            const value = ref<Date | null>(new Date('2026-05-18T06:30:00Z'));
            const events = ref<string[]>([]);
            function onChange(payload: { from: string; to: string }) {
                events.value.push(`${payload.from} → ${payload.to}`);
            }
            return { value, events, onChange };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-date-picker
                    v-model="value"
                    type="datetime-local"
                    label="타임존을 바꿔보세요"
                    timezone
                    @timezone-change="onChange"
                />
                <div style="padding: 1rem; background: #f5f5f5; border-radius: 0.5rem;">
                    <div><strong>modelValue (UTC):</strong> {{ value?.toISOString() ?? 'null' }}</div>
                    <div><strong>Timezone changes:</strong></div>
                    <ul>
                        <li v-for="(e, i) in events" :key="i">{{ e }}</li>
                    </ul>
                </div>
            </div>
        `,
    }),
};
