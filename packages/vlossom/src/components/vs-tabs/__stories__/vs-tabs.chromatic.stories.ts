import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsTabs from './../VsTabs.vue';

const meta: Meta<typeof VsTabs> = {
    title: 'Chromatic/Base Components/VsTabs',
    component: VsTabs,
    render: (args: any) => ({
        components: { VsTabs },
        setup() {
            return { args };
        },
        template: `
            <div style="display:flex; flex-direction: column; gap: 2rem;">
                <!-- 기본 스타일 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 스타일</h3>
                    <vs-tabs v-bind="args" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" />
                </div>

                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Primary</h3>
                    <vs-tabs v-bind="args" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" primary />
                </div>

                <!-- 크기 변형 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">크기 변형</h3>
                    <vs-tabs v-bind="args" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" dense />
                </div>

                <!-- 비활성화 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">비활성화 탭 (특정 인덱스)</h3>
                    <vs-tabs 
                        v-bind="args" 
                        :tabs="['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5']" 
                        :disabled="(index) => [1, 3].includes(index)" 
                    />
                </div>
                
                <!-- 비활성화 조건 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">비활성화 탭 (조건부)</h3>
                    <vs-tabs 
                        v-bind="args" 
                        :tabs="['Tab 0', 'Tab 1', 'Tab 2', 'Tab 3', 'Tab 4']" 
                        :disabled="(index) => index % 2 === 0" 
                    />
                </div>

                <!-- 수직 레이아웃 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">수직 레이아웃</h3>
                    <div style="width: 200px;">
                        <vs-tabs v-bind="args" :tabs="['Dashboard', 'Profile', 'Settings', 'Messages']" vertical />
                    </div>
                </div>

                <!-- 스크롤 버튼 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">스크롤 버튼</h3>
                    <vs-tabs 
                        v-bind="args" 
                        :tabs="['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6', 'Tab 7', 'Tab 8']" 
                        scroll-buttons="show" 
                    />
                </div>

                <!-- 선택된 탭 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">선택된 탭</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">첫 번째 선택</p>
                            <vs-tabs v-bind="args" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" :model-value="0" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">두 번째 선택</p>
                            <vs-tabs v-bind="args" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" :model-value="1" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">세 번째 선택</p>
                            <vs-tabs v-bind="args" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" :model-value="2" />
                        </div>
                    </div>
                </div>

                <!-- 다양한 탭 개수 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">다양한 탭 개수</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">2개</p>
                            <vs-tabs v-bind="args" :tabs="['Tab 1', 'Tab 2']" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">3개</p>
                            <vs-tabs v-bind="args" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">5개</p>
                            <vs-tabs v-bind="args" :tabs="['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5']" />
                        </div>
                    </div>
                </div>

                 <!-- 조합 -->
                 <div>
                     <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">조합</h3>
                     <div style="display:flex; flex-direction: column; gap: 1rem;">
                         <div>
                             <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">Dense + Disabled</p>
                             <vs-tabs 
                                 v-bind="args" 
                                 :tabs="['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4']" 
                                 dense 
                                 :disabled="(index) => index === 2" 
                             />
                         </div>
                         <div>
                             <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">Primary + Dense</p>
                             <vs-tabs 
                                 v-bind="args" 
                                 :tabs="['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4']" 
                                 primary
                                 dense 
                             />
                         </div>
                         <div>
                             <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">Vertical + Primary</p>
                             <div style="width: 200px;">
                                 <vs-tabs 
                                     v-bind="args" 
                                     :tabs="['Dashboard', 'Profile', 'Settings', 'Messages']" 
                                     vertical 
                                     primary
                                 />
                             </div>
                         </div>
                         <div>
                             <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">Vertical + Scroll Buttons + Dense</p>
                             <div style="width: 200px; height: 200px;">
                                <vs-tabs 
                                    v-bind="args" 
                                    :tabs="[
                                        'Dashboard', 'Profile', 'Settings', 
                                        'Messages', 'Notifications', 'Calendar'
                                    ]" 
                                    vertical 
                                    scroll-buttons="show"
                                    dense
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
type Story = StoryObj<typeof VsTabs>;

export const Default: Story = {};
