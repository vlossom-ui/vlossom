import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters } from '@/storybook';
import VsBar from './../VsBar.vue';

const meta: Meta<typeof VsBar> = {
    title: 'Chromatic/Base Components/VsBar',
    component: VsBar,
    parameters: {
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsBar },
        setup() {
            return { args };
        },
        template: '<vs-bar v-bind="args"><span>Bar Content</span></vs-bar>',
    }),
};

export default meta;
type Story = StoryObj<typeof VsBar>;

export const AllVariations: Story = {
    parameters: {
        chromatic: chromaticParameters.theme,
    },
    render: () => ({
        components: { VsBar },
        template: `
            <div class="chromatic-wrapper">
                <div class="chromatic-section">
                    <vs-bar :style-set='{ "padding": "1rem", "margin": "0.5rem 0" }'>
                        기본 바
                    </vs-bar>
                </div>

                <div class="chromatic-section">
                    <vs-bar primary :style-set='{ "padding": "1rem", "margin": "0.5rem 0" }'>
                        Primary 바
                    </vs-bar>
                </div>

                <div class="chromatic-section">
                    <vs-bar :style-set='{
                        "backgroundColor": "#e3f2fd",
                        "border": "2px solid #2196f3",
                        "borderRadius": "8px",
                        "padding": "1rem",
                        "margin": "0.5rem 0"
                    }'>
                        커스텀 스타일 바
                    </vs-bar>

                    <vs-bar :style-set='{
                        "backgroundColor": "#f3e5f5",
                        "fontColor": "#7b1fa2",
                        "fontWeight": "600",
                        "padding": "1rem",
                        "margin": "0.5rem 0"
                    }'>
                        폰트 스타일 바
                    </vs-bar>
                </div>

                <div class="chromatic-section">
                    <h3>위치 설정 (상대 위치로 시각화)</h3>
                    <div style="position: relative; height: 120px; border: 1px dashed #ccc; margin: 0.5rem 0;">
                        <vs-bar position="absolute" :style-set='{
                            "backgroundColor": "#ffebee",
                            "border": "1px solid #f44336",
                            "top": "10px",
                            "left": "10px",
                            "width": "200px",
                            "padding": "0.5rem"
                        }'>
                            Absolute 위치
                        </vs-bar>

                        <vs-bar position="absolute" :style-set='{
                            "backgroundColor": "#e8f5e8",
                            "border": "1px solid #4caf50",
                            "bottom": "10px",
                            "right": "10px",
                            "width": "200px",
                            "padding": "0.5rem"
                        }'>
                            Absolute 우하단
                        </vs-bar>
                    </div>
                </div>
            </div>
        `,
    }),
};
