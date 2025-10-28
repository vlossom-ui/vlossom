<template>
    <div>
        <h1>Hello Vlossom</h1>
        <div id="vs-toast-wrapper" style="width: 300px; height: 300px; border: 2px solid red"></div>
        <button @click="showToast">Show Toast</button>
        <button @click="showPrimaryToast">Show Primary Toast</button>
        <button @click="showErrorToast">Show Error Toast</button>
        <button @click="clearToast">Clear Toast</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import { COLORS } from '@/declaration';

export default defineComponent({
    name: 'App',
    setup() {
        const instance = getCurrentInstance();

        function showToast() {
            instance?.proxy?.$vs.toast.show('Hello Toast!');
        }

        function showPrimaryToast() {
            instance?.proxy?.$vs.toast.show('Primary Toast', { primary: true });
        }

        function showErrorToast() {
            instance?.proxy?.$vs.toast.show('Error Toast', { colorScheme: 'rose' });
        }

        function clearToast() {
            instance?.proxy?.$vs.toast.clear();
        }

        return {
            showToast,
            showPrimaryToast,
            showErrorToast,
            clearToast,
            COLORS,
        };
    },
});
</script>
