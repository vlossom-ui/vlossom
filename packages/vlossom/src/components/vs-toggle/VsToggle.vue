<template>
    <div class="vs-toggle">
        <slot name="toggle" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VsComponent } from '@/declaration';

const name = VsComponent.VsToggle;

export default defineComponent({
    name,
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        return {};
    },
});
</script>

<style src="./VsToggle.css" />
