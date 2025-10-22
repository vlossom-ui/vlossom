import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, colorScheme } from '@/storybook';
import { useVlossom } from '@/framework';
import { options } from './constants';
import VsContainer from '@/components/vs-container/VsContainer.vue';
import VsCheckboxSet from './../VsCheckboxSet.vue';
import type { VsCheckboxSetStyleSet } from './../types';

const meta: Meta<typeof VsCheckboxSet> = {
    title: 'Components/Input Components/VsCheckboxSet',
    component: VsCheckboxSet,
    render: (args: any) => ({
        components: { VsCheckboxSet },
        setup() {
            const preDefinedStyleSet: VsCheckboxSetStyleSet = {
                gap: '3rem',
                checkbox: {
                    borderRadius: '1.3rem',
                    label: {
                        fontColor: '#a0b0b9',
                        fontSize: '0.8rem',
                    },
                    checkboxColor: '#81c798',
                    checkboxSize: '4rem',
                },
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsCheckboxSet: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-checkbox-set v-bind="args"  />',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        disabled: {
            control: 'boolean',
            description: 'CheckboxSet 비활성화',
        },
        readonly: {
            control: 'boolean',
            description: '읽기 전용 모드',
        },
        required: {
            control: 'boolean',
            description: '필수 입력 여부',
        },
        vertical: {
            control: 'boolean',
            description: '수직 레이아웃',
        },
    },
    args: {
        options,
    },
};

export default meta;
type Story = StoryObj<typeof VsCheckboxSet>;

export const Default: Story = {};

export const ColorScheme: Story = {
    render: (args: any) => ({
        components: { VsCheckboxSet },
        setup() {
            const colorOptions = [...colorScheme.options];
            return { colorOptions, args };
        },
        template: `
            <div>
				<vs-checkbox-set v-for="color in colorOptions" :key="color" v-bind="args" :color-scheme="color" />
            </div>
        `,
    }),
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const State: Story = {
    render: (args: any) => ({
        components: { VsCheckboxSet },
        setup() {
            const states = ['success', 'info', 'error', 'warning'];
            return { args, states };
        },
        template: `
            <div>
                <vs-checkbox-set v-for="state in states" :key="state" v-bind="args" :label="\`State (\${state})\`" :state="state" style="margin-bottom: 16px" />
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
        label: 'Choose your favorite(s)',
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
        label: 'Choose your favorite(s)',
        required: true,
    },
};

export const Vertical: Story = {
    args: {
        vertical: true,
    },
};

export const BeforeChange: Story = {
    args: {
        beforeChange: async () => {
            // const $vs = useVlossom();
            //return await $vs.confirm.open('Are you sure?'); // boolean 형 토글 상태에 따라 동작하는 예제로 변경
            return true;
        },
    },
};

export const Width: Story = {
    render: (args: any) => ({
        components: { VsCheckboxSet, VsContainer },
        setup() {
            return { args };
        },
        template: `
            <vs-container>
                <vs-checkbox-set v-bind="args" />
                <vs-checkbox-set v-bind="args" />
            </vs-container>
        `,
    }),
    args: {
        width: { md: '300px', lg: '400px' },
    },
};

export const Grid: Story = {
    render: (args: any) => ({
        components: { VsCheckboxSet, VsContainer },
        setup() {
            return { args };
        },
        template: `
            <vs-container grid>
                <vs-checkbox-set v-bind="args" />
                <vs-checkbox-set v-bind="args" />
            </vs-container>
        `,
    }),
    args: {
        grid: { md: 6, lg: 3 },
    },
};

export const StyleSet: Story = {
    args: {
        styleSet: {
            borderRadius: '0.1rem',
            checkbox: {
                label: {
                    fontColor: '#a0b0b9',
                    fontSize: '1.2rem',
                },
                checkboxColor: '#81c798',
                checkboxSize: '2rem',
            },
            flexWrap: 'nowrap',
            gap: '3rem',
        },
    },
};
export const PreDefinedStyleSet: Story = {
    args: {
        styleSet: 'myStyleSet',
    },
};
