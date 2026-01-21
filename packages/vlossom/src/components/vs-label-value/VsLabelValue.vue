<template>
    <vs-responsive
        :class="['vs-label-value', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
        :width
        :grid
    >
        <div v-if="$slots['label']" class="vs-cell vs-label">
            <slot name="label" />
        </div>
        <div v-if="$slots.default" class="vs-cell vs-value">
            <slot />
        </div>
    </vs-responsive>
</template>
<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
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
    },
    setup(props) {
        const { colorScheme, styleSet, dense, primary } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<Partial<VsLabelValueStyleSet>> = computed(() => ({}));

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsLabelValueStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

        const classObj = computed(() => ({
            'vs-dense': dense.value,
            'vs-primary': primary.value,
        }));

        return {
            classObj,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsLabelValue.css" />
