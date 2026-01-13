<template>
    <div :class="['vs-loading', colorSchemeClass]" :style="{ ...styleSetVariables, ...componentStyleSet.component }">
        <div class="vs-loading-rect vs-loading-rect1" />
        <div class="vs-loading-rect vs-loading-rect2" />
        <div class="vs-loading-rect vs-loading-rect3" />
        <div class="vs-loading-rect vs-loading-rect4" />
        <div class="vs-loading-rect vs-loading-rect5" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import { stringUtil, objectUtil } from '@/utils';
import type { VsLoadingStyleSet } from './types';

const componentName = VsComponent.VsLoading;
export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsLoadingStyleSet>(),
        width: { type: [String, Number] },
        height: { type: [String, Number] },
    },
    setup(props) {
        const { colorScheme, styleSet, width, height } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<VsLoadingStyleSet> = computed(() => ({}));
        const additionalStyleSet: ComputedRef<VsLoadingStyleSet> = computed(() => {
            return {
                component: objectUtil.shake({
                    width: width.value === undefined ? undefined : stringUtil.toStringSize(width.value),
                    height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
                }),
            };
        });

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsLoadingStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        return { colorSchemeClass, componentStyleSet, styleSetVariables };
    },
});
</script>

<style src="./VsLoading.css" />
