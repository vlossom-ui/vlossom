import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme } from '@/storybook';
import VsInput from './../VsInput.vue';

const meta: Meta<typeof VsInput> = {
    title: 'Chromatic/Input Components/VsInput',
    component: VsInput,
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            const textValue = ref('');
            const emailValue = ref('');
            const passwordValue = ref('');
            const numberValue = ref<number | null>(null);
            const disabledValue = ref('Disabled value');
            const readonlyValue = ref('Readonly value');
            const valueWithClear = ref('Clear 가능');
            const valueNoClear = ref('Clear 불가');

            return {
                args,
                textValue,
                emailValue,
                passwordValue,
                numberValue,
                disabledValue,
                readonlyValue,
                valueWithClear,
                valueNoClear,
            };
        },
        template: `
            <div style="display:flex; flex-direction: column; gap: 2rem; padding: 1rem;">
                <!-- 기본 타입들 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Input Types</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" v-model="textValue" type="text" label="Text" placeholder="텍스트 입력" />
                        <vs-input v-bind="args" v-model="emailValue" type="email" label="Email" placeholder="email@example.com" />
                        <vs-input v-bind="args" v-model="passwordValue" type="password" label="Password" placeholder="비밀번호" />
                        <vs-input v-bind="args" v-model="numberValue" type="number" label="Number" placeholder="숫자 입력" />
                    </div>
                </div>

                <!-- 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">States</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" label="Normal" placeholder="일반 상태" />
                        <vs-input v-bind="args" v-model="disabledValue" label="Disabled" disabled />
                        <vs-input v-bind="args" v-model="readonlyValue" label="Readonly" readonly />
                        <vs-input v-bind="args" label="Required" placeholder="필수 입력" required />
                    </div>
                </div>

                <!-- 크기 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Sizes</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" label="Small" placeholder="작은 크기" small />
                        <vs-input v-bind="args" label="Default" placeholder="기본 크기" />
                    </div>
                </div>

                <!-- Clear 버튼 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Clear Button</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" v-model="valueWithClear" label="With Clear" />
                        <vs-input v-bind="args" v-model="valueNoClear" label="No Clear" no-clear />
                    </div>
                </div>

                <!-- 슬롯 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Slots</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" label="Prepend" placeholder="검색어 입력">
                            <template #prepend>
                                🔍
                            </template>
                        </vs-input>
                        <vs-input v-bind="args" label="Append" placeholder="0" type="number">
                            <template #append>
                                <span style="padding: 0 0.5rem;">원</span>
                            </template>
                        </vs-input>
                        <vs-input v-bind="args" label="Both" placeholder="입력">
                            <template #prepend>
                                ⭐
                            </template>
                            <template #append>
                                <span style="padding: 0 0.5rem;">%</span>
                            </template>
                        </vs-input>
                    </div>
                </div>

                <!-- 라벨 없음 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">No Label</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" placeholder="라벨 없음" no-label />
                        <vs-input v-bind="args" placeholder="작은 크기, 라벨 없음" no-label small />
                    </div>
                </div>

                <!-- 조합 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">Combinations</h3>
                    <div style="display:flex; flex-direction: column; gap: 1rem;">
                        <vs-input v-bind="args" label="Small + Required" placeholder="작은 크기 + 필수" small required />
                        <vs-input v-bind="args" label="Small + Disabled" placeholder="작은 크기 + 비활성화" small disabled />
                        <vs-input v-bind="args" label="Required + Prepend" placeholder="필수 + 앞 슬롯" required>
                            <template #prepend>
                                📧
                            </template>
                        </vs-input>
                    </div>
                </div>
            </div>`,
    }),
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsInput>;

export const Default: Story = {};
