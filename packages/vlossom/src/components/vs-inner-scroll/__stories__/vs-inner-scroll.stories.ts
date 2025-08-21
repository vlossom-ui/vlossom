import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { useVlossom } from '@/framework';
import VsInnerScroll from './../VsInnerScroll.vue';
import type { VsInnerScrollStyleSet } from '../types';

const meta: Meta<typeof VsInnerScroll> = {
    title: 'Components/Layout Components/VsInnerScroll',
    component: VsInnerScroll,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'VsInnerScroll는 내부 스크롤이 가능한 컨테이너 컴포넌트입니다. 헤더와 푸터 영역은 고정하고, 본문 영역만 스크롤되도록 하는 레이아웃을 제공합니다.',
            },
        },
    },
    argTypes: {
        hideScroll: {
            control: 'boolean',
            description: '스크롤바 표시/숨김 여부',
        },
        styleSet: {
            control: 'object',
            description: '커스텀 스타일 설정',
        },
    },
    args: {
        hideScroll: false,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스크롤 컨테이너
export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본적인 내부 스크롤 컨테이너입니다. 컨텐츠가 컨테이너보다 클 경우 스크롤이 나타납니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInnerScroll },
        setup() {
            return { args };
        },
        template: `
            <div style="height: 500px; border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                <vs-inner-scroll v-bind="args">
                    <div style="padding: 20px; background: linear-gradient(45deg, #f9fafb 25%, transparent 25%),
                                           linear-gradient(-45deg, #f9fafb 25%, transparent 25%),
                                           linear-gradient(45deg, transparent 75%, #f9fafb 75%),
                                           linear-gradient(-45deg, transparent 75%, #f9fafb 75%);
                                           background-size: 20px 20px;
                                           background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                                           height: 1000px;">
                        <div style="padding: 20px; margin-bottom: 20px; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                            <h3 style="margin: 0 0 16px 0; color: #374151;">Scrollable Container (500px height)</h3>
                            <p style="color: #6b7280; margin: 0;">이 영역은 컨테이너보다 높아서 스크롤이 나타납니다.</p>
                            <p style="color: #9ca3af; margin: 16px 0 0 0; font-size: 0.9rem;">이 컨텐츠는 1000px 높이로 설정되어 500px 컨테이너에서 스크롤됩니다.</p>
                        </div>
                    </div>
                </vs-inner-scroll>
            </div>
        `,
    }),
};

