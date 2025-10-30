import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsInput from './../VsInput.vue';

const meta: Meta<typeof VsInput> = {
    title: 'Chromatic/Input Components/VsInput',
    component: VsInput,
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            return { args };
        },
        template: `
            <div>
                <vs-input v-bind="args" type="text" label="Text Input" placeholder="텍스트 입력" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" type="email" label="Email Input" placeholder="email@example.com" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" type="password" label="Password Input" placeholder="비밀번호" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" type="number" label="Number Input" placeholder="숫자 입력" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="Disabled Input" disabled model-value="Disabled value" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="Readonly Input" readonly model-value="Readonly value" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="Required Input" placeholder="필수 입력" required :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="Small Input" placeholder="작은 크기" small :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="No Clear" placeholder="Clear 불가" no-clear model-value="Clear 불가" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="Prepend Slot" placeholder="검색어 입력" :style="{ marginBottom: '12px' }">
                    <template #prepend>🔍</template>
                </vs-input>

                <vs-input v-bind="args" label="Append Slot" placeholder="0" type="number" :style="{ marginBottom: '12px' }">
                    <template #append><span style="padding: 0 0.5rem;">원</span></template>
                </vs-input>

                <vs-input v-bind="args" label="Both Slots" placeholder="입력" :style="{ marginBottom: '12px' }">
                    <template #prepend>⭐</template>
                    <template #append><span style="padding: 0 0.5rem;">%</span></template>
                </vs-input>

                <vs-input v-bind="args" placeholder="No Label" no-label :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" placeholder="Small + No Label" no-label small />
            </div>
        `,
    }),
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

export const Default: Story = {};
