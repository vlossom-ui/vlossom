import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, inputPropsArgTypes, minMaxArgTypes, responsiveArgTypes, styleArgTypes } from '@/storybook';
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

                <!-- Multiple -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">단일/다중 파일</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-file-drop v-bind="args" label="Single File" placeholder="1개만 업로드 가능" />
                        <vs-file-drop v-bind="args" label="Multiple Files" placeholder="여러 파일 업로드 가능" multiple />
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
        colorScheme,
        ...inputPropsArgTypes,
        ...minMaxArgTypes,
        ...responsiveArgTypes,
        ...styleArgTypes,
    },
};

export default meta;
type Story = StoryObj<typeof VsFileDrop>;

export const Default: Story = {};
