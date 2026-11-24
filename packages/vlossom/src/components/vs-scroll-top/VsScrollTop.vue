<template>
    <Transition name="vs-scroll-top" :css="!noAnimation">
        <div
            v-if="isShow"
            :class="['vs-scroll-top', { 'vs-fixed': fixed }]"
            :style="{ ...styleSetVariables, ...componentInlineStyle }"
        >
            <slot :scroll-to-top>
                <vs-button
                    :color-scheme="computedColorScheme"
                    :style-set="componentStyleSet.$button"
                    :aria-label="optionMessages.VS_ARIA_SCROLL_TOP"
                    :ghost
                    :outline
                    :primary
                    :size
                    @click="scrollToTop"
                >
                    <ArrowUpIcon aria-hidden="true" />
                </vs-button>
            </slot>
        </div>
    </Transition>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, toRefs, type PropType } from 'vue';
import { VsComponent, type Size } from '@/declaration';
import { useColorScheme, useMessages, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { logUtil } from '@/utils';
import type { VsScrollTopStyleSet } from './types';

import { ArrowUpIcon } from '@lucide/vue';
import VsButton from '@/components/vs-button/VsButton.vue';

const componentName = VsComponent.VsScrollTop;
export default defineComponent({
    name: componentName,
    components: { VsButton, ArrowUpIcon },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsScrollTopStyleSet>(),
        fixed: { type: Boolean, default: false },
        ghost: { type: Boolean, default: false },
        noAnimation: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
        size: { type: String as PropType<Size>, default: 'md' },
        target: { type: String, default: '' },
        threshold: { type: [Number, String], default: 200 },
    },
    setup(props) {
        const { colorScheme, styleSet, noAnimation, target, threshold } = toRefs(props);

        const { optionMessages } = useMessages();

        const { computedColorScheme } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsScrollTopStyleSet>(
            componentName,
            styleSet,
        );

        // target은 mount 시점에 한 번만 조회한다 (README Caution 참고)
        let scrollContainer: HTMLElement | Window | null = null;
        const hasScrollContainer = ref(false);
        const scrollTop = ref(0);

        const isShow = computed(() => hasScrollContainer.value && scrollTop.value >= Number(threshold.value));

        function updateScrollTop() {
            if (!scrollContainer) {
                return;
            }
            scrollTop.value = scrollContainer === window ? window.scrollY : (scrollContainer as HTMLElement).scrollTop;
        }

        function scrollToTop() {
            if (!scrollContainer) {
                return;
            }
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            scrollContainer.scrollTo({ top: 0, behavior: noAnimation.value || reducedMotion ? 'instant' : 'smooth' });
        }

        onMounted(() => {
            scrollContainer = target.value ? document.querySelector<HTMLElement>(target.value) : window;
            if (!scrollContainer) {
                logUtil.propWarning(componentName, 'target', `cannot find element: ${target.value}`);
                return;
            }
            hasScrollContainer.value = true;
            scrollContainer.addEventListener('scroll', updateScrollTop, { passive: true });
            updateScrollTop();
        });

        onBeforeUnmount(() => {
            scrollContainer?.removeEventListener('scroll', updateScrollTop);
            scrollContainer = null;
            hasScrollContainer.value = false;
        });

        return {
            isShow,
            optionMessages,
            computedColorScheme,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,
            scrollToTop,
        };
    },
});
</script>

<style src="./VsScrollTop.css" />
