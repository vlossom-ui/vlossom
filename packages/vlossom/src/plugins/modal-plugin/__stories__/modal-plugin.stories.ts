import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { useVlossom } from '@/framework';
import VsButton from '@/components/vs-button/VsButton.vue';

const meta: Meta = {
    title: 'Plugins/Modal Plugin',
    parameters: {
        docs: {
            description: {
                component:
                    'Modal Plugin은 모달 다이얼로그를 표시하기 위한 플러그인입니다. <br />' +
                    'useVlossom()을 통해 접근할 수 있으며, open, close, closeWithId, clear 등의 메서드를 제공합니다.',
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
                story: '모달 플러그인의 기본 사용 예시입니다. 각 버튼을 클릭하여 모달을 열고 닫을 수 있습니다.',
            },
        },
    },
    render: () => ({
        components: { VsButton },
        setup() {
            const $vs = useVlossom();
            let currentModalId = '';

            function handleOpen() {
                currentModalId = $vs.modal.open('기본 모달 내용입니다.');
            }

            function handleOpenWithOptions() {
                currentModalId = $vs.modal.open('옵션이 적용된 모달입니다.', { size: 'sm' });
            }

            function handleOpenCustomSize() {
                currentModalId = $vs.modal.open('커스텀 크기 모달입니다.', {
                    size: { width: '600px', height: '400px' },
                });
            }

            function handleClose() {
                $vs.modal.close();
            }

            function handleCloseWithId() {
                if (currentModalId) {
                    $vs.modal.closeWithId('body', currentModalId);
                    currentModalId = '';
                }
            }

            function handleClear() {
                $vs.modal.clear();
                currentModalId = '';
            }

            return {
                handleOpen,
                handleOpenWithOptions,
                handleOpenCustomSize,
                handleClose,
                handleCloseWithId,
                handleClear,
            };
        },
        template: `
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <vs-button @click="handleOpen">Open</vs-button>
                <vs-button @click="handleOpenWithOptions">Open (Small)</vs-button>
                <vs-button @click="handleOpenCustomSize">Open (Custom Size)</vs-button>
                <vs-button outline @click="handleClose">Close</vs-button>
                <vs-button outline @click="handleCloseWithId">Close (With ID)</vs-button>
                <vs-button outline @click="handleClear">Clear</vs-button>
            </div>
        `,
    }),
};
