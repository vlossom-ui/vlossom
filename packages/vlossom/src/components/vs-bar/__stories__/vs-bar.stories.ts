import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsBar from './../VsBar.vue';
import type { VsBarStyleSet } from './../types';

const meta: Meta<typeof VsBar> = {
    title: 'Components/Base Components/VsBar',
    component: VsBar,
    parameters: {
        docs: {
            description: {
                component:
                    'VsBar는 다양한 위치에 배치할 수 있는 바 형태의 컴포넌트입니다. 네비게이션 바, 툴바, 상태 바 등으로 활용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBar },
        setup() {
            const preDefinedStyleSet: VsBarStyleSet = {
                backgroundColor: '#2c3e50',
                height: '60px',
                padding: '0 1.5rem',
                fontColor: '#ffffff',
                fontSize: '16px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            } as const;

            useVlossom().styleSet = {
                myBarStyleSet: { VsBar: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-bar v-bind="args"><span>Bar Content</span></vs-bar>',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        primary: {
            control: 'boolean',
            description: '강조 스타일 적용',
        },
        position: {
            control: { type: 'select' },
            options: ['relative', 'absolute', 'fixed', 'sticky', 'static'],
            description: 'CSS position 속성 설정',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsBar>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 바입니다. 기본적인 스타일과 기능을 제공합니다.',
            },
        },
    },
};

export const Primary: Story = {
    parameters: {
        docs: {
            description: {
                story: '강조 스타일이 적용된 primary 바입니다.',
            },
        },
    },
    args: {
        primary: true,
    },
};

export const NavigationBar: Story = {
    parameters: {
        docs: {
            description: {
                story: '상단 네비게이션 바의 예시입니다. fixed 위치와 적절한 스타일이 적용됩니다.',
            },
        },
    },
    args: {
        position: 'fixed',
        primary: true,
        styleSet: {
            top: 0,
            left: 0,
            width: '100%',
            height: '64px',
            padding: '0 2rem',
            zIndex: '1000',
            backgroundColor: '#1976d2',
            fontColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        },
    },
    render: (args: any) => ({
        components: { VsBar },
        setup() {
            return { args };
        },
        template: `
            <vs-bar v-bind="args" class="flex items-center justify-between" tag="nav">
                <div style="font-weight: bold; font-size: 18px;">Logo</div>
                <div style="display: flex; gap: 1.5rem;">
                    <a href="#home" style="color: inherit; text-decoration: none;">홈</a>
                    <a href="#about" style="color: inherit; text-decoration: none;">소개</a>
                    <a href="#services" style="color: inherit; text-decoration: none;">서비스</a>
                    <a href="#contact" style="color: inherit; text-decoration: none;">연락처</a>
                </div>
            </vs-bar>
        `,
    }),
};

export const StatusBar: Story = {
    parameters: {
        docs: {
            description: {
                story: '하단 상태 바의 예시입니다. 고정된 위치에 상태 정보를 표시합니다.',
            },
        },
    },
    args: {
        position: 'fixed',
        styleSet: {
            left: 0,
            bottom: 0,
            height: '32px',
            padding: '0 1rem',
            backgroundColor: '#f5f5f5',
            fontColor: '#666666',
            fontSize: '12px',
            border: '1px solid #e0e0e0',
        },
    },
    render: (args: any) => ({
        components: { VsBar },
        setup() {
            return { args };
        },
        template: `
            <vs-bar v-bind="args" class="flex items-center justify-between" tag="footer">
                <span>상태: 준비됨</span>
                <span>라인 1, 열 1</span>
                <span>UTF-8</span>
            </vs-bar>
        `,
    }),
};

export const Toolbar: Story = {
    parameters: {
        docs: {
            description: {
                story: '사이드 툴바의 예시입니다. 절대 위치로 배치되며 수직 배치에 적합합니다.',
            },
        },
    },
    args: {
        position: 'absolute',
        styleSet: {
            left: 0,
            top: 0,
            width: '56px',
            height: '100%',
            backgroundColor: '#2c3e50',
            padding: '2.4rem 0',
        },
    },
    render: (args: any) => ({
        components: { VsBar },
        setup() {
            return { args };
        },
        template: `
            <div style="position: relative; height: 400px; border: 1px solid #ddd;">
                <vs-bar v-bind="args" class="flex flex-col items-center justify-between text-white">
                    <button style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0.5rem;">📁</button>
                    <button style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0.5rem;">🔍</button>
                    <button style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0.5rem;">⚙️</button>
                    <button style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0.5rem;">📊</button>
                </vs-bar>
            </div>
        `,
    }),
};

export const Positions: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 위치 설정의 예시입니다. absolute, fixed, sticky, static 위치를 보여줍니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBar },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem;">
                <div>
                    <h4>Default (relative)</h4>
                    <vs-bar :style-set='{ "backgroundColor": "#e3f2fd", "padding": "0.5rem", "border": "1px solid #2196f3" }'>
                        Default Position Bar
                    </vs-bar>
                </div>

                <div style="position: relative; height: 100px; border: 1px solid #ddd;">
                    <h4>Absolute Position</h4>
                    <vs-bar position="absolute" :style-set='{ "backgroundColor": "#fff3e0", "padding": "0.5rem", "top": "30px", "left": "10px", "border": "1px solid #ff9800" }'>
                        Absolute Bar
                    </vs-bar>
                </div>

                <div class="relative">
                    <h4>Fixed Position</h4>
                    <vs-bar position="fixed" :style-set='{ "backgroundColor": "#f3e5f5", "padding": "0.5rem", "border": "1px solid #9c27b0" }'>
                        Fixed Bar
                    </vs-bar>
                </div>
            </div>
        `,
    }),
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 바들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsBar },
        setup() {
            const styleSet = {
                padding: '0.5rem',
            };
            return { args, styleSet };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-bar v-bind="args" color-scheme="{{ color }}" :style-set="styleSet">
                        {{ color }} 색상 테마 바
                    </vs-bar>
                `)}
                ${getColorSchemeTemplate(`
                    <vs-bar v-bind="args" color-scheme="{{ color }}" :style-set="styleSet" primary>
                        {{ color }} 색상 테마 바
                    </vs-bar>
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 바입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBar },
        setup() {
            return { args };
        },
        template: '<vs-bar v-bind="args" class="flex items-center">커스텀 스타일 바</vs-bar>',
    }),
    args: {
        styleSet: {
            backgroundColor: '#e91e63',
            border: '2px solid #ad1457',
            borderRadius: '8px',
            fontColor: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            height: '56px',
            padding: '0 2rem',
            boxShadow: '0 4px 8px rgba(233, 30, 99, 0.3)',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 바입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myBarStyleSet',
    },
    render: (args: any) => ({
        components: { VsBar },
        setup() {
            return { args };
        },
        template: '<vs-bar v-bind="args" class="flex items-center">미리 정의된 스타일 바</vs-bar>',
    }),
};
