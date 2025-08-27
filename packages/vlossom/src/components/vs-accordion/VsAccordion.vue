<template>
    <vs-responsive
        tag="details"
        :class="['vs-accordion', colorSchemeClass, classObj]"
        :width
        :grid
        :style="componentStyleSet"
        :open="isOpen"
        @toggle.stop="onToggle"
    >
        <summary :class="['vs-accordion-title', { 'vs-focusable': !disabled }]" :tabindex="disabled ? -1 : 0">
            <slot name="title" />
        </summary>
        <div class="vs-accordion-expand">
            <slot />
        </div>
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
            'vs-disabled': disabled.value,
            'vs-primary': primary.value,
        }));

        function onToggle(event: Event) {
            const element = event.target as HTMLDetailsElement;
            isOpen.value = element.open;
        }

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
            onToggle,
            toggle,
        };
    },
});
</script>

<style src="./VsAccordion.css" />
