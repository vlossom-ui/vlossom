<template>
    <div :class="['vs-loading', colorSchemeClass]" :style="computedStyleSet">
        <div class="vs-loading-rect1" />
        <div class="vs-loading-rect2" />
        <div class="vs-loading-rect3" />
        <div class="vs-loading-rect4" />
        <div class="vs-loading-rect5" />
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsLoadingStyleSet } from './types';

const name = VsComponent.VsLoading;

export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsLoadingStyleSet>(),
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { computedStyleSet } = useStyleSet(name, styleSet);

        return { colorSchemeClass, computedStyleSet };
    },
});
</script>

<style src="./VsLoading.css" />
