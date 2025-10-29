import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VsCheckboxSet from './../VsCheckboxSet.vue';

type VsCheckboxSetArgs = InstanceType<typeof VsCheckboxSet>['$props'];

const meta: Meta<VsCheckboxSetArgs> = {
    title: 'Chromatic/Input Components/VsCheckboxSet',
    component: VsCheckboxSet,
    args: {
        label: 'Checkbox Set',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        modelValue: ['Option 1', 'Option 3'],
    },
    render: (args: VsCheckboxSetArgs) => ({
        components: { VsCheckboxSet },
        setup() {
            return { args };
        },
        template: `
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
                <vs-checkbox-set v-bind="args" label="Checkbox Set" />

                <vs-checkbox-set v-bind="args" label="Vertical Checkbox Set" vertical />

                <vs-checkbox-set v-bind="args" label="Small Checkbox Set" small />

                <vs-checkbox-set v-bind="args" label="Required Checkbox Set" required />

                <vs-checkbox-set v-bind="args" label="Readonly Checkbox Set" readonly />

                <vs-checkbox-set v-bind="args" label="Disabled Checkbox Set" disabled />
            </div>
        `,
    }),
};

export default meta;
type Story = StoryObj<VsCheckboxSetArgs>;

export const Default: Story = {};
