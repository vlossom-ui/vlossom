import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { useVlossom } from '@/framework';
import VsButton from '@/components/vs-button/VsButton.vue';

const meta: Meta = {
    title: 'Plugins/Toast Plugin',
    parameters: {
        docs: {
            description: {
                component:
                    'Toast Plugin은 토스트 알림 메시지를 표시하기 위한 플러그인입니다. <br />' +
                    'useVlossom()을 통해 접근할 수 있으며, show, info, success, warning, error 등의 메서드를 제공합니다.',
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
                story: '토스트 플러그인의 기본 사용 예시입니다. 각 버튼을 클릭하여 다양한 타입의 토스트를 확인할 수 있습니다.',
            },
        },
    },
    render: () => ({
        components: { VsButton },
        setup() {
            const $vs = useVlossom();

            function handleShow() {
                $vs.toast.show('기본 토스트 메시지입니다.');
            }

            function handleInfo() {
                $vs.toast.info('정보 메시지입니다.');
            }

            function handleSuccess() {
                $vs.toast.success('성공 메시지입니다.');
            }

            function handleWarning() {
                $vs.toast.warning('경고 메시지입니다.');
            }

            function handleError() {
                $vs.toast.error('에러 메시지입니다.');
            }

            function handleClear() {
                $vs.toast.clear();
            }

            return {
                handleShow,
                handleInfo,
                handleSuccess,
                handleWarning,
                handleError,
                handleClear,
            };
        },
        template: `
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <vs-button @click="handleShow">Show</vs-button>
                <vs-button color-scheme="cyan" @click="handleInfo">Info</vs-button>
                <vs-button color-scheme="green" @click="handleSuccess">Success</vs-button>
                <vs-button color-scheme="yellow" @click="handleWarning">Warning</vs-button>
                <vs-button color-scheme="red" @click="handleError">Error</vs-button>
                <vs-button outline @click="handleClear">Clear</vs-button>
            </div>
        `,
    }),
};
