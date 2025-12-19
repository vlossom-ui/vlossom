<template>
    <vs-responsive :class="['vs-block', colorSchemeClass]" :style="styleSetVariables" :grid :width>
        <vs-inner-scroll>
            <template #header v-if="$slots['title']">
                <div class="vs-block-title">
                    <slot name="title" />
                </div>
            </template>
            <div class="vs-block-content">
                <slot />
            </div>
        </vs-inner-scroll>
    </vs-responsive>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import { stringUtil, objectUtil } from '@/utils';
import type { VsBlockStyleSet } from './types';

import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';
import VsInnerScroll from '@/components/vs-inner-scroll/VsInnerScroll.vue';

const componentName = VsComponent.VsBlock;
export default defineComponent({
    name: componentName,
    components: { VsResponsive, VsInnerScroll },
    props: {
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsBlockStyleSet>(),
        height: { type: [String, Number] },
    },
    setup(props) {
        const { colorScheme, styleSet, height } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
        const additionalStyleSet = computed(() => {
            return objectUtil.shake({
                height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
            });
        });
        const { styleSetVariables } = useStyleSet<VsBlockStyleSet>(componentName, styleSet, additionalStyleSet);

        return {
            colorSchemeClass,
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsBlock.css" />
