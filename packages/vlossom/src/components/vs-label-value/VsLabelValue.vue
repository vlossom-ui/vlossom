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
import { computed, defineComponent, toRefs } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps, getResponsiveProps } from '@/props';
import { VsComponent } from '@/declaration';
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
        dense: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
        vertical: { type: Boolean, default: false },
        responsive: { type: Boolean, default: false },
    },
    setup(props) {
        const { colorScheme, styleSet, dense, primary, vertical, responsive } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { styleSetVariables, componentStyleSet, componentInlineStyle } = useStyleSet<VsLabelValueStyleSet>(
            componentName,
            styleSet,
        );

        const classObj = computed(() => ({
            'vs-dense': dense.value,
            'vs-primary': primary.value,
            'vs-vertical': vertical.value,
            'vs-responsive-vertical': responsive.value,
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
