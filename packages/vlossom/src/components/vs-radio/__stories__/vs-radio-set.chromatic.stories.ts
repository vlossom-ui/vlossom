import type { Meta, StoryObj } from '@storybook/vue3-vite';

import VsRadioSet from './../VsRadioSet.vue';

type VsRadioSetArgs = InstanceType<typeof VsRadioSet>['$props'];

const meta: Meta<VsRadioSetArgs> = {
    title: 'Chromatic/Input Components/VsRadioSet',
    component: VsRadioSet,
    args: {
        label: 'Radio Set',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        modelValue: 'Option 2',
    },
    render: (args: VsRadioSetArgs) => ({
        components: { VsRadioSet },
        setup() {
            return { args };
        },
        template: `
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
                <vs-radio-set v-bind="args" label="Radio Set" />

                <vs-radio-set v-bind="args" label="Vertical Radio Set" vertical />

                <vs-radio-set v-bind="args" label="Required Radio Set" required :model-value="null" />

                <vs-radio-set v-bind="args" label="Readonly Radio Set" readonly />

                <vs-radio-set v-bind="args" label="Disabled Radio Set" disabled />
            </div>
        `,
    }),
};

export default meta;
type Story = StoryObj<VsRadioSetArgs>;

export const Default: Story = {};