// 헤더와 푸터가 있는 스크롤
export const WithHeaderAndFooter: Story = {
    parameters: {
        docs: {
            description: {
                story: '헤더와 푸터 영역이 고정되고, 본문 영역만 스크롤되는 레이아웃입니다. 채팅 창이나 메일 뷰어 등에 활용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInnerScroll },
        setup() {
            return { args };
        },
        template: `
            <div style="height: 500px; border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                <vs-inner-scroll v-bind="args">
                    <template #header>
                        <div style="padding: 16px; background: #3b82f6; color: white; border-radius: 6px; margin-bottom: 4px;">
                            <h3 style="margin: 0 0 16px 0; color: white;">Fixed Header & Footer with Scrollable Body</h3>
                            <p style="margin: 4px 0 0 0; font-size: 0.9rem; opacity: 0.9;">이 영역은 스크롤되지 않습니다</p>
                        </div>
                    </template>

                    <div style="padding: 20px; background: linear-gradient(45deg, #f9fafb 25%, transparent 25%),
                                           linear-gradient(-45deg, #f9fafb 25%, transparent 25%),
                                           linear-gradient(45deg, transparent 75%, #f9fafb 75%),
                                           linear-gradient(-45deg, transparent 75%, #f9fafb 75%);
                                           background-size: 15px 15px;
                                           height: 1000px;">
                        <div style="padding: 16px; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
                            <h4 style="color: #1f2937; margin: 0 0 12px 0;">채팅 본문 영역</h4>
                            <p style="color: #6b7280; margin: 0;">헤더와 푸터는 고정되고, 이 본문 영역만 스크롤됩니다.</p>
                            <p style="color: #9ca3af; margin: 12px 0 0 0; font-size: 0.9rem;">높이 1000px로 설정되어 스크롤 동작을 확인할 수 있습니다.</p>
                        </div>
                    </div>

                    <template #footer>
                        <div style="padding: 12px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; margin-top: 4px;">
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <input type="text" placeholder="메시지를 입력하세요..." style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; outline: none;">
                                <button style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">전송</button>
                            </div>
                        </div>
                    </template>
                </vs-inner-scroll>
            </div>
        `,
    }),
};

// 스크롤바 숨김
export const HiddenScrollbar: Story = {
    parameters: {
        docs: {
            description: {
                story: 'hideScroll prop을 사용하여 스크롤바를 숨긴 상태입니다. 스크롤 기능은 유지되지만 스크롤바가 보이지 않습니다.',
            },
        },
    },
    args: {
        hideScroll: true,
    },
    render: (args: any) => ({
        components: { VsInnerScroll },
        setup() {
            return { args };
        },
        template: `
            <div style="height: 500px; border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                <vs-inner-scroll v-bind="args">
                    <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; height: 1000px; border-radius: 8px;">
                        <h3 style="margin: 0 0 16px 0; color: white;">Hidden Scrollbar (Mouse wheel or touch scroll works)</h3>
                        <p style="margin-bottom: 20px; opacity: 0.9;">마우스 휠이나 터치로 스크롤할 수 있습니다.</p>
                        <div style="padding: 16px; margin-bottom: 16px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; backdrop-filter: blur(10px);">
                            <h5 style="color: white; margin: 0 0 8px 0;">스크롤바 숨김 기능</h5>
                            <p style="color: rgba(255, 255, 255, 0.8); margin: 0; line-height: 1.5;">
                                이 컨테이너는 스크롤바가 숨겨져 있습니다. 스크롤 기능은 정상적으로 작동하지만 스크롤바는 보이지 않습니다.
                                깔끔한 UI를 원할 때 유용합니다. 마우스 휠이나 터치로 스크롤해보세요!
                            </p>
                        </div>
                    </div>
                </vs-inner-scroll>
            </div>
        `,
    }),
};

// 커스텀 스타일
export const CustomStyle: Story = {
    parameters: {
        docs: {
            description: {
                story: 'styleSet을 사용하여 각 영역의 패딩을 커스터마이징한 예제입니다.',
            },
        },
    },
    args: {
        styleSet: {
            header: {
                padding: '24px',
            },
            padding: '24px',
            footer: {
                padding: '16px',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInnerScroll },
        setup() {
            return { args };
        },
        template: `
            <div style="height: 500px; border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                <vs-inner-scroll v-bind="args">
                    <template #header>
                        <div style="background: #fef3c7; border-radius: 8px; border: 1px solid #f59e0b;">
                            <h3 style="margin: 0 0 16px 0; color: #92400e;">Custom Padding Styles</h3>
                            <p style="color: #b45309; margin: 8px 0 0 0; font-size: 0.9rem;">header padding: 24px</p>
                        </div>
                    </template>

                    <div style="background: #ecfdf5; border-radius: 8px; height: 1000px; border: 1px solid #10b981;">
                        <h4 style="color: #047857; margin: 0 0 16px 0;">커스텀 패딩이 적용된 본문</h4>
                        <p style="color: #065f46; margin-bottom: 16px;">body padding: 24px</p>
                        <div style="padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #10b981;">
                            <h5 style="color: #047857; margin: 0 0 8px 0;">패딩 커스터마이징</h5>
                            <p style="color: #065f46; margin: 0; line-height: 1.5;">
                                styleSet을 통해 각 영역(header, body, footer)의 패딩을 개별적으로 설정할 수 있습니다.
                                이 본문 영역은 24px 패딩이 적용되어 더 넉넉한 여백을 가지고 있습니다.
                            </p>
                        </div>
                    </div>

                    <template #footer>
                        <div style="background: #ede9fe; border-radius: 8px; border: 1px solid #8b5cf6;">
                            <h4 style="color: #6d28d9; margin: 0;">커스텀 패딩이 적용된 푸터</h4>
                            <p style="color: #7c3aed; margin: 8px 0 0 0; font-size: 0.9rem;">footer padding: 16px</p>
                        </div>
                    </template>
                </vs-inner-scroll>
            </div>
        `,
    }),
};

// 미리 정의된 스타일 세트
export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 예제입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInnerScroll },
        setup() {
            const preDefinedStyleSet: VsInnerScrollStyleSet = {
                header: {
                    padding: '20px',
                },
                padding: '28px',
                footer: {
                    padding: '20px',
                },
            };

            useVlossom().styleSet = {
                myScrollStyleSet: { VsInnerScroll: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: `
            <div style="height: 500px; border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                <vs-inner-scroll v-bind="args">
                    <template #header>
                        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 8px; text-align: center;">
                            <h3 style="margin: 0 0 16px 0; color: white;">Pre-defined Style Set</h3>
                        </div>
                    </template>

                    <div style="background: linear-gradient(45deg, #f0f9ff, #e0f2fe); height: 1000px; border-radius: 8px;">
                        <h4 style="color: #0369a1; margin: 0 0 16px 0;">미리 정의된 스타일 세트</h4>
                        <p style="color: #0369a1; margin-bottom: 20px;">
                            이 스크롤 컨테이너는 useVlossom().styleSet에 등록된 스타일을 사용합니다.
                        </p>
                        <div style="padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            <h5 style="color: #1e40af; margin: 0 0 8px 0;">스타일 세트 활용</h5>
                            <p style="color: #3b82f6; margin: 0; line-height: 1.5;">
                                전역 스타일 설정으로 일관된 디자인을 유지할 수 있습니다.
                                header padding: 20px, body padding: 28px, footer padding: 20px가 적용되었습니다.
                            </p>
                        </div>
                    </div>

                    <template #footer>
                        <div style="background: linear-gradient(135deg, #764ba2, #667eea); color: white; border-radius: 8px; text-align: center;">
                            <p style="color: white; margin: 0;">StyleSet: myScrollStyleSet</p>
                        </div>
                    </template>
                </vs-inner-scroll>
            </div>
        `,
    }),
    args: {
        styleSet: 'myScrollStyleSet',
    },
};
