<template>
    <main class="mx-auto flex max-w-3xl flex-col gap-6 p-8">
        <h1 class="text-2xl font-bold">Modal backClose E2E</h1>

        <section class="flex flex-wrap gap-2">
            <vs-button data-testid="open-back-close" @click="openBackCloseModal"> Open backClose modal </vs-button>
            <vs-button data-testid="open-no-back-close" @click="openNoBackCloseModal">
                Open backClose false modal
            </vs-button>
            <vs-button data-testid="open-stack" @click="openStackedModals(true)">Open stacked modals</vs-button>
            <vs-button data-testid="open-protected-stack" @click="openStackedModals(false)"
                >Open protected modal</vs-button
            >
            <vs-button data-testid="open-select-modal" @click="selectModalOpen = true">
                Open modal with select
            </vs-button>
            <vs-button data-testid="open-alert" @click="openAlert">Open alert</vs-button>
            <vs-button data-testid="open-confirm" @click="openConfirm">Open confirm</vs-button>
            <vs-button data-testid="open-prompt" @click="openPrompt">Open prompt</vs-button>
            <vs-button data-testid="open-confirm-host" @click="openConfirmHost">Open confirm host</vs-button>
            <vs-button data-testid="open-esc-sync" @click="openEscSyncModal">Open ESC sync modal</vs-button>
            <vs-button data-testid="open-dim-sync" @click="openDimSyncModal">Open dim sync modal</vs-button>
            <vs-button data-testid="open-clear-stack" @click="openClearStack">Open clear stack</vs-button>
            <vs-button data-testid="open-reject-modal" @click="openRejectModal">Open rejecting modal</vs-button>
        </section>

        <p data-testid="status">{{ status }}</p>

        <vs-modal v-model="backCloseModalOpen" :back-close="true" :dimmed="true" :dim-close="true" :esc-close="true">
            <div data-testid="back-close-modal" class="flex flex-col gap-4 p-6">
                <h2>backClose modal</h2>
                <vs-button data-testid="close-by-button" @click="backCloseModalOpen = false">
                    Close by button
                </vs-button>
            </div>
        </vs-modal>

        <vs-modal v-model="noBackCloseModalOpen" :back-close="false" :dimmed="true" :esc-close="true">
            <div data-testid="no-back-close-modal" class="p-6">backClose false modal</div>
        </vs-modal>

        <vs-modal v-model="selectModalOpen" :back-close="true" :dimmed="true" :esc-close="true">
            <div data-testid="select-modal" class="flex flex-col gap-4 p-6">
                <h2>Modal with select</h2>
                <vs-select v-model="selectedFruit" data-testid="modal-select" label="Fruit" :options="fruitOptions" />
            </div>
        </vs-modal>
    </main>
</template>

<script lang="ts">
import { defineComponent, h, ref, type Ref } from 'vue';
import { useVlossom } from '@/framework';

const fruitOptions = ['Apple', 'Banana', 'Cherry'];

export default defineComponent({
    name: 'ModalBackCloseE2E',
    setup() {
        const $vs = useVlossom();
        const backCloseModalOpen: Ref<boolean> = ref(false);
        const noBackCloseModalOpen: Ref<boolean> = ref(false);
        const selectModalOpen: Ref<boolean> = ref(false);
        const selectedFruit: Ref<string | null> = ref(null);
        const status: Ref<string> = ref('idle');

        function openBackCloseModal(): void {
            status.value = 'back-close-opened';
            backCloseModalOpen.value = true;
        }

        function openNoBackCloseModal(): void {
            status.value = 'no-back-close-opened';
            noBackCloseModalOpen.value = true;
        }

        async function openConfirm(): Promise<void> {
            const result = await $vs.confirm.open('Confirm message');
            status.value = `confirm-resolved-${result}`;
        }

        async function openAlert(): Promise<void> {
            await $vs.alert.open('Alert message');
            status.value = 'alert-resolved';
        }

        async function openPrompt(): Promise<void> {
            const result = await $vs.prompt.open('Prompt message');
            status.value = `prompt-resolved-${result ?? 'null'}`;
        }

        function openConfirmHost(): void {
            $vs.modal.open(
                h('div', { 'data-testid': 'confirm-host' }, [
                    h('p', 'Confirm host modal'),
                    h(
                        'button',
                        {
                            'data-testid': 'open-inner-confirm',
                            onClick: () => {
                                void openConfirm();
                            },
                        },
                        'Open inner confirm',
                    ),
                ]),
                { backClose: true },
            );
        }

        function openEscSyncModal(): void {
            $vs.modal.open(h('div', { 'data-testid': 'esc-sync-modal' }, 'ESC sync modal'), {
                backClose: true,
                escClose: true,
            });
        }

        function openDimSyncModal(): void {
            $vs.modal.open(h('div', { 'data-testid': 'dim-sync-modal' }, 'Dim sync modal'), {
                backClose: true,
                dimClose: true,
                dimmed: true,
            });
        }

        function openClearStack(): void {
            $vs.modal.open(h('div', { 'data-testid': 'clear-bottom' }, 'Clear bottom modal'), {
                backClose: true,
                beforeClose: () => {
                    status.value = 'unexpected-before-close';
                    return false;
                },
            });
            window.setTimeout(() => {
                $vs.modal.open(
                    h('div', { 'data-testid': 'clear-top' }, [
                        h('p', 'Clear top modal'),
                        h(
                            'button',
                            {
                                'data-testid': 'clear-all',
                                onClick: () => {
                                    $vs.modal.clear();
                                },
                            },
                            'Clear all',
                        ),
                    ]),
                    { backClose: true },
                );
            }, 50);
        }

        function openRejectModal(): void {
            $vs.modal.open('Rejecting modal', {
                backClose: true,
                beforeClose: async () => false,
            });
        }

        function openStackedModals(topBackClose: boolean): void {
            const bottomId = $vs.modal.open(h('div', { 'data-testid': 'stack-bottom' }, 'Bottom backClose modal'), {
                backClose: true,
            });

            window.setTimeout(() => {
                $vs.modal.open(h('div', { 'data-testid': 'stack-top' }, 'Top backClose modal'), {
                    backClose: topBackClose,
                });
            }, 50);

            status.value = `stack-opened-${bottomId}`;
        }

        return {
            backCloseModalOpen,
            fruitOptions,
            noBackCloseModalOpen,
            openBackCloseModal,
            openConfirm,
            openAlert,
            openConfirmHost,
            openDimSyncModal,
            openEscSyncModal,
            openNoBackCloseModal,
            openPrompt,
            openRejectModal,
            openStackedModals,
            openClearStack,
            selectedFruit,
            selectModalOpen,
            status,
        };
    },
});
</script>
