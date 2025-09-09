import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters, LOREM_IPSUM } from '@/storybook';
import { useVlossom } from '@/framework';
import VsPage from './../VsPage.vue';
import type { VsPageStyleSet } from '../types';

const meta: Meta<typeof VsPage> = {
    title: 'Components/Layout Components/VsPage',
    component: VsPage,
    parameters: {
        docs: {
            description: {
                component:
                    'VsPage는 페이지의 기본 레이아웃을 제공하는 컴포넌트입니다. ' +
                    '페이지 제목, 설명, 본문 콘텐츠를 구조화하여 표시할 수 있으며, 각 영역별로 세밀한 스타일 커스터마이징을 지원합니다.',
            },
        },
    },
    argTypes: {
        title: {
            control: 'text',
            description: 'Title slot content',
            table: {
                category: 'slots',
            },
        },
        description: {
            control: 'text',
            description: 'Description slot content',
            table: {
                category: 'slots',
            },
        },
        default: {
            control: 'text',
            description: 'Default slot content',
            table: {
                category: 'slots',
            },
        },
    } as any,
    args: {
        title: 'Page Title',
        description: 'Page Description',
        default: 'This is Page Content.',
    } as any,
    render: (args: any) => ({
        components: { VsPage },
        setup() {
            const preDefinedStyleSet: VsPageStyleSet = {
                padding: '2rem 3rem',
                fontColor: '#2c3e50',
                fontSize: '1rem',
                title: {
                    fontColor: '#1976d2',
                    fontSize: '2rem',
                    fontWeight: '700',
                    padding: '0 0 1rem 0',
                },
                description: {
                    fontColor: '#666666',
                    fontSize: '1.1rem',
                    fontWeight: '400',
                    padding: '0 0 2rem 0',
                },
            } as const;

            useVlossom().styleSet = {
                myPageStyleSet: { VsPage: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: `
        <vs-page v-bind="args">
            <template #title><h2>{{ args.title }}</h2></template>
            <template #description>{{ args.description }}</template>
            {{ args.default }}
        </vs-page>
        `,
    }),
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VsPage>;

export const Default: Story = {
    args: {
        styleSet: {},
    },
    parameters: {
        docs: {
            description: {
                story: '기본 페이지 레이아웃입니다. 제목, 설명, 본문으로 구성된 표준적인 페이지 구조를 제공합니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
};

export const WithoutSlots: Story = {
    parameters: {
        docs: {
            description: {
                story: '제목과 설명 없이 본문 콘텐츠만 있는 페이지입니다. 간단한 콘텐츠 영역이 필요할 때 사용합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsPage },
        setup() {
            return { args };
        },
        template: `
        <vs-page v-bind="args">
            A simple page with content only, without title and description slots.
        </vs-page>
    `,
    }),
};

export const OnlyTitle: Story = {
    parameters: {
        docs: {
            description: {
                story: '제목만 있는 페이지입니다. 설명 없이 제목과 본문만으로 구성된 페이지 레이아웃입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsPage },
        setup() {
            return { args };
        },
        template: `
        <vs-page v-bind="args">
            <template #title><h1>Page with Title Only</h1></template>
            A page has only a title slot filled. The description slot is empty, so it won't be rendered.
        </vs-page>
    `,
    }),
};

export const OnlyDescription: Story = {
    parameters: {
        docs: {
            description: {
                story: '설명만 있는 페이지입니다. 제목 없이 설명과 본문만으로 구성된 페이지 레이아웃입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsPage },
        setup() {
            return { args };
        },
        template: `
        <vs-page v-bind="args">
            <template #description>A page has only a description slot filled. The title slot is empty.</template>
            This is the main content. Only description and content are shown in this layout.
        </vs-page>
    `,
    }),
};

export const LongContent: Story = {
    parameters: {
        docs: {
            description: {
                story: '긴 콘텐츠를 포함한 페이지 예시입니다. 스크롤이 필요한 장문의 콘텐츠에서 어떻게 표시되는지 확인할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsPage },
        setup() {
            return { args };
        },
        template: `
        <vs-page v-bind="args">
            <template #title><h1>Long Content Page</h1></template>
            <template #description>This page demonstrates how VsPage handles long content with proper spacing and layout.</template>
            ${LOREM_IPSUM}
        </vs-page>
    `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 페이지입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    args: {
        styleSet: {
            padding: '1.2rem 3rem',
            fontColor: '#3559e0',
            fontSize: '1.1rem',
            fontWeight: '500',
        },
    },
};

export const NestedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '제목과 설명 영역에 개별적으로 다른 스타일을 적용한 페이지입니다. title, description 속성을 사용하여 각 영역별 세밀한 스타일링이 가능합니다.',
            },
        },
    },
    args: {
        styleSet: {
            padding: '2rem',
            title: {
                fontColor: '#e91e63',
                fontSize: '2.5rem',
                fontWeight: '800',
                padding: '0 0 1.5rem 0',
            },
            description: {
                fontColor: '#757575',
                fontSize: '1.2rem',
                fontWeight: '300',
                padding: '1.5rem 0 2rem 0',
            },
        },
    },
    render: (args: any) => ({
        components: { VsPage },
        setup() {
            return { args };
        },
        template: `
        <vs-page v-bind="args">
            <template #title>Styled Page Title</template>
            <template #description>Styled description</template>
            This is the main content area.
        </vs-page>
    `,
    }),
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 페이지입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myPageStyleSet',
    },
};
