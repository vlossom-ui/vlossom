<template>
    <vs-responsive
        :class="['vs-block', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
        :grid
        :width
    >
        <vs-inner-scroll :color-scheme="computedColorScheme" :style-set="innerScrollStyleSet">
            <template #header v-if="$slots['title']">
                <div class="vs-block-title" :style="componentStyleSet.$title">
                    <slot name="title" />
                </div>
            </template>
            <div class="vs-block-content" :style="componentStyleSet.$content">
                <slot />
            </div>
        </vs-inner-scroll>
    </vs-responsive>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import { stringUtil, objectUtil } from '@/utils';
import type { VsBlockStyleSet } from './types';
import type { VsInnerScrollStyleSet } from '@/components/vs-inner-scroll/types';

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

        const { colorSchemeClass, computedColorScheme } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<VsBlockStyleSet> = computed(() => ({}));
        const additionalStyleSet: ComputedRef<Partial<VsBlockStyleSet>> = computed(() => {
            return objectUtil.shake({
                height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
            });
        });

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsBlockStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        const innerScrollStyleSet: VsInnerScrollStyleSet = { $header: { padding: 0 }, $content: { padding: 0 } };

        return {
            innerScrollStyleSet,
            colorSchemeClass,
            computedColorScheme,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,
        };
    },
});
</script>

<style src="./VsBlock.css" />
