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
            <div style="display:flex; flex-direction: column; gap: 2rem; align-items: flex-start; width: 100%;">
                <!-- 기본 상태 -->
                <div style="width: 100%;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 상태</h3>
                    <div style="display:flex; gap: 1rem; flex-direction: column;">
                        <vs-file-drop v-bind="args" placeholder="기본" />
                        <vs-file-drop v-bind="args" placeholder="Multiple" multiple />
                        <vs-file-drop v-bind="args" placeholder="Single" :multiple="false" />
                    </div>
                </div>

                <!-- 크기 -->
                <div style="width: 100%;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">크기</h3>
                    <div style="display:flex; gap: 1rem; flex-direction: column;">
                        <vs-file-drop v-bind="args" placeholder="Default Size" />
                        <vs-file-drop v-bind="args" placeholder="Small Size" small />
                    </div>
                </div>

                <!-- 상태 -->
                <div style="width: 100%;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">상태</h3>
                    <div style="display:flex; gap: 1rem; flex-direction: column;">
                        <vs-file-drop v-bind="args" placeholder="Normal" />
                        <vs-file-drop v-bind="args" placeholder="Disabled" disabled />
                        <vs-file-drop v-bind="args" placeholder="Readonly" readonly />
                        <vs-file-drop v-bind="args" placeholder="Required" label="Required" required />
                    </div>
                </div>

                <!-- Accept -->
                <div style="width: 100%;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Accept</h3>
                    <div style="display:flex; gap: 1rem; flex-direction: column;">
                        <vs-file-drop v-bind="args" placeholder="이미지만 (.png, .jpg)" accept=".png,.jpg" />
                        <vs-file-drop v-bind="args" placeholder="문서만 (.pdf, .docx)" accept=".pdf,.docx" />
                    </div>
                </div>

                <!-- Label -->
                <div style="width: 100%;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Label</h3>
                    <div style="display:flex; gap: 1rem; flex-direction: column;">
                        <vs-file-drop v-bind="args" label="파일 첨부" placeholder="파일을 드래그하세요" />
                        <vs-file-drop v-bind="args" label="필수 파일" placeholder="파일을 드래그하세요" required />
                    </div>
                </div>

                <!-- Messages -->
                <div style="width: 100%;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Messages</h3>
                    <div style="display:flex; gap: 1rem; flex-direction: column;">
                        <vs-file-drop v-bind="args" placeholder="Success Message" :messages="[{ state: 'success', text: '성공 메시지' }]" />
                        <vs-file-drop v-bind="args" placeholder="Error Message" :messages="[{ state: 'error', text: '에러 메시지' }]" />
                        <vs-file-drop v-bind="args" placeholder="Info Message" :messages="[{ state: 'info', text: '정보 메시지' }]" />
                    </div>
                </div>
            </div>`,
    }),
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsFileDrop>;

export const Default: Story = {};

