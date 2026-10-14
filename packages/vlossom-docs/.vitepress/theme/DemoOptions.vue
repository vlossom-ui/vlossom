<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, defineAsyncComponent } from 'vue';
import { vlossomColors } from './vlossom.ts';

// 패널은 json5를 함께 쓰므로, 데모가 있는 페이지에서 처음 보일 때 따로 받는다.
const DemoOptionsPanel = defineAsyncComponent(() => import('./DemoOptionsPanel.vue'));

const { frontmatter } = useData();
const visible = computed(() => frontmatter.value.liveDemos === true && vlossomColors.value.length > 0);
</script>

<template>
    <DemoOptionsPanel v-if="visible" />
</template>
