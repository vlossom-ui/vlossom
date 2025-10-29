import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import VsInput from './../VsInput.vue';

const meta: Meta<typeof VsInput> = {
    title: 'Chromatic/Input Components/VsInput',
    component: VsInput,
    render: (args: any) => ({
        components: { VsInput },
        setup() {
            return { args };
        },
        template: `
            <div>
                <vs-input v-bind="args" type="text" label="Text Input" placeholder="텍스트 입력" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" type="email" label="Email Input" placeholder="email@example.com" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" type="password" label="Password Input" placeholder="비밀번호" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" type="number" label="Number Input" placeholder="숫자 입력" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="Disabled Input" disabled model-value="Disabled value" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="Readonly Input" readonly model-value="Readonly value" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="Required Input" placeholder="필수 입력" required :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="Small Input" placeholder="작은 크기" small :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="No Clear" placeholder="Clear 불가" no-clear model-value="Clear 불가" :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" label="Prepend Slot" placeholder="검색어 입력" :style="{ marginBottom: '12px' }">
                    <template #prepend>🔍</template>
                </vs-input>

                <vs-input v-bind="args" label="Append Slot" placeholder="0" type="number" :style="{ marginBottom: '12px' }">
                    <template #append><span style="padding: 0 0.5rem;">원</span></template>
                </vs-input>

                <vs-input v-bind="args" label="Both Slots" placeholder="입력" :style="{ marginBottom: '12px' }">
                    <template #prepend>⭐</template>
                    <template #append><span style="padding: 0 0.5rem;">%</span></template>
                </vs-input>

                <vs-input v-bind="args" placeholder="No Label" no-label :style="{ marginBottom: '12px' }" />

                <vs-input v-bind="args" placeholder="Small + No Label" no-label small />
            </div>
        `,
    }),
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsInput>;

export const Default: Story = {};
