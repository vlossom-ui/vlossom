import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { useVlossom } from '@/framework';
import VsButton from '@/components/vs-button/VsButton.vue';

const meta: Meta = {
    title: 'Plugins/Prompt Plugin',
    parameters: {
        docs: {
            description: {
                component:
                    'Prompt Plugin은 입력 다이얼로그를 Promise 기반으로 제공하여 사용자로부터 문자열이나 숫자를 손쉽게 입력받을 수 있도록 돕습니다. <br />' +
                    'useVlossom()에서 prompt 인스턴스를 가져와 open 메서드를 호출하면 입력 값과 취소 여부를 제어할 수 있습니다.',
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
                story: '가장 기본적인 입력 다이얼로그와 몇 가지 옵션을 적용한 예시입니다. 버튼을 눌러 입력 값과 검증 흐름을 확인하세요.',
            },
        },
    },
    render: () => ({
        components: { VsButton },
        setup() {
            const $vs = useVlossom();
            const resultText = ref('아직 입력 없음');

            async function handleOpenBasic() {
                try {
                    const value = await $vs.prompt.open('프로필 이름을 입력해주세요.');
                    resultText.value =
                        value === null || value === '' ? '사용자가 입력을 취소했습니다.' : `입력 값: ${value}`;
                } catch {
                    resultText.value = '입력이 검증을 통과하지 못했습니다.';
                }
            }

            async function handleOpenCustom() {
                try {
                    const value = await $vs.prompt.open('1에서 10 사이의 숫자를 입력해주세요.', {
                        inputType: 'number',
                        inputInitialValue: 3,
                        inputPlaceholder: '예: 5',
                        inputLabel: '최대 시도 횟수',
                        inputRules: [
                            (v) => {
                                if (v === null || v === '') {
                                    return '값을 입력해주세요.';
                                }
                                const num = Number(v);
                                if (!Number.isInteger(num)) {
                                    return '정수를 입력해주세요.';
                                }
                                if (num < 1 || num > 10) {
                                    return '1에서 10 사이의 값을 입력해주세요.';
                                }
                                return '';
                            },
                        ],
                        inputMessages: [
                            {
                                state: 'info',
                                text: '1에서 10 사이의 정수만 허용됩니다.',
                            },
                        ],
                        buttonOkText: '적용',
                        buttonCancelText: '취소',
                        swapButtons: true,
                    });

                    if (value === null || value === '') {
                        resultText.value = '사용자가 취소했습니다.';
                        return;
                    }

                    resultText.value = `사용자가 입력한 숫자: ${value}`;
                } catch {
                    resultText.value = '입력이 검증을 통과하지 못했습니다.';
                }
            }

            return {
                handleOpenBasic,
                handleOpenCustom,
                resultText,
            };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 360px;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <vs-button @click="handleOpenBasic">Open Prompt</vs-button>
                    <vs-button color-scheme="indigo" @click="handleOpenCustom">Open Prompt (Custom)</vs-button>
                </div>
                <div style="font-size: 0.875rem; color: var(--vs-gray-700, #4b5563);">
                    {{ resultText }}
                </div>
            </div>
        `,
    }),
};
