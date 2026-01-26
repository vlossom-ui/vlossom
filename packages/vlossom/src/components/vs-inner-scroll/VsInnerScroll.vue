<template>
    <div class="vs-inner-scroll" :style="styleSetVariables">
        <div v-if="$slots['header']" class="vs-inner-scroll-header" :style="componentStyleSet.header">
            <slot name="header" />
        </div>

        <div
            ref="bodyRef"
            :class="['vs-inner-scroll-body', { 'vs-hide-scroll': hideScroll }]"
            :style="componentStyleSet.content"
        >
            <slot />
        </div>

        <div v-if="$slots['footer']" class="vs-inner-scroll-footer" :style="componentStyleSet.footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, useTemplateRef, type TemplateRef } from 'vue';
import { VsComponent } from '@/declaration';
import { getStyleSetProps } from '@/props';
import { useStyleSet } from '@/composables';
import type { VsInnerScrollStyleSet } from './types';

const componentName = VsComponent.VsInnerScroll;
export default defineComponent({
    name: componentName,
    props: {
        ...getStyleSetProps<VsInnerScrollStyleSet>(),
        hideScroll: { type: Boolean, default: false },
    },
    // expose: ['hasScroll'],
    setup(props) {
        const { styleSet } = toRefs(props);
        const bodyRef: TemplateRef<HTMLElement> = useTemplateRef('bodyRef');

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsInnerScrollStyleSet>(componentName, styleSet);

        function hasScroll() {
            if (!bodyRef.value) {
                return false;
            }

            return bodyRef.value.scrollHeight > bodyRef.value.clientHeight;
        }

        return { componentStyleSet, styleSetVariables, hasScroll, bodyRef };
    },
});
</script>

<style src="./VsInnerScroll.css" />
