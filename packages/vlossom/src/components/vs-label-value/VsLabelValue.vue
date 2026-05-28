<template>
    <vs-responsive
        :class="['vs-label-value', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
        :width
        :grid
    >
        <div v-if="$slots['label']" class="vs-cell vs-label" :style="componentStyleSet.$label">
            <slot name="label" />
        </div>
        <div class="vs-cell vs-value" :style="componentStyleSet.$value">
            <slot />
        </div>
    </vs-responsive>
</template>
<script lang="ts">
import { computed, defineComponent, toRefs, type PropType } from 'vue';
import { useColorScheme, useSizeClass, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps, getResponsiveProps } from '@/props';
import { VsComponent, type Size } from '@/declaration';
import type { VsLabelValueStyleSet } from './types';

import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';

const componentName = VsComponent.VsLabelValue;
export default defineComponent({
    name: componentName,
    components: { VsResponsive },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsLabelValueStyleSet>(),
        ...getResponsiveProps(),
        size: { type: String as PropType<Size>, default: 'md' },
        primary: { type: Boolean, default: false },
        vertical: { type: Boolean, default: false },
        responsive: { type: Boolean, default: false },
    },
    setup(props) {
        const { colorScheme, styleSet, size, primary, vertical, responsive } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { styleSetVariables, componentStyleSet, componentInlineStyle } = useStyleSet<VsLabelValueStyleSet>(
            componentName,
            styleSet,
        );

        const { sizeClass } = useSizeClass(size);
        const classObj = computed(() => ({
            'vs-primary': primary.value,
            'vs-vertical': vertical.value,
            'vs-responsive-vertical': responsive.value,
            [sizeClass.value]: !!sizeClass.value,
        }));

        return {
            classObj,
            colorSchemeClass,
            styleSetVariables,
            componentStyleSet,
            componentInlineStyle,
        };
    },
});
</script>

<style src="./VsLabelValue.css" />
