<template>
    <button :type :class="['vs-button']">
        <slot />
    </button>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
    props: {
        type: {
            type: String as PropType<'button' | 'submit' | 'reset'>,
            default: 'button',
        },
    },
    setup() {
        return {};
    },
});
</script>

<style src="./VsButton.css" />
