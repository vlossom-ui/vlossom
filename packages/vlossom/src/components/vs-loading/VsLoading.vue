<template>
    <div :class="['vs-loading', colorSchemeClass]" :style="styleSetVariables">
        <div class="vs-loading-rect vs-loading-rect1" />
        <div class="vs-loading-rect vs-loading-rect2" />
        <div class="vs-loading-rect vs-loading-rect3" />
        <div class="vs-loading-rect vs-loading-rect4" />
        <div class="vs-loading-rect vs-loading-rect5" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsLoadingStyleSet } from './types';
import { objectUtil, stringUtil } from '@/utils';

const name = VsComponent.VsLoading;

export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsLoadingStyleSet>(),
        width: { type: [String, Number] },
        height: { type: [String, Number] },
    },
    setup(props) {
        const { colorScheme, styleSet, width, height } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const additionalStyleSet = computed(() => {
            return objectUtil.shake({
                width: width.value === undefined ? undefined : stringUtil.toStringSize(width.value),
                height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
            });
        });

        const { styleSetVariables } = useStyleSet(name, styleSet, additionalStyleSet);

        return { colorSchemeClass, styleSetVariables };
    },
});
</script>

<style src="./VsLoading.css" />
