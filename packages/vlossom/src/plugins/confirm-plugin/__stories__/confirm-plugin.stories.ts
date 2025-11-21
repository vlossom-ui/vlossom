import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { useVlossom } from '@/framework';
import VsButton from '@/components/vs-button/VsButton.vue';

const meta: Meta = {
    title: 'Plugins/Confirm Plugin',
    parameters: {
        docs: {
            description: {
                component:
                    'Confirm Plugin은 확인 다이얼로그를 Promise 기반으로 제공하는 플러그인입니다. <br />' +
                    'useVlossom()에서 confirm 인스턴스를 가져와 open 메서드를 호출하면 사용자의 응답을 받을 수 있습니다.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '가장 기본적인 확인 다이얼로그 사용 예시입니다. 버튼을 눌러 확인/취소 결과를 확인하세요.',
            },
        },
    },
    render: () => ({
        components: { VsButton },
        setup() {
            const $vs = useVlossom();
            const resultText = ref('아직 응답 없음');

            async function handleOpenDefault() {
                const confirmed = await $vs.confirm.open('정말로 진행하시겠습니까?');
                resultText.value = confirmed ? '사용자가 확인을 선택했습니다.' : '사용자가 취소를 선택했습니다.';
            }

            async function handleOpenCustom() {
                const confirmed = await $vs.confirm.open('이 작업은 되돌릴 수 없습니다.', {
                    colorScheme: 'red',
                    okText: '삭제',
                    cancelText: '취소',
                    swapButtons: true,
                    dimmed: true,
                });
                resultText.value = confirmed ? '삭제를 진행합니다.' : '삭제를 취소했습니다.';
            }

            return {
                handleOpenDefault,
                handleOpenCustom,
                resultText,
            };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 320px;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <vs-button @click="handleOpenDefault">Open Confirm</vs-button>
                    <vs-button color-scheme="red" @click="handleOpenCustom">Open Confirm (Danger)</vs-button>
                </div>
                <div style="font-size: 0.875rem; color: var(--vs-gray-700, #4b5563);">
                    {{ resultText }}
                </div>
            </div>
        `,
    }),
};
