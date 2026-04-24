import { computed, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, colorScheme, getColorSchemeTemplate } from '@/storybook';
import { useVlossom } from '@/framework';
import VsSwitch from './../VsSwitch.vue';
import VsContainer from '@/components/vs-container/VsContainer.vue';
import type { VsSwitchStyleSet } from './../types';

const meta: Meta<typeof VsSwitch> = {
    title: 'Components/Input Components/VsSwitch',
    component: VsSwitch,
    parameters: {
        docs: {
            description: {
                component: 'VsSwitch는 ON/OFF 상태를 토글할 수 있는 스위치 컴포넌트입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSwitch },
        setup() {
            const preDefinedStyleSet: VsSwitchStyleSet = {
                variables: {
                    handleColor: '#fff',
                    handleSize: '18px',
                },
            } as const;

            useVlossom().styleSet = {
                mySwitchStyleSet: { VsSwitch: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-switch v-bind="args" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsSwitch>;

export const Default: Story = {};

export const ColorScheme: Story = {
    render: (args: any) => ({
        components: { VsSwitch },
        setup() {
            return { args };
        },
        template: `
            <div>
                ${getColorSchemeTemplate(`
                    <vs-switch v-bind="args" color-scheme="{{ color }}" :style="{ marginBottom: '5px' }"  />
                `)}
            </div>
        `,
    }),
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const State: Story = {
    render: (args: any) => ({
        components: { VsSwitch },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-switch v-bind="args" label="State (idle)" state="idle" />
                <vs-switch v-bind="args" label="State (success)" state="success" />
                <vs-switch v-bind="args" label="State (info)" state="info" />
                <vs-switch v-bind="args" label="State (warning)" state="warning" />
                <vs-switch v-bind="args" label="State (error)" state="error" />
            </div>
        `,
    }),
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const Label: Story = {
    args: {
        label: 'Custom Label',
    },
};

export const TrueLabelAndFalseLabel: Story = {
    args: {
        trueLabel: 'Approved',
        falseLabel: 'Rejected',
    },
};

export const Messages: Story = {
    render: (args: any) => ({
        components: { VsSwitch },
        setup() {
            const value = ref(false);
            const messages = computed(() => {
                if (!value.value) {
                    return [{ state: 'error', text: 'This is error message' }];
                }

                return [{ state: 'success', text: 'This is success message' }];
            });

            return { args, value, messages };
        },
        template: '<vs-switch v-model="value" :messages="messages" />',
    }),
};

export const Readonly: Story = {
    args: {
        readonly: true,
    },
};

export const Required: Story = {
    args: {
        label: 'Label',
        required: true,
    },
};

export const Width: Story = {
    render: (args: any) => ({
        components: { VsSwitch, VsContainer },
        setup() {
            return { args };
        },
        template: `
            <vs-grid>
                <vs-switch v-bind="args" />
                <vs-switch v-bind="args"  style="margin-top: 5px"/>
            </vs-grid>
        `,
    }),
    args: {
        width: { sm: '200px', md: '300px', lg: '400px', xl: '500px' },
    },
};

export const Grid: Story = {
    render: (args: any) => ({
        components: { VsSwitch, VsContainer },
        setup() {
            return { args };
        },
        template: `
            <vs-grid>
                <vs-switch v-bind="args" />
                <vs-switch v-bind="args" />
            </vs-grid>
        `,
    }),
    args: {
        grid: { md: 6, lg: 3 },
    },
};

export const StyleSet: Story = {
    render: (args: any) => ({
        components: { VsSwitch },
        setup() {
            return { args };
        },
        template: `
            <vs-switch v-bind="args">
                <template #true-label>
                    <span class="text-red-500">True Slot</span>
                </template>
                <template #false-label>
                    <span class="text-blue-500">False Slot</span>
                </template>
            </vs-switch>
            `,
    }),
    args: {
        styleSet: {
            variables: {
                handleColor: '#2ecc71',
                handleSize: '16px',
            },
        },
    },
};

export const PreDefinedStyleSet: Story = {
    args: {
        styleSet: 'mySwitchStyleSet',
    },
};
