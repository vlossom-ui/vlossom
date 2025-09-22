import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters } from '@/storybook';
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
                                <template #label>짧은</template>
                                값
                            </vs-label-value>

                            <vs-label-value>
                                <template #label>중간 길이의 레이블</template>
                                중간 길이의 값입니다
                            </vs-label-value>

                            <vs-label-value>
                                <template #label>매우 긴 레이블 텍스트입니다</template>
                                매우 긴 값 텍스트입니다. 이것은 긴 콘텐츠가 어떻게 표시되는지 테스트하기 위한 예제입니다.
                            </vs-label-value>
                        </div>

                        <vs-label-value>
                            <template #label>기본</template>
                            일반 스타일
                        </vs-label-value>

                        <vs-label-value primary>
                            <template #label>Primary</template>
                            강조 스타일
                        </vs-label-value>

                        <vs-label-value dense>
                            <template #label>Dense</template>
                            압축 스타일
                        </vs-label-value>

                        <vs-label-value primary dense>
                            <template #label>Primary + Dense</template>
                            조합 스타일
                        </vs-label-value>
                    </div>
                </div>
        `,
    }),
};
