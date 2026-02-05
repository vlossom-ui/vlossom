import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters } from '@/storybook';
import { LOREM_IPSUM } from '@/storybook';
import VsLabelValue from './../VsLabelValue.vue';

const meta: Meta<typeof VsLabelValue> = {
    title: 'Chromatic/Base Components/VsLabelValue',
    component: VsLabelValue,
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export default meta;
type Story = StoryObj<typeof VsLabelValue>;

export const AllVariants: Story = {
    render: () => ({
        components: { VsLabelValue },
        template: `
                <div>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 30rem;">
                            <vs-label-value>
                                <template #label>Short</template>
                                값
                            </vs-label-value>

                            <vs-label-value>
                                <template #label>Medium Length Label</template>
                                중간 길이의 값입니다
                            </vs-label-value>

                            <vs-label-value :grid="3">
                                <template #label>Very Long Label Text</template>
                                ${LOREM_IPSUM}
                            </vs-label-value>
                        </div>

                        <vs-label-value>
                            <template #label>Default</template>
                            ${LOREM_IPSUM}
                        </vs-label-value>

                        <vs-label-value primary>
                            <template #label>Primary</template>
                            ${LOREM_IPSUM}
                        </vs-label-value>

                        <vs-label-value dense>
                            <template #label>Dense</template>
                            ${LOREM_IPSUM}
                        </vs-label-value>

                        <vs-label-value primary dense>
                            <template #label>Primary + Dense</template>
                            ${LOREM_IPSUM}
                        </vs-label-value>

                        <vs-label-value width="400px">
                            <template #label>Fixed Width</template>
                            ${LOREM_IPSUM}
                        </vs-label-value>

                        <vs-label-value
                            :style-set="{
                                variables: {
                                    border: '2px solid #6366f1',
                                    label: {
                                        backgroundColor: '#6366f1',
                                        color: '#ffffff',
                                    },
                                    value: {
                                        backgroundColor: '#eef2ff',
                                        color: '#4338ca',
                                    },
                                },
                            }"
                        >
                            <template #label>StyleSet</template>
                            ${LOREM_IPSUM}
                        </vs-label-value>
                    </div>
                </div>
        `,
    }),
};
