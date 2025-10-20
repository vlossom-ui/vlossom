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
import { computed, defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsChipStyleSet } from './types';
import { closeIcon } from './icons';

import VsRender from '@/components/vs-render/VsRender.vue';

const name = VsComponent.VsChip;

export default defineComponent({
    name,
    components: { VsRender },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsChipStyleSet>(),
        closable: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
    },
    emits: ['close'],
    setup(props, { slots }) {
        const { colorScheme, small, primary, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { styleSetVariables } = useStyleSet<VsChipStyleSet>(name, styleSet);

        const hasIcon = computed((): boolean => !!slots['icon']);

        const classObj = computed(() => ({
            'vs-small': small.value,
            'vs-primary': primary.value,
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
