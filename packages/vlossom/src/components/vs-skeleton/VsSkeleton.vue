<template>
    <div :class="['vs-skeleton', colorSchemeClass]" :style="styleSetVariables">
        <div class="vs-skeleton-bg" />
        <div class="vs-skeleton-inner">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsSkeletonStyleSet } from './types';

const name = VsComponent.VsSkeleton;
export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsSkeletonStyleSet>(),
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { styleSetVariables } = useStyleSet<VsSkeletonStyleSet>(name, styleSet);

        return {
            colorSchemeClass,
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsSkeleton.css" scoped />
