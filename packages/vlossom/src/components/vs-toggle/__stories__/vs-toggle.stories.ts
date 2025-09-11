import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import { useVlossom } from '@/framework';
import { ref, computed } from 'vue';
import VsToggle from './../VsToggle.vue';
import type { VsToggleStyleSet } from './../types';

const meta: Meta<typeof VsToggle> = {
    title: 'Components/Base Components/VsToggle',
    component: VsToggle,
    parameters: {
        docs: {
            description: {
                component:
                    'VsToggle은 Boolean 값을 토글하는 버튼 컴포넌트입니다. v-model을 지원하며 기본적으로 VsButton의 모든 스타일링 옵션을 포함합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsToggle },
        setup() {
            const preDefinedStyleSet: VsToggleStyleSet = {
                backgroundColor: '#1e88e5',
                height: '3rem',
                padding: '0 1.5rem',
                width: 'auto',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsToggle: { ...preDefinedStyleSet } },
            };

            const toggleValue = ref(args.modelValue ?? false);

            return {
                args,
                toggleValue,
                onToggle: (value: boolean) => {
                    toggleValue.value = value;
                },
            };
        },
        template: '<vs-toggle v-bind="args" v-model="toggleValue" @toggle="onToggle">Toggle Button</vs-toggle>',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        modelValue: {
            control: 'boolean',
            description: 'v-model로 바인딩되는 토글 상태 값',
        },
        circle: {
            control: 'boolean',
            description: '원형 버튼 스타일',
        },
        disabled: {
            control: 'boolean',
            description: '버튼 비활성화',
        },
        ghost: {
            control: 'boolean',
            description: '고스트 스타일 (투명 배경)',
        },
        large: {
            control: 'boolean',
            description: '큰 크기',
        },
        loading: {
            control: 'boolean',
            description: '로딩 상태',
        },
        outline: {
            control: 'boolean',
            description: '아웃라인 스타일',
        },
        primary: {
            control: 'boolean',
            description: '강조 스타일',
        },
        responsive: {
            control: 'boolean',
            description: '반응형 디자인',
        },
        small: {
            control: 'boolean',
            description: '작은 크기',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsToggle>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 토글 버튼입니다. 클릭할 때마다 true/false 값이 토글됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsToggle },
        setup() {
            const toggleValue = ref(false);
            const toggleHistory = ref<boolean[]>([]);

            const onToggle = (value: boolean) => {
                toggleHistory.value.push(value);
            };

            return {
                args,
                toggleValue,
                toggleHistory,
                onToggle,
            };
        },
        template: `
            <div class="flex flex-col gap-4">
                <vs-toggle v-bind="args" v-model="toggleValue" @toggle="onToggle" :primary="toggleValue">
                    {{ toggleValue ? ' ON' : 'OFF' }}
                </vs-toggle>
                <div class="p-4 bg-gray-100 rounded-md">
                    <strong>현재 상태:</strong> {{ toggleValue }}<br>
                    <strong>토글 히스토리:</strong> {{ toggleHistory.join(' → ') || '없음' }}
                </div>
            </div>
        `,
    }),
};

