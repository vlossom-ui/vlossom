import { colorScheme } from '@/storybook';
import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VsSwitch from './../VsSwitch.vue';

const meta: Meta<typeof VsSwitch> = {
    title: 'Chromatic/Input Components/VsSwitch',
    component: VsSwitch,
    render: (args: any) => ({
        components: { VsSwitch },
        setup() {
            const messages = [{ state: 'success', text: 'This is success message' }];
            const modelValue = ref(true);
            return { args, messages, modelValue };
        },
        template: `
            <div>
                <vs-switch v-bind="args" label="Switch" :style="{ marginBottom: '12px' }"/>

                <vs-switch v-bind="args" v-model="modelValue" label="Switch" :style="{ marginBottom: '12px' }"/>

                <vs-switch v-bind="args" label="Required Switch" required :style="{ marginBottom: '12px' }"/>

                <vs-switch v-bind="args" label="Readonly Switch" readonly :style="{ marginBottom: '12px' }"/>

                <vs-switch v-bind="args" label="Disabled Switch" disabled :style="{ marginBottom: '12px' }"/>

                <vs-switch v-bind="args" label="Switch with Messages" :messages="messages" :style="{ marginBottom: '12px' }"/>

                <vs-switch v-bind="args" label="Switch with Custom Labels" true-label="Approved" false-label="Rejected"/>
            </div>
		`,
    }),
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsSwitch>;

export const Default: Story = {};
