<template>
    <div
        :class="['vs-skeleton', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
    >
        <div class="vs-skeleton-bg" />
        <div class="vs-skeleton-inner">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { type ComputedRef, computed, defineComponent, toRefs } from 'vue';
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

        const baseStyleSet: ComputedRef<Partial<VsSkeletonStyleSet>> = computed(() => ({}));

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsSkeletonStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

        return {
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsSkeleton.css" />
