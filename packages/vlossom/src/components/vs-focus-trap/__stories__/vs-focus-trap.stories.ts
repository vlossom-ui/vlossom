import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, nextTick } from 'vue';
import VsFocusTrap from './../VsFocusTrap.vue';

const meta: Meta<typeof VsFocusTrap> = {
    title: 'Components/Base Components/VsFocusTrap',
    component: VsFocusTrap,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `VsFocusTrap은 포커스를 특정 영역에 가둬두는 컴포넌트입니다.
                    모달, 팝업, 드롭다운 등에서 키보드 접근성을 향상시키는 데 사용됩니다.
                    Tab과 Shift+Tab 키로 포커스가 내부에서만 순환됩니다.`,
            },
        },
    },
    argTypes: {
        focusLock: {
            control: 'boolean',
            description: 'Tab 키로 포커스 순환을 활성화할지 여부',
        },
        initialFocusRef: {
            control: false,
            description: '컴포넌트 마운트 시 포커스할 요소의 참조',
        },
    },
    args: {
        focusLock: true,
        initialFocusRef: null,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 포커스 트랩
export const Default: Story = {
    render: (args: any) => ({
        components: { VsFocusTrap },
        setup() {
            return { args };
        },
        template: `
            <div>
                <input
                    type="text"
                    placeholder="포커스 트랩 외부 요소 - Tab으로 포커스가 여기에 오지 않습니다"
                    class="w-full px-2 py-2 mb-4 text-sm border border-gray-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <vs-focus-trap v-bind="args">
                    <div class="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 max-w-sm">
                        <h3 class="mb-4 text-lg font-semibold text-gray-700">기본 포커스 트랩</h3>
                                                <input
                            type="text"
                            placeholder="첫 번째 입력"
                            class="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-md
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="두 번째 입력"
                            class="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-md
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div>
                            <button class="px-4 py-2 mr-2 mb-2 text-sm text-white bg-blue-500 rounded-md
                                           hover:bg-blue-600 focus:outline-none focus:ring-2
                                           focus:ring-blue-500 focus:ring-offset-2">
                                확인
                            </button>
                            <button class="px-4 py-2 mr-2 mb-2 text-sm text-white bg-blue-500 rounded-md
                                           hover:bg-blue-600 focus:outline-none focus:ring-2
                                           focus:ring-blue-500 focus:ring-offset-2">
                                취소
                            </button>
                        </div>
                        <p class="mt-4 text-xs text-gray-500">
                            Tab과 Shift+Tab을 눌러 포커스 순환을 확인해보세요
                        </p>
                    </div>
                </vs-focus-trap>
            </div>
        `,
    }),
};

// 초기 포커스 지정
export const InitialFocus: Story = {
    render: (args: any) => ({
        components: { VsFocusTrap },
        setup() {
            const confirmButtonRef = ref(null);

            return {
                args: {
                    ...args,
                    initialFocusRef: confirmButtonRef,
                },
                confirmButtonRef,
            };
        },
        template: `
            <div>
                <vs-focus-trap v-bind="args">
                    <div class="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 max-w-sm">
                        <h3 class="mb-4 text-lg font-semibold text-gray-700">초기 포커스 지정</h3>
                                                <input
                            type="text"
                            placeholder="사용자명"
                            class="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-md
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            class="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-md
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div>
                            <button
                                ref="confirmButtonRef"
                                class="px-4 py-2 mr-2 mb-2 text-sm text-white bg-blue-500 rounded-md
                                       hover:bg-blue-600 focus:outline-none focus:ring-2
                                       focus:ring-blue-500 focus:ring-offset-2"
                            >
                                로그인 (초기 포커스)
                            </button>
                            <button class="px-4 py-2 mr-2 mb-2 text-sm text-white bg-blue-500 rounded-md
                                           hover:bg-blue-600 focus:outline-none focus:ring-2
                                           focus:ring-blue-500 focus:ring-offset-2">
                                취소
                            </button>
                        </div>
                        <p class="mt-4 text-xs text-gray-500">
                            컴포넌트가 마운트되면 로그인 버튼에 포커스됩니다
                        </p>
                    </div>
                </vs-focus-trap>
            </div>
        `,
    }),
};

// 포커스 잠금 비활성화
export const NoFocusLock: Story = {
    args: {
        focusLock: false,
    },
    render: (args: any) => ({
        components: { VsFocusTrap },
        setup() {
            return { args };
        },
        template: `
            <div>
                <input
                    type="text"
                    placeholder="외부 요소 1"
                    class="w-64 px-2 py-2 mb-4 text-sm border border-gray-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <vs-focus-trap v-bind="args">
                    <div class="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 max-w-sm">
                        <h3 class="mb-4 text-lg font-semibold text-gray-700">포커스 잠금 비활성화</h3>
                        <input
                            type="text"
                            placeholder="내부 입력 1"
                            class="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-md
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="내부 입력 2"
                            class="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-md
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button class="px-4 py-2 mr-2 mb-2 text-sm text-white bg-blue-500 rounded-md
                                       hover:bg-blue-600 focus:outline-none focus:ring-2
                                       focus:ring-blue-500 focus:ring-offset-2">
                            내부 버튼
                        </button>
                        <p class="mt-4 text-xs text-gray-500">
                            Tab을 누르면 외부 요소로도 포커스가 이동합니다
                        </p>
                    </div>
                </vs-focus-trap>

                <input
                    type="text"
                    placeholder="외부 요소 2"
                    class="w-64 px-2 py-2 mt-4 text-sm border border-gray-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        `,
    }),
};

// 모달 시뮬레이션
export const ModalSimulation: Story = {
    render: (args: any) => ({
        components: { VsFocusTrap },
        setup() {
            const isModalOpen = ref(false);
            const closeButtonRef = ref(null);

            const openModal = () => {
                isModalOpen.value = true;
                nextTick(() => {
                    // Modal이 열릴 때 포커스 트랩이 활성화됨
                });
            };

            const closeModal = () => {
                isModalOpen.value = false;
            };

            return {
                args: {
                    ...args,
                    initialFocusRef: closeButtonRef,
                },
                isModalOpen,
                openModal,
                closeModal,
                closeButtonRef,
            };
        },
        template: `
            <div>
                <div class="p-5">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">모달 시뮬레이션</h3>
                    <p class="text-gray-600 mb-4">버튼을 클릭하면 모달이 열리고, 포커스 트랩이 활성화됩니다.</p>
                                        <button
                        @click="openModal"
                        class="px-5 py-2.5 text-white bg-blue-500 rounded-lg font-medium
                               hover:bg-blue-600 transition-colors duration-200"
                    >
                        모달 열기
                    </button>
                </div>

                <div
                    v-if="isModalOpen"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    @click.self="closeModal"
                >
                    <vs-focus-trap v-bind="args" @keydown.esc="closeModal">
                        <div class="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-5/6">
                            <h2 class="text-2xl font-semibold text-gray-900 mb-6">설정</h2>
                            <div class="mb-6">
                                <div class="mb-4">
                                    <label class="block mb-1.5 font-medium text-gray-700">이름</label>
                                                                        <input
                                        type="text"
                                        value="홍길동"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md
                                               focus:outline-none focus:ring-2 focus:ring-blue-500
                                               focus:border-blue-500"
                                    />
                                </div>
                                <div class="mb-4">
                                    <label class="block mb-1.5 font-medium text-gray-700">이메일</label>
                                    <input
                                        type="email"
                                        value="hong@example.com"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md
                                               focus:outline-none focus:ring-2 focus:ring-blue-500
                                               focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label class="flex items-center gap-2 font-medium text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked
                                            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        알림 수신 동의
                                    </label>
                                </div>
                            </div>
                            <div class="flex gap-3 justify-end">
                                                                <button
                                    @click="closeModal"
                                    ref="closeButtonRef"
                                    class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium
                                           hover:bg-gray-200 transition-colors duration-200"
                                >
                                    취소
                                </button>
                                <button
                                    @click="closeModal"
                                    class="px-5 py-2.5 text-white bg-blue-500 rounded-lg font-medium
                                           hover:bg-blue-600 transition-colors duration-200"
                                >
                                    저장
                                </button>
                            </div>
                            <p class="mt-4 text-xs text-gray-500 text-center">
                                ESC 키를 누르거나 배경을 클릭하면 모달이 닫힙니다
                            </p>
                        </div>
                    </vs-focus-trap>
                </div>
            </div>
        `,
    }),
};
