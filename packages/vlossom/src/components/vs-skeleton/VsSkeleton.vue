<template>
    <div :class="['vs-skeleton', colorSchemeClass]" :style="componentStyleSet.component">
        <div class="vs-skeleton-bg" :style="componentStyleSet.backGround" />
        <div class="vs-skeleton-inner" :style="componentStyleSet.inner">
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

const componentName = VsComponent.VsSkeleton;
export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsSkeletonStyleSet>(),
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet } = useStyleSet<VsSkeletonStyleSet>(componentName, styleSet);

        return {
            colorSchemeClass,
            componentStyleSet,
        };
    },
});
</script>

<style src="./VsSkeleton.css" />
