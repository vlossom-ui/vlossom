<template>
    <vs-page class="mb-8" :style-set="pageStyleSet">
        <div class="sandbox flex flex-col gap-6">
            <div>
                <h1 class="mb-2 text-2xl font-bold">Modal Back Close Sandbox</h1>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                    Android Back 또는 브라우저 뒤로가기로 modal backClose 동작과 history sync를 확인합니다.
                </p>
            </div>

            <vs-block>
                <h2 class="mb-3 text-lg font-semibold">1. 일반 VsModal backClose 옵션</h2>
                <p class="mb-4 text-sm">
                    첫 번째 버튼은 뒤로가기로 닫히고, 두 번째 버튼은 뒤로가기를 눌러도 닫히면 안 됩니다.
                </p>
                <div class="flex flex-wrap gap-2">
                    <vs-button @click="openBackCloseModal">Open backClose Modal</vs-button>
                    <vs-button @click="openNoBackCloseModal">Open backClose false Modal</vs-button>
                </div>
            </vs-block>

            <vs-block>
                <h2 class="mb-3 text-lg font-semibold">2. 목적형 modal 기본값</h2>
                <p class="mb-4 text-sm">Alert, Confirm, Prompt는 옵션을 넘기지 않아도 뒤로가기로 닫혀야 합니다.</p>
                <div class="flex flex-wrap gap-2">
                    <vs-button @click="openAlert">Open Alert</vs-button>
                    <vs-button @click="openConfirm">Open Confirm</vs-button>
                    <vs-button @click="openPrompt">Open Prompt</vs-button>
                </div>
            </vs-block>

            <vs-block>
                <h2 class="mb-3 text-lg font-semibold">3. Stack 최상단 보호</h2>
                <p class="mb-4 text-sm">
                    아래 modal은 backClose true, 위 modal은 backClose false입니다. 뒤로가기를 눌러도 둘 다 닫히면 안
                    됩니다.
                </p>
                <vs-button @click="openStackedModals">Open stacked Modals</vs-button>
            </vs-block>

            <vs-block>
                <h2 class="mb-3 text-lg font-semibold">4. 다른 닫기 기능 후 history sync</h2>
                <p class="mb-4 text-sm">
                    ESC, dim click, 버튼으로 닫은 뒤 브라우저 뒤로가기를 눌렀을 때 이미 닫힌 modal 때문에 추가 동작이
                    생기면 안 됩니다.
                </p>
                <div class="flex flex-wrap gap-2">
                    <vs-button @click="openEscSyncModal">Open ESC sync Modal</vs-button>
                    <vs-button @click="openDimSyncModal">Open dim sync Modal</vs-button>
                    <vs-button @click="openButtonSyncModal">Open button sync Modal</vs-button>
                </div>
            </vs-block>

            <vs-block>
                <h2 class="mb-3 text-lg font-semibold">5. clear() stale history 재현</h2>
                <p class="mb-4 text-sm">
                    backClose modal 2개를 연 뒤 <code>$vs.modal.clear()</code>로 모두 닫습니다. 닫힌 뒤 브라우저
                    뒤로가기를 한 번 눌렀을 때 hash가 그대로라면 stale modal history가 한 번 소비된 것입니다.
                </p>
                <vs-button @click="openClearHistoryRepro">Open clear() repro Modals</vs-button>
            </vs-block>

            <vs-block>
                <h2 class="mb-3 text-lg font-semibold">6. backClose modal 2개 stack</h2>
                <p class="mb-4 text-sm">
                    위/아래 modal 모두 backClose true입니다. 뒤로가기를 한 번 누르면 위 modal만 닫혀야 합니다. 아무것도
                    닫히지 않고 뒤로가기를 반복해도 페이지를 벗어나지 못하면 재현입니다. 두 번째 버튼은 같은 문제를
                    backClose modal 안에서 confirm을 여는 실사용 흐름으로 확인합니다.
                </p>
                <div class="flex flex-wrap gap-2">
                    <vs-button @click="openStackedBackCloseModals">Open 2 backClose Modals</vs-button>
                    <vs-button @click="openConfirmHostModal">Open Confirm inside Modal</vs-button>
                </div>
            </vs-block>

            <vs-block>
                <h2 class="mb-3 text-lg font-semibold">7. Modal 안 VsSelect 드롭다운 + 뒤로가기</h2>
                <p class="mb-4 text-sm">
                    modal 안 select 드롭다운을 연 상태에서 ESC를 누르면 드롭다운만 닫힙니다. 같은 상태에서 뒤로가기를
                    눌렀을 때 드롭다운이 아니라 modal 전체가 닫히면 ESC와 동작이 어긋난 것입니다.
                </p>
                <vs-button @click="openSelectModal">Open Modal with Select</vs-button>
            </vs-block>

            <vs-block>
                <h2 class="mb-3 text-lg font-semibold">Event Log</h2>
                <div class="mb-3 flex gap-2">
                    <vs-button size="sm" @click="clearLogs">Clear logs</vs-button>
                </div>
                <ol
                    class="flex max-h-80 flex-col gap-1 overflow-auto rounded-md bg-gray-100 p-3 text-sm
                        dark:bg-gray-800"
                >
                    <li v-for="log in logs" :key="log.id">{{ log.message }}</li>
                </ol>
            </vs-block>

            <vs-modal
                v-model="backCloseModalOpen"
                :back-close="true"
                :dimmed="true"
                :dim-close="true"
                :esc-close="true"
                :size="{ width: '420px', height: 'auto' }"
                @open="onOpenBackCloseModal"
                @close="onCloseBackCloseModal"
            >
                <div class="flex flex-col gap-4 p-6">
                    <h3 class="text-lg font-semibold">backClose true</h3>
                    <p>뒤로가기를 누르면 이 modal이 닫혀야 합니다.</p>
                    <vs-button @click="closeBackCloseModal">Close by button</vs-button>
                </div>
            </vs-modal>

            <vs-modal
                v-model="noBackCloseModalOpen"
                :back-close="false"
                :dimmed="true"
                :dim-close="true"
                :esc-close="true"
                :size="{ width: '420px', height: 'auto' }"
                @open="onOpenNoBackCloseModal"
                @close="onCloseNoBackCloseModal"
            >
                <div class="flex flex-col gap-4 p-6">
                    <h3 class="text-lg font-semibold">backClose false</h3>
                    <p>뒤로가기를 눌러도 이 modal은 닫히면 안 됩니다.</p>
                    <vs-button @click="closeNoBackCloseModal">Close by button</vs-button>
                </div>
            </vs-modal>

            <vs-modal
                v-model="selectModalOpen"
                :back-close="true"
                :dimmed="true"
                :esc-close="true"
                :size="{ width: '420px', height: 'auto' }"
                @close="onCloseSelectModal"
            >
                <div class="flex flex-col gap-4 p-6">
                    <h3 class="text-lg font-semibold">backClose modal + VsSelect</h3>
                    <p>드롭다운을 연 상태에서 ESC와 뒤로가기를 각각 눌러 비교하세요.</p>
                    <vs-select v-model="selectedFruit" :options="fruitOptions" label="과일 선택" />
                </div>
            </vs-modal>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, h, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import { VsButton } from '@/components';
