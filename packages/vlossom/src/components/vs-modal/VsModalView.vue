<template>
    <div class="vs-modal-view" :class="{ 'vs-modal-fixed': isFixed }">
        <TransitionGroup name="modal" :duration="ANIMATION_DURATION">
            <vs-modal-node
                v-for="modal in modals"
                :key="modal.id"
                :color-scheme="modal.colorScheme"
                :style-set="modal.styleSet"
                :callbacks="modal.callbacks"
                :dim-close="modal.dimClose"
                :dimmed="modal.dimmed"
                :esc-close="modal.escClose"
                :focus-lock="modal.focusLock"
                :hide-scroll="modal.hideScroll"
                :id="modal.id"
                :initial-focus-ref="modal.initialFocusRef"
                :scroll-lock="modal.scrollLock"
                :size="modal.size"
                @close="onClose(modal.id)"
            >
                <vs-render :content="modal.content" />
            </vs-modal-node>
        </TransitionGroup>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, watch, type ComputedRef } from 'vue';
import { VsComponent, ANIMATION_DURATION } from '@/declaration';
import { useModalContainerStore } from '@/stores';
import { useScrollLock } from '@/composables';
import type { ModalInfo } from '@/plugins';

import VsModalNode from '@/components/vs-modal/VsModalNode.vue';
import VsRender from '@/components/vs-render/VsRender.vue';

const name = VsComponent.VsModalView;
export default defineComponent({
    name,
    components: { VsModalNode, VsRender },
    props: {
        container: { type: String, default: 'body' },
    },
    setup(props) {
        const { container } = toRefs(props);

        const modalStore = useModalContainerStore();

        const modals = computed((): ModalInfo[] => {
            const containerValue = container.value || 'body';
            return modalStore.get(containerValue);
        });

        const isFixed = computed(() => {
            const containerValue = container.value || 'body';
            return containerValue === 'body';
        });

        const containerElement: ComputedRef<HTMLElement | null> = computed(() => {
            const containerValue = container.value || 'body';
            if (containerValue === 'body') {
                return document.body;
            }

            return document.querySelector(containerValue);
        });

        const needScrollLock = computed(() => {
            return modals.value.some((modal) => modal.scrollLock);
        });

        watch(
            needScrollLock,
            (lock) => {
                if (lock) {
                    useScrollLock(containerElement.value).lock();
                } else {
                    useScrollLock(containerElement.value).unlock();
                }
            },
            { immediate: true },
        );

        function onClose(id: string) {
            modalStore.remove(container.value, id);
        }

        return { modals, isFixed, ANIMATION_DURATION, onClose };
    },
});
</script>

<style src="./VsModalView.css" />
