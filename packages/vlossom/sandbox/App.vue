<template>
    <div>
        <h1>Hello Vlossom</h1>

        <vs-button @click="isOpen = !isOpen">Toggle Modal</vs-button>

        <vs-modal v-model="isOpen" focus-lock>
            <modal-content />
        </vs-modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ModalContent from './ModalContent.vue';

export default defineComponent({
    name: 'App',
    components: { ModalContent },
    setup() {
        const isOpen = ref(false);

        return {
            isOpen,
        };
    },
});
</script>
