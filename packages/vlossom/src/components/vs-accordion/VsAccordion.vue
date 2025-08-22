<template>
    <vs-responsive class="vs-accordion" :width :grid>
        <details
            :class="['vs-accordion-details', colorSchemeClass]"
            :style="componentStyleSet"
            :open="isOpen"
            @toggle.stop="onToggle"
        >
            <summary class="vs-accordion-summary">
                <slot name="title" />
            </summary>
            <div class="vs-accordion-content">
                <slot />
            </div>
        </details>
    </vs-responsive>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue';
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
        open: { type: Boolean, default: false },
        // v-model
        modelValue: { type: Boolean, default: false },
    },
    setup(props, { emit }) {
        const { colorScheme, styleSet, open, modelValue } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const { componentStyleSet } = useStyleSet<VsAccordionStyleSet>(name, styleSet);

        const isOpen = ref(open.value || modelValue.value);

        function onToggle(event: Event) {
            const element = event.target as HTMLDetailsElement;
            isOpen.value = element.open;
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
            onToggle,
        };
    },
});
</script>

<style src="./VsAccordion.css" />
