import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VsResponsive from './../VsResponsive.vue';
import VsGrid from '../../vs-grid/VsGrid.vue';

const meta: Meta<typeof VsResponsive> = {
    title: 'Components/Layout Components/VsResponsive',
    component: VsResponsive,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `VsResponsive는 반응형 레이아웃을 쉽게 구성할 수 있는 컴포넌트입니다.
                    width와 grid props를 통해 다양한 화면 크기에서 다른 스타일을 적용할 수 있습니다.
                    Breakpoints 객체를 사용하여 xs, sm, md, lg, xl 크기별로 다른 값을 설정할 수 있습니다.`,
            },
        },
    },
    argTypes: {
        tag: {
            control: 'select',
            options: ['div', 'section', 'main', 'article', 'aside', 'header', 'footer'],
            description: '렌더링할 HTML 태그',
        },
        width: {
            control: 'object',
            description: '반응형 너비 설정 (문자열, 숫자, 또는 Breakpoints 객체)',
        },
        grid: {
            control: 'object',
            description: '반응형 그리드 설정 (문자열, 숫자, 또는 Breakpoints 객체)',
        },
    },
    args: {
        tag: 'div',
        width: '100%',
        grid: 12,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 사용법
export const Default: Story = {
    args: {
        width: '50%',
        grid: 10,
    },
    render: (args: any) => ({
        components: { VsResponsive, VsGrid },
        setup() {
            return { args };
        },
        template: `
            <vs-grid>
                <vs-responsive v-bind="args" style="border: 2px solid #e5e7eb; padding: 20px;">
                    <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px;">
                        <h3 style="margin: 0 0 10px 0; color: #374151;">기본 반응형 컴포넌트</h3>
                        <p style="margin: 0; color: #6b7280;">이 컴포넌트는 width와 grid props를 통해 반응형 동작을 제어합니다.</p>
                        <p style="margin: 0; color: #6b7280;">width: 50% | grid: 10</p>
                    </div>
                </vs-responsive>
            </vs-grid>
        `,
    }),
};

// 반응형 너비 설정
export const ResponsiveWidth: Story = {
    args: {
        width: {
            xs: '100%',
            sm: '90%',
            md: '70%',
            lg: '50%',
            xl: '30%',
        },
    },
    render: (args: any) => ({
        components: { VsResponsive, VsGrid },
        setup() {
            return { args };
        },
        template: `
            <vs-grid>
                <vs-responsive v-bind="args" style="border: 2px solid #3b82f6; padding: 20px; margin: 0 auto;">
                    <div style="background: #dbeafe; padding: 20px; text-align: center; border-radius: 8px;">
                        <h3 style="margin: 0 0 10px 0; color: #1e40af;">반응형 너비</h3>
                        <p style="margin: 0; color: #1e40af;">
                            화면 크기에 따라 너비가 자동으로 조정됩니다:<br>
                            xs: 100% | sm: 90% | md: 80% | lg: 70% | xl: 60%
                        </p>
                    </div>
                </vs-responsive>
            </vs-grid>
        `,
    }),
};

// 반응형 그리드 설정
export const ResponsiveGrid: Story = {
    args: {
        grid: {
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
            xl: 2,
        },
    },
    render: (args: any) => ({
        components: { VsResponsive, VsGrid },
        setup() {
            return { args };
        },
        template: `
            <vs-grid column-gap="16px" row-gap="16px">
                <vs-responsive v-bind="args" style="border: 2px solid #10b981; padding: 20px;">
                    <div style="background: #d1fae5; padding: 20px; text-align: center; border-radius: 8px; border: 1px solid #10b981;">
                        <h4 style="margin: 0 0 8px 0; color: #065f46;">Grid Item 1</h4>
                        <p style="margin: 0; color: #047857; font-size: 14px;">반응형 그리드 아이템</p>
                    </div>
                </vs-responsive>
                <vs-responsive v-bind="args" style="border: 2px solid #10b981; padding: 20px;">
                    <div style="background: #d1fae5; padding: 20px; text-align: center; border-radius: 8px; border: 1px solid #10b981;">
                        <h4 style="margin: 0 0 8px 0; color: #065f46;">Grid Item 2</h4>
                        <p style="margin: 0; color: #047857; font-size: 14px;">화면 크기에 따라 컬럼 수가 변경됩니다</p>
                    </div>
                </vs-responsive>
                <vs-responsive v-bind="args" style="border: 2px solid #10b981; padding: 20px;">
                    <div style="background: #d1fae5; padding: 20px; text-align: center; border-radius: 8px; border: 1px solid #10b981;">
                        <h4 style="margin: 0 0 8px 0; color: #065f46;">Grid Item 3</h4>
                        <p style="margin: 0; color: #047857; font-size: 14px;">xs:12 | sm:6 | md:4 | lg:3 | xl:2</p>
                    </div>
                </vs-responsive>
                <vs-responsive v-bind="args" style="border: 2px solid #10b981; padding: 20px;">
                    <div style="background: #d1fae5; padding: 20px; text-align: center; border-radius: 8px; border: 1px solid #10b981;">
                        <h4 style="margin: 0 0 8px 0; color: #065f46;">Grid Item 4</h4>
                        <p style="margin: 0; color: #047857; font-size: 14px;">CSS Grid를 활용한 레이아웃</p>
                    </div>
                </vs-responsive>
                <vs-responsive v-bind="args" style="border: 2px solid #10b981; padding: 20px;">
                    <div style="background: #d1fae5; padding: 20px; text-align: center; border-radius: 8px; border: 1px solid #10b981;">
                        <h4 style="margin: 0 0 8px 0; color: #065f46;">Grid Item 5</h4>
                        <p style="margin: 0; color: #047857; font-size: 14px;">자동으로 반응형 처리</p>
                    </div>
                </vs-responsive>
                <vs-responsive v-bind="args" style="border: 2px solid #10b981; padding: 20px;">
                    <div style="background: #d1fae5; padding: 20px; text-align: center; border-radius: 8px; border: 1px solid #10b981;">
                        <h4 style="margin: 0 0 8px 0; color: #065f46;">Grid Item 6</h4>
                        <p style="margin: 0; color: #047857; font-size: 14px;">반응 잘 하나요?</p>
                    </div>
                </vs-responsive>
            </vs-grid>
        `,
    }),
};
