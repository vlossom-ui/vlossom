import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate } from '@/storybook';
import { useVlossom } from '@/framework';
import VsBreadcrumb from './../VsBreadcrumb.vue';
import type { VsBreadcrumbStyleSet } from './../types';

const LONG_PATHS = [
    'Home',
    'Product Documentation',
    'Component Library Reference',
    'Navigation Components',
    'Breadcrumb Component Overview',
    'Accessibility Guidelines',
    'Keyboard Interaction Patterns',
    'Examples And Recipes',
];

const meta: Meta<typeof VsBreadcrumb> = {
    title: 'Components/Base Components/VsBreadcrumb',
    component: VsBreadcrumb,
    parameters: {
        docs: {
            description: {
                component:
                    'VsBreadcrumb는 현재 페이지까지의 경로를 보여주는 breadcrumb 컴포넌트입니다. 직접 이동하지 않고, 조상 항목 클릭을 click-path 이벤트로 알립니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBreadcrumb },
        setup() {
            const preDefinedStyleSet: VsBreadcrumbStyleSet = {
                $item: {
                    color: '#1e88e5',
                    $current: { color: '#0d47a1', fontWeight: '700' },
                },
                $separator: { color: '#90caf9' },
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsBreadcrumb: { ...preDefinedStyleSet } },
            };

            const clickedPathText = ref('-');
            function onClickPath(clickedPaths: string[]) {
                clickedPathText.value = clickedPaths.join(' / ');
            }

            return { args, clickedPathText, onClickPath };
        },
        template: `
            <div>
                <vs-breadcrumb v-bind="args" @click-path="onClickPath" />
                <div style="margin-top: 2rem; padding: 1rem; background-color: #f5f5f5; border-radius: 4px;">
                    <p style="margin: 0;">클릭한 경로: <strong>{{ clickedPathText }}</strong></p>
                </div>
            </div>
        `,
    }),
    tags: ['autodocs'],
    args: {
        paths: ['Home', 'Components', 'Breadcrumb'],
    },
    argTypes: {
        colorScheme,
        paths: {
            control: 'object',
            description: '루트부터 현재 페이지까지의 경로 라벨 배열. 마지막 항목이 현재 페이지',
        },
        disabled: {
            control: false,
            description:
                '조상 항목 비활성화 여부. boolean이면 전체에 적용되고, (path: string, index: number) => boolean 함수면 항목마다 조건부 적용',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsBreadcrumb>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 breadcrumb입니다. 조상 항목을 클릭하면 클릭한 단계까지의 경로가 click-path 이벤트로 전달됩니다.',
            },
        },
    },
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: 'colorScheme prop으로 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBreadcrumb },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${getColorSchemeTemplate(`
                    <vs-breadcrumb v-bind="args" color-scheme="{{ color }}" :paths="['Home', 'Components', '{{ color }}']" />
                `)}
            </div>
        `,
    }),
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'disabled prop에 true를 전달하면 모든 조상 항목이 비활성화됩니다.',
            },
        },
    },
    args: {
        disabled: true,
    },
};

export const DisabledByCondition: Story = {
    parameters: {
        docs: {
            description: {
                story: 'disabled에 함수를 전달하면 조건에 맞는 조상 항목만 비활성화됩니다. 이 예시에서는 첫 항목을 비활성화합니다.',
            },
        },
    },
    args: {
        paths: ['Home', 'Components', 'Navigation', 'Breadcrumb'],
        disabled: (_path: string, index: number) => index === 0,
    },
};

export const LongPaths: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '긴 라벨은 한 줄로 표시되고 공간이 부족하면 말줄임으로 잘립니다. ' +
                    '두 번째 예시는 $item.maxWidth로 항목 폭을 제한한 경우입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBreadcrumb },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 320px; border: 1px dashed #ccc; padding: 0.5rem;">
                <vs-breadcrumb v-bind="args" />
                <vs-breadcrumb v-bind="args" :style-set="{ $item: { maxWidth: '8rem' } }" />
            </div>
        `,
    }),
    args: {
        paths: LONG_PATHS,
    },
};

export const CustomSeparator: Story = {
    parameters: {
        docs: {
            description: {
                story: 'separator 슬롯으로 기본 Chevron 아이콘을 다른 구분자로 바꿀 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBreadcrumb },
        setup() {
            return { args };
        },
        template: `
            <vs-breadcrumb v-bind="args">
                <template #separator>/</template>
            </vs-breadcrumb>
        `,
    }),
};

export const CustomItem: Story = {
    parameters: {
        docs: {
            description: {
                story: 'item 슬롯으로 항목 라벨을 바꿀 수 있습니다. 슬롯은 항목 안쪽만 바꾸므로 클릭 동작은 유지됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsBreadcrumb },
        setup() {
            return { args };
        },
        template: `
            <vs-breadcrumb v-bind="args">
                <template #item="{ path, index, isCurrent }">
                    <span :style="{ fontStyle: isCurrent ? 'normal' : 'italic' }">{{ index + 1 }}. {{ path }}</span>
                </template>
            </vs-breadcrumb>
        `,
    }),
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '전역에 등록한 styleSet 이름(myStyleSet)을 전달해 미리 정의된 스타일을 적용합니다.',
            },
        },
    },
    args: {
        styleSet: 'myStyleSet',
    },
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: 'styleSet prop에 스타일 객체를 직접 전달해 목록, 항목(현재 항목은 $item.$current), 구분자를 꾸밀 수 있습니다.',
            },
        },
    },
    args: {
        paths: ['Home', 'Documentation', 'Components', 'Navigation', 'Breadcrumb'],
        styleSet: {
            $list: { gap: '0.25rem 0.75rem' },
            $item: {
                color: '#e91e63',
                $current: { color: '#880e4f', fontWeight: '700' },
            },
            $separator: { color: '#f48fb1' },
        },
    },
};
