<template>
    <div>
        <h1>Hello Vlossom</h1>
        <vs-button @click="showToast()">Show Toast</vs-button>
        <vs-button @click="showToast({ container: '#vs-toast-wrapper' })">Show Toast in Wrapper</vs-button>
        <vs-button @click="showPrimaryToast">Show Primary Toast</vs-button>
        <vs-button @click="showErrorToast">Show Error Toast</vs-button>
        <vs-button @click="clearToast">Clear Toast</vs-button>
        <vs-render :content="TestComp" />
        <div
            id="vs-toast-wrapper"
            style="margin-top: 20px; margin-left: 20px; width: 300px; height: 300px; border: 2px solid red"
        ></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { COLORS } from '@/declaration';
import { useVlossom } from '@/framework';
import type { ToastOptions } from '@/plugins';

import TestComp from './TestComp.vue';

export default defineComponent({
    name: 'App',
    setup() {
        const $vs = useVlossom();

        function showToast(options?: ToastOptions) {
            $vs.toast.show(TestComp, options);
        }

        function showPrimaryToast() {
            $vs.toast.show('Primary Toast', { primary: true });
        }

        function showErrorToast() {
            $vs.toast.error('Error Toast', { colorScheme: 'rose' });
        }

        function clearToast() {
            $vs.toast.clear();
        }

        return {
            showToast,
            showPrimaryToast,
            showErrorToast,
            clearToast,
            COLORS,
            TestComp,
        };
    },
});
</script>
