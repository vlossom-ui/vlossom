import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, colorScheme, getColorSchemeTemplate } from '@/storybook';
import VsSelect from './../VsSelect.vue';

type VsSelectArgs = InstanceType<typeof VsSelect>['$props'];

const meta: Meta<VsSelectArgs> = {
    title: 'Components/Input Components/VsSelect',
    component: VsSelect,
    render: (args: VsSelectArgs) => ({
        components: { VsSelect },
        setup() {
            return { args };
        },
        template: '<vs-select v-bind="args" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        modelValue: { control: false },
        options: { control: false },
    },
};

export default meta;
type Story = StoryObj<VsSelectArgs>;

const basicOptions = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Strawberry'];

const objectOptions = [
    { id: 1, name: 'Apple', category: 'Fruits', unavailable: false },
    { id: 2, name: 'Banana', category: 'Fruits', unavailable: false },
    { id: 3, name: 'Orange', category: 'Fruits', unavailable: false },
    { id: 4, name: 'Carrot', category: 'Vegetables', unavailable: false },
    { id: 5, name: 'Broccoli', category: 'Vegetables', unavailable: true },
    { id: 6, name: 'Tomato', category: 'Vegetables', unavailable: false },
];

export const Default: Story = {
    args: {
        label: 'Select',
        options: basicOptions,
        placeholder: 'Select an option',
        modelValue: null,
    },
};

export const Multiple: Story = {
    args: {
        label: 'Multiple Select',
        options: basicOptions,
        placeholder: 'Select multiple options',
        multiple: true,
        modelValue: [],
    },
};

export const WithObjects: Story = {
    args: {
        label: 'Fruits & Vegetables',
        options: objectOptions,
        optionLabel: 'name',
        optionValue: 'id',
        placeholder: 'Select a product',
        modelValue: null,
    },
};

export const WithSearch: Story = {
    args: {
        label: 'Searchable Select',
        options: basicOptions,
        placeholder: 'Search and select',
        search: true,
        modelValue: null,
    },
};

export const WithSearchOptions: Story = {
    args: {
        label: 'Searchable with custom placeholder',
        options: basicOptions,
        placeholder: 'Select an option',
        search: {
            useRegex: false,
            useCaseSensitive: false,
            placeholder: 'Type to search...',
        },
        modelValue: null,
    },
};

export const WithSelectAll: Story = {
    args: {
        label: 'Multiple with Select All',
        options: basicOptions,
        placeholder: 'Select options',
        multiple: true,
        selectAll: true,
        modelValue: [],
    },
};

export const WithGroups: Story = {
    args: {
        label: 'Grouped Options',
        options: objectOptions,
        optionLabel: 'name',
        optionValue: 'id',
        groupBy: (option: any) => option.category,
        placeholder: 'Select a product',
        modelValue: null,
    },
};

export const WithDisabledOptions: Story = {
    args: {
        label: 'With Disabled Options',
        options: objectOptions,
        optionLabel: 'name',
        optionValue: 'id',
        optionsDisabled: (option: any) => option.unavailable,
        placeholder: 'Select a product',
        modelValue: null,
    },
};

export const WithValidation: Story = {
    args: {
        label: 'Select with Validation',
        options: basicOptions,
        placeholder: 'Required field',
        required: true,
        modelValue: null,
    },
};

export const WithMinMax: Story = {
    args: {
        label: 'Multiple Select with Min/Max',
        options: basicOptions,
        placeholder: 'Select 2-3 options',
        multiple: true,
        min: 2,
        max: 3,
        modelValue: [],
    },
};

export const WithClosableChips: Story = {
    args: {
        label: 'Multiple with Closable Chips',
        options: basicOptions,
        placeholder: 'Select options',
        multiple: true,
        closableChips: true,
        modelValue: ['Apple', 'Banana', 'Orange'],
    },
};

export const WithCollapseChips: Story = {
    args: {
        label: 'Multiple with Collapse Chips',
        options: basicOptions,
        placeholder: 'Select options',
        multiple: true,
        collapseChips: true,
        modelValue: ['Apple', 'Banana', 'Orange', 'Mango'],
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Select',
        options: basicOptions,
        placeholder: 'Disabled',
        disabled: true,
        modelValue: 'Apple',
    },
};

export const Readonly: Story = {
    args: {
        label: 'Readonly Select',
        options: basicOptions,
        placeholder: 'Readonly',
        readonly: true,
        modelValue: 'Apple',
    },
};

export const NoClear: Story = {
    args: {
        label: 'No Clear Button',
        options: basicOptions,
        placeholder: 'Select an option',
        noClear: true,
        modelValue: 'Apple',
    },
};

export const ColorScheme: Story = {
    render: () => ({
        components: { VsSelect },
        template: `
            <div>
                ${getColorSchemeTemplate(`
                    <vs-select
                        :label="'{{color}} Select'"
                        :options="['Option 1', 'Option 2', 'Option 3']"
                        :model-value="'Option 1'"
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
        options: basicOptions,
        placeholder: 'Select an option',
        styleSet: {
            variables: {
                height: '3rem',
                focused: {
                    border: '2px solid #2196f3',
                    borderRadius: '12px',
                    backgroundColor: '#f5f5f5',
                },
            },
            component: {
                fontSize: '1rem',
            },
        },
        modelValue: null,
    },
};

export const CustomOption: Story = {
    render: () => ({
        components: { VsSelect },
        setup() {
            const users = [
                { id: 1, name: 'John Doe', email: 'john@example.com' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
                { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
            ];
            return { users };
        },
        template: `
            <vs-select
                label="Select User"
                :options="users"
                option-label="name"
                option-value="id"
                placeholder="Choose a user"
                :model-value="null"
            >
                <template #option="{ label, value, selected }">
                    <div :class="{ 'font-bold': selected }">
                        <div>{{ label }}</div>
                        <div class="text-sm text-gray-500">{{ users.find(u => u.id === value)?.email }}</div>
                    </div>
                </template>
            </vs-select>
        `,
    }),
};

export const WithHeaderFooter: Story = {
    render: () => ({
        components: { VsSelect },
        setup() {
            const options = basicOptions;
            return { options };
        },
        template: `
            <vs-select
                label="Select with Header & Footer"
                :options="options"
                placeholder="Select an option"
                :model-value="null"
                search
            >
                <template #options-header>
                    <div class="p-2 border-b text-sm text-gray-600">
                        Popular options
                    </div>
                </template>
                <template #options-footer>
                    <div class="p-2 border-t text-sm text-gray-600">
                        Total: {{ options.length }} options
                    </div>
                </template>
            </vs-select>
        `,
    }),
};

export const WithCustomGroup: Story = {
    render: () => ({
        components: { VsSelect },
        setup() {
            const products = [
                { id: 1, name: 'Apple', category: 'Fruits', icon: '🍎' },
                { id: 2, name: 'Banana', category: 'Fruits', icon: '🍌' },
                { id: 3, name: 'Carrot', category: 'Vegetables', icon: '🥕' },
                { id: 4, name: 'Broccoli', category: 'Vegetables', icon: '🥦' },
            ];
            return { products };
        },
        template: `
            <vs-select
                label="Products with Custom Groups"
                :options="products"
                option-label="name"
                option-value="id"
                :group-by="(option) => option.category"
                placeholder="Select a product"
                :model-value="null"
            >
                <template #group="{ groupName }">
                    <div class="font-bold text-purple-600">
                        {{ groupName }} Category
                    </div>
                </template>
                <template #option="{ label, value }">
                    <div class="flex items-center gap-2">
                        <span>{{ products.find(p => p.id === value)?.icon }}</span>
                        <span>{{ label }}</span>
                    </div>
                </template>
            </vs-select>
        `,
    }),
};
