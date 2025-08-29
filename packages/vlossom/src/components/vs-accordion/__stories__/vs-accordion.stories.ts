import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import VsAccordion from '../VsAccordion.vue';

const meta: Meta<typeof VsAccordion> = {
    title: 'Components/Base Components/VsAccordion',
    component: VsAccordion,
    parameters: {
        docs: {
            description: {
                component:
                    'VsAccordion은 접을 수 있는 콘텐츠 영역 컴포넌트입니다. 부드러운 슬라이드 애니메이션을 제공합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsAccordion },
        setup() {
            return { args };
        },
        template: `
            <vs-accordion v-bind="args">
                <template #title>아코디언 제목</template>
                <p>아코디언 내용입니다. 이 영역이 부드럽게 슬라이드 다운 애니메이션과 함께 열리고 닫힙니다.</p>
                <p>더 많은 내용을 추가할 수 있습니다. 애니메이션이 자연스럽게 적용되는지 확인해보세요!</p>
            </vs-accordion>
        `,
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        open: {
            control: 'boolean',
            description: '아코디언 초기 열림 상태',
        },
        modelValue: {
            control: 'boolean',
            description: 'v-model로 아코디언 상태 제어',
        },
        disabled: {
            control: 'boolean',
            description: '아코디언 비활성화 상태',
        },
        primary: {
            control: 'boolean',
            description: 'primary 스타일 적용',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
    args: {
        open: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
    parameters: {
        docs: {
            description: {
                story: '비활성화된 아코디언입니다. 클릭해도 열리지 않습니다.',
            },
        },
    },
};

export const Primary: Story = {
    args: {
        primary: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'primary 스타일이 적용된 아코디언입니다.',
            },
        },
    },
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 아코디언들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsAccordion },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${getColorSchemeTemplate(`
                    <vs-accordion v-bind="args" color-scheme="{{ color }}">
                        <template #title>{{ color }} 아코디언</template>
                        <p>{{ color }} 색상 스킴이 적용된 아코디언입니다. 애니메이션과 함께 열려보세요!</p>
                    </vs-accordion>
                `)}
            </div>
        `,
    }),
};
