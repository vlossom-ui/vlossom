<template>
    <div>
        <h1>Hello Vlossom</h1>
        <vs-section>
            <vs-button>Click me</vs-button>
        </vs-section>
    </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const app = getCurrentInstance();
        console.log(app?.appContext.components);
        return {};
    },
});
</script>
