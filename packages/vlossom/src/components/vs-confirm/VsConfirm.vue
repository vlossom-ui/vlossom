<template>
    <div>VsConfirm</div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue';
import { VsComponent } from '@/declaration';

const name = VsComponent.VsConfirm;

export default defineComponent({
    name,
    setup() {
        return () => h('div', 'VsConfirm');
    },
});
</script>

<style src="./VsConfirm.css" />
