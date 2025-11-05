import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsFileDrop from './../VsFileDrop.vue';

const meta: Meta<typeof VsFileDrop> = {
    title: 'Chromatic/Input Components/VsFileDrop',
    component: VsFileDrop,
    render: (args: any) => ({
        components: { VsFileDrop },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- 기본 스타일 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 스타일</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-file-drop v-bind="args" placeholder="Basic FileDrop" />
                        <vs-file-drop v-bind="args" label="With Label" placeholder="파일을 드래그하거나 클릭하세요" />
                    </div>
                </div>

                <!-- Accept -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">파일 타입 제한</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-file-drop v-bind="args" label="Accept Images" placeholder="이미지만 업로드 가능" accept=".png,.jpg,.jpeg" />
                    </div>
                </div>

                <!-- 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-file-drop v-bind="args" label="Disabled" placeholder="비활성화" disabled />
                        <vs-file-drop v-bind="args" label="Readonly" placeholder="읽기 전용" readonly />
                        <vs-file-drop v-bind="args" label="Required" placeholder="필수 입력" required />
                    </div>
                </div>

                <!-- 크기 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">크기</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-file-drop v-bind="args" label="Small" placeholder="작은 크기" small />
                    </div>
                </div>

                <!-- 검증 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">검증 상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-file-drop v-bind="args" label="Success" placeholder="성공 상태" state="success" />
                        <vs-file-drop v-bind="args" label="Error" placeholder="에러 상태" state="error" />
                    </div>
                </div>
            </div>
        `,
    }),
    argTypes: {
        modelValue: { control: false, table: { category: 'Model' } },
        changed: { control: 'boolean', table: { category: 'Model' } },
        valid: { control: 'boolean', table: { category: 'Model' } },
        placeholder: { control: 'text', table: { category: 'FileDrop Props' } },
        accept: { control: 'text', table: { category: 'FileDrop Props' } },
        height: { control: 'text', table: { category: 'FileDrop Props' } },
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
type Story = StoryObj<typeof VsFileDrop>;

export const Default: Story = {};
