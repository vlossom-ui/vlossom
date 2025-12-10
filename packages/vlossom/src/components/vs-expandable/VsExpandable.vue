<template>
    <Transition name="vs-expand" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
        <div v-if="open" class="vs-expandable-wrapper" :style="componentStyleSet">
            <div class="vs-expandable-content">
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
import type { VsExpandableStyleSet } from './types';

const componentName = VsComponent.VsExpandable;
export default defineComponent({
    name: componentName,
    props: {
        ...getStyleSetProps<VsExpandableStyleSet>(),
        open: { type: Boolean, required: true, default: false },
    },
    setup(props) {
        const { styleSet } = toRefs(props);

        const { componentStyleSet } = useStyleSet<VsExpandableStyleSet>(componentName, styleSet);

        function beforeEnter(el: Element) {
            const element = el as HTMLElement;
            element.style.height = '0';
            element.style.opacity = '0';
        }

        function enter(el: Element, done: () => void) {
            const element = el as HTMLElement;
            const content = element.querySelector('.vs-expandable-content') as HTMLElement;

            if (!content) {
                console.warn('VsExpandable: content element not found');
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
            const content = element.querySelector('.vs-expandable-content') as HTMLElement;

            if (!content) {
                console.warn('VsExpandable: content element not found');
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

<style src="./VsExpandable.css" />
