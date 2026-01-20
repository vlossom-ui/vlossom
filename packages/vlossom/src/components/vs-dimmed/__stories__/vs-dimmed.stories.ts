import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsDimmed from './../VsDimmed.vue';
import type { VsDimmedStyleSet } from '../types';

const meta: Meta<typeof VsDimmed> = {
    title: 'Components/Base Components/VsDimmed',
    component: VsDimmed,
    render: (args: any) => ({
        components: { VsDimmed },
        setup() {
            const isVisible = ref(args.modelValue ?? true);
            return { args, isVisible };
        },
        template: '<div class="relative h-64 w-full"><vs-dimmed v-model="isVisible" v-bind="args"/></div>',
    }),
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'VsDimmed는 오버레이나 모달 같은 컴포넌트에서 배경을 어둡게 처리하는 컴포넌트입니다. ' +
                    '기본적으로 절대 위치로 부모 요소를 가득 채우며, backgroundColor와 opacity를 통해 스타일을 커스터마이징할 수 있습니다.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsDimmed>;

export const Default: Story = {
    args: {
        modelValue: true,
    },
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const WithVModel: Story = {
    render: (args: any) => ({
        components: { VsDimmed },
        setup() {
            const isVisible = ref(false);
            function toggle() {
                isVisible.value = !isVisible.value;
            }
            return { args, isVisible, toggle };
        },
        template: `
            <div class="relative h-64 w-full">
                <button @click="toggle" class="absolute top-4 left-4 z-20 bg-white px-4 py-2 rounded">
                    {{ isVisible ? 'Hide' : 'Show' }} Dimmed
                </button>
                <div class="absolute top-4 left-32 z-10 text-white">v-model로 제어</div>
                <vs-dimmed v-model="isVisible" v-bind="args"/>
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '인라인 스타일 객체를 사용한 커스텀 dimmed입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    args: {
        modelValue: true,
        styleSet: {
            component: {
                backgroundColor: 'rgba(255, 0, 0, 1)',
                opacity: 0.5,
            },
        },
    },
    render: (args: any) => ({
        components: { VsDimmed },
        setup() {
            const isVisible = ref(args.modelValue ?? true);
            return { args, isVisible };
        },
        template:
            '<div class="relative h-64 w-full"><div class="absolute top-4 left-4 z-10 text-white">빨간색 배경, 50% 투명도</div><vs-dimmed v-model="isVisible" v-bind="args"/></div>',
    }),
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '미리 정의된 스타일 세트를 사용한 dimmed입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsDimmed },
        setup() {
            const preDefinedStyleSet: VsDimmedStyleSet = {
                component: {
                    backgroundColor: 'rgba(0, 255, 0, 1)',
                    opacity: 0.6,
                },
            };

            useVlossom().styleSet = {
                myDimmedStyleSet: { VsDimmed: { ...preDefinedStyleSet } },
            };

            const isVisible = ref(args.modelValue ?? true);
            return { args, isVisible };
        },
        template:
            '<div class="relative h-64 w-full"><div class="absolute top-4 left-4 z-10">미리 정의된 스타일 세트</div><vs-dimmed v-model="isVisible" v-bind="args"/></div>',
    }),
    args: {
        modelValue: true,
        styleSet: 'myDimmedStyleSet',
    },
};

