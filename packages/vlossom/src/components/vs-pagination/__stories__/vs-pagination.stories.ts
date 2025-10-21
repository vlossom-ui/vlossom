import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import VsPagination from './../VsPagination.vue';

const meta: Meta<typeof VsPagination> = {
    title: 'Components/Base Components/VsPagination',
    component: VsPagination,
    parameters: {
        docs: {
            description: {
                component: 'VsPagination은 페이지 네비게이션을 위한 페이지네이션 컴포넌트입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsPagination },
        setup() {
            const currentPage = ref(args.modelValue || 0);
            return { args, currentPage };
        },
        template: `
            <div>
                <vs-pagination v-bind="args" v-model="currentPage" />
                <p style="margin-top: 1rem;">현재 페이지: {{ currentPage + 1 }}</p>
            </div>
        `,
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        length: {
            control: 'number',
            description: '전체 페이지 수',
        },
        showingLength: {
            control: 'number',
            description: '화면에 표시할 페이지 버튼 수',
        },
        edgeButtons: {
            control: 'boolean',
            description: '첫 페이지/마지막 페이지 버튼 표시 여부',
        },
        disabled: {
            control: 'boolean',
            description: '전체 페이지네이션 비활성화',
        },
        ghost: {
            control: 'boolean',
            description: '고스트 스타일 적용',
        },
        outline: {
            control: 'boolean',
            description: '아웃라인 스타일 적용',
        },
        modelValue: {
            control: 'number',
            description: '현재 페이지 (0-based)',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsPagination>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 페이지네이션입니다. 이전/다음 버튼과 페이지 번호를 표시합니다.',
            },
        },
    },
    args: {
        length: 10,
    },
};

export const WithEdgeButtons: Story = {
    parameters: {
        docs: {
            description: {
                story: '처음/마지막 페이지로 이동하는 버튼이 추가된 페이지네이션입니다.',
            },
        },
    },
    args: {
        length: 20,
        edgeButtons: true,
    },
};

export const LimitedShowingLength: Story = {
    parameters: {
        docs: {
            description: {
                story: 'showingLength prop을 사용하여 표시할 페이지 버튼 수를 제한할 수 있습니다.',
            },
        },
    },
    args: {
        length: 100,
        showingLength: 5,
        edgeButtons: true,
    },
};

export const Ghost: Story = {
    parameters: {
        docs: {
            description: {
                story: '투명한 배경의 고스트 스타일 페이지네이션입니다.',
            },
        },
    },
    args: {
        length: 10,
        ghost: true,
    },
};

export const Outline: Story = {
    parameters: {
        docs: {
            description: {
                story: '테두리만 있는 아웃라인 스타일 페이지네이션입니다.',
            },
        },
    },
    args: {
        length: 10,
        outline: true,
    },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: '비활성화된 페이지네이션입니다. 모든 버튼이 클릭 불가능합니다.',
            },
        },
    },
    args: {
        length: 10,
        disabled: true,
    },
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 페이지네이션입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsPagination },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${getColorSchemeTemplate(`
                    <div>
                        <p style="margin: 0 0 0.5rem 0;">{{ color }}</p>
                        <vs-pagination v-bind="args" color-scheme="{{ color }}" />
                    </div>
                `)}
            </div>
        `,
    }),
    args: {
        length: 10,
    },
};

export const CustomPageSlot: Story = {
    parameters: {
        docs: {
            description: {
                story: 'page 슬롯을 사용하여 페이지 번호 표시를 커스터마이징할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsPagination },
        setup() {
            const currentPage = ref(0);
            return { args, currentPage };
        },
        template: `
            <vs-pagination v-bind="args" v-model="currentPage">
                <template #page="{ page }">
                    Page {{ page }}
                </template>
            </vs-pagination>
        `,
    }),
    args: {
        length: 5,
    },
};

export const CustomNavigationIcons: Story = {
    parameters: {
        docs: {
            description: {
                story: '슬롯을 사용하여 네비게이션 버튼의 아이콘을 커스터마이징할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsPagination },
        setup() {
            const currentPage = ref(0);
            return { args, currentPage };
        },
        template: `
            <vs-pagination v-bind="args" v-model="currentPage">
                <template #first>⏮</template>
                <template #prev>◀</template>
                <template #next>▶</template>
                <template #last>⏭</template>
            </vs-pagination>
        `,
    }),
    args: {
        length: 10,
        edgeButtons: true,
    },
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: 'styleSet prop을 사용하여 페이지네이션의 스타일을 커스터마이징할 수 있습니다.',
            },
        },
    },
    args: {
        length: 10,
        styleSet: {
            gap: '2rem',
            pageButton: {
                borderRadius: '50%',
                width: '3rem',
                height: '3rem',
            },
            edgeButton: {
                borderRadius: '8px',
                padding: '0.6rem',
            },
        },
    },
};
