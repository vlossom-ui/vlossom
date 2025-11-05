import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, colorScheme, getColorSchemeTemplate } from '@/storybook';

import VsRadioSet from './../VsRadioSet.vue';
import { useTemplateRef } from 'vue';

type VsRadioSetArgs = InstanceType<typeof VsRadioSet>['$props'];

const meta: Meta<VsRadioSetArgs> = {
    title: 'Components/Input Components/VsRadioSet',
    component: VsRadioSet,
    render: (args: VsRadioSetArgs) => ({
        components: { VsRadioSet },
        setup() {
            return { args };
        },
        template: '<vs-radio-set v-bind="args" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        modelValue: { control: false },
        options: { control: false },
    },
};

export default meta;
type Story = StoryObj<VsRadioSetArgs>;

export const Default: Story = {
    args: {
        label: 'Radio Set',
        options: ['Option 1', 'Option 2', 'Option 3'],
        modelValue: 'Option 1',
    },
};

export const WithObjects: Story = {
    args: {
        label: 'Fruits',
        options: [
            { id: 1, name: 'Apple' },
            { id: 2, name: 'Banana' },
            { id: 3, name: 'Orange' },
        ],
        optionLabel: 'name',
        optionValue: 'id',
        modelValue: 2,
    },
};

export const Vertical: Story = {
    args: {
        label: 'Vertical Layout',
        options: ['Option 1', 'Option 2', 'Option 3'],
        vertical: true,
        modelValue: 'Option 2',
    },
};

export const WithValidation: Story = {
    render: () => ({
        components: { VsRadioSet },
        setup() {
            const radioSetRef = useTemplateRef('radioSetRef');
            const args = {
                label: 'Select One',
                options: ['Option 1', 'Option 2', 'Option 3'],
                required: true,
                modelValue: null,
            };

            function clear() {
                const radioRefs = (radioSetRef.value as any).radioRefs;
                radioRefs.forEach((radio: any) => {
                    radio.clear();
                });
            }
            function validate() {
                (radioSetRef.value as any).validate();
            }
            return { args, clear, validate };
        },
        template: `
            <vs-radio-set v-bind="args" ref="radioSetRef" />
            <vs-button primary @click="validate">Validate</vs-button>
            <vs-button outline @click="clear">Clear</vs-button>
        `,
    }),
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Radio Set',
        options: ['Option 1', 'Option 2', 'Option 3'],
        disabled: true,
        modelValue: 'Option 1',
    },
};

export const Readonly: Story = {
    args: {
        label: 'Readonly Radio Set',
        options: ['Option 1', 'Option 2', 'Option 3'],
        readonly: true,
        modelValue: 'Option 2',
    },
};

export const ColorScheme: Story = {
    render: () => ({
        components: { VsRadioSet },
        template: `
            <div>
                ${getColorSchemeTemplate(`
                    <vs-radio-set
                        :label="'{{color}} Radio Set'"
                        :options="['Option 1', 'Option 2', 'Option 3']"
                        :model-value="'Option 2'"
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
            gap: '2rem',
            radio: {
                radioColor: '#7c3aed',
                radioSize: '1.2rem',
            },
        },
        modelValue: 'Option 3',
    },
};

export const CustomLabels: Story = {
    render: () => ({
        components: { VsRadioSet },
        setup() {
            const options = [
                { id: 'basic', title: 'Basic Plan', price: '$10 / month' },
                { id: 'pro', title: 'Pro Plan', price: '$25 / month' },
                { id: 'enterprise', title: 'Enterprise Plan', price: '$50 / month' },
            ];
            return { options };
        },
        template: `
            <vs-radio-set
                label="Choose a plan"
                :options="options"
                option-label="title"
                option-value="id"
                :model-value="'pro'"
            >
                <template #radio-label="{ option }">
                    <div class="flex flex-col">
                        <span class="font-medium">{{ option.title }}</span>
                        <span class="text-sm text-gray-500">{{ option.price }}</span>
                    </div>
                </template>
            </vs-radio-set>
        `,
    }),
};
