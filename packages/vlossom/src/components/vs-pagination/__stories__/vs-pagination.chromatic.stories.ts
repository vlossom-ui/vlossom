import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsPagination from './../VsPagination.vue';

const meta: Meta<typeof VsPagination> = {
    title: 'Chromatic/Base Components/VsPagination',
    component: VsPagination,
    render: (args: any) => ({
        components: { VsPagination },
        setup() {
            return { args };
        },
        template: `
            <div style="display:flex; flex-direction: column; gap: 2rem; align-items: flex-start; width: 100%;">
                <!-- 기본 스타일 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 스타일</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-pagination v-bind="args" :length="10" />
                        <vs-pagination v-bind="args" :length="10" ghost />
                        <vs-pagination v-bind="args" :length="10" outline />
                    </div>
                </div>

                <!-- Edge Buttons -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Edge Buttons</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-pagination v-bind="args" :length="10" />
                        <vs-pagination v-bind="args" :length="10" edge-buttons />
                    </div>
                </div>

                <!-- 페이지 위치별 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">페이지 위치별 (length: 20, showingLength: 5)</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">첫 페이지 (page 0)</p>
                            <vs-pagination v-bind="args" :length="20" :showing-length="5" :model-value="0" edge-buttons />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">중간 페이지 (page 10)</p>
                            <vs-pagination v-bind="args" :length="20" :showing-length="5" :model-value="10" edge-buttons />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">마지막 페이지 (page 19)</p>
                            <vs-pagination v-bind="args" :length="20" :showing-length="5" :model-value="19" edge-buttons />
                        </div>
                    </div>
                </div>

                <!-- ShowingLength 변형 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">ShowingLength 변형 (length: 100)</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">showingLength: 3</p>
                            <vs-pagination v-bind="args" :length="100" :showing-length="3" :model-value="50" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">showingLength: 5</p>
                            <vs-pagination v-bind="args" :length="100" :showing-length="5" :model-value="50" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">showingLength: 10</p>
                            <vs-pagination v-bind="args" :length="100" :showing-length="10" :model-value="50" />
                        </div>
                    </div>
                </div>

                <!-- 적은 페이지 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">적은 페이지</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">length: 1</p>
                            <vs-pagination v-bind="args" :length="1" edge-buttons />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">length: 3</p>
                            <vs-pagination v-bind="args" :length="3" edge-buttons />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">length: 5</p>
                            <vs-pagination v-bind="args" :length="5" edge-buttons />
                        </div>
                    </div>
                </div>

                <!-- 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">상태</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">Normal</p>
                            <vs-pagination v-bind="args" :length="10" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">Disabled</p>
                            <vs-pagination v-bind="args" :length="10" disabled />
                        </div>
                    </div>
                </div>

                <!-- Ghost + Edge Buttons 조합 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Ghost + Edge Buttons 조합</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-pagination v-bind="args" :length="10" ghost edge-buttons />
                        <vs-pagination v-bind="args" :length="10" ghost edge-buttons :model-value="0" />
                        <vs-pagination v-bind="args" :length="10" ghost edge-buttons :model-value="9" />
                    </div>
                </div>

                <!-- Outline + Edge Buttons 조합 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Outline + Edge Buttons 조합</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-pagination v-bind="args" :length="10" outline edge-buttons />
                        <vs-pagination v-bind="args" :length="10" outline edge-buttons :model-value="0" />
                        <vs-pagination v-bind="args" :length="10" outline edge-buttons :model-value="9" />
                    </div>
                </div>
            </div>`,
    }),
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsPagination>;

export const Default: Story = {};
