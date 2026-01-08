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
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- 기본 스타일 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 스타일</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-textarea v-bind="args" placeholder="Basic Textarea" />
                        <vs-textarea v-bind="args" label="With Label" placeholder="내용을 입력하세요..." />
                        <vs-textarea v-bind="args" label="With Value" model-value="여러 줄의 텍스트가 입력되어 있습니다.\n두 번째 줄입니다." />
                    </div>
                </div>

                <!-- 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-textarea v-bind="args" label="Disabled" model-value="disabled value" disabled />
                        <vs-textarea v-bind="args" label="Readonly" model-value="readonly value\nmulti line" readonly />
                        <vs-textarea v-bind="args" label="Required" placeholder="필수 입력" required />
                    </div>
                </div>

                <!-- 검증 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">검증 상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-textarea v-bind="args" label="Success" model-value="성공" state="success" />
                        <vs-textarea v-bind="args" label="Error" model-value="에러" state="error" />
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
        placeholder: { control: 'text', table: { category: 'Textarea Props' } },
        autocomplete: { control: 'boolean', table: { category: 'Textarea Props' } },
        colorScheme,
        label: { control: 'text', table: { category: 'Common Props' } },
        noLabel: { control: 'boolean', table: { category: 'Common Props' } },
        disabled: { control: 'boolean', table: { category: 'Common Props' } },
        readonly: { control: 'boolean', table: { category: 'Common Props' } },
        hidden: { control: 'boolean', table: { category: 'Common Props' } },
        required: { control: 'boolean', table: { category: 'Common Props' } },
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
type Story = StoryObj<typeof VsTextarea>;

export const Default: Story = {};
