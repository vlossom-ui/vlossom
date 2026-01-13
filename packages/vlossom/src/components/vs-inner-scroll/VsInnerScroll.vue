<template>
    <div class="vs-inner-scroll">
        <div v-if="$slots['header']" class="vs-inner-scroll-header">
            <slot name="header" />
        </div>

        <div ref="bodyRef" :class="['vs-inner-scroll-body', { 'vs-hide-scroll': hideScroll }]">
            <slot />
        </div>

        <div v-if="$slots['footer']" class="vs-inner-scroll-footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, useTemplateRef, type TemplateRef } from 'vue';
import { VsComponent } from '@/declaration';

const componentName = VsComponent.VsInnerScroll;
export default defineComponent({
    name: componentName,
    props: {
        hideScroll: { type: Boolean, default: false },
    },
    // expose: ['hasScroll'],
    setup() {
        const bodyRef: TemplateRef<HTMLElement> = useTemplateRef('bodyRef');

        function hasScroll() {
            if (!bodyRef.value) {
                return false;
            }

            return bodyRef.value.scrollHeight > bodyRef.value.clientHeight;
        }

        return { hasScroll, bodyRef };
    },
});
</script>

<style src="./VsInnerScroll.css" />
