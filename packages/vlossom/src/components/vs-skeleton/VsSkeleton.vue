<template>
    <div :class="['vs-skeleton', colorSchemeClass]" :style="styleSetVariables">
        <div class="vs-skeleton-bg" />
        <div class="vs-skeleton-inner">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, toRefs } from 'vue';
import { type ColorScheme, VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';

import type { VsSkeletonStyleSet } from './types';

const name = VsComponent.VsSkeleton;
export default defineComponent({
    name,
    props: {
        colorScheme: { type: String as PropType<ColorScheme> },
        styleSet: { type: [String, Object] as PropType<string | VsSkeletonStyleSet> },
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

<style lang="scss" src="./VsSkeleton.scss" />
