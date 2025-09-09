import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters } from '@/storybook';
import VsPage from './../VsPage.vue';

const meta: Meta<typeof VsPage> = {
    title: 'Chromatic/Layout Components/VsPage',
    component: VsPage,
    parameters: {
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsPage },
        setup() {
            return { args };
        },
        template: `
        <vs-page v-bind="args">
            <template #title><h2>Page Title</h2></template>
            <template #description>Page description content</template>
            This is Page Content. Page Title and Page Description is added via slot.
        </vs-page>
    `,
    }),
};

export default meta;
type Story = StoryObj<typeof VsPage>;

export const Default: Story = {};
