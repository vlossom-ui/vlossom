import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VsCheckboxSet from './../VsCheckboxSet.vue';

type VsCheckboxSetArgs = InstanceType<typeof VsCheckboxSet>['$props'];

const meta: Meta<VsCheckboxSetArgs> = {
    title: 'Chromatic/Input Components/VsCheckboxSet',
    component: VsCheckboxSet,
    render: (args: VsCheckboxSetArgs) => ({
        components: { VsCheckboxSet },
        setup() {
            return { args };
        },
        template: '<vs-checkbox-set v-bind="args" />',
    }),
};

export default meta;
type Story = StoryObj<VsCheckboxSetArgs>;

export const Horizontal: Story = {
    args: {
        label: 'Horizontal Checkbox Set',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        modelValue: ['Option 1', 'Option 3'],
    },
};

export const Vertical: Story = {
    args: {
        label: 'Vertical Checkbox Set',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        vertical: true,
        modelValue: ['Option 2'],
    },
};

export const States: Story = {
    render: () => ({
        components: { VsCheckboxSet },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <vs-checkbox-set
                    label="Default State"
                    :options="['Option 1', 'Option 2', 'Option 3']"
                    :model-value="['Option 1']"
                />

                <vs-checkbox-set
                    label="Disabled State"
                    :options="['Option 1', 'Option 2', 'Option 3']"
                    :model-value="['Option 2']"
                    disabled
                />

                <vs-checkbox-set
                    label="Readonly State"
                    :options="['Option 1', 'Option 2', 'Option 3']"
                    :model-value="['Option 1', 'Option 3']"
                    readonly
                />

                <vs-checkbox-set
                    label="Required (with validation error)"
                    :options="['Option 1', 'Option 2', 'Option 3']"
                    :model-value="[]"
                    required
                    :messages="[{ state: 'error', text: 'At least one option must be selected' }]"
                />
            </div>
        `,
    }),
};

export const Sizes: Story = {
    render: () => ({
        components: { VsCheckboxSet },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <vs-checkbox-set
                    label="Default Size"
                    :options="['Option 1', 'Option 2', 'Option 3']"
                    :model-value="['Option 1']"
                />

                <vs-checkbox-set
                    label="Small Size"
                    :options="['Option 1', 'Option 2', 'Option 3']"
                    :model-value="['Option 2']"
                    small
                />
            </div>
        `,
    }),
};
