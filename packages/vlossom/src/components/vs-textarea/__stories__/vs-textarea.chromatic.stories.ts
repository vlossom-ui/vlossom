import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsTextarea from './../VsTextarea.vue';

const meta: Meta<typeof VsTextarea> = {
    title: 'Chromatic/Input Components/VsTextarea',
    component: VsTextarea,
    render: (args: any) => ({
        components: { VsTextarea },
        setup() {
            return { args };
        },
        template: `
            <div>
                <vs-textarea v-bind="args" label="Textarea" placeholder="내용을 입력하세요..." :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" label="Textarea with Value" model-value="여러 줄의 텍스트가 입력되어 있습니다.\n두 번째 줄입니다.\n세 번째 줄입니다." :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" label="Required Textarea" placeholder="필수 입력 항목" required :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" label="Readonly Textarea" model-value="읽기 전용 내용입니다.\n수정할 수 없습니다." readonly :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" label="Disabled Textarea" model-value="비활성화된 내용입니다." disabled :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" label="Small Textarea" placeholder="작은 크기" small :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" label="Success State" model-value="성공적으로 입력되었습니다" state="success" :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" label="Error State" model-value="잘못된 입력입니다" state="error" :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" label="Info State" model-value="정보 메시지" state="info" :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" label="Warning State" model-value="주의가 필요합니다" state="warning" :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" placeholder="No Label" no-label :style="{ marginBottom: '12px' }"/>

                <vs-textarea v-bind="args" placeholder="Small + No Label" no-label small />
            </div>
		`,
    }),
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

export const Default: Story = {};
