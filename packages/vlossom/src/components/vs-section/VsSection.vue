<template>
    <div :class="['vs-section']">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {},
    setup() {
        return {};
    },
});
</script>

<style src="./VsSection.css" />
