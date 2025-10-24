import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, colorScheme, getColorSchemeTemplate } from '@/storybook';
import { useVlossom } from '@/framework';
import VsContainer from '@/components/vs-container/VsContainer.vue';
import VsCheckbox from './../VsCheckbox.vue';
import type { VsCheckboxStyleSet } from './../types';
import { computed, ref } from 'vue';

const meta: Meta<typeof VsCheckbox> = {
    title: 'Components/Input Components/VsCheckbox',
    component: VsCheckbox,
    render: (args: any) => ({
        components: { VsCheckbox },
        setup() {
            const preDefinedStyleSet: VsCheckboxStyleSet = {
                borderRadius: '0.6rem',
                checkboxColor: '#ffb300',
                checkboxSize: '3rem',
            } as const;

            useVlossom().styleSet = {
                myCheckboxStyleSet: { VsCheckbox: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-checkbox v-bind="args" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        disabled: {
            control: 'boolean',
            description: 'Checkbox 비활성화',
        },
        readonly: {
            control: 'boolean',
            description: '읽기 전용 모드',
        },
        required: {
            control: 'boolean',
            description: '필수 입력 여부',
        },
        indeterminate: {
            control: 'boolean',
            description: '불확정 상태 표시',
        },
    },
    args: {
        checkLabel: 'Checkbox',
    },
};

export default meta;
type Story = StoryObj<typeof VsCheckbox>;

export const Default: Story = {};

export const ColorScheme: Story = {
    render: () => ({
        components: { VsCheckbox },
        setup() {
            const colorOptions = [...colorScheme.options];
            return { colorOptions };
        },
        template: `
            <div>
				${getColorSchemeTemplate(`
					<vs-checkbox color-scheme="{{color}}" checkLabel="Checkbox" />
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
        components: { VsCheckbox },
        setup() {
            const states = ['success', 'info', 'error', 'warning'];
            return { args, states };
        },
        template: `
            <div>
                <vs-checkbox v-for="state in states" :key="state" v-bind="args" :label="\`State (\${state})\`" :state="state" style="margin-bottom: 16px" check-label="Checkbox" />
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
        label: 'Label',
    },
};

export const Messages: Story = {
    args: {
        messages: [{ state: 'success', text: 'This is success message' }],
    },
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

export const Indeterminate: Story = {
    render: (args: any) => ({
        components: { VsCheckbox },
        setup() {
            return { args };
        },
        template: `
            <div >
            ${getColorSchemeTemplate(`
                <vs-checkbox v-bind="args" color-scheme="{{color}}" indeterminate check-label="Indeterminate" />
            `)}
            </div>
        `,
    }),
};

export const BeforeChange: Story = {
    render: (args: any) => ({
        components: { VsCheckbox },
        setup() {
            const modelValue = ref(false);
            const toggleMessage = computed(() => {
                if (modelValue.value) {
                    return 'checkbox interact allowed';
                }
                return 'checkbox interact denied';
            });

            const beforeChange = async () => {
                return modelValue.value;
            };
            return { args, modelValue, beforeChange, toggleMessage };
        },
        template: `
            <vs-toggle v-model="modelValue" style="margin-bottom: 16px">{{ toggleMessage }}</vs-toggle>
            <vs-checkbox v-bind="args" :before-change="beforeChange" label="by before change logic" />
        `,
    }),
};

export const Width: Story = {
    render: (args: any) => ({
        components: { VsCheckbox, VsContainer },
        setup() {
            return { args };
        },
        template: `
            <vs-container>
                <vs-checkbox v-bind="args" />
                <vs-checkbox v-bind="args" />
            </vs-container>
        `,
    }),
    args: {
        width: { sm: '200px', md: '300px', lg: '400px', xl: '500px' },
    },
};

export const Grid: Story = {
    render: (args: any) => ({
        components: { VsCheckbox, VsContainer },
        setup() {
            return { args };
        },
        template: `
            <vs-grid>
                <vs-checkbox v-bind="args" />
                <vs-checkbox v-bind="args" />
                <vs-checkbox v-bind="args" />
                <vs-checkbox v-bind="args" />
            </vs-grid>
        `,
    }),
    args: {
        grid: { md: 4, lg: 3 },
    },
};

export const StyleSet: Story = {
    args: {
        styleSet: {
            borderRadius: '1.3rem',
            checkboxColor: '#81c798',
            checkboxSize: '4rem',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    args: {
        styleSet: 'myCheckboxStyleSet',
    },
};
