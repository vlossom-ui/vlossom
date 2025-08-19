import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsButton from './../VsButton.vue';

const meta: Meta<typeof VsButton> = {
    title: 'Chromatic/Base Components/VsButton',
    component: VsButton,
    render: (args: any) => ({
        components: { VsButton },
        setup() {
            return { args };
        },
        template: `
            <div style="display:flex; flex-direction: column; gap: 2rem; align-items: flex-start;">
                <!-- 기본 스타일 버튼들 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 스타일</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-button v-bind="args">Default</vs-button>
                        <vs-button v-bind="args" primary>Primary</vs-button>
                        <vs-button v-bind="args" outline>Outline</vs-button>
                        <vs-button v-bind="args" ghost>Ghost</vs-button>
                    </div>
                </div>

                <!-- 사이즈 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">크기 변형</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-button v-bind="args" small>Small</vs-button>
                        <vs-button v-bind="args">Default</vs-button>
                        <vs-button v-bind="args" large>Large</vs-button>
                    </div>
                </div>

                <!-- 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">상태</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-button v-bind="args">Normal</vs-button>
                        <vs-button v-bind="args" disabled>Disabled</vs-button>
                        <vs-button v-bind="args" loading>Loading</vs-button>
                    </div>
                </div>

                <!-- 원형 버튼 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">원형 버튼</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-button v-bind="args" circle>X</vs-button>
                        <vs-button v-bind="args" circle primary>+</vs-button>
                        <vs-button v-bind="args" circle outline>-</vs-button>
                        <vs-button v-bind="args" circle ghost>?</vs-button>
                    </div>
                </div>

                <!-- Primary 조합 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Primary 조합</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-button v-bind="args" primary small>Primary Small</vs-button>
                        <vs-button v-bind="args" primary>Primary Default</vs-button>
                        <vs-button v-bind="args" primary large>Primary Large</vs-button>
                        <vs-button v-bind="args" primary disabled>Primary Disabled</vs-button>
                    </div>
                </div>

                <!-- Outline 조합 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Outline 조합</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-button v-bind="args" outline small>Outline Small</vs-button>
                        <vs-button v-bind="args" outline>Outline Default</vs-button>
                        <vs-button v-bind="args" outline large>Outline Large</vs-button>
                        <vs-button v-bind="args" outline disabled>Outline Disabled</vs-button>
                    </div>
                </div>
            </div>`,
    }),
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsButton>;

export const Default: Story = {};
