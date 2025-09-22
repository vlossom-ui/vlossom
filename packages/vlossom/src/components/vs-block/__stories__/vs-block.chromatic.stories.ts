import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters } from '@/storybook';
import VsBlock from '@/components/vs-block/VsBlock.vue';

const meta: Meta<typeof VsBlock> = {
    title: 'Chromatic/Base Components/VsBlock',
    component: VsBlock,
    parameters: {
        chromatic: chromaticParameters.theme,
    },
    argTypes: {
        title: {
            control: 'text',
            type: 'string',
            description: 'Title slot content',
            table: {
                category: 'slots',
            },
        },
        default: {
            control: 'text',
            type: 'string',
            description: 'Default slot content',
            table: {
                category: 'slots',
            },
        },
    } as any,
    args: {
        styleSet: {},
        title: 'Block Title',
        default: 'This is Block Content. Title and Default is added via slot.',
    } as any,
    render: (args: any) => ({
        components: { VsBlock },
        setup() {
            return { args };
        },
        template: `
        <vs-block v-bind="args">
            <template #title>{{ args.title }}</template>
            {{ args.default }}
        </vs-block>
        `,
    }),
};

export default meta;
type Story = StoryObj<typeof VsBlock>;

export const Default: Story = {};
