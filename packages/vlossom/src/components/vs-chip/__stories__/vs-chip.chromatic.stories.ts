import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsChip from './../VsChip.vue';

const meta: Meta<typeof VsChip> = {
    title: 'Chromatic/Base Components/VsChip',
    component: VsChip,
    render: (args: any) => ({
        components: { VsChip },
        setup() {
            return { args };
        },
        template: `
            <div style="display:flex; flex-direction: column; gap: 2rem; align-items: flex-start;">
                <!-- 기본 스타일 칩들 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 스타일</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-chip v-bind="args">Default</vs-chip>
                        <vs-chip v-bind="args" primary>Primary</vs-chip>
                        <vs-chip v-bind="args" closable>Closable</vs-chip>
                    </div>
                </div>

                <!-- 사이즈 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">크기 변형</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-chip v-bind="args" size="xs">XS</vs-chip>
                        <vs-chip v-bind="args">Default (SM)</vs-chip>
                        <vs-chip v-bind="args" size="md">MD</vs-chip>
                        <vs-chip v-bind="args" size="lg">LG</vs-chip>
                        <vs-chip v-bind="args" size="xl">XL</vs-chip>
                    </div>
                </div>

                <!-- 아이콘이 있는 칩들 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">아이콘이 있는 칩</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-chip v-bind="args">
                            <template #icon>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 6L9 17l-5-5"/>
                                </svg>
                            </template>
                            Success
                        </vs-chip>
                        <vs-chip v-bind="args" primary>
                            <template #icon>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                                </svg>
                            </template>
                            Happy
                        </vs-chip>
                        <vs-chip v-bind="args" closable>
                            <template #icon>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </template>
                            Star
                        </vs-chip>
                    </div>
                </div>

                <!-- 닫기 버튼이 있는 칩들 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">닫기 버튼이 있는 칩</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-chip v-bind="args" closable>Closable</vs-chip>
                        <vs-chip v-bind="args" closable primary>Primary Closable</vs-chip>
                        <vs-chip v-bind="args" closable size="xs">XS Closable</vs-chip>
                    </div>
                </div>

                <!-- Primary 조합 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Primary 조합</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-chip v-bind="args" primary size="xs">Primary XS</vs-chip>
                        <vs-chip v-bind="args" primary>Primary Default</vs-chip>
                        <vs-chip v-bind="args" primary closable>Primary Closable</vs-chip>
                    </div>
                </div>

                <!-- XS 조합 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">XS 조합</h3>
                    <div style="display:flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <vs-chip v-bind="args" size="xs">XS Default</vs-chip>
                        <vs-chip v-bind="args" size="xs" primary>XS Primary</vs-chip>
                        <vs-chip v-bind="args" size="xs" closable>XS Closable</vs-chip>
                    </div>
                </div>
            </div>`,
    }),
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsChip>;

export const Default: Story = {};
