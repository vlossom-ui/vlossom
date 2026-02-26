<template>
    <vs-responsive
        :class="['vs-label-value', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
        :width
        :grid
    >
        <div v-if="$slots['label']" class="vs-cell vs-label" :style="componentStyleSet.label">
            <slot name="label" />
        </div>
        <div v-if="$slots.default" class="vs-cell vs-value" :style="componentStyleSet.value">
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
        responsiveVertical: { type: Boolean, default: false },
    },
    setup(props) {
        const { colorScheme, styleSet, dense, primary, vertical, responsiveVertical } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { styleSetVariables, componentStyleSet } = useStyleSet<VsLabelValueStyleSet>(componentName, styleSet);

        const classObj = computed(() => ({
            'vs-dense': dense.value,
            'vs-primary': primary.value,
            'vs-vertical': vertical.value,
            'vs-responsive-vertical': responsiveVertical.value,
        }));

        return {
            classObj,
            colorSchemeClass,
            styleSetVariables,
            componentStyleSet,
        };
    },
});
</script>

<style src="./VsLabelValue.css" />
