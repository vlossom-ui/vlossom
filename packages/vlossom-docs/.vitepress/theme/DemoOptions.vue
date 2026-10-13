<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, defineAsyncComponent } from 'vue';
import { vlossomColors } from './vlossom.ts';

// 패널은 json5를 함께 쓰므로, 데모가 있는 페이지에서 처음 보일 때 따로 받는다.
const DemoOptionsPanel = defineAsyncComponent(() => import('./DemoOptionsPanel.vue'));

const { frontmatter } = useData();
// 패널은 vlossom이 전역 등록한 컴포넌트를 쓴다. 컴파일된 render 함수는 v-if 안의 컴포넌트도 맨 앞에서 찾으므로,
// 한 파일에 두면 vlossom을 불러오기 전에 "Failed to resolve component" 경고가 난다. 그래서 vlossom을 불러온 뒤에만 패널을 그린다.
const visible = computed(() => frontmatter.value.liveDemos === true && vlossomColors.value.length > 0);
</script>

<template>
    <DemoOptionsPanel v-if="visible" />
</template>
