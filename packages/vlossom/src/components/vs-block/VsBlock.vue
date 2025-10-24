<template>
    <vs-responsive :class="['vs-block', colorSchemeClass]" :style="styleSetVariables" :grid="grid" :width="width">
        <div v-if="$slots['title']" class="vs-block-title">
            <slot name="title" />
        </div>
        <div class="vs-block-content">
            <slot />
        </div>
    </vs-responsive>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import type { VsBlockStyleSet } from './types';

import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';

const name = VsComponent.VsBlock;
export default defineComponent({
    name,
    components: { VsResponsive },
    props: {
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsBlockStyleSet>(),
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const { styleSetVariables } = useStyleSet<VsBlockStyleSet>(name, styleSet);

        return {
            colorSchemeClass,
            styleSetVariables,
        };
    },
});
</script>

<style lang="css" src="./VsBlock.css" />
