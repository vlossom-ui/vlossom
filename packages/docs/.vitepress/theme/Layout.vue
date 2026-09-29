<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import ColorSchemeBar from './ColorSchemeBar.vue';

const { Layout } = DefaultTheme;
const { page } = useData();

const isComponentPage = computed(() => /(^|\/)components\//.test(page.value.relativePath));
</script>

<template>
    <Layout>
        <template #doc-before>
            <ColorSchemeBar v-if="isComponentPage" />
        </template>
    </Layout>
</template>
