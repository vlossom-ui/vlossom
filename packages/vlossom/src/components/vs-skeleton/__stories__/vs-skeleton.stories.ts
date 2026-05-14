import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate, LOREM_IPSUM } from '@/storybook';
import VsSkeleton from './../VsSkeleton.vue';
import VsGrid from '@/components/vs-grid/VsGrid.vue';
import VsButton from '@/components/vs-button/VsButton.vue';
import VsAvatar from '@/components/vs-avatar/VsAvatar.vue';

const meta: Meta<typeof VsSkeleton> = {
    title: 'Components/Base Components/VsSkeleton',
    component: VsSkeleton,
    parameters: {
        docs: {
            description: {
                component: 'VsSkeleton는 UI 컴포넌트의 로딩 상태를 표시하기 위한 컴포넌트입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSkeleton },
        setup() {
            return { args };
        },
        template: `
            <div class="w-[200px] h-[200px]">
                <vs-skeleton v-bind="args" />
            </div>
        `,
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'VsSkeleton의 기본 형태입니다.',
            },
        },
    },
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 스켈레톤들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSkeleton },
        setup() {
            return { args };
        },
        template: `
            <div class="w-auto">
                ${getColorSchemeTemplate(`
                    <div class="inline-block w-[50px] h-[50px] m-1">
                        <vs-skeleton color-scheme="{{ color }}" />
                    </div>
                `)}
            </div>
        `,
    }),
};

export const StyleSetUsages: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 스켈레톤입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSkeleton, VsGrid, VsButton, VsAvatar },
        setup() {
            const isLoading = ref(false);

            function toggleLoading() {
                isLoading.value = true;
                setTimeout(() => {
                    isLoading.value = false;
                }, 1000);
            }

            return { args, isLoading, toggleLoading };
        },
        template: `
            <div class="flex flex-row items-center mb-20">
                <vs-button @click="toggleLoading">Run Test</vs-button>
            </div>

            <vs-grid :grid-size="3" :column-gap="16" :row-gap="16" width="500px" height="200px" class="mt-4">
                <div class="flex flex-row items-center justify-center">
                    <vs-avatar :style-set="{ border: 'unset' }">
                        <img v-if="!isLoading" src="https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png" alt="pikachu">
                        <vs-skeleton color-scheme="yellow" v-else />
                    </vs-avatar>
                </div>
                <div class="flex flex-row items-center justify-center">
                    <div class="w-[150px] h-[20px]">
                        <span v-if="!isLoading">Pikachu</span>
                        <vs-skeleton v-else />
                    </div>
                </div>
                <div class="flex flex-col items-center justify-center gap-2">
                    <span v-if="!isLoading">${LOREM_IPSUM.slice(0, 50)}</span>
                    <div v-if="isLoading" class="w-[150px] h-[10px]">
                        <vs-skeleton  />
                    </div>
                    <div v-if="isLoading" class="w-[150px] h-[10px]">
                        <vs-skeleton  />
                    </div>
                    <div v-if="isLoading" class="w-[150px] h-[10px]">
                        <vs-skeleton  />
                    </div>
                    <div v-if="isLoading" class="w-[150px] h-[10px]">
                        <vs-skeleton  />
                    </div>
                </div>
                <div class="flex flex-row items-center justify-center">
                    <vs-avatar :style-set="{ border: 'unset' }">
                        <img v-if="!isLoading" src="https://upload.wikimedia.org/wikipedia/en/5/59/Pok%C3%A9mon_Squirtle_art.png" alt="pikachu">
                        <vs-skeleton color-scheme="blue" v-else />
                    </vs-avatar>
                </div>
                <div class="flex flex-row items-center justify-center">
                    <div class="w-[150px] h-[20px]">
                        <span v-if="!isLoading">Squirtle</span>
                        <vs-skeleton v-else />
                    </div>
                </div>
                <div class="flex flex-col items-center justify-center gap-2">
                    <span v-if="!isLoading">${LOREM_IPSUM.slice(0, 50)}</span>
                    <div v-if="isLoading" class="w-[150px] h-[10px]">
                        <vs-skeleton  />
                    </div>
                    <div v-if="isLoading" class="w-[150px] h-[10px]">
                        <vs-skeleton  />
                    </div>
                    <div v-if="isLoading" class="w-[150px] h-[10px]">
                        <vs-skeleton  />
                    </div>
                    <div v-if="isLoading" class="w-[150px] h-[10px]">
                        <vs-skeleton  />
                    </div>
                </div>
            </vs-grid>
        `,
    }),
};
