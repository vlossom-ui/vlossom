<template>
    <div
        :class="['vs-chip', 'vs-inline-gap', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
    >
        <span v-if="!!$slots.icon" class="vs-chip-icon" :style="componentStyleSet.$icon">
            <slot name="icon" />
        </span>

        <span class="vs-chip-content">
            <slot />
        </span>

        <button
            v-if="closable"
            type="button"
            class="vs-chip-icon vs-chip-close-button"
            tabindex="-1"
            :aria-label="optionMessages.VS_ARIA_CHIP_CLOSE"
            :style="componentStyleSet.$closeButton"
            @click.prevent.stop="$emit('close')"
        >
            <XIcon class="vs-chip-close-icon" />
        </button>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type PropType } from 'vue';
import { VsComponent, type Size } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme, useSizeClass, useStyleSet, useMessages } from '@/composables';
import type { VsChipStyleSet } from './types';

import { XIcon } from '@lucide/vue';

const componentName = VsComponent.VsChip;
export default defineComponent({
    name: componentName,
    components: { XIcon },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsChipStyleSet>(),
        closable: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
        size: { type: String as PropType<Size>, default: 'md' },
    },
    emits: ['close'],
    setup(props) {
        const { optionMessages } = useMessages();
        const { colorScheme, size, primary, outline, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsChipStyleSet>(
            componentName,
            styleSet,
        );

        const { sizeClass } = useSizeClass(size);

        const classObj = computed(() => ({
            'vs-outline': outline.value,
            'vs-primary': primary.value,
            [sizeClass.value]: !!sizeClass.value,
        }));

        return {
            colorSchemeClass,
            componentStyleSet,
            optionMessages,
            styleSetVariables,
            componentInlineStyle,
            classObj,
        };
    },
});
</script>

<style src="./VsChip.css" />
