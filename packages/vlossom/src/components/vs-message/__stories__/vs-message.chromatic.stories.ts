import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VsMessage from './../VsMessage.vue';

const meta: Meta<typeof VsMessage> = {
    title: 'Chromatic/Base Components/VsMessage',
    component: VsMessage,
    render: (args: any) => ({
        components: { VsMessage },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem; align-items: flex-start;">
                <!-- 기본 상태들 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <vs-message v-bind="args" state="idle" text="기본 메시지입니다." />
                        <vs-message v-bind="args" state="info" text="정보 메시지입니다." />
                        <vs-message v-bind="args" state="success" text="성공적으로 완료되었습니다." />
                        <vs-message v-bind="args" state="warning" text="주의가 필요합니다." />
                        <vs-message v-bind="args" state="error" text="오류가 발생했습니다." />
                    </div>
                </div>

                <!-- 크기 변형 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">크기 변형</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <vs-message v-bind="args" text="기본 메시지" />
                        <vs-message v-bind="args" size="2rem" text="큰 메시지" />
                        <vs-message v-bind="args" size="10" text="숫자만 전달 (px)" />
                    </div>
                </div>
            </div>
        `,
    }),
    argTypes: {},
};

export default meta;
type Story = StoryObj<typeof VsMessage>;

export const Default: Story = {};
