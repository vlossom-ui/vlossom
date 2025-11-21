import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VsTextWrap from './../VsTextWrap.vue';

const meta: Meta<typeof VsTextWrap> = {
    title: 'Chromatic/Base Components/VsTextWrap',
    component: VsTextWrap,
    render: (args: any) => ({
        components: { VsTextWrap },
        setup() {
            return { args };
        },
        template: `
            <div style="display:flex; flex-direction: column; gap: 2rem; align-items: flex-start;">
                <!-- 기본 스타일 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 스타일</h3>
                    <div style="display:flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <vs-text-wrap v-bind="args">Default Text Wrap</vs-text-wrap>
                        <vs-text-wrap v-bind="args" copy>With Copy Button</vs-text-wrap>
                        <vs-text-wrap v-bind="args" link="https://example.com">With Link Button</vs-text-wrap>
                        <vs-text-wrap v-bind="args" copy link="https://example.com">
                            With Both Buttons
                        </vs-text-wrap>
                    </div>
                </div>

                <!-- Width 설정 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Width 설정</h3>
                    <div style="display:flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <vs-text-wrap v-bind="args" width="200px" copy>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        </vs-text-wrap>
                        <vs-text-wrap v-bind="args" width="300px" copy link="https://example.com">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        </vs-text-wrap>
                    </div>
                </div>

                <!-- 커스텀 아이콘 스타일 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">커스텀 아이콘 스타일</h3>
                    <div style="display:flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <vs-text-wrap 
                            v-bind="args" 
                            copy 
                            link="https://example.com"
                            :style-set="{
                                copyIcon: { color: '#ff5722', width: '2rem', height: '2rem' },
                                linkIcon: { color: '#2196f3', width: '2rem', height: '2rem' }
                            }"
                        >
                            Custom Icon Size and Color
                        </vs-text-wrap>
                        <vs-text-wrap 
                            v-bind="args" 
                            copy 
                            :style-set="{
                                copyIcon: { color: '#9c27b0', width: '1rem', height: '1rem' }
                            }"
                        >
                            Small Purple Copy Icon
                        </vs-text-wrap>
                    </div>
                </div>

                <!-- Copy만 있는 경우 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Copy 기능</h3>
                    <div style="display:flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <vs-text-wrap v-bind="args" copy>Simple text to copy</vs-text-wrap>
                        <vs-text-wrap v-bind="args" copy>
                            <div>Text with <b>HTML</b> tags to <i>copy</i></div>
                        </vs-text-wrap>
                    </div>
                </div>

                <!-- Link만 있는 경우 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Link 기능</h3>
                    <div style="display:flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <vs-text-wrap v-bind="args" link="https://google.com">https://google.com</vs-text-wrap>
                        <vs-text-wrap v-bind="args" link="https://github.com">Visit GitHub</vs-text-wrap>
                    </div>
                </div>

                <!-- 모든 기능 조합 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">모든 기능 조합</h3>
                    <div style="display:flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <vs-text-wrap 
                            v-bind="args" 
                            copy 
                            link="https://example.com" 
                            width="250px"
                            :style-set="{
                                copyIcon: { color: '#4caf50' },
                                linkIcon: { color: '#03a9f4' }
                            }"
                        >
                            https://example.com/very/long/url/path/to/resource
                            <template #tooltip="{ content }">
                                <vs-tooltip>{{ content }}</vs-tooltip>
                            </template>
                        </vs-text-wrap>
                    </div>
                </div>

                <!-- Custom Actions Slot -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Custom Actions</h3>
                    <div style="display:flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <vs-text-wrap v-bind="args" copy>
                            With custom action
                            <template #actions>
                                <button style="padding: 0.2rem 0.5rem; margin-right: 0.25rem; border: 1px solid #ccc; border-radius: 0.25rem; background: white; cursor: pointer;">
                                    ⭐
                                </button>
                            </template>
                        </vs-text-wrap>
                    </div>
                </div>
            </div>`,
    }),
};

export default meta;
type Story = StoryObj<typeof VsTextWrap>;

export const Default: Story = {};
