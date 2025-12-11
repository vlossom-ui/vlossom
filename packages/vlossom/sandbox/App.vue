<template>
    <vs-layout style="min-height: 100vh">
        <vs-drawer v-model="leftOpen" placement="left" size="250px" open layout-responsive scroll-lock esc-close>
            <h1>Left Drawer</h1>
        </vs-drawer>
        <vs-container>
            <div style="height: 1000px; background-color: #f0f0f0; padding: 20px">
                <h2>Content</h2>
                <vs-button @click="leftOpen = !leftOpen">Toggle Left Drawer</vs-button>
                <vs-button @click="rightOpen = !rightOpen">Toggle Right Drawer</vs-button>
                <vs-button @click="modalOpen = !modalOpen">Toggle Modal Component</vs-button>
                <vs-button @click="openModal">Open Modal</vs-button>
                <vs-button @click="closeModal">Close Modal</vs-button>
                <div>
                    {{ scrollLockStore.scrollLockMap }}
                </div>
            </div>
        </vs-container>
        <vs-drawer v-model="rightOpen" placement="right" size="250px" open layout-responsive esc-close>
            <h1>Right Drawer</h1>
        </vs-drawer>
    </vs-layout>
    <vs-modal v-model="modalOpen" scroll-lock>
        <h1>Modal</h1>
    </vs-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useScrollLockStore } from '@/stores';
import { useVlossom } from '@/framework';

export default defineComponent({
    name: 'App',
    setup() {
        const leftOpen = ref(false);
        const rightOpen = ref(false);
        const modalOpen = ref(false);
        const scrollLockStore = useScrollLockStore();
        const $vs = useVlossom();

        function openModal() {
            $vs.modal.open('Modal');
        }

        function closeModal() {
            $vs.modal.close();
        }

        return { leftOpen, rightOpen, modalOpen, scrollLockStore, openModal, closeModal };
    },
});
</script>
