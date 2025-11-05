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
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- 기본 스타일 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 스타일</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" placeholder="Basic Input" />
                        <vs-input v-bind="args" label="With Label" placeholder="텍스트 입력" />
                    </div>
                </div>

                <!-- Input 타입 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Input 타입</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" type="email" label="Email" placeholder="email@example.com" />
                        <vs-input v-bind="args" type="password" label="Password" placeholder="비밀번호" />
                        <vs-input v-bind="args" type="number" label="Number" placeholder="숫자 입력" />
                    </div>
                </div>

                <!-- 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" label="Disabled" model-value="disabled value" disabled />
                        <vs-input v-bind="args" label="Readonly" model-value="readonly value" readonly />
                        <vs-input v-bind="args" label="Required" placeholder="필수 입력" required />
                    </div>
                </div>

                <!-- 크기 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">크기</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" label="Small" placeholder="작은 크기" small />
                    </div>
                </div>

                <!-- 검증 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">검증 상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" label="Success" model-value="성공" state="success" />
                        <vs-input v-bind="args" label="Error" model-value="에러" state="error" />
                    </div>
                </div>

                <!-- 추가 기능 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">추가 기능</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" label="No Clear" model-value="clear 버튼 없음" no-clear />
                        <vs-input v-bind="args" label="Prepend Slot" placeholder="검색">
                            <template #prepend>🔍</template>
                        </vs-input>
                        <vs-input v-bind="args" label="Append Slot" type="number" placeholder="0">
                            <template #append><span style="padding: 0 0.5rem;">원</span></template>
                        </vs-input>
                    </div>
                </div>
            </div>
        `,
    }),
    argTypes: {
        modelValue: { control: 'text', table: { category: 'Model' } },
        modelModifiers: { control: 'object', table: { category: 'Model' } },
        changed: { control: 'boolean', table: { category: 'Model' } },
        valid: { control: 'boolean', table: { category: 'Model' } },
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
            table: { category: 'Input Props' },
        },
        placeholder: { control: 'text', table: { category: 'Input Props' } },
        autocomplete: { control: 'boolean', table: { category: 'Input Props' } },
        noClear: { control: 'boolean', table: { category: 'Input Props' } },
        colorScheme,
        label: { control: 'text', table: { category: 'Common Props' } },
        noLabel: { control: 'boolean', table: { category: 'Common Props' } },
        disabled: { control: 'boolean', table: { category: 'Common Props' } },
        readonly: { control: 'boolean', table: { category: 'Common Props' } },
        hidden: { control: 'boolean', table: { category: 'Common Props' } },
        required: { control: 'boolean', table: { category: 'Common Props' } },
        small: { control: 'boolean', table: { category: 'Common Props' } },
        state: {
            control: 'select',
            options: ['idle', 'success', 'error', 'info', 'warning'],
            table: { category: 'Common Props' },
        },
        min: { control: 'number', table: { category: 'Validation' } },
        max: { control: 'number', table: { category: 'Validation' } },
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
type Story = StoryObj<typeof VsInput>;

export const Default: Story = {};
