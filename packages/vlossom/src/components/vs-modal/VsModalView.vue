<template>
    <div class="vs-modal-view" :class="{ 'vs-modal-fixed': isFixed }">
        <TransitionGroup name="modal" :duration="ANIMATION_DURATION" appear>
            <vs-modal-node
                v-for="modal in modals"
                :key="modal.id"
                :before-close="modal.beforeClose"
                :color-scheme="modal.colorScheme"
                :style-set="modal.styleSet"
                :callbacks="modal.callbacks"
                :dim-close="modal.dimClose"
                :dimmed="modal.dimmed"
                :esc-close="modal.escClose"
                :focus-lock="modal.focusLock"
                :hide-scroll="modal.hideScroll"
                :id="modal.id"
                :size="modal.size"
                @close="onClose(modal.id)"
            >
                <vs-render :content="modal.content" />
            </vs-modal-node>
        </TransitionGroup>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { VsComponent, ANIMATION_DURATION } from '@/declaration';
import { useModalContainerStore } from '@/stores';
import type { ModalInfo } from '@/plugins';

import VsModalNode from '@/components/vs-modal/VsModalNode.vue';
import VsRender from '@/components/vs-render/VsRender.vue';

const componentName = VsComponent.VsModalView;
export default defineComponent({
    name: componentName,
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

        function onClose(id: string) {
            modalStore.remove(container.value, id);
        }

        return { modals, isFixed, ANIMATION_DURATION, onClose };
    },
});
</script>

<style src="./VsModalView.css" />
