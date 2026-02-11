import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, colorScheme, getColorSchemeTemplate } from '@/storybook';
import VsCheckboxSet from './../VsCheckboxSet.vue';

type VsCheckboxSetArgs = InstanceType<typeof VsCheckboxSet>['$props'];

const meta: Meta<VsCheckboxSetArgs> = {
    title: 'Components/Input Components/VsCheckboxSet',
    component: VsCheckboxSet,
    render: (args: VsCheckboxSetArgs) => ({
        components: { VsCheckboxSet },
        setup() {
            return { args };
        },
        template: '<vs-checkbox-set v-bind="args" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        modelValue: { control: false },
        options: { control: false },
    },
};

export default meta;
type Story = StoryObj<VsCheckboxSetArgs>;

export const Default: Story = {
    args: {
        label: 'Checkbox Set',
        options: ['Option 1', 'Option 2', 'Option 3'],
        modelValue: [],
    },
};

export const WithObjects: Story = {
    args: {
        label: 'Fruits',
        options: [
            { id: 1, name: 'Apple', value: 'apple' },
            { id: 2, name: 'Banana', value: 'banana' },
            { id: 3, name: 'Orange', value: 'orange' },
        ],
        optionLabel: 'name',
        optionValue: 'value',
        modelValue: [],
    },
};

export const Vertical: Story = {
    args: {
        label: 'Vertical Layout',
        options: ['Option 1', 'Option 2', 'Option 3'],
        vertical: true,
        modelValue: [],
    },
};

export const WithValidation: Story = {
    args: {
        label: 'Select at least 2 options',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        required: true,
        min: 2,
        max: 3,
        modelValue: [],
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Checkbox Set',
        options: ['Option 1', 'Option 2', 'Option 3'],
        disabled: true,
        modelValue: ['Option 1'],
    },
};

export const Readonly: Story = {
    args: {
        label: 'Readonly Checkbox Set',
        options: ['Option 1', 'Option 2', 'Option 3'],
        readonly: true,
        modelValue: ['Option 1', 'Option 3'],
    },
};

export const ColorScheme: Story = {
    render: () => ({
        components: { VsCheckboxSet },
        template: `
            <div>
                ${getColorSchemeTemplate(`
                    <vs-checkbox-set
                        :label="'{{color}} Checkbox Set'"
                        :options="['Option 1', 'Option 2', 'Option 3']"
                        :model-value="['Option 1']"
                        color-scheme="{{color}}"
                    />
                `)}
            </div>
        `,
    }),
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const StyleSet: Story = {
    args: {
        label: 'Custom Style',
        options: ['Option 1', 'Option 2', 'Option 3'],
        styleSet: {
            component: {
                gap: '2rem',
            },
            checkbox: {
                variables: {
                    checkboxColor: '#7c3aed',
                    checkboxSize: '1.2rem',
                },
            },
            wrapper: {
                label: {
                    fontWeight: 'bold',
                },
            },
        },
        modelValue: ['Option 1'],
    },
};

export const CustomLabels: Story = {
    render: () => ({
        components: { VsCheckboxSet },
        setup() {
            const options = [
                { id: 1, title: 'Basic Plan', price: '$10' },
                { id: 2, title: 'Pro Plan', price: '$25' },
                { id: 3, title: 'Enterprise Plan', price: '$50' },
            ];
            return { options };
        },
        template: `
            <vs-checkbox-set
                label="Select Plans"
                :options="options"
                option-label="title"
                option-value="id"
                :model-value="[]"
            >
                <template #check-label="{ option }">
                    <div class="flex flex-col">
                        <span class="font-medium">{{ option.title }}</span>
                        <span class="text-sm text-gray-500">{{ option.price }}/month</span>
                    </div>
                </template>
            </vs-checkbox-set>
        `,
    }),
};
