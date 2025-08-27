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
        <VsExpandTransition :open="isOpen" :style-set="componentStyleSet.expand">
            <slot />
        </VsExpandTransition>
    </vs-responsive>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { getColorSchemeProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsAccordionStyleSet } from './types';
import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';
import VsExpandTransition from '@/components/vs-expand-transition/VsExpandTransition.vue';

const name = VsComponent.VsAccordion;
export default defineComponent({
    name,
    components: { VsResponsive, VsExpandTransition },
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
        };
    },
});
</script>

<style src="./VsAccordion.css" />
