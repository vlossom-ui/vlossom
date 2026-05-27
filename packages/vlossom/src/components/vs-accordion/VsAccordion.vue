<template>
    <vs-responsive
        :class="['vs-accordion', colorSchemeClass, classObj, { 'vs-accordion-open': isOpen }]"
        :width
        :grid
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
        :tabindex="disabled ? -1 : 0"
        @keydown.enter.prevent.stop="toggle"
        @keydown.space.prevent.stop="toggle"
    >
        <div class="vs-accordion-title" :style="componentStyleSet.$title" @click.prevent.stop="toggle">
            <slot name="title" />
        </div>
        <vs-expandable :open="isOpen" :size :style-set="componentStyleSet.$content">
            <slot />
        </vs-expandable>
    </vs-responsive>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch, type PropType } from 'vue';
import { getColorSchemeProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { VsComponent, type Size } from '@/declaration';
import { useColorScheme, useSizeClass, useStyleSet } from '@/composables';
import type { VsAccordionStyleSet } from './types';

import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';
import VsExpandable from '@/components/vs-expandable/VsExpandable.vue';

const componentName = VsComponent.VsAccordion;
export default defineComponent({
    name: componentName,
    components: { VsResponsive, VsExpandable },
    props: {
        ...getColorSchemeProps(),
        ...getResponsiveProps(),
        ...getStyleSetProps<VsAccordionStyleSet>(),
        disabled: { type: Boolean, default: false },
        open: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
        size: { type: String as PropType<Size>, default: 'md' },

        // v-model
        modelValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'toggle'],
    // expose: ['toggle'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, open, modelValue, disabled, primary, size } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsAccordionStyleSet>(
            componentName,
            styleSet,
        );

        const isOpen = ref(open.value || modelValue.value);

        const { sizeClass } = useSizeClass(size);
        const classObj = computed(() => ({
            'vs-focus-visible': !disabled.value,
            'vs-disabled': disabled.value,
            'vs-primary': primary.value,
            [sizeClass.value]: !!sizeClass.value,
        }));

        function toggle() {
            if (disabled.value) {
                return;
            }
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
            styleSetVariables,
            componentStyleSet,
            componentInlineStyle,
            isOpen,
            classObj,
            toggle,
        };
    },
});
</script>

<style src="./VsAccordion.css" />
