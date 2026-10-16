import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate } from '@/storybook';
import VsDropzone from './../VsDropzone.vue';

const meta: Meta<typeof VsDropzone> = {
    title: 'Components/Base Components/VsDropzone',
    component: VsDropzone,
    render: (args: any) => ({
        components: { VsDropzone },
        setup() {
            const fileNames = ref('');
            function onDrop(files: File[]) {
                fileNames.value = files.map((file) => file.name).join(', ');
            }
            return { args, fileNames, onDrop };
        },
        template: `
            <div>
                <vs-dropzone v-bind="args" @drop="onDrop">
                    <div class="p-12 text-center">파일을 이 영역에 드롭하세요</div>
                    <template #overlay>파일을 놓으면 업로드됩니다</template>
                </vs-dropzone>
                <p class="mt-2">드롭된 파일: {{ fileNames }}</p>
            </div>
        `,
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
    },
    parameters: {
        docs: {
            description: {
                component:
                    'VsDropzone은 감싼 영역 전체를 파일 드롭 영역으로 만드는 컴포넌트입니다. ' +
                    '값을 가지지 않고 드래그 상태와 드롭된 파일만 알려줍니다.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsDropzone>;

export const Default: Story = {};

export const ColorScheme: Story = {
    render: (args: any) => ({
        components: { VsDropzone },
        setup() {
            return { args };
        },
        template: getColorSchemeTemplate(`
            <vs-dropzone v-bind="args" color-scheme="{{ color }}" class="mb-4">
                <div class="p-8 text-center">{{ color }}</div>
            </vs-dropzone>
        `),
    }),
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const NoOverlay: Story = {
    render: (args: any) => ({
        components: { VsDropzone },
        setup() {
            return { args };
        },
        template: `
            <vs-dropzone v-bind="args" no-overlay>
                <template #default="{ dragging }">
                    <div class="p-12 text-center" :style="{ background: dragging ? '#e8f4fd' : 'transparent' }">
                        {{ dragging ? '놓으세요!' : '파일을 드래그하세요' }}
                    </div>
                </template>
            </vs-dropzone>
        `,
    }),
};

export const StyleSet: Story = {
    args: {
        styleSet: {
            $overlay: {
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                borderColor: '#0066cc',
                borderRadius: '12px',
            },
        },
    },
};
