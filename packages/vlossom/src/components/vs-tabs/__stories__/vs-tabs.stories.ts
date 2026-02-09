import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsTabs from './../VsTabs.vue';
import VsGrid from '@/components/vs-grid/VsGrid.vue';
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
                variables: { gap: '0.5rem' },
                scrollButton: {
                    variables: { padding: '0.4rem' },
                    component: {
                        backgroundColor: '#1565c0',
                        borderRadius: '4px',
                    },
                },
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
            description: '탭 항목 배열 (기본값: [])',
        },
        modelValue: {
            control: 'number',
            description: '선택된 탭 인덱스 (v-model)',
        },
        width: {
            control: 'text',
            description: '탭 너비 (반응형 지원)',
        },
        grid: {
            control: 'text',
            description: '그리드 컬럼 수 (반응형 지원)',
        },
        height: {
            control: 'text',
            description: '탭 높이',
        },
        dense: {
            control: 'boolean',
            description: '작은 크기',
        },
        disabled: {
            control: false,
            description:
                '탭 비활성화 여부. boolean이면 전체 탭에 적용되고, (tab: string, index: number) => boolean 함수면 각 탭마다 조건부 적용',
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

export const DisabledAll: Story = {
    parameters: {
        docs: {
            description: {
                story: '모든 탭이 비활성화된 상태입니다. disabled prop에 true를 전달하면 전체 탭을 비활성화할 수 있습니다.',
            },
        },
    },
    args: {
        tabs: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'],
        disabled: true,
        modelValue: 0,
    },
};

export const DisabledTabs: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '일부 탭이 비활성화된 상태입니다. disabled prop에 함수를 전달하여 조건부로 비활성화할 수 있습니다. ' +
                    '비활성화된 탭은 클릭할 수 없으며 키보드 네비게이션에서도 건너뜁니다.',
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

export const Width: Story = {
    parameters: {
        docs: {
            description: {
                story: 'width prop을 사용하여 탭 너비를 제한할 수 있습니다.',
            },
        },
    },
    args: {
        tabs: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'],
        width: '300px',
    },
};

export const Height: Story = {
    parameters: {
        docs: {
            description: {
                story: 'height prop을 사용하여 탭의 높이를 지정할 수 있습니다. 수평 탭에서는 탭 자체의 높이를, 수직 탭에서는 전체 탭 컨테이너의 높이를 지정합니다.',
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
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <div>
                    <h4 style="margin: 0 0 1rem 0; font-size: 1rem; font-weight: 600;">수평 탭</h4>
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; color: #666;">Default (auto)</p>
                            <vs-tabs v-bind="args" v-model="selectedTab" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; color: #666;">Height: 60px</p>
                            <vs-tabs v-bind="args" v-model="selectedTab" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" height="60px" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; color: #666;">Height: 80 (숫자)</p>
                            <vs-tabs v-bind="args" v-model="selectedTab" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" :height="80" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; color: #666;">Height: 4rem</p>
                            <vs-tabs v-bind="args" v-model="selectedTab" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" height="4rem" />
                        </div>
                    </div>
                </div>
                <div>
                    <h4 style="margin: 0 0 1rem 0; font-size: 1rem; font-weight: 600;">수직 탭</h4>
                    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
                        <div>
                            <p style="margin: 0 0 0.5rem 0; color: #666;">Height: 200px</p>
                            <vs-tabs v-bind="args" v-model="selectedTab" :tabs="['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4']" vertical height="200px" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; color: #666;">Height: 300px</p>
                            <vs-tabs v-bind="args" v-model="selectedTab" :tabs="['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4']" vertical height="300px" />
                        </div>
                        <div>
                            <p style="margin: 0 0 0.5rem 0; color: #666;">Height: 400 (숫자)</p>
                            <vs-tabs v-bind="args" v-model="selectedTab" :tabs="['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4']" vertical :height="400" />
                        </div>
                    </div>
                </div>
            </div>
        `,
    }),
};

export const Grid: Story = {
    parameters: {
        docs: {
            description: {
                story: 'grid prop을 사용하여 12컬럼 그리드 시스템 내에서 탭이 차지할 컬럼 수를 지정할 수 있습니다. vs-grid 컴포넌트와 함께 사용됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTabs, VsGrid },
        setup() {
            const selectedTab = ref(0);
            return { args, selectedTab };
        },
        template: `
            <vs-grid column-gap="16px" row-gap="16px">
                <vs-tabs v-bind="args" v-model="selectedTab" :grid="8" />
                <vs-tabs v-bind="args" v-model="selectedTab" :grid="4" />
                <vs-tabs v-bind="args" v-model="selectedTab" :grid="6" />
                <vs-tabs v-bind="args" v-model="selectedTab" :grid="6" />
            </vs-grid>
        `,
    }),
    args: {
        tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
    },
};

export const ResponsiveWidth: Story = {
    parameters: {
        docs: {
            description: {
                story: '반응형 width를 사용하여 화면 크기에 따라 탭 너비를 조절할 수 있습니다. 브레이크포인트 객체를 전달합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTabs, VsGrid },
        setup() {
            const selectedTab = ref(0);
            return { args, selectedTab };
        },
        template: `
            <vs-grid>
                <vs-tabs v-bind="args" v-model="selectedTab" />
            </vs-grid>
            <div style="margin-top: 2rem; padding: 1rem; background-color: #f5f5f5; border-radius: 4px;">
                <p style="margin: 0;">선택된 탭: <strong>{{ args.tabs[selectedTab] }}</strong></p>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #666;">
                    화면 크기를 조절하면 탭 너비가 자동으로 변경됩니다.
                </p>
            </div>
        `,
    }),
    args: {
        tabs: ['Home', 'Profile', 'Settings', 'Messages'],
        width: {
            xs: '100%',
            sm: '90%',
            md: '70%',
            lg: '50%',
            xl: '30%',
        },
    },
};

export const ResponsiveGrid: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '반응형 grid를 사용하여 화면 크기에 따라 탭이 차지할 그리드 컬럼 수를 조절할 수 있습니다. ' +
                    '모바일(xs/sm)에서는 전체 너비(12컬럼), 태블릿(md)에서는 8컬럼, 데스크톱(lg/xl)에서는 6컬럼을 차지합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTabs, VsGrid },
        setup() {
            return { args };
        },
        template: `
            <vs-grid column-gap="16px" row-gap="16px">
                <vs-tabs 
                    v-bind="args" 
                />
                <vs-tabs 
                    v-bind="args" 
                />
                <vs-tabs 
                    v-bind="args" 
                />
                <vs-tabs 
                    v-bind="args" 
                />
                <vs-tabs 
                    v-bind="args" 
                />
                <vs-tabs 
                    v-bind="args" 
                />
            </vs-grid>
        `,
    }),
    args: {
        tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
        grid: {
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
            xl: 2,
        },
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
                story:
                    '인라인 스타일 객체를 사용한 커스텀 탭입니다.' +
                    'styleSet prop에 variables(gap), tab, activeTab, scrollButton을 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    args: {
        tabs: ['Custom 1', 'Custom 2', 'Custom 3', 'Custom 4', 'Custom 5', 'Custom 6', 'Custom 7', 'Custom 8'],
        scrollButtons: 'show',
        styleSet: {
            variables: { gap: '1rem' },
            tab: { fontWeight: '600' },
            activeTab: { backgroundColor: '#f0e6f5' },
            scrollButton: {
                variables: { padding: '0.4rem' },
                component: {
                    backgroundColor: '#b968c7',
                    borderRadius: '8px',
                },
            },
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
        tabs: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6'],
        scrollButtons: 'show',
        styleSet: 'myStyleSet',
    },
};
