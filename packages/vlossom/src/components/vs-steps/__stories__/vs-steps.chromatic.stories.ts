import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsSteps from './../VsSteps.vue';

const meta: Meta<typeof VsSteps> = {
    title: 'Chromatic/Base Components/VsSteps',
    component: VsSteps,
    render: (args: any) => ({
        components: { VsSteps },
        setup() {
            return { args };
        },
        template: `
            <div style="display:flex; flex-direction: column; gap: 2rem;">
                <!-- 기본 스타일 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 스타일</h3>
                    <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" :model-value="1" />
                </div>

                <!-- No Label -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">No Label</h3>
                    <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" :model-value="1" no-label />
                </div>

                <!-- 비활성화 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">비활성화(전체)</h3>
                    <vs-steps 
                        v-bind="args" 
                        :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" 
                        :model-value="1"
                        :disabled="true" 
                    />
                </div>

                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">비활성화(특정 인덱스)</h3>
                    <vs-steps 
                        v-bind="args" 
                        :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5']" 
                        :model-value="2"
                        :disabled="(step, index) => [1, 3].includes(index)" 
                    />
                </div>

                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">비활성화(조건부)</h3>
                    <vs-steps 
                        v-bind="args" 
                        :steps="['Step 0', 'Step 1', 'Step 2', 'Step 3', 'Step 4']" 
                        :model-value="1"
                        :disabled="(step, index) => index % 2 === 0" 
                    />
                </div>
                
                <!-- 수직 레이아웃 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">수직 레이아웃</h3>
                    <div style="display:flex; gap: 2rem; flex-wrap: wrap;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">기본 (첫 번째 선택)</p>
                            <vs-steps v-bind="args" :steps="['Account', 'Profile', 'Settings', 'Complete']" :model-value="0" vertical height="300px" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">기본 (두 번째 선택)</p>
                            <vs-steps v-bind="args" :steps="['Account', 'Profile', 'Settings', 'Complete']" :model-value="1" vertical height="300px" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">No Label</p>
                            <vs-steps v-bind="args" :steps="['Account', 'Profile', 'Settings', 'Complete']" :model-value="1" vertical no-label height="300px" />
                        </div>
                    </div>
                </div>

                <!-- Gap 변형 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Gap 변형</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">gap: 4rem</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" :model-value="1" gap="4rem" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">gap: 8rem</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" :model-value="1" gap="8rem" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">gap: 12rem</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" :model-value="1" gap="12rem" />
                        </div>
                    </div>
                </div>

                <!-- Width 제한 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Width 제한</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">width: 300px</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" :model-value="1" width="300px" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">width: 500px</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" :model-value="1" width="500px" />
                        </div>
                    </div>
                </div>

                <!-- Height 제한 (Vertical 모드) -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Height 제한 (Vertical 모드)</h3>
                    <div style="display:flex; gap: 2rem; flex-wrap: wrap;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">height: 200px</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" :model-value="1" vertical height="200px" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">height: 400px</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" :model-value="1" vertical height="400px" />
                        </div>
                    </div>
                </div>

                <!-- 진행 상태별 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">진행 상태별</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">첫 번째 스텝</p>
                            <vs-steps v-bind="args" :steps="['Account', 'Profile', 'Settings', 'Complete']" :model-value="0" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">두 번째 스텝</p>
                            <vs-steps v-bind="args" :steps="['Account', 'Profile', 'Settings', 'Complete']" :model-value="1" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">세 번째 스텝</p>
                            <vs-steps v-bind="args" :steps="['Account', 'Profile', 'Settings', 'Complete']" :model-value="2" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">마지막 스텝</p>
                            <vs-steps v-bind="args" :steps="['Account', 'Profile', 'Settings', 'Complete']" :model-value="3" />
                        </div>
                    </div>
                </div>

                <!-- 다양한 스텝 개수 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">다양한 스텝 개수</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">3개</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3']" :model-value="1" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">4개</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" :model-value="1" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">5개</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5']" :model-value="2" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">6개</p>
                            <vs-steps v-bind="args" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6']" :model-value="2" />
                        </div>
                    </div>
                </div>

                <!-- 조합 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">조합</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">No Label + Disabled</p>
                            <vs-steps 
                                v-bind="args" 
                                :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5']" 
                                :model-value="2"
                                no-label 
                                :disabled="(step, index) => index === 3" 
                            />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">Gap + No Label</p>
                            <vs-steps 
                                v-bind="args" 
                                :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" 
                                :model-value="1"
                                gap="12rem" 
                                no-label 
                            />
                        </div>
                        <div style="display:flex; gap: 2rem;">
                            <div>
                                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">Vertical + Gap</p>
                                <vs-steps 
                                    v-bind="args" 
                                    :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" 
                                    :model-value="1"
                                    vertical 
                                    gap="4rem"
                                />
                            </div>
                            <div>
                                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">Vertical + Disabled + No Label</p>
                                <vs-steps 
                                    v-bind="args" 
                                    :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" 
                                    :model-value="1"
                                    vertical 
                                    no-label
                                    :disabled="(step, index) => index === 2" 
                                    height="300px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>`,
    }),
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsSteps>;

export const Default: Story = {};
