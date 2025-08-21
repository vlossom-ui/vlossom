<template>
    <div class="vs-inner-scroll" :style="styleSetVariables">
        <div v-if="$slots['header']" class="vs-inner-scroll-header">
            <slot name="header" />
        </div>

        <div :class="['vs-inner-scroll-body', { 'vs-hide-scroll': hideScroll }]">
            <slot />
        </div>

        <div v-if="$slots['footer']" class="vs-inner-scroll-footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { getStyleSetProps } from '@/props';
import { useStyleSet } from '@/composables';
import type { VsInnerScrollStyleSet } from './types';

const name = VsComponent.VsInnerScroll;
export default defineComponent({
    name,
    props: {
        ...getStyleSetProps<VsInnerScrollStyleSet>(),
        hideScroll: { type: Boolean, default: false },
    },
    setup(props) {
        const { styleSet } = toRefs(props);

        const { styleSetVariables } = useStyleSet(name, styleSet);

        return { styleSetVariables };
    },
});
</script>

<style src="./VsInnerScroll.css" />
