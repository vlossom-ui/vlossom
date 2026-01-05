<template>
    <div :class="['vs-chip', 'vs-inline-gap', colorSchemeClass, classObj]" :style="styleSetVariables">
        <span v-if="hasIcon" class="vs-icon-container vs-chip-icon">
            <slot name="icon" />
        </span>

        <span class="vs-chip-content">
            <slot />
        </span>

        <button
            v-if="closable"
            type="button"
            class="vs-icon-container vs-chip-close-button"
            aria-label="close"
            tabindex="-1"
            @click.prevent.stop="$emit('close')"
        >
            <vs-render :content="closeIcon" />
        </button>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type PropType } from 'vue';
import { VsComponent, type Size } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsChipStyleSet } from './types';
import { closeIcon } from '@/icons';

import VsRender from '@/components/vs-render/VsRender.vue';

const componentName = VsComponent.VsChip;
export default defineComponent({
    name: componentName,
    components: { VsRender },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsChipStyleSet>(),
        closable: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
        size: { type: String as PropType<Size>, default: 'md' },
    },
    emits: ['close'],
    setup(props, { slots }) {
        const { colorScheme, size, primary, outline, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { styleSetVariables } = useStyleSet<VsChipStyleSet>(componentName, styleSet);

        const hasIcon = computed((): boolean => !!slots['icon']);

        const sizeClass = computed(() => (size.value ? `vs-${size.value}` : ''));

        const classObj = computed(() => ({
            'vs-outline': outline.value,
            'vs-primary': primary.value,
            [sizeClass.value]: !!sizeClass.value,
        }));

        return {
            colorSchemeClass,
            styleSetVariables,
            hasIcon,
            classObj,
            closeIcon,
        };
    },
});
</script>

<style src="./VsChip.css" />
