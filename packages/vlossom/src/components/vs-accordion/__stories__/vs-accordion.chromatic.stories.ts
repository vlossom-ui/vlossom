import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VsAccordion from './../VsAccordion.vue';

const meta: Meta<typeof VsAccordion> = {
    title: 'Chromatic/Base Components/VsAccordion',
    component: VsAccordion,
    render: (args: any) => ({
        components: { VsAccordion },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- 기본 상태들 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-accordion v-bind="args">
                            <template #title>기본 아코디언 (닫힘)</template>
                            <p>기본 아코디언의 내용입니다.</p>
                        </vs-accordion>

                        <vs-accordion v-bind="args" :open="true">
                            <template #title>기본 아코디언 (열림)</template>
                            <p>열린 상태의 기본 아코디언입니다.</p>
                        </vs-accordion>
                    </div>
                </div>

                <!-- Primary 스타일 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Primary 스타일</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-accordion v-bind="args" primary>
                            <template #title>Primary 아코디언 (닫힘)</template>
                            <p>Primary 스타일이 적용된 아코디언입니다.</p>
                        </vs-accordion>

                        <vs-accordion v-bind="args" primary :open="true">
                            <template #title>Primary 아코디언 (열림)</template>
                            <p>열린 상태의 Primary 아코디언입니다.</p>
                        </vs-accordion>
                    </div>
                </div>

                <!-- Disabled 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Disabled 상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-accordion v-bind="args" disabled>
                            <template #title>비활성화된 아코디언</template>
                            <p>클릭해도 열리지 않는 아코디언입니다.</p>
                        </vs-accordion>

                        <vs-accordion v-bind="args" disabled primary>
                            <template #title>비활성화된 Primary 아코디언</template>
                            <p>Primary + Disabled 조합입니다.</p>
                        </vs-accordion>
                    </div>
                </div>
            </div>
        `,
    }),
};

export default meta;
type Story = StoryObj<typeof VsAccordion>;

export const AllVariations: Story = {};
