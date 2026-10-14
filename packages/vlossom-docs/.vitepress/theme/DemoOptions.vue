<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, defineAsyncComponent } from 'vue';
import { vlossomColors } from './vlossom.ts';

const DemoOptionsPanel = defineAsyncComponent(() => import('./DemoOptionsPanel.vue'));

const { frontmatter } = useData();
const visible = computed(() => frontmatter.value.liveDemos === true && vlossomColors.value.length > 0);
</script>

<template>
    <DemoOptionsPanel v-if="visible" />
</template>
