import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { useVlossom } from '@/framework';
import VsTextWrap from './../VsTextWrap.vue';
import type { VsTextWrapStyleSet } from './../types';

const meta: Meta<typeof VsTextWrap> = {
    title: 'Components/Base Components/VsTextWrap',
    component: VsTextWrap,
    parameters: {
        docs: {
            description: {
                component: 'VsTextWrap은 텍스트를 감싸고 복사/링크 기능을 제공하는 컴포넌트입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextWrap },
        setup() {
            const preDefinedStyleSet: VsTextWrapStyleSet = {
                copyIcon: {
                    color: '#394867',
                    width: '1.6rem',
                    height: '1.6rem',
                },
                linkIcon: {
                    color: '#526d82',
                    width: '1.6rem',
                    height: '1.6rem',
                },
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsTextWrap: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-text-wrap v-bind="args">This is text wrap.</vs-text-wrap>',
    }),
    tags: ['autodocs'],
    argTypes: {
        copy: {
            control: 'boolean',
            description: '복사 버튼 표시 여부',
        },
        link: {
            control: 'text',
            description: '링크 URL',
        },
        width: {
            control: 'text',
            description: '텍스트 영역 너비',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsTextWrap>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 텍스트 랩입니다. 텍스트를 감싸는 기본 기능을 제공합니다.',
            },
        },
    },
};

export const WithCopy: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '복사 버튼이 있는 텍스트 랩입니다. ' +
                    'copy prop을 true로 설정하면 복사 버튼이 표시되며, ' +
                    '클릭 시 HTML 태그를 제거한 순수 텍스트가 클립보드에 복사됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextWrap },
        setup() {
            return { args };
        },
        template: `
            <vs-text-wrap v-bind="args">
                <div>If you want to <b>copy</b> this text, <b>click</b> the <i>button.</i></div>
            </vs-text-wrap>
        `,
    }),
    args: {
        copy: true,
    },
};

export const WithLink: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '링크 버튼이 있는 텍스트 랩입니다. ' +
                    'link prop에 URL을 지정하면 링크 버튼이 표시되며, ' +
                    '클릭 시 새 탭에서 해당 URL이 열립니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextWrap },
        setup() {
            return { args };
        },
        template: '<vs-text-wrap v-bind="args">https://google.com</vs-text-wrap>',
    }),
    args: {
        link: 'https://google.com',
    },
};

export const WithWidth: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '너비가 지정된 텍스트 랩입니다. ' +
                    'width prop으로 텍스트 영역의 너비를 조절할 수 있으며, ' +
                    '긴 텍스트는 말줄임표로 표시됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextWrap },
        setup() {
            return { args };
        },
        template:
            '<vs-text-wrap v-bind="args">Lorem ipsum dolor sit amet, ' + 'consectetur adipisicing elit</vs-text-wrap>',
    }),
    args: {
        width: '310px',
    },
};

export const WithActionsSlot: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'actions 슬롯을 사용하여 커스텀 버튼을 추가한 예시입니다. ' +
                    '복사/링크 버튼 앞에 원하는 액션 버튼을 자유롭게 추가할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextWrap },
        setup() {
            function handleStar() {
                alert('즐겨찾기에 추가되었습니다!');
            }

            function handleShare() {
                alert('공유 기능 실행!');
            }

            return { args, handleStar, handleShare };
        },
        template: `
            <vs-text-wrap v-bind="args">
                https://example.com
                <template #actions>
                    <button 
                        @click="handleStar"
                        style="
                            padding: 0.2rem 0.5rem;
                            margin-right: 0.25rem;
                            border: 1px solid #ccc;
                            border-radius: 0.25rem;
                            background: white;
                            cursor: pointer;
                            font-size: 1.2rem;
                        "
                        title="즐겨찾기"
                    >
                        ⭐
                    </button>
                    <button 
                        @click="handleShare"
                        style="
                            padding: 0.2rem 0.5rem;
                            margin-right: 0.25rem;
                            border: 1px solid #ccc;
                            border-radius: 0.25rem;
                            background: white;
                            cursor: pointer;
                            font-size: 1.2rem;
                        "
                        title="공유"
                    >
                        📤
                    </button>
                </template>
            </vs-text-wrap>
        `,
    }),
    args: {
        copy: true,
        link: 'https://example.com',
    },
};

export const AllFeatures: Story = {
    parameters: {
        docs: {
            description: {
                story: '모든 기능이 활성화된 텍스트 랩입니다. 복사, 링크, 커스텀 액션이 모두 포함됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsTextWrap },
        setup() {
            function handleCustomAction() {
                console.log('커스텀 액션 실행');
            }

            return { args, handleCustomAction };
        },
        template: `
            <vs-text-wrap v-bind="args">
                https://example.com
                <template #actions>
                    <button 
                        @click="handleCustomAction"
                        style="
                            padding: 0.2rem 0.5rem;
                            margin-right: 0.25rem;
                            border: 1px solid #ccc;
                            border-radius: 0.25rem;
                            background: white;
                            cursor: pointer;
                        "
                    >
                        🔔
                    </button>
                </template>
            </vs-text-wrap>
        `,
    }),
    args: {
        copy: true,
        link: 'https://example.com',
        width: '200px',
    },
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '인라인 스타일 객체를 사용한 커스텀 텍스트 랩입니다. ' +
                    'styleSet prop에 직접 스타일 객체를 전달하여 아이콘 색상과 크기를 커스터마이징할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: {
            copyIcon: {
                color: '#394867',
                width: '2rem',
                height: '2rem',
            },
            linkIcon: {
                color: '#526d82',
                width: '2rem',
                height: '2rem',
            },
        },
        copy: true,
        link: 'https://google.com',
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '미리 정의된 스타일 세트를 사용한 텍스트 랩입니다. ' +
                    'useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myStyleSet',
        copy: true,
        link: 'https://google.com',
    },
};
