<template>
    <component :is="tag" :class="['vs-responsive', responsiveClasses]" :style="responsiveStyles">
        <slot />
    </component>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { getResponsiveProps } from '@/props';
import { VsComponent } from '@/declaration';
import { useResponsive } from './composables/responsive-composable';

const name = VsComponent.VsResponsive;
export default defineComponent({
    name,
    props: {
        ...getResponsiveProps(),
        tag: { type: String, default: 'div' },
    },
    setup(props) {
        const { width, grid } = toRefs(props);

        const { responsiveClasses, responsiveStyles } = useResponsive(width, grid);

        return {
            responsiveClasses,
            responsiveStyles,
        };
    },
});
</script>

<style src="./VsResponsive.css" />
