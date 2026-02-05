import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import VsSearchInput from '../VsSearchInput.vue';

const meta: Meta<typeof VsSearchInput> = {
    title: 'Components/Input Components/VsSearchInput',
    component: VsSearchInput,
    parameters: {
        docs: {
            description: {
                component:
                    'VsSearchInput은 검색 기능을 제공하는 입력 컴포넌트입니다. ' +
                    'vs-input을 기반으로 만들어졌으며, 대소문자 구분 및 정규식 검색 옵션을 제공합니다. ' +
                    '입력 시 debounce를 적용하여 400ms마다 search 이벤트를 emit합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSearchInput },
        setup() {
            function onSearch(value: string) {
                console.log('Search:', value);
            }
            return { args, onSearch };
        },
        template: '<vs-search-input v-bind="args" @search="onSearch" />',
    }),
    tags: ['autodocs'],
    argTypes: {
        // 공통 Props
        colorScheme,
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
            table: { category: 'Common Props' },
        },
        readonly: {
            control: 'boolean',
            description: '읽기 전용 상태',
            table: { category: 'Common Props' },
        },
        placeholder: {
            control: 'text',
            description: '플레이스홀더 텍스트',
            table: { category: 'Common Props' },
        },
        // Layout
        width: {
            control: 'text',
            description: 'Input 너비 (string | number | Breakpoints)',
            table: { category: 'Layout' },
        },
        grid: {
            control: 'text',
            description: 'Grid 설정 (string | number | Breakpoints)',
            table: { category: 'Layout' },
        },

        // Style
        styleSet: {
            control: 'object',
            description: '커스텀 스타일 객체',
            table: { category: 'Style' },
        },

        // Search Props
        useCaseSensitive: {
            control: 'boolean',
            description: '대소문자 구분 토글 버튼 표시 여부',
            table: { category: 'Search Props', defaultValue: { summary: 'false' } },
        },
        useRegex: {
            control: 'boolean',
            description: '정규식 토글 버튼 표시 여부',
            table: { category: 'Search Props', defaultValue: { summary: 'false' } },
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsSearchInput>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 검색 입력 필드입니다.',
            },
        },
    },
    args: {
        placeholder: '검색어를 입력하세요',
    },
};

export const WithToggleOptions: Story = {
    parameters: {
        docs: {
            description: {
                story: '대소문자 구분 및 정규식 토글 버튼이 있는 검색 입력 필드입니다.',
            },
        },
    },
    args: {
        placeholder: '검색어를 입력하세요',
        useCaseSensitive: true,
        useRegex: true,
    },
};

export const MatchExample: Story = {
    parameters: {
        docs: {
            description: {
                story: 'match 메서드를 사용하여 텍스트를 필터링하는 예제입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSearchInput },
        setup() {
            const searchInputRef = ref();
            const searchText = ref('');
            const items = ref(['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew']);
            const filteredItems = ref([...items.value]);

            function onSearch(value: string) {
                searchText.value = value;
                if (!searchInputRef.value) {
                    return;
                }

                filteredItems.value = items.value.filter((item) => {
                    return searchInputRef.value.match(item);
                });
            }

            return {
                args,
                searchInputRef,
                searchText,
                filteredItems,
                onSearch,
            };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-search-input
                    ref="searchInputRef"
                    v-bind="args"
                    @search="onSearch"
                />
                <div style="padding: 1rem; background: #f5f5f5; border-radius: 0.5rem;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong>검색어:</strong> {{ searchText || '(없음)' }}
                    </div>
                    <div>
                        <strong>결과 ({{ filteredItems.length }}개):</strong>
                        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                            <li v-for="item in filteredItems" :key="item">{{ item }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `,
    }),
    args: {
        placeholder: '검색어를 입력하세요',
        useCaseSensitive: true,
        useRegex: true,
    },
};

export const DisabledAndReadonly: Story = {
    parameters: {
        docs: {
            description: {
                story: 'disabled, readonly 등의 상태를 표현할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSearchInput },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <vs-search-input placeholder="정상 상태" />
                <vs-search-input placeholder="비활성화 상태" disabled />
                <vs-search-input placeholder="읽기 전용 상태" readonly />
            </div>
        `,
    }),
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: 'colorScheme prop을 사용하여 다양한 색상 테마를 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsSearchInput },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-search-input color-scheme="{{ color }}" placeholder="{{ color }} 검색" use-case-sensitive use-regex />
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: 'styleSet prop을 사용하여 커스텀 스타일을 적용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSearchInput },
        setup() {
            return { args };
        },
        template: '<vs-search-input v-bind="args" />',
    }),
    args: {
        placeholder: '커스텀 검색 필드',
        useRegex: true,
        useCaseSensitive: true,
        styleSet: {
            variables: {
                height: '3.5rem',
            },
            input: {
                component: {
                    color: '#1565c0',
                    fontSize: '1.1rem',
                    padding: '0 1.5rem',
                },
                wrapper: {
                    component: {
                        backgroundColor: '#f0f8ff',
                        border: '2px solid #1e88e5',
                        borderRadius: '12px',
                    },
                },
            },
        },
    },
};
