<template>
    <div>
        <h1>Hello Vlossom</h1>
        <Sandbox />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sandbox from './Sandbox.vue';

export default defineComponent({
    name: 'App',
    components: { Sandbox },
    setup() {
        return {};
    },
});
</script>
