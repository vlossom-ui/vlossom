<template>
    <vs-responsive
        :class="['vs-accordion', colorSchemeClass, classObj, { 'vs-accordion-open': isOpen }]"
        :width
        :grid
        :style="componentStyleSet"
        :tabindex="disabled ? -1 : 0"
    >
        <div
            class="vs-accordion-title"
            @click="!disabled && toggle()"
            @keydown.enter="!disabled && toggle()"
            @keydown.space.prevent="!disabled && toggle()"
        >
            <slot name="title" />
        </div>
        <Transition
            name="vs-accordion"
            @before-enter="beforeEnter"
            @enter="enter"
            @before-leave="beforeLeave"
            @leave="leave"
        >
            <div v-if="isOpen" class="vs-accordion-expand">
                <div class="vs-accordion-expand-content">
                    <slot />
                </div>
            </div>
        </Transition>
    </vs-responsive>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { getColorSchemeProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsAccordionStyleSet } from './types';
import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';

const name = VsComponent.VsAccordion;
export default defineComponent({
    name,
    components: { VsResponsive },
    props: {
        ...getColorSchemeProps(),
        ...getResponsiveProps(),
        ...getStyleSetProps<VsAccordionStyleSet>(),
        disabled: { type: Boolean, default: false },
        open: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
        // v-model
        modelValue: { type: Boolean, default: false },
    },
    setup(props, { emit }) {
        const { colorScheme, styleSet, open, modelValue, disabled, primary } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const { componentStyleSet } = useStyleSet<VsAccordionStyleSet>(name, styleSet);

        const isOpen = ref(open.value || modelValue.value);

        const classObj = computed(() => ({
            'vs-focusable': !disabled.value,
            'vs-disabled': disabled.value,
            'vs-primary': primary.value,
        }));

        function toggle() {
            isOpen.value = !isOpen.value;
        }

        function beforeEnter(el: Element) {
            const element = el as HTMLElement;
            element.style.height = '0';
            element.style.opacity = '0';
        }

        function enter(el: Element, done: () => void) {
            const element = el as HTMLElement;
            const content = element.querySelector('.vs-accordion-expand-content') as HTMLElement;
            element.style.height = content.offsetHeight + 'px';
            element.style.opacity = '1';

            const handleTransitionEnd = () => {
                element.removeEventListener('transitionend', handleTransitionEnd);
                element.style.height = 'auto';
                done();
            };

            element.addEventListener('transitionend', handleTransitionEnd);
        }

        function beforeLeave(el: Element) {
            const element = el as HTMLElement;
            const content = element.querySelector('.vs-accordion-expand-content') as HTMLElement;
            element.style.height = content.offsetHeight + 'px';
        }

        function leave(el: Element, done: () => void) {
            const element = el as HTMLElement;
            // force reflow
            void element.offsetHeight;
            element.style.height = '0';
            element.style.opacity = '0';

            const handleTransitionEnd = () => {
                element.removeEventListener('transitionend', handleTransitionEnd);
                done();
            };

            element.addEventListener('transitionend', handleTransitionEnd);
        }

        watch(modelValue, (o) => {
            isOpen.value = o;
        });

        watch(isOpen, (o) => {
            emit('update:modelValue', o);
            emit('toggle', o);
        });

        return {
            colorSchemeClass,
            componentStyleSet,
            isOpen,
            classObj,
            toggle,
            beforeEnter,
            enter,
            beforeLeave,
            leave,
        };
    },
});
</script>

<style src="./VsAccordion.css" />
