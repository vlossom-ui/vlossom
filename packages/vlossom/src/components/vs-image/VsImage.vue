<template>
    <div class="vs-image" ref="vsImageRef" :style="{ ...styleSetVariables, ...componentInlineStyle }">
        <vs-skeleton v-if="isLoading && !noSkeleton" :style-set="componentStyleSet.$skeleton">
            <slot name="skeleton" />
        </vs-skeleton>
        <div v-if="showDefaultFallback" class="vs-image-fallback">
            <ImageIcon class="vs-image-fallback-icon" />
        </div>
        <img
            :class="['vs-image-tag', { 'vs-hidden': isLoading || showDefaultFallback }]"
            :src="computedSrc"
            :alt="alt"
            :style="componentStyleSet.$image"
            @load.stop="onImageLoad"
            @error.stop="onImageError"
        />
    </div>
</template>

<script lang="ts">
import { type ComputedRef, computed, defineComponent, ref, toRefs, watch } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useStyleSet } from '@/composables';
import { VsComponent } from '@/declaration';
import { getStyleSetProps } from '@/props';
import { objectUtil, stringUtil } from '@/utils';

import { ImageIcon } from '@lucide/vue';
import VsSkeleton from '@/components/vs-skeleton/VsSkeleton.vue';

import type { VsImageStyleSet } from './types';

const componentName = VsComponent.VsImage;
export default defineComponent({
    name: componentName,
    components: { VsSkeleton, ImageIcon },
    props: {
        ...getStyleSetProps<VsImageStyleSet>(),
        alt: { type: String, default: '' },
        fallback: { type: String, default: '' },
        height: { type: [String, Number] },
        lazy: { type: Boolean, default: false },
        noSkeleton: { type: Boolean, default: false },
        src: { type: String, required: true, default: '' },
        width: { type: [String, Number] },
    },
    emits: ['error'],
    setup(props, { emit }) {
        const { styleSet, src, fallback, lazy, width, height } = toRefs(props);

        const baseStyleSet: ComputedRef<VsImageStyleSet> = computed(() => ({}));
        const additionalStyleSet: ComputedRef<Partial<VsImageStyleSet>> = computed(() => {
            return objectUtil.shake({
                width: width.value === undefined ? undefined : stringUtil.toStringSize(width.value),
                height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
            });
        });

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsImageStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        const vsImageRef = ref(null);

        const hasIntersectionObserver = window && window.IntersectionObserver !== undefined;

        const isLoading = ref(true); // check if img tag src is loaded
        const isLoaded = ref(hasIntersectionObserver && lazy.value ? false : true);
        const isFallback = ref(false);
        const showDefaultFallback = ref(false);

        const computedSrc: ComputedRef<string> = computed(() => {
            if (!isLoaded.value) {
                return '';
            }
            if (isFallback.value) {
                return fallback.value;
            }

            return src.value;
        });

        watch([src, fallback], () => {
            isFallback.value = false;
            showDefaultFallback.value = false;
        });

        function onImageLoad() {
            isLoading.value = false;
        }

        function onImageError() {
            if (!isLoaded.value) {
                return;
            }

            emit('error');
            isLoading.value = false;

            if (fallback.value && !isFallback.value) {
                isFallback.value = true;
                return;
            }

            showDefaultFallback.value = true;
        }

        if (hasIntersectionObserver && lazy.value) {
            // Use Intersection Observer for Lazy Load
            const { pause } = useIntersectionObserver(vsImageRef, ([{ isIntersecting }]) => {
                if (isIntersecting) {
                    isLoaded.value = true;
                    pause();
                }
            });
        }

        return {
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,
            computedSrc,
            vsImageRef,
            isLoading,
            showDefaultFallback,
            onImageLoad,
            onImageError,
        };
    },
});
</script>

<style src="./VsImage.css" />
