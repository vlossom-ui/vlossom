import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { src, fallbackSrc, lazySrc, brokenSrc } from './constants';
import VsImage from './../VsImage.vue';

const meta: Meta<typeof VsImage> = {
    title: 'Chromatic/Base Components/VsImage',
    component: VsImage,
    render: (args: any) => ({
        components: { VsImage },
        setup() {
            return { args, fallbackSrc, lazySrc, brokenSrc };
        },
        template: `
            <div style="display:flex; flex-direction:column;">
                <vs-image v-bind="args" :style="{ marginBottom: '12px' }"/>

                <vs-image
                    v-bind="args"
                    :src="brokenSrc"
                    :fallback="fallbackSrc"
                    :style="{ marginBottom: '12px' }"
                />

                <vs-image
                    v-bind="args"
                    :src="brokenSrc"
                    :style="{ marginBottom: '12px' }"
                >
                    <template #fallback>
                        <div
                            style="display:flex; width:100%; height:100%; align-items:center; justify-content:center; border:1px solid #93c5fd; border-radius:4px; background-color:#eff6ff; color:#2563eb;"
                        >
                            fallback slot
                        </div>
                    </template>
                </vs-image>

                <vs-image
                    v-bind="args"
                    :src="brokenSrc"
                    :fallback="fallbackSrc"
                    :style="{ marginBottom: '12px' }"
                >
                    <template #fallback>
                        <div
                            style="display:flex; width:100%; height:100%; align-items:center; justify-content:center; border:1px solid #fca5a5; border-radius:4px; background-color:#fef2f2; color:#dc2626;"
                        >
                            This slot should not be displayed
                        </div>
                    </template>
                </vs-image>

                <vs-image v-bind="args" src='' alt="alternative text" :style="{ marginBottom: '12px' }"/>

                <vs-image v-bind="args" :src="lazySrc" lazy alt="lazy loading"/>
            </div>`,
    }),
    args: {
        src,
    },
    argTypes: {},
};

export default meta;
type Story = StoryObj<typeof VsImage>;

export const Default: Story = {};