import { useVlossom } from '@/framework';
import { useModalContainerStore } from '@/stores';

interface SandboxLog {
    id: string;
    message: string;
}

const LOG_LIMIT = 30;
const pageStyleSet = { padding: '0 0 3rem 0' };
const fruitOptions = ['Apple', 'Banana', 'Cherry'];

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const $vs = useVlossom();
        const modalContainerStore = useModalContainerStore();

        const backCloseModalOpen: Ref<boolean> = ref(false);
        const noBackCloseModalOpen: Ref<boolean> = ref(false);
        const selectModalOpen: Ref<boolean> = ref(false);
        const selectedFruit: Ref<string | null> = ref(null);
        const logs: Ref<SandboxLog[]> = ref([]);

        function addLog(message: string): void {
            const time = new Date().toLocaleTimeString();
            const nextLog: SandboxLog = {
                id: `${Date.now()}-${Math.random()}`,
                message: `[${time}] ${message}`,
            };
            logs.value = [nextLog, ...logs.value].slice(0, LOG_LIMIT);
        }

        function clearLogs(): void {
            logs.value = [];
        }

        function openBackCloseModal(): void {
            backCloseModalOpen.value = true;
        }

        function closeBackCloseModal(): void {
            backCloseModalOpen.value = false;
        }

        function onOpenBackCloseModal(): void {
            addLog('backClose modal opened');
        }

        function onCloseBackCloseModal(): void {
            addLog('backClose modal closed');
        }

        function openNoBackCloseModal(): void {
            noBackCloseModalOpen.value = true;
        }

        function closeNoBackCloseModal(): void {
            noBackCloseModalOpen.value = false;
        }

        function onOpenNoBackCloseModal(): void {
            addLog('backClose false modal opened');
        }

        function onCloseNoBackCloseModal(): void {
            addLog('backClose false modal closed');
        }

        async function openAlert(): Promise<void> {
            addLog('alert opened');
            await $vs.alert.open('뒤로가기로 닫히는 alert 기본값 테스트입니다.');
            addLog('alert resolved');
        }

        async function openConfirm(): Promise<void> {
            addLog('confirm opened');
            const result = await $vs.confirm.open('뒤로가기로 닫으면 false로 resolve되어야 합니다.');
            addLog(`confirm resolved: ${result}`);
        }

        async function openPrompt(): Promise<void> {
            addLog('prompt opened');
            const result = await $vs.prompt.open('뒤로가기로 닫으면 null로 resolve되어야 합니다.', {
                input: { placeholder: '아무 값이나 입력' },
            });
            addLog(`prompt resolved: ${result ?? 'null'}`);
        }

        function openStackedModals(): void {
            addLog('stack lower modal opened');
            $vs.modal.open(
                h('div', { class: 'flex flex-col gap-4 p-6' }, [
                    h('h3', { class: 'text-lg font-semibold' }, 'Lower modal: backClose true'),
                    h('p', '잠시 후 위에 backClose false modal이 열립니다.'),
                ]),
                {
                    backClose: true,
                    dimmed: true,
                    size: { width: '440px', height: 'auto' },
                },
            );

            window.setTimeout(() => {
                addLog('stack top modal opened');
                const topModalId = $vs.modal.open(
                    h('div', { class: 'flex flex-col gap-4 p-6' }, [
                        h('h3', { class: 'text-lg font-semibold' }, 'Top modal: backClose false'),
                        h('p', '뒤로가기를 눌러도 이 modal과 아래 modal 모두 닫히면 안 됩니다.'),
                        h(
                            'div',
                            { class: 'flex gap-2' },
                            h(VsButton, { onClick: () => $vs.modal.closeWithId(topModalId) }, () => 'Close top'),
                        ),
                    ]),
                    {
                        backClose: false,
                        dimmed: true,
                        size: { width: '440px', height: 'auto' },
                    },
                );
            }, 100);
        }

        function openEscSyncModal(): void {
            addLog('ESC sync modal opened');
            $vs.modal.open('ESC로 닫은 뒤 브라우저 뒤로가기를 눌러 history sync를 확인하세요.', {
                backClose: true,
                dimmed: true,
                escClose: true,
                size: 'xs',
            });
        }

        function openDimSyncModal(): void {
            addLog('dim sync modal opened');
            $vs.modal.open('딤 영역 클릭으로 닫은 뒤 브라우저 뒤로가기를 눌러 history sync를 확인하세요.', {
                backClose: true,
                dimmed: true,
                dimClose: true,
                size: 'xs',
            });
        }

        function openButtonSyncModal(): void {
            addLog('button sync modal opened');
            const modalId = $vs.modal.open(
                h('div', { class: 'flex flex-col gap-4 p-6' }, [
                    h('p', '버튼으로 닫은 뒤 브라우저 뒤로가기를 눌러 history sync를 확인하세요.'),
                    h(VsButton, { onClick: () => $vs.modal.closeWithId(modalId) }, () => 'Close by plugin'),
                ]),
                {
                    backClose: true,
                    dimmed: true,
                    size: { width: '420px', height: 'auto' },
                },
            );
        }

        function openClearHistoryRepro(): void {
            window.history.pushState({ sandbox: 'modal-clear-repro-base' }, '', '#modal-clear-repro-base');
            addLog('clear repro base hash pushed: #modal-clear-repro-base');

            $vs.modal.open(
                h('div', { class: 'flex flex-col gap-4 p-6' }, [
                    h('h3', { class: 'text-lg font-semibold' }, 'First backClose modal'),
                    h('p', '두 번째 backClose modal이 곧 위에 열립니다.'),
                ]),
                {
                    backClose: true,
                    dimmed: true,
                    size: { width: '440px', height: 'auto' },
                },
            );

            window.setTimeout(() => {
                $vs.modal.open(
                    h('div', { class: 'flex flex-col gap-4 p-6' }, [
                        h('h3', { class: 'text-lg font-semibold' }, 'Second backClose modal'),
                        h(
                            'p',
                            'Clear all 버튼을 누른 뒤 브라우저 뒤로가기를 한 번 누르세요. hash가 그대로면 재현입니다.',
                        ),
                        h(
                            VsButton,
                            {
                                onClick: () => {
                                    addLog('clear repro: $vs.modal.clear() called');
                                    $vs.modal.clear();
                                    window.setTimeout(() => {
                                        addLog(`clear repro after clear hash: ${window.location.hash || '(empty)'}`);
                                    });
                                },
                            },
                            () => 'Clear all by modal.clear()',
                        ),
                    ]),
                    {
                        backClose: true,
                        dimmed: true,
                        size: { width: '440px', height: 'auto' },
                    },
                );
                addLog('clear repro modals opened: 2 backClose entries');
            }, 100);
        }

        function openStackedBackCloseModals(): void {
            addLog('stacked backClose: lower modal opened');
            $vs.modal.open(
                h('div', { class: 'flex flex-col gap-4 p-6' }, [
                    h('h3', { class: 'text-lg font-semibold' }, 'Lower modal: backClose true'),
                    h('p', '잠시 후 위에 backClose true modal이 하나 더 열립니다.'),
                ]),
                {
                    backClose: true,
                    dimmed: true,
                    size: { width: '480px', height: 'auto' },
                },
            );

            window.setTimeout(() => {
                addLog('stacked backClose: top modal opened');
                $vs.modal.open(
                    h('div', { class: 'flex flex-col gap-4 p-6' }, [
                        h('h3', { class: 'text-lg font-semibold' }, 'Top modal: backClose true'),
                        h('p', '뒤로가기를 한 번 누르면 이 modal만 닫히고 아래 modal은 남아야 합니다.'),
                    ]),
                    {
                        backClose: true,
                        dimmed: true,
                        size: { width: '400px', height: 'auto' },
                    },
                );
            }, 100);
        }

        async function openInnerConfirm(): Promise<void> {
            addLog('inner confirm opened');
            const result = await $vs.confirm.open('뒤로가기를 누르면 이 confirm만 닫히고 false로 resolve되어야 합니다.');
            addLog(`inner confirm resolved: ${result}`);
        }

        function openConfirmHostModal(): void {
            addLog('confirm host modal opened');
            $vs.modal.open(
                h('div', { class: 'flex flex-col gap-4 p-6' }, [
                    h('h3', { class: 'text-lg font-semibold' }, 'Host modal: backClose true'),
                    h('p', '버튼으로 confirm을 연 뒤 뒤로가기를 누르세요.'),
                    h(VsButton, { onClick: openInnerConfirm }, () => 'Open confirm'),
                ]),
                {
                    backClose: true,
                    dimmed: true,
                    size: { width: '480px', height: 'auto' },
                },
            );
        }

        function openSelectModal(): void {
            selectModalOpen.value = true;
            addLog('select modal opened');
        }

        function onCloseSelectModal(): void {
            addLog('select modal closed');
        }

        function onPopState(): void {
            // modal-history-store의 popstate 처리(async closeModal)가 끝난 뒤 상태를 기록한다.
            window.setTimeout(() => {
                addLog(`popstate: open modals=${modalContainerStore.get('body').length}`);
            });
        }

        onMounted(() => {
            window.addEventListener('popstate', onPopState);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('popstate', onPopState);
        });

        return {
            pageStyleSet,
            fruitOptions,
            backCloseModalOpen,
            noBackCloseModalOpen,
            selectModalOpen,
            selectedFruit,
            logs,
            addLog,
            clearLogs,
            openBackCloseModal,
            closeBackCloseModal,
            onOpenBackCloseModal,
            onCloseBackCloseModal,
            openNoBackCloseModal,
            closeNoBackCloseModal,
            onOpenNoBackCloseModal,
            onCloseNoBackCloseModal,
            openAlert,
            openConfirm,
            openPrompt,
            openStackedModals,
            openEscSyncModal,
            openDimSyncModal,
            openButtonSyncModal,
            openClearHistoryRepro,
            openStackedBackCloseModals,
            openConfirmHostModal,
            openSelectModal,
            onCloseSelectModal,
        };
    },
});
</script>
