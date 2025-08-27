<template>
    <Transition name="vs-expand" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
        <div v-if="open" class="vs-expand-transition-wrapper" :style="componentStyleSet">
            <div class="vs-expand-transition-content">
                <slot />
            </div>
        </div>
    </Transition>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import { useStyleSet } from '@/composables';
import type { VsExpandTransitionStyleSet } from './types';

const name = VsComponent.VsExpandTransition;
export default defineComponent({
    name,
    props: {
        ...getStyleSetProps<VsExpandTransitionStyleSet>(),
        open: { type: Boolean, required: true, default: false },
    },
    setup(props) {
        const { styleSet } = toRefs(props);

        const { componentStyleSet } = useStyleSet<VsExpandTransitionStyleSet>(name, styleSet);

        function beforeEnter(el: Element) {
            const element = el as HTMLElement;
            element.style.height = '0';
            element.style.opacity = '0';
        }

        function enter(el: Element, done: () => void) {
            const element = el as HTMLElement;
            const content = element.querySelector('.vs-expand-transition-content') as HTMLElement;

            if (!content) {
                console.warn('VsExpandTransition: content element not found');
                done();
                return;
            }

            element.style.height = content.offsetHeight + 'px';
            element.style.opacity = '1';

            function handleTransitionEnd() {
                element.removeEventListener('transitionend', handleTransitionEnd);
                element.style.height = 'auto';
                done();
            }

            element.addEventListener('transitionend', handleTransitionEnd);
        }

        function beforeLeave(el: Element) {
            const element = el as HTMLElement;
            const content = element.querySelector('.vs-expand-transition-content') as HTMLElement;

            if (!content) {
                console.warn('VsExpandTransition: content element not found');
                return;
            }

            element.style.height = content.offsetHeight + 'px';
        }

        function leave(el: Element, done: () => void) {
            const element = el as HTMLElement;
            // force reflow
            void element.offsetHeight;
            element.style.height = '0';
            element.style.opacity = '0';

            function handleTransitionEnd() {
                element.removeEventListener('transitionend', handleTransitionEnd);
                done();
            }

            element.addEventListener('transitionend', handleTransitionEnd);
        }

        return {
            componentStyleSet,
            beforeEnter,
            enter,
            beforeLeave,
            leave,
        };
    },
});
</script>

<style src="./VsExpandTransition.css" />