export const ToggleExample1: Story = {
    parameters: {
        docs: {
            description: {
                story: '간단한 메뉴 버튼 기능을 구현한 예제입니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsToggle },
        setup() {
            const isOpen = ref(false);
            const size = ref('3.2rem');

            const iconSize = computed(() => {
                const sizeValue = size.value;
                const match = sizeValue.match(/^(\d*\.?\d+)([a-zA-Z%]*)$/);
                if (match) {
                    const value = parseFloat(match[1]);
                    const unit = match[2];
                    return `${(value * 2) / 3}${unit}`;
                }
                return sizeValue;
            });

            const menuButtonStyleSet = computed(() => ({
                width: size.value,
                height: size.value,
                borderRadius: '8px',
                backgroundColor: 'transparent',
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: iconSize.value,
                color: isOpen.value ? '#fff' : '#333',
            }));

            const onToggle = (value: boolean) => {
                isOpen.value = value;
            };

            return {
                args,
                isOpen,
                size,
                iconSize,
                menuButtonStyleSet,
                onToggle,
            };
        },
        template: `
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-4">
                    <vs-toggle
                        v-model="isOpen"
                        @toggle="onToggle"
                        :style-set="menuButtonStyleSet"
                        :aria-label="isOpen ? 'Close Menu' : 'Open Menu'"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></svg>
                    </vs-toggle>
                </div>

                <div v-if="isOpen" class="p-4 border border-gray-300 rounded-md bg-gray-100">
                    <h4 class="m-0">Menu Items</h4>
                    <ul class="m-0 pl-6">
                        <li>Home</li>
                        <li>About</li>
                        <li>Contact</li>
                        <li>Settings</li>
                    </ul>
                </div>
            </div>
        `,
    }),
};

export const ToggleExample2: Story = {
    parameters: {
        docs: {
            description: {
                story: 'VsToggle로 구현한 다양한 스타일의 메뉴 버튼 예제들입니다. 크기, 색상, 아이콘 등을 커스터마이징할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsToggle },
        setup() {
            const toggle1 = ref(false);
            const toggle2 = ref(true);
            const toggle3 = ref(false);

            const buttonStyle = (isActive: boolean, color: string) => ({
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: isActive ? color : '#f5f5f5',
                border: `2px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '18px',
                color: isActive ? '#fff' : color,
                boxShadow: isActive ? `0 4px 12px ${color}40` : 'none',
            });

            return {
                args,
                toggle1,
                toggle2,
                toggle3,
                buttonStyle,
            };
        },
        template: `
            <div class="flex gap-4 flex-wrap items-center">
                <div class="flex flex-col items-center gap-2">
                    <vs-toggle
                        v-model="toggle1"
                        :style-set="buttonStyle(toggle1, '#1e88e5')"
                        circle
                        aria-label="Hamburger Menu"
                    >
                        {{ toggle1 ? '✕' : '≡' }}
                    </vs-toggle>
                    <span class="text-sm text-gray-600">Hamburger</span>
                </div>

                <div class="flex flex-col items-center gap-2">
                    <vs-toggle
                        v-model="toggle2"
                        :style-set="buttonStyle(toggle2, '#e91e63')"
                        circle
                        aria-label="Options Menu"
                    >
                        {{ toggle2 ? '✕' : '⋮' }}
                    </vs-toggle>
                    <span class="text-sm text-gray-600">Options</span>
                </div>

                <div class="flex flex-col items-center gap-2">
                    <vs-toggle
                        v-model="toggle3"
                        :style-set="buttonStyle(toggle3, '#4caf50')"
                        circle
                        aria-label="More Menu"
                    >
                        {{ toggle3 ? '▲' : '⋯' }}
                    </vs-toggle>
                    <span class="text-sm text-gray-600">More</span>
                </div>

                <div class="p-4 bg-gray-100 rounded-md min-w-[200px]">
                    <h4 class="m-0 text-sm">Menu States:</h4>
                    <div class="text-sm text-gray-600">
                        Hamburger: {{ toggle1 ? 'Open' : 'Closed' }}<br>
                        Options: {{ toggle2 ? 'Open' : 'Closed' }}<br>
                        More: {{ toggle3 ? 'Open' : 'Closed' }}
                    </div>
                </div>
            </div>
        `,
    }),
};

export const ToggleExample3: Story = {
    parameters: {
        docs: {
            description: {
                story: '투명한 토글 버튼을 구현한 예제입니다, 모달의 뒷 배경을 클릭하여 모달을 닫을 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsToggle },
        setup() {
            const toggleValue = ref(args.modelValue ?? true);
            const showModal = ref(true);
            return {
                args,
                toggleValue,
                showModal,
                onToggle: (value: boolean) => {
                    toggleValue.value = value;
                    if (value) {
                        showModal.value = true;
                    } else {
                        showModal.value = false;
                    }
                },
            };
        },
        template: `
            <vs-toggle v-model="toggleValue" @toggle="onToggle" class='mb-4'> visible toggle </vs-toggle>

            <div class="h-24">
                <div
                    v-if="showModal"
                    class="fixed inset-0 w-full h-full flex items-center justify-center"
                    style="background: rgba(0, 0, 0, 0.65);"
                >
                    <div class="absolute inset-0 w-full h-full">
                        <vs-toggle
                            id="invisible-toggle"
                            :style-set="{
                                opacity: 0,
                                height: '100%',
                                width: '100%',
                            }"
                            v-model="toggleValue"
                            @toggle="onToggle"
                        />
                    </div>

                    <div class="relative w-[400px] h-[200px] bg-white rounded-xl p-5">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="m-0 text-gray-800 text-lg font-semibold">테스트 모달</h3>
                        </div>

                        <div class="mb-4">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                <strong class="text-gray-800">토글 상태: {{ toggleValue ? 'ON (활성화)' : 'OFF (비활성화)' }}</strong>
                            </div>
                            <p class="m-0 text-gray-600 text-sm">
                                {{ '모달을 닫기 위해 모달 바깥쪽을 클릭하세요' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `,
    }),
};
