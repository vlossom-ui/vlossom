import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { useVlossom } from '@/framework';
import VsButton from '@/components/vs-button/VsButton.vue';

const meta: Meta = {
    title: 'Plugins/Alert Plugin',
    parameters: {
        docs: {
            description: {
                component:
                    'Alert Plugin은 간단한 확인 알림을 Promise 기반으로 제공하여 사용자에게 메시지를 전달하고 확인 입력을 기다릴 때 사용합니다.',
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
                story: '기본 알림과 색상/버튼 텍스트를 커스터마이징한 알림을 확인할 수 있는 예시입니다.',
            },
        },
    },
    render: () => ({
        components: { VsButton },
        setup() {
            const $vs = useVlossom();

            async function handleOpenBasic() {
                await $vs.alert.open('변경 내용이 저장되었습니다.');
            }

            async function handleOpenCustom() {
                await $vs.alert.open('프로젝트가 성공적으로 생성되었습니다.', {
                    colorScheme: 'emerald',
                    okText: '확인했어요',
                });
            }

            return {
                handleOpenBasic,
                handleOpenCustom,
            };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 320px;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <vs-button @click="handleOpenBasic">Open Alert</vs-button>
                    <vs-button color-scheme="emerald" @click="handleOpenCustom">Open Alert (Custom)</vs-button>
                </div>
            </div>
        `,
    }),
};
