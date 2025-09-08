<template>
    <vs-container>
        <vs-page
            :style-set="{
                padding: '10rem',
                title: { padding: '0 0 20rem 0' },
                description: { padding: '0 0 20rem 0' },
                fontColor: 'red',
                fontSize: '20rem',
                fontWeight: 'bold',
                lineHeight: '30rem',
            }"
        >
            <template #title> Hello Vlossom </template>
            <template #description>
                Vlossom is a vibrant and versatile [Vue](https://vuejs.org/) UI library designed to blossom your web
                applications with elegance and ease.
            </template>
            lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet
        </vs-page>
    </vs-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        return {};
    },
});
</script>
