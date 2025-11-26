<template>
    <div>
        <h1>Hello Vlossom</h1>
    </div>
    <vs-tabs
        :tabs="['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6', 'Tab 7', 'Tab 8']"
        :disabled="(index, tab) => tab === 'Tab 2'"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        return {};
    },
});
</script>
