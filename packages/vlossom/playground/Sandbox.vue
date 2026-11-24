<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <template #title>
            <h1>Hello, Sandbox</h1>
        </template>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        return {};
    },
});
</script>
