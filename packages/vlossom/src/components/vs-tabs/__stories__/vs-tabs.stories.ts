import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsTabs from './../VsTabs.vue';
import type { VsTabsStyleSet } from './../types';

const meta: Meta<typeof VsTabs> = {
    title: 'Components/Base Components/VsTabs',
    component: VsTabs,
    parameters: {
        docs: {
            description: {
                component:
                    'VsTabs는 탭 네비게이션 컴포넌트입니다. 수평/수직 레이아웃, 스크롤 버튼, 키보드 네비게이션을 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTabs },
        setup() {
            const preDefinedStyleSet: VsTabsStyleSet = {
                backgroundColor: '#1e88e5',
                gap: '0.5rem',
                height: '3rem',
                padding: '0 1.5rem',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsTabs: { ...preDefinedStyleSet } },
            };

            const selectedTab = ref(args.modelValue || 0);

            return { args, selectedTab };
        },
        template: `
            <div>
                <vs-tabs v-bind="args" v-model="selectedTab" />
                <div style="margin-top: 2rem; padding: 1rem; background-color: #f5f5f5; border-radius: 4px;">
                    <p style="margin: 0;">선택된 탭 인덱스: <strong>{{ selectedTab }}</strong></p>
                    <p style="margin: 0.5rem 0 0 0;">선택된 탭: <strong>{{ args.tabs[selectedTab] }}</strong></p>
                </div>
            </div>
        `,
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        tabs: {
            control: 'object',
            description: '탭 항목 배열',
        },
        modelValue: {
            control: 'number',
            description: '선택된 탭 인덱스 (v-model)',
        },
        dense: {
            control: 'boolean',
            description: '작은 크기',
        },
        disabled: {
            control: false,
            description: '탭 비활성화 여부를 판별하는 함수. (tab: string, index: number) => boolean 형태',
        },
        primary: {
            control: 'boolean',
            description: 'primary 색상 테마',
        },
        scrollButtons: {
            control: 'select',
            options: ['hide', 'show', 'auto'],
            description: '스크롤 버튼 표시 방식',
        },
        vertical: {
            control: 'boolean',
            description: '수직 레이아웃',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsTabs>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 탭 네비게이션입니다. 탭을 클릭하거나 키보드 화살표 키로 이동할 수 있습니다.',
            },
        },
    },
    args: {
        tabs: ['Home', 'Profile', 'Settings', 'Messages'],
        modelValue: 0,
    },
};

export const Dense: Story = {
    parameters: {
        docs: {
            description: {
                story: '작은 크기의 탭입니다. 좁은 공간에 적합합니다.',
            },
        },
    },
    args: {
        tabs: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'],
        dense: true,
    },
};

export const Primary: Story = {
    parameters: {
        docs: {
            description: {
                story: 'primary 색상 테마가 적용된 탭입니다. 선택된 탭에 primary 색상이 강조됩니다.',
            },
        },
    },
    args: {
        tabs: ['Home', 'Profile', 'Settings', 'Messages'],
        primary: true,
        modelValue: 0,
    },
};

export const DisabledTabs: Story = {
    parameters: {
        docs: {
            description: {
                story: '일부 탭이 비활성화된 상태입니다. 비활성화된 탭은 클릭할 수 없으며 키보드 네비게이션에서도 건너뜁니다.',
            },
        },
    },
    args: {
        tabs: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5'],
        disabled: (tab: string, index: number) => [1, 3].includes(index),
        modelValue: 0,
    },
};

export const DisabledByCondition: Story = {
    parameters: {
        docs: {
            description: {
                story: 'disabled 함수를 사용하여 조건에 따라 동적으로 탭을 비활성화할 수 있습니다. 이 예시에서는 짝수 인덱스의 탭을 비활성화합니다.',
            },
        },
    },
    args: {
        tabs: ['Tab 0', 'Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'],
        disabled: (tab: string, index: number) => index % 2 === 0,
    },
};

export const Vertical: Story = {
    parameters: {
        docs: {
            description: {
                story: '수직 레이아웃의 탭입니다. 세로 방향으로 배치되며 위/아래 화살표 키로 이동할 수 있습니다.',
            },
        },
    },
    args: {
        tabs: ['Dashboard', 'Profile', 'Settings', 'Messages', 'Notifications'],
        vertical: true,
    },
};

export const WithScrollButtons: Story = {
    parameters: {
        docs: {
            description: {
                story: '스크롤 버튼이 항상 표시되는 탭입니다. 많은 탭 항목을 탐색할 때 유용합니다.',
            },
        },
    },
    args: {
        tabs: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6', 'Tab 7', 'Tab 8', 'Tab 9', 'Tab 10'],
        scrollButtons: 'show',
    },
};

export const AutoScrollButtons: Story = {
    parameters: {
        docs: {
            description: {
                story: '스크롤이 필요한 경우에만 버튼이 표시되는 탭입니다. 화면 크기를 조절하면 버튼이 자동으로 표시/숨김됩니다.',
            },
        },
    },
    args: {
        tabs: ['Dashboard', 'Analytics', 'Reports', 'Settings', 'Profile', 'Messages', 'Notifications', 'Calendar'],
        scrollButtons: 'auto',
    },
};

export const CustomSlot: Story = {
    parameters: {
        docs: {
            description: {
                story: '커스텀 슬롯을 사용하여 탭 내용을 커스터마이징할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTabs },
        setup() {
            const selectedTab = ref(0);
            return { args, selectedTab };
        },
        template: `
            <div>
                <vs-tabs v-bind="args" v-model="selectedTab">
                    <template #tab="{ tab, index }">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                            <span>{{ ['🏠', '👤', '⚙️', '✉️'][index] }}</span>
                            <span>{{ tab }}</span>
                        </span>
                    </template>
                </vs-tabs>
                <div style="margin-top: 2rem; padding: 1rem; background-color: #f5f5f5; border-radius: 4px;">
                    <p style="margin: 0;">선택된 탭: <strong>{{ args.tabs[selectedTab] }}</strong></p>
                </div>
            </div>
        `,
    }),
    args: {
        tabs: ['Home', 'Profile', 'Settings', 'Messages'],
    },
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 탭들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsTabs },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-tabs v-bind="args" color-scheme="{{ color }}" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" />
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 탭입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    args: {
        tabs: ['Custom 1', 'Custom 2', 'Custom 3'],
        styleSet: {
            backgroundColor: '#e188e5',
            gap: '1rem',
            height: '3.5rem',
            padding: '0 2rem',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 탭입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
        styleSet: 'myStyleSet',
    },
};
